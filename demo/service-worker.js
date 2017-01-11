const $Cache = {};
const $Notifications = undefined;
/*
 * Browser Globals:
 *    self - the service worker context
 * Injected Globals:
 *    $Cache {
 *
 *    }
 */

self.addEventListener('install', function ServiceWorkerInstallCallback(event) {
  event.waitUntil(self.skipWaiting());
});

