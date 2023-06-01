const cacheName = "app-cache";
const cacheFiles = [
    "/",
    "/index.html",
    "/styles.css",
    // "/app.js",
    "/quiz.js",
    "/ui.js",
    "/main.js",
    "/success.wav",
    "/fail.wav",
    "/success.svg",
    "/fail.svg",
    "/image.svg",
];

self.addEventListener("install", (event) => {
    // Add the specified files to the cache when the service worker is installed
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener("fetch", (event) => {
    // Respond with cached files if available, otherwise fetch from the network
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
