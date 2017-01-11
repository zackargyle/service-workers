'use strict';
/*
 * Notifications
 * Browser Globals:
 *    self - the service worker context
 *    clients - the scope of a service worker client
 * Injected Globals:
 *    $Notifications {
 *      fetchUrl: the url used to fetch notification data
 *      logClickUrl: the url used to log notification clicks
 *      duration: the delay before closing notifications
 *      tagFormat: the format used to parse tag data
 *    }
 */
let lastSubscriptionId;

self.addEventListener('push', handlePush);
self.addEventListener('notificationclick', handleNotificationClick);

function handlePush(event) {
  const done = self.registration.pushManager.getSubscription()
    .then(fetchData)
    .then(handleResponse)
    .then(showNotification);
  event.waitUntil(done);
}

function fetchData(subscription) {
  lastSubscriptionId = subscription.subscriptionId || subscription.endpoint.split('/').slice(-1)[0];
  return fetch(formatUrl($Notifications.fetchUrl), { credentials: 'include' });
}

function handleResponse(response) {
  if (response.status !== 200) {
    throw new Error('Notification data fetch failed.');
  }
  return response.json();
}

function showNotification(notification) {
  if (notification.error) {
    throw new Error('JSON parse failed for notification data fetch');
  }
  delayDismissNotification();
  return self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: notification.icon,
    tag: notification.tag,
  });
}

function delayDismissNotification() {
  setTimeout(function ServiceWorkerDismissNotification() {
    self.registration.getNotifications()
      .then(notifs => notifs.forEach(notif => notif.close()));
  }, $Notifications.duration);
}

function handleNotificationClick(event) {
  fetch(formatUrl($Notifications.logClickUrl, event.notification.tag));
  const done = clients.matchAll({ type: 'window' }).then(() => {
    return clients.openWindow && clients.openWindow(link);
  });
  event.waitUntil(done);
}

function formatUrl(url, tag) {
  const map = getMappedTag(event.notification.tag, $Notifications.tagFormat);
  const tagKeys = Object.keys(map).join('|');
  const regex = new Regex(`:(${tagKeys})`, 'g');
  return url.replace(regex, (_, key) => map[key]);
}

/*
 * tag - val1:val2:val3
 * format - key1:key2:key3
 * { key1: 'val1', key2: 'val2', key3: 'val3' }
 */
function getMappedTag(tag, format) {
  const keys = format ? format.split(':') : [];
  const values = tag.split(':');
  return keys.reduce((map, key, index) => {
    map[key] = values[index];
    return map;
  }, { subscription_id: lastSubscriptionId });
}

// Export functions on the server for testing
if (typeof window === 'undefined') {
  module.exports = {
    handlePush: handlePush,
    fetchData: fetchData,
    handleResponse: handleResponse,
    showNotification: showNotification,
    delayDismissNotification: delayDismissNotification,
    handleNotificationClick: handleNotificationClick,
    formatUrl: formatUrl,
    getMappedTag: getMappedTag,
  };
}
