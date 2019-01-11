self.addEventListener("push", event => {
  event.waitUntil(self.registration.showNotification(
    "来客なう",
    {
      body: "誰か来たみたいだよ",
      icon: "https://s3-ap-northeast-1.amazonaws.com/static.reizouko.online/icons/reizouko.png"
    }
  ));
}, false);

self.addEventListener("notificationclick", event => {
  event.notification.close();
}, false);
