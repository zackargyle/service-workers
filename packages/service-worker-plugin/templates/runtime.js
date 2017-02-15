function noopPromise() {
  return {
    then: function () {
      return noopPromise();
    },
    catch: function () {}
  };
}

function serviceWorkerRegister(experimentKey) {
  if (navigator.serviceWorker) {
    if (experimentKey && !$LocationMap[experimentKey]) {
      throw new Error('Experiment: "' + experimentKey + '" not found. Must be one of:', Object.keys($LocationMap).join(', '));
    }
    const key = experimentKey || 'main';
    return navigator.serviceWorker.register($LocationMap[key]);
  }
  return noopPromise();
}

function requestServiceWorkerNotificationsPermission() {
  if (navigator.serviceWorker) {
    return navigator.serviceWorker.ready
      .then(sw => sw.pushManager.subscribe({
        userVisibleOnly: true
      }));
  }
  return noopPromise();
}

module.exports = {
  register: serviceWorkerRegister,
  requestNotificationsPermission: requestServiceWorkerNotificationsPermission
};
