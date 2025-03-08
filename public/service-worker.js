const cacheName = 'swlite-cache-';
const version = '1.0.11001';

const allowedCache = {
  script: true,
  style: true
};
self.addEventListener('install', (event) => {
  console.log('Service Worker Installed :: Version - ', version);
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      // Remove caches whose name is no longer valid
      return Promise.all(
        keys
          .filter(function (key) {
            return key.indexOf(version) === -1;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  const request = event.request;

  // For static requests, look in the cache first, fall back to the network
  const { url, destination } = request;
  if (url.startsWith(this.origin) && allowedCache[destination]) {
    event.respondWith(
      caches.match(url).then(function (response) {
        return (
          response ||
          fetch(request)
            .then(function (response) {
              const copy = response.clone();
              const headers = copy.headers.get('Content-Type');
              if (headers?.indexOf('javascript') !== -1 || headers?.indexOf('text/css') !== -1) {
                caches.open(cacheName + version).then(function (cache) {
                  cache.put(url, copy);
                });
              }

              return response;
            })
            .catch(function () {})
        );
      })
    );
    return;
  }
});
