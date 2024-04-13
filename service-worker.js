const VERSION = "1";
const HOST = location.protocol+'//'+location.host;


const FILECACHE = [
    HOST + '/index.html',
    HOST + '/details.html',
    HOST + '/js/script.js',
    HOST + '/js/details.js',
    HOST + '/js/game.js',
    HOST + '/css/style.css',
    'https://unpkg.com/tailwindcss@%5E2.0/dist/tailwind.min.css',
];
console.log('FILECACHE', FILECACHE);

self.addEventListener('install', (e) => {
    self.skipWaiting();
    console.log('Version:', VERSION);

    // Mise en chache des fichiers 
    e.waitUntil(
        (async () => {
            const cache = await caches.open(VERSION);
            await cache.addAll(FILECACHE);
        })()
    );
});

self.addEventListener('activate', (e) => {
    // Supprime le chache des anciens
    e.waitUntil(
        (async () => {
            // On récup tous les chaches
            const keys = await caches.keys();

            await Promise.all(
                keys.map((k) => {
                    if (!k.includes(VERSION)) {
                        return caches.delete(k);
                    }
                })
            )
        })()
    )
});


self.addEventListener('fetch', (e) => {
    console.log('fetch : ', e.request);
    console.log('fetchmode : ', e.request.mode);

    if (e.request.mode === 'navigate') {
        e.respondWith(
            (async () => {
                try {
                    const preloadResponse = await e.preloadResponse;
                    if (preloadResponse) return preloadResponse;

                    const cacheResponse = await caches.match(e.request);
                    if (cacheResponse) return cacheResponse;

                    return await fetch(e.request);

                } catch(error) {

                    const cache = await caches.open(VERSION);
                    return await cache.match('./index.html');
                };
            })()
        );
    }
    // Pour les chargement qui ne sont pas en navigate
    if (FILECACHE.includes(e.request.url)) {
        // On sort le fichier du cache
        e.respondWith(caches.match(e.request));
    }

    if (e.request.url.includes('https://api.tvmaze.com/search/shows') || e.request.url.includes('details.html')) {

        e.respondWith(
            caches.match(e.request).then(response => {
                return response || fetch(e.request).then(response => {
                    return caches.open(VERSION).then(cache => {
                        cache.put(e.request, response.clone());
                        return response;
                    });
                });
            }).catch(() => {
                return caches.match('index.html');
            })
        );
    }

    if (e.request.url.includes('https://api.tvmaze.com/search/shows')) {
        e.respondWith(
            fetch(e.request).then(fetchResponse => {
                return fetchResponse.json().then(jsonResponse => {

                    const results = jsonResponse.map(result => result.show);

                    // Mettre en cache toutes les pages de détails
                    const cachePromises = results.map(show => {
                        const detailPageRequest = new Request(`${HOST}/details.html?id=${show.id}`);
                        return caches.open(VERSION).then(cache => {
                            return fetch(detailPageRequest).then(response => {
                                return cache.put(detailPageRequest, response);
                            });
                        });
                    });

                    // Retourner la réponse de l'API
                    return fetchResponse;
                });
            }).catch(() => {
                return caches.match('index.html');
            })
        );
        return;
    }
    
});