// Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here. Other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
 importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

 // Initialize the Firebase app in the service worker by passing in
 // your app's Firebase config object.
 // https://firebase.google.com/docs/web/setup#config-object
 firebase.initializeApp({
    apiKey: "AIzaSyCX7V6JgK6dJtC5pkyiWyyvbi_nXuxmSbY",
    authDomain: "pwa-test-endo.firebaseapp.com",
    projectId: "pwa-test-endo",
    storageBucket: "pwa-test-endo.appspot.com",
    messagingSenderId: "1072641905457",
    appId: "1:1072641905457:web:f7eb5d00d6e6799923d610",
    measurementId: "G-65YQB6Q86Q"
 });

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically 
// and you should use data messages for custom notifications.
// For more info see: 
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notificationtitle;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});