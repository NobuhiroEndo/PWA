const checkIsWebPushSupported = async () => {
    if (!('Notification' in window)) {
      return false;
    }

    if (!('serviceWorker' in navigator)) {
      return false;
    }
    try {
      const sw = await navigator.serviceWorker.ready;

      if (!('pushManager' in sw)) {
        return false;
      }

      // 通知の許可状態を確認
      // if (!isNotificationPermissionGranted()) {
      //   return false;
      // }
      return true;
    } catch (error) {
      return false;
    }
}

export { checkIsWebPushSupported };