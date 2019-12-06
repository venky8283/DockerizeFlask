// Static Cache versioning *** MAKE SURE YOU CHANGE THE VERSION WHEN YOU MAKE CHANGES IN UI OR BACKEND WHILE DEVELOPING ****
var CACHE_STATIC_NAME = "static-scalex1.1";

var DYNAMIC_CACHE = ["/"];

// Installing service worker
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function(cache) {
      cache.addAll([
        // CDN files
        "https://fonts.googleapis.com/css?family=Khula:300,400,600,700,800",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
        "https://cdn.jsdelivr.net/npm/chrono-node@1.3.5/chrono.min.js",
        "https://code.jquery.com/jquery-3.3.1.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js",
        "https://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/base/jquery-ui.css",
        "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/jquery.validate.min.js"
      ]);
    })
  );
  self.skipWaiting();
});

// Activating the latest service worker
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  /* We should only cache GET requests, and deal with the rest of method in the
       client-side, by handling failed POST,PUT,PATCH,etc. requests.
    */
  if (event.request.method !== "GET") {
    /* If we don't block the event as shown below, then the request will go to
         the network as usual.
      */
    return;
  }
  /* Similar to event.waitUntil in that it blocks the fetch event on a promise.
       Fulfillment result will be used as the response, and rejection will end in a
       HTTP response indicating failure.
    */
  event.respondWith(
    caches
      /* This method returns a promise that resolves to a cache entry matching
           the request. Once the promise is settled, we can then provide a response
           to the fetch request.
        */
      .match(event.request)
      .then(function(cached) {
        /* Even if the response is in our cache, we go to the network as well.
             This pattern is known for producing "eventually fresh" responses,
             where we return cached responses immediately, and meanwhile pull
             a network response and store that in the cache.
             Read more:
             https://ponyfoo.com/articles/progressive-networking-serviceworker
          */
        var networked = fetch(event.request)
          // We handle the network request with success and failure scenarios.
          .then(fetchedFromNetwork, unableToResolve)
          // We should catch errors on the fetchedFromNetwork handler as well.
          .catch(unableToResolve);

        /* We return the cached response immediately if there is one, and fall
             back to waiting on the network as usual.
          */
        return cached || networked;

        function fetchedFromNetwork(response) {
          /* We copy the response before replying to the network request.
               This is the response that will be stored on the ServiceWorker cache.
            */
          var cacheCopy = response.clone();

          caches
            // We open a cache to store the response for this request.
            .open(CACHE_STATIC_NAME)
            .then(function add(cache) {
              /* We store the response for this request. It'll later become
                   available to caches.match(event.request) calls, when looking
                   for cached responses.
                */
              responseURL = "/api" + event.request.url.split("api")[1];

              if (DYNAMIC_CACHE.indexOf(responseURL) > -1) {
                cache.put(event.request, cacheCopy);
              }
            });

          // Return the response so that the promise is settled in fulfillment.
          return response;
        }

        /* When this method is called, it means we were unable to produce a response
             from either the cache or the network. This is our opportunity to produce
             a meaningful response even when all else fails. It's the last chance, so
             you probably want to display a "Service Unavailable" view or a generic
             error response.
          */
        function unableToResolve() {
          /* There's a couple of things we can do here.
               - Test the Accept header and then return one of the `offlineFundamentals`
                 e.g: `return caches.match('/some/cached/image.png')`
               - You should also consider the origin. It's easier to decide what
                 "unavailable" means for requests against your origins than for requests
                 against a third party, such as an ad provider
               - Generate a Response programmaticaly, as shown below, and return that
            */

          /* Here we're creating a response programmatically. The first parameter is the
               response body, and the second one defines the options for the response.
            */
          return new Response("<h1>Service Unavailable</h1>", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/html"
            })
          });
        }
      })
  );
});

// self.addEventListener("notificationclick", function(event) {
//   var notification = event.notification;
//   var action = event.action;

//   event.waitUntil(
//     clients.matchAll().then(function(clis) {
//       var client = clis.find(function(c) {
//         return c.visibilityState === "visible";
//       });

//       if (client !== undefined) {
//         client.navigate(notification.data.url);
//         client.focus();
//       } else {
//         clients.openWindow(notification.data.url);
//       }
//       notification.close();
//     })
//   );
// });

// // self.addEventListener("push", function(event) {
// //   if (event.data) {
// //     data = JSON.parse(event.data.text());
// //   }

// //   var options = {
// //     body: data.content,
// //     icon: "/static/img/logo96.png",
// //     dir: "ltr",
// //     lang: "en-US",
// //     vibrate: [100, 50, 200],
// //     badge: "/static/img/logo96.png",
// //     data: {
// //       url: data.openURL
// //     }
// //   };

// //   event.waitUntil(self.registration.showNotification("Innov8 CRM", options));
// // });
