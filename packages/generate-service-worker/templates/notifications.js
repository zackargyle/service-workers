/*
 * AUTOGENERATED FROM GENERATE-SERVICE-WORKER
 * Injected Global: $Notifications
 */

'use strict';

/*         -------- NOTIFICATIONS CONSTANTS ---------         */

let lastSubscriptionId;

/*         -------- NOTIFICATIONS CONSTANTS ---------         */

self.addEventListener('push', handleNotificationPush);
self.addEventListener('notificationclick', handleNotificationClick);

/*         -------- NOTIFICATIONS HANDLERS ---------         */

function handleNotificationPush(event) {
  logger.log('Push notification received', event);

  let done;
  if (event.data && event.data.title) {
    done = showNotification(event.data);
  } else {
    done = self.registration.pushManager.getSubscription()
      .then(fetchNotificationData)
      .then(handleNotificationResponse)
      .then(showNotification)
      .catch(showNotification.bind(null, $Notifications.default));
  }

  event.waitUntil(done);
}

function handleNotificationClick(event) {
  logger.log('Push notification clicked.', event.notification);

  // Log the click if url provided in config
  if ($Notifications.logClick) {
    const query = {
      subscription_id: lastSubscriptionId,
      tag: event.notification.tag
    };
    const logClickUrl = formatUrl($Notifications.logClick.url, query);
    fetch(logClickUrl, $Notifications.logClick.requestOptions);
  }

  // Open the url if provided
  if (event.notification.data && event.notification.data.url) {
    if (clients.openWindow) {
      const url = event.notification.data.url;
      event.waitUntil(clients.openWindow(url));
    }
  }

  event.notification.close();
}

/*         -------- NOTIFICATIONS HELPERS ---------         */

/*
 * Use the injected fetch url and append the subscription id as a
 * query parameter.
 */
function fetchNotificationData(subscription) {
  if (!subscription) {
    logger.log('No subscription found.');
    throw new Error('No subscription found.');
  }
  if (!$Notifications.fetchData) {
    logger.log('No fetch url provided for notification data.');
    throw new Error('No fetch url provided for notification data.');
  }
  logger.log('Fetching remote notification data for subscription: ', subscription);
  lastSubscriptionId = subscription.subscriptionId || subscription.endpoint.split('/').slice(-1)[0];
  const queries = {
    subscription_id: lastSubscriptionId
  };
  const url = formatUrl($Notifications.fetchData.url, queries);
  return fetch(url, $Notifications.fetchData.requestOptions)
    .catch(() => showNotification($Notifications.default));
}

function handleNotificationResponse(response) {
  if (response.status !== 200) {
    logger.error('Notification data fetch failed. Using default.');
    return $Notifications.default;
  }
  logger.log('Converting remote notification response to JSON.');
  return response.json();
}

function showNotification(data) {
  logger.log('Attempting to show notification: ', data);
  if (data.error) {
    throw new Error(data.error);
  }
  return self.registration
    .showNotification(data.title, data)
    .then(delayDismissNotification);
}

function delayDismissNotification() {
  setTimeout(function ServiceWorkerDismissNotification() {
    logger.log('Hiding notification after delay: ', $Notifications.duration);
    self.registration.getNotifications()
      .then(notifs => notifs.forEach(notif => notif.close()));
  }, $Notifications.duration);
}

function formatUrl(url, queries) {
  const prefix = url.includes('?') ? '&' : '?';
  const query = Object.keys(queries).map(function (key) {
    return `${key}=${queries[key]}`;
  }).join('&');
  return url + prefix + query;
}

function logError(error) {
  // post message to app runtime?
  logger.error(error);
}

// Export functions on the server for testing
if (typeof __TEST_MODE__ !== 'undefined') {
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
