// service-worker.js

self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'logo192.png',  // Path to an icon file
      badge: 'logo512.png' // Path to a badge icon file
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('/')  // Replace with the URL you want to open
    );
  });
  