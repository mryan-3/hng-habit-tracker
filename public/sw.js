const CACHE_VERSION = "v1";
const STATIC_CACHE = `habit-tracker-static-${CACHE_VERSION}`;

const APP_SHELL = [
  "/",
  "/login",
  "/signup",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE)
          .map((key) => caches.delete(key)),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  const isNavigationRequest = event.request.mode === "navigate";
  if (isNavigationRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseCopy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(event.request, responseCopy);
          });
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(event.request);
          if (cachedPage) {
            return cachedPage;
          }
          const cachedRoot = await caches.match("/");
          if (cachedRoot) {
            return cachedRoot;
          }
          return new Response("Offline", { status: 503 });
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseCopy = networkResponse.clone();
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(event.request, responseCopy);
        });
        return networkResponse;
      });
    }),
  );
});
