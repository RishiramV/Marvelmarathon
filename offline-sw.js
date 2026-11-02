/* Only the public offline screen and its artwork/fonts are stored here. */
const OFFLINE_CACHE='marvel-offline-v1';
const OFFLINE_ASSETS=['/offline.html','/offline-gauntlet.png','/fonts/Anton-Regular.woff','/fonts/Arimo-Regular.woff'];
self.addEventListener('install',event=>event.waitUntil(caches.open(OFFLINE_CACHE).then(cache=>cache.addAll(OFFLINE_ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('marvel-offline-')&&key!==OFFLINE_CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(OFFLINE_ASSETS.includes(url.pathname)){
    event.respondWith(caches.open(OFFLINE_CACHE).then(cache=>cache.match(url.pathname)).then(cached=>cached||fetch(request)));
  }else if(request.mode==='navigate'){
    event.respondWith(fetch(request).catch(()=>caches.open(OFFLINE_CACHE).then(cache=>cache.match('/offline.html'))));
  }
});
