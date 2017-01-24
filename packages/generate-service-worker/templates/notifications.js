/*
 * AUTOGENERATED FROM GENERATE-SERVICE-WORKER
 * Injected Global: $Notifications
 */
'use strict';

/*         -------- NOTIFICATIONS CONSTANTS ---------         */

let lastSubscriptionId;

/*         -------- NOTIFICATIONS CONSTANTS ---------         */

self.addEventListener('push', handleNotificationPush);
if ($Notifications.log) {
  self.addEventListener('notificationclick', handleNotificationClick);
}

/*         -------- NOTIFICATIONS HANDLERS ---------         */

function handleNotificationPush(event) {
  const done = self.registration.pushManager.getSubscription()
    .then(fetchNotificationData)
    .then(handleNotificationResponse)
    .then(showNotification)
    .catch(logError);
  event.waitUntil(done);
}

function handleNotificationClick(event) {
  const query = {
    subscription_id: lastSubscriptionId,
    tag: event.notification.tag
  };
  fetch(formatUrl($Notifications.log.url, query), $Notifications.log.requestOptions);
  const done = clients.matchAll({ type: 'window' }).then(() => {
    const url = event.notification.data && event.notification.data.url;
    return clients.openWindow && clients.openWindow(url);
  });
  event.waitUntil(done);
}

/*         -------- NOTIFICATIONS HELPERS ---------         */

/*
 * Use the injected fetch url and append the subscription id as a
 * query parameter.
 */
function fetchNotificationData(subscription) {
  lastSubscriptionId = subscription.subscriptionId || subscription.endpoint.split('/').slice(-1)[0];
  const queries = {
    subscription_id: lastSubscriptionId
  };
  const url = formatUrl($Notifications.fetch.url, queries);
  return fetch(url, $Notifications.fetch.requestOptions);
}

function handleNotificationResponse(response) {
  if (response.status !== 200) {
    throw new Error('Notification data fetch failed.');
  }
  return response.json();
}

function showNotification(data) {
  if (data.error) {
    throw new Error(data.error);
  }
  return self.registration
    .showNotification(data.title, data)
    .then(delayDismissNotification);
}

function delayDismissNotification(event) {
  const notification = event.notification;
  setTimeout(function ServiceWorkerDismissNotification() {
    notification.close();
  }, $Notifications.duration);
}

function formatUrl(url, queries) {
  const prefix = url.includes('?') ? '&' : '?';
  const query = Object.keys(queries).map(function(key) {
    return `${key}=${queries[key]}`;
  }).join('&');
  return url + prefix + query;
}

function logError(error) {
  // post message to app runtime?
  logger.error(error);
}

// Export functions on the server for testing
if (typeof window === 'undefined') {
  module.exports = {
    handleNotificationPush: handleNotificationPush,
    fetchNotificationData: fetchNotificationData,
    handleNotificationResponse: handleNotificationResponse,
    showNotification: showNotification,
    delayDismissNotification: delayDismissNotification,
    handleNotificationClick: handleNotificationClick,
    formatUrl: formatUrl,
    logError: logError
  };
}
