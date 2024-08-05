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
      const badgeCount = payload?.badge_count ?? 0;
    
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
  
  self.addEventListener('notificationclick', async (event) => {
    try {
      event.notification.close();
      console.log('リスナーは起動しました！')

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
      console.log('かうんと！',badgeCount)

      if ('setAppBadge' in navigator) {
        navigator.setAppBadge(badgeCount);
      }

    } catch (e) {
      console.error('エラー：',e);
    }
  });

  self.addEventListener('notificationclose', async (event) => {
    try {
      event.notification.close();
      console.log('リスナーは起動しました！')

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
      console.log('かうんと！',badgeCount)

      if ('setAppBadge' in navigator) {
        navigator.setAppBadge(badgeCount);
      }

    } catch (e) {
      console.error('エラー：',e);
    }
  });