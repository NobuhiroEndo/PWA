self.addEventListener('push', (event) => {
    console.log('プッシュイベントを受信：', event);
    try {
      if (
        self.Notification == null ||
        self.Notification.permission !== 'granted'
      ) {
        console.log('通知許可なし');
        return;
      }

      const payload = event.data?.json() ?? null;
      const title = payload?.title ?? 'プッシュ通知で表示されるタイトルのデフォルト値';
      const body = payload?.body ?? '';
      const icon = payload?.icon ?? 'プッシュ通知で表示させたいアイコン画像URLのデフォルト値';
      const data = payload?.data ?? null;
    
      self.registration.showNotification(title, {
        body,
        icon,
        data,
      });

      if ('setAppBadge' in navigator) {
        navigator.setAppBadge(1);
      }

    } catch (e) {
      console.error('エラー：',e);
    }
  });
  
  self.addEventListener('notificationclick', (event) => {
    try {
      event.notification.close();
      clients.openWindow(event.notification.data?.url ?? '/');
      if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge();
      }
    } catch (e) {
      console.error('エラー：',e);
    }
  });