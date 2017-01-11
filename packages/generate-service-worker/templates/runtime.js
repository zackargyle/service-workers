/*
 * Injected Globals:
 *    $RuntimePath
 */

if (Boolean(navigator.serviceWorker)) {
  navigator.serviceWorker.register($RuntimePath).then(function(reg) {
    reg.onupdatefound = function() {
      var installation = reg.installing;
      installation.onstatechange = function() {
        if (installation.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            console.log('New or updated content is available.');
          } else {
            console.log('Content is now available offline!');
          }
        } else if (installation.state === 'redundant') {
          console.error('The installing service worker became redundant.');
        }
      };
    };
  });
}
