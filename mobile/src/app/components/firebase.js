import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCX7V6JgK6dJtC5pkyiWyyvbi_nXuxmSbY",
  authDomain: "pwa-test-endo.firebaseapp.com",
  projectId: "pwa-test-endo",
  storageBucket: "pwa-test-endo.appspot.com",
  messagingSenderId: "1072641905457",
  appId: "1:1072641905457:web:f7eb5d00d6e6799923d610",
  measurementId: "G-65YQB6Q86Q"
};

initializeApp(firebaseConfig);
const messaging = getMessaging();

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: "BD4ViSjnDbaROdqtIuw87O3-t641sI3CFhlM5aBiYGqb-3NwKL-sjhpD4OIHhxVuhSG755iqe-jrws8jkDNS6eY" });
    if (currentToken) {
      console.log("current token for client: ", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });