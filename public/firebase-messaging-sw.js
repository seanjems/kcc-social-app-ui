// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDUl6uM8O7mTPRIRIlmZdTjDLJQi0prVL4",
  authDomain: "sdakcc.firebaseapp.com",
  projectId: "sdakcc",
  storageBucket: "sdakcc.appspot.com",
  messagingSenderId: "308096063661",
  appId: "1:308096063661:web:ff90c9dd83eacb697b0e24",
  measurementId: "G-BWQJPHZ",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
