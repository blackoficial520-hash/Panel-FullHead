importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA9eqc3PMW37oZi3RIjN_5DMrxfyeqeQgM",
  authDomain: "panelfreefire-f90aa.firebaseapp.com",
  projectId: "panelfreefire-f90aa",
  storageBucket: "panelfreefire-f90aa.firebasestorage.app",
  messagingSenderId: "788453326370",
  appId: "1:788453326370:web:b53c27d2fe493e1e9c547b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Ajuste aqui: se payload.notification estiver vazio, ele busca em payload.data
  const title = payload.notification?.title || payload.data?.title;
  const body = payload.notification?.body || payload.data?.body;
  const icon = payload.notification?.icon || payload.data?.icon;

  const notificationTitle = title || '✅ Panel FullHead Activo';
  const notificationOptions = {
    body: body || 'Tu panel está funcionando correctamente en segundo plano.',
    icon: icon || '/favicon.png',
    badge: '/favicon.png',
    tag: 'fullhead-panel-activo',
    renotify: false,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: { url: '/' },
    actions: [
      { action: 'abrir', title: 'Abrir Panel' },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
