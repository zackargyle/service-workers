'use strict';

/*         -------- NOTIFICATIONS ---------         */

self.addEventListener('push', handleNotificationPush);
self.addEventListener('notificationclick', handleNotificationClick);

/*         -------- NOTIFICATIONS HANDLERS ---------         */

function handleNotificationPush(event) {
  logger.log('Push notification received');

  if ($Log.notificationReceived) {
    event.waitUntil(logNotificationReceived(event));
  }

  // Show notification or fallback
  if (event.data && event.data.title) {
    event.waitUntil(showNotification(event.data));
  } else if ($Notifications.fallbackURL) {
    event.waitUntil(
      self.registration.pushManager.getSubscription()
        .then(fetchNotification)
        .then(convertResponseToJson)
        .then(showNotification)
        .catch(showNotification)
    );
  } else {
    logger.warn('No notification.data and no fallbackURL.');
    event.waitUntil(showNotification());
  }
}

function handleNotificationClick(event) {
  logger.log('Push notification clicked.', event.notification.tag);

  if ($Log.notificationClicked) {
    event.waitUntil(logNotificationClick(event));
  }

  // Open the url if provided
  if (event.notification.data && event.notification.data.url) {
    const url = event.notification.data.url;
    event.waitUntil(openWindow(url));
  } else if (event.notification.tag.indexOf(':') !== -1) {
    // TODO: Deprecate
    const url = event.notification.tag.split(':')[2] || '/';
    event.waitUntil(openWindow(url));
  } else {
    logger.warn('Cannot route click with no data.url property. Using "/".', event.notification.tag);
    event.waitUntil(openWindow('/'));
  }

  event.notification.close();
  logger.groupEnd(event.notification.tag);
}

/*         -------- NOTIFICATIONS HELPERS ---------         */

function showNotification(data) {
  if (!data || !data.tag) {
    // eslint-disable-next-line no-param-reassign
    data = $Notifications.default;
  }
  logger.group(data.tag);
  logger.log('Show notification.', data.tag);
  return self.registration
    .showNotification(data.title, data)
    .then(delayDismissNotification);
}

function fetchNotification(subscription) {
  if (!subscription) {
    logger.warn('No subscription found.');
    throw new Error('No subscription found.');
  }
  logger.log('Fetching remote notification data.');
  const queries = {
    endpoint: subscription.endpoint
  };
  const url = formatUrl($Notifications.fallbackURL, queries);
  return fetch(url, { credentials: 'include' });
}

function convertResponseToJson(response) {
  if (response.status !== 200) {
    throw new Error('Notification data fetch failed.');
  }
  return response.json();
}

function delayDismissNotification() {
  setTimeout(function serviceWorkerDismissNotification() {
    self.registration.getNotifications()
      .then(notifications => {
        notifications.forEach(notification => {
          notification.close();
          logger.log('Dismissing notification.', notification.tag);
          logger.groupEnd(notification.tag);
        });
      });
  }, $Notifications.duration || 5000);
}

function openWindow(url) {
  if (clients.openWindow) {
    return clients.openWindow(url);
  }
  return Promise.resolve();
}

function logNotificationReceived(event) {
  return logAction(event, $Log.notificationReceived);
}

function logNotificationClick(event) {
  return logAction(event.notification, $Log.notificationClicked);
}

function logAction(notification, url) {
  logger.log(`Send log event to ${url}.`, notification.tag);
  return self.registration.pushManager.getSubscription().then((subscription) => {
    const query = {
      endpoint: subscription.endpoint,
      tag: notification.tag
    };
    return fetch(formatUrl(url, query), { credentials: 'include' });
  });
}

function formatUrl(url, queries) {
  const prefix = url.includes('?') ? '&' : '?';
  const query = Object.keys(queries).map(function (key) {
    return `${key}=${queries[key]}`;
  }).join('&');
  return url + prefix + query;
}
