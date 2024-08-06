// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyCX7V6JgK6dJtC5pkyiWyyvbi_nXuxmSbY",
  authDomain: "pwa-test-endo.firebaseapp.com",
  projectId: "pwa-test-endo",
  storageBucket: "pwa-test-endo.appspot.com",
  messagingSenderId: "1072641905457",
  appId: "1:1072641905457:web:f7eb5d00d6e6799923d610",
  measurementId: "G-65YQB6Q86Q"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
// messaging.onBackgroundMessage(function(payload) {
//   const title = payload.notification.title || 'プッシュ通知で表示されるタイトルのデフォルト値';
//   const body = payload.notification.body || '';
//   const icon = payload.notification.icon || 'プッシュ通知で表示させたいアイコン画像URLのデフォルト値';
//   const badgeCount = payload.data?.badge_count || 0; // FCMのデータメッセージに含まれるバッジカウント

//   self.registration.showNotification(title, {
//     body,
//     icon,
//     badge: icon // バッジにはアイコン画像のURLを指定
//   });

//   if ('setAppBadge' in navigator) {
//     navigator.setAppBadge(badgeCount);
//   }
// });

self.addEventListener('push', (event) => {
  console.log('プッシュイベントを受信：', event.data.json());
  try {
    if (
      self.Notification == null ||
      self.Notification.permission !== 'granted'
    ) {
      console.log('通知許可なし');
      return;
    }

    const payload = event.data?.json() ?? null;
    const title = payload?.notification.title ?? 'プッシュ通知で表示されるタイトルのデフォルト値';
    const body = payload?.notification.body ?? '';
    const icon = payload?.icon ?? 'プッシュ通知で表示させたいアイコン画像URLのデフォルト値';
    const data = payload?.data ?? null;
    const badgeCount = payload?.data.badge_count ?? 0;
  
    self.registration.showNotification(title, {
      title,
      body,
      icon,
      data,
    });

    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(badgeCount);
    }

  } catch (e) {
    console.error('エラー：',e);
  }
});

// Handle notification click
self.addEventListener('notificationclick', async (event) => {
  try {
    event.notification.close();
    console.log('Notification click event triggered.');

    // Optionally handle notification click
    await fetch(`https://api.februar.org/api/notification_read/notification_read/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'nobuhiro'
      })
    });

    const response = await fetch(`https://api.februar.org/api/notification_count/notification_count/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const badgeCount = data.unread_notifications_count ?? 0;

    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(badgeCount);
    }
  } catch (e) {
    console.error('Error handling notification click:', e);
  }
});

// Handle notification close
self.addEventListener('notificationclose', async (event) => {
  try {
    event.notification.close();
    console.log('Notification close event triggered.');

    // Optionally handle notification close
    await fetch(`https://api.februar.org/api/notification_read/notification_read/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'nobuhiro'
      })
    });

    const response = await fetch(`https://api.februar.org/api/notification_count/notification_count/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const badgeCount = data.unread_notifications_count ?? 0;

    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(badgeCount);
    }
  } catch (e) {
    console.error('Error handling notification close:', e);
  }
});