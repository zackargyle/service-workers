/*
 * AUTOGENERATED FROM PROGRESSIVE-WEBAPP-PLUGIN
 * Injected Global: $LocationMap
 */

 function serviceWorkerRegister(experimentKey) {
   if (navigator.serviceWorker) {
     if (experimentKey && !$LocationMap[experimentKey]) {
       throw new Error('Experiment: "' + experimentKey + '" not found. Must be one of:', Object.keys($LocationMap).join(', '));
     }
     const key = experimentKey || 'main';
     return navigator.serviceWorker.register($LocationMap[key]);
   }
   return Promise.resolve();
 }

 function requestServiceWorkerNotificationsPermission() {
   return navigator.serviceWorker.ready
    .then(sw => sw.pushManager.subscribe({
      userVisibleOnly: true
    }));
 }

 module.exports = {
   register: serviceWorkerRegister,
   requestNotificationsPermission: requestServiceWorkerNotificationsPermission
 };
