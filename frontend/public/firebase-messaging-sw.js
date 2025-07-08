// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyABdxUmas8xyfayQjt8M7eyLw5_MbqXYD0",
  authDomain: "fir-3-5a5ac.firebaseapp.com",
  projectId: "fir-3-5a5ac",
  storageBucket: "fir-3-5a5ac.firebasestorage.app",
  messagingSenderId: "328039237750",
  appId: "1:328039237750:web:6045d2a5a48aae5471b757",
  measurementId: "G-HBTVN5SDF1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
