self.addEventListener("install", (e) => {
    e.waitUntil(
      caches.open("static").then((cache) => {
        return cache.addAll([
          "./style.css",
          "./",
          "./images/android-chrome-192x192.png"
        ])
        .catch((err) => {
          console.error("Failed to cache assets during install:", err);
        });
      })
    );
  });
  
  self.addEventListener("fetch", (e) => {
    console.log(`Intercepting fetch request for: ${e.request.url}`);
    // Optionally, you can add some custom fetch logic here if needed
    e.respondWith(
      caches.match(e.request)
        .then((cachedResponse) => {
          // If a cached response exists, serve it. Otherwise, fetch the resource from the network.
          return cachedResponse || fetch(e.request);
        })
        .catch((err) => {
          console.error("Fetch interception error:", err);
          return fetch(e.request); // Default to network fetch in case of error
        })
    );
  });
  