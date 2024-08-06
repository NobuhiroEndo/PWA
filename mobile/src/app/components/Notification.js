import React, { useState, useEffect } from "react";
import { requestForToken, onMessageListener } from "./firebase";
import useAuth from '../hooks/useAuth'; 


const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const { authToken } = useAuth();

  // アプリがロードされたときにサービスワーカーを登録
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker registered with scope: ', registration.scope);
        } catch (error) {
          console.error('Service Worker registration failed: ', error);
        }
      } else {
        console.log('Service workers are not supported.');
      }
    };

    registerServiceWorker();
  }, []); // 空の依存配列で、コンポーネントの初回レンダリング時に実行

  // トークンを取得し、バックエンドに保存
  const handleRequestToken = async () => {
    try {
      const token = await requestForToken();
      console.log('トークン：', token);

      if (token) {
        await saveTokenToDatabase(token); // トークンをバックエンドに保存
      }
    } catch (error) {
      console.error('Failed to get token: ', error);
    }
  };

  // トークンをバックエンドに保存
  const saveTokenToDatabase = async (token) => {
    console.log('受け取ったtoken：', JSON.stringify({ subscription_info: token }));
    try {
      const response = await fetch(`${baseURL}/user_notifications/save_subscription_info/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify({
          endpoint: token,
          expiration_time: null,
          keys: {
              p256dh: null,
              auth: null,
          },
      }),
      });
      if (response.ok) {
        console.log('Token saved to database');
      } else {
        console.error('Failed to save token');
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  // メッセージをリスンし、通知を表示
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        setNotification({ title: payload?.notification?.title, body: payload?.notification?.body });
      })
      .catch((err) => console.log("failed: ", err));
  }, []);

  useEffect(() => {
    if (notification?.title) {
      alert("title: " + notification?.title + "\nbody: " + notification?.body);
    }
  }, [notification]);

  return (
    <div>
      <button onClick={handleRequestToken}>Request Notification Permission</button>
    </div>
  );
};

export default Notification;