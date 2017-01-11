console.log(module);

function fetchServiceWorker() {
  fetch('service-worker.js')
    .then(res => res.text())
    .then(text => document.getElementById('sw').innerHTML = text);
}

if (module.hot) {
    module.hot.accept(fetchServiceWorker);
}

fetchServiceWorker();
