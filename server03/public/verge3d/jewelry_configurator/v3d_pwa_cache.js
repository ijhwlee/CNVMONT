const CACHE_PREFIX = 'v3d-app-cache';
const CACHE_HASH = '0c89e1d1ae';
const CACHE_VERSION = 'v2';

const ASSETS = [
    'v3d.js',
    'style.css',
    'gem_8.bin.xz',
    'gem_10.gltf.xz',
    'gem_8.gltf.xz',
    'gem_6.bin.xz',
    'engrave_ao.jpg',
    'gem_10.bin.xz',
    'environment.hdr',
    'gem_7.gltf.xz',
    'gem_0.gltf.xz',
    'gem_9.bin.xz',
    'gem_3.bin.xz',
    'gem_4.bin.xz',
    'gem_5.bin.xz',
    'gem_4.gltf.xz',
    'jewelry_configurator.gltf.xz',
    'gem_2.bin.xz',
    'visual_logic.js',
    'gem_1.gltf.xz',
    'gem_6.gltf.xz',
    'gem_3.gltf.xz',
    'gem_7.bin.xz',
    'jewelry_configurator.css',
    'gem_5.gltf.xz',
    'jewelry_configurator.bin.xz',
    'gem_0.bin.xz',
    'jewelry_configurator.html',
    'engrave_normal.jpg',
    'gem_2.gltf.xz',
    'index.html',
    'gem_9.gltf.xz',
    'jewelry_configurator.js',
    'gem_1.bin.xz',
    'media/android-chrome-512x512.png',
    'media/icon_gem_6.png',
    'media/icon_type_2.png',
    'media/icon_gem_9.png',
    'media/icon_type_3.png',
    'media/line_2.png',
    'media/icon_gem_color_5.png',
    'media/icon_curve_1.png',
    'media/icon_gem_1.png',
    'media/preloader.svg',
    'media/icon_type_5.png',
    'media/favicon.svg',
    'media/favicon-48x48.png',
    'media/icon_pearl_color_2.png',
    'media/safari-pinned-tab.svg',
    'media/icon_curve_0.png',
    'media/android-chrome-192x192.png',
    'media/icon_gem_10.png',
    'media/icon_gem_2.png',
    'media/icon_gem_3.png',
    'media/icon_gem_color_7.png',
    'media/icon_curve_4.png',
    'media/icon_engrave.png',
    'media/icon_gem_8.png',
    'media/icon_clear.png',
    'media/icon_curve_3.png',
    'media/icon_gem_5.png',
    'media/favicon-32x32.png',
    'media/icon_gem_0.png',
    'media/fullscreen_close.svg',
    'media/icon_pearl_color_1.png',
    'media/manifest.json',
    'media/favicon-16x16.png',
    'media/icon_pearl_color_4.png',
    'media/icon_gem_color_6.png',
    'media/icon_curve_2.png',
    'media/icon_gem_7.png',
    'media/icon_gem_color_4.png',
    'media/icon_gem_color_1.png',
    'media/icon_pearl_color_3.png',
    'media/icon_gem_color_3.png',
    'media/icon_type_1.png',
    'media/line_0.png',
    'media/apple-touch-icon.png',
    'media/icon_type_4.png',
    'media/icon_gem_4.png',
    'media/line_1.png',
    'media/fullscreen_open.svg',
    'media/icon_gem_color_2.png',
    'fonts/DaysOne-Regular.ttf',
    'fonts/GreatVibes-Regular.ttf',
    'fonts/Caveat-Regular.ttf',
    'fonts/Bellefair-Regular.ttf',
    'fonts/Lobster-Regular.ttf',
    'fonts/Roboto-Regular.ttf',
];

const cacheName = () => {
    return `${CACHE_PREFIX}-${CACHE_HASH}-${CACHE_VERSION}`;
}

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(cacheName()).then(cache => {
        return cache.addAll(ASSETS);
    }));
});

const deleteCache = async (key) => {
    await caches.delete(key);
};

const deleteOldCaches = async () => {
    const cacheKeepList = [cacheName()];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => {
        return (key.includes(CACHE_HASH) && !cacheKeepList.includes(key));
    });
    await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener('activate', (event) => {
    event.waitUntil(deleteOldCaches());
});

const handleCached = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache)
        return responseFromCache;
    return fetch(request);
};

self.addEventListener('fetch', (event) => {
    event.respondWith(handleCached(event.request));
});
