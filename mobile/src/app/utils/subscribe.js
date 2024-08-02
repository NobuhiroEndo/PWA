import { checkIsWebPushSupported } from "./checkIsWebPushSupported";
import { getVapidPublicKey } from "./getVapidPublicKey";

const subscribe = async () => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  console.log('チェック開始');
  try {
      if (!(await checkIsWebPushSupported())) {
          console.log('ご利用のブラウザではWeb Pushは使えません');
          return;
      }
  
      const validPublicKey = await getVapidPublicKey();
      console.log('鍵の取得は成功');
  
      if (window.Notification.permission === "default") {
          const result = await window.Notification.requestPermission();
          if (result === "default") {
              console.log("プッシュ通知の有効化がキャンセルされました。はじめからやり直してください。");
              return;
          }
      }
  
      if (window.Notification.permission === "denied") {
          console.log("プッシュ通知がブロックされています。ブラウザの設定から通知のブロックを解除してください。");
          return;
      }
  
      const currentLocalSubscription = await navigator.serviceWorker.ready.then(
          (worker) =>
              worker.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: validPublicKey,
              })
      );
      
      const subscriptionJSON = currentLocalSubscription.toJSON();
      if (subscriptionJSON.endpoint == null || subscriptionJSON.keys == null) {
          console.log("ご利用のブラウザが発行したトークンは未対応のため、プッシュ通知はご利用いただけません。");
          return;
      }
  
      try {
          const res = await fetch(`${baseURL}/user_notifications/save_subscription_info/`, {
              method: "post",
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  endpoint: subscriptionJSON.endpoint,
                  expiration_time: subscriptionJSON.expirationTime ?? null,
                  keys: {
                      p256dh: subscriptionJSON.keys.p256dh,
                      auth: subscriptionJSON.keys.auth,
                  },
              }),
          });
          if (!res.ok) {
              console.log("プッシュ通知の購読に失敗しました");
          } else {
              console.log('プッシュ通知を購読しました', window.Notification.permission);
          }
      } catch (err) {
          console.error("プッシュ通知の購読に失敗しました", err);
      }
  } catch (error) {
      console.error("サブスクリプション処理中にエラーが発生しました", error);
  }
};

export{ subscribe };