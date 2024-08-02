const checkNotification = () => {
    if (window.Notification.permission === "granted") {
        return true
    }
    return false
}