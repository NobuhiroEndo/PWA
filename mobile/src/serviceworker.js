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
  
    //   const payload = event.data?.json() ?? null;
      const title = 'テストタイトル';
      const body = 'テストボディ2';
      const icon = '/icons/icon-192×192.png';
      const data = 'テストデータ';
  
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