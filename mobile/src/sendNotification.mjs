import fetch from 'node-fetch';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

// FCM HTTP v1 API URL
const url = 'https://fcm.googleapis.com/v1/projects/pwa-test-endo/messages:send';

// メッセージペイロード
const payload = {
  message: {
    token: "d6fWBOomzNl1FUAogIIddM:APA91bG-Z23u-3IoCo4OffU12731AWBkP5uZZfEu3roRLlj-ZwdMl22Y9vIxGizgdJHDGNhocHwHZ_lymZE4eScgeEk_VD8mXymGYb2HjmOPOvyJMgG2jC9Nfrbra_RNY5d6tNK4oAjd",
    notification: {
      title: '通知テスト',
      body: 'これはテストです',
    }
  }
};

// サービスアカウントのキーのパス
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

// Google Auth クライアントの初期化
const auth = new GoogleAuth({
  keyFilename: serviceAccountPath,
  scopes: [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/firebase.messaging'
  ]
});

// アクセストークンの取得とメッセージ送信
async function sendMessage() {
  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const opts = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const res = await fetch(url, opts);
    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Error sending message:', err.message);
  }
}

// メッセージ送信を実行
sendMessage();