// Safari: preserve original FLAC/WAV bytes while avoiding proxy range/CORS issues.
(() => {
  if (!/AppleWebKit/.test(navigator.userAgent) || /Chrome|Chromium|Edg|OPR/.test(navigator.userAgent) || location.protocol === 'file:') return;
  const requests = new Map();
  window.echoReceiveLosslessAudio = (key, mime, base64) => {
    const request = requests.get(key);
    if (!request) return;
    try {
      const raw = atob(base64);
      const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
      request.registered = true;
      request.resolve(URL.createObjectURL(new Blob([bytes], {type: mime})));
    } catch (error) { request.reject(error); }
  };
  function load(src) {
    const url = new URL(src, document.baseURI);
    const key = url.pathname.split('/').pop();
    if (requests.has(key)) return requests.get(key).promise;
    const request = {};
    request.promise = new Promise((resolve, reject) => Object.assign(request, {resolve, reject}));
    requests.set(key, request);
    const script = document.createElement('script');
    url.pathname += '.js';
    script.src = url.href;
    const timer = setTimeout(() => request.reject(new Error('Audio loading timed out')), 60000);
    script.onerror = () => request.reject(new Error('Audio payload failed to load'));
    script.onload = () => {
      if (!request.registered) request.reject(new Error('Audio payload missing'));
    };
    request.promise.then(() => {clearTimeout(timer); script.remove();}, () => {
      clearTimeout(timer); script.remove(); requests.delete(key);
    });
    document.head.append(script);
    return request.promise;
  }
  const observer = new IntersectionObserver(entries => {
    for (const {target: audio, isIntersecting} of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(audio);
      const src = audio.getAttribute('src') || audio.querySelector('source')?.getAttribute('src');
      const status = document.createElement('span');
      status.textContent = 'Loading audio…';
      status.setAttribute('role', 'status');
      status.style.cssText = 'display:block;font-size:12px;color:#666';
      audio.after(status);
      load(src).then(url => {
        // The native play control may already be waiting on the proxy URL.
        // load() resets that pending request, so carry it across the source swap.
        // A user who paused while loading must remain paused.
        const resume = !audio.paused;
        audio.src = url;
        audio.preload = 'metadata';
        audio.load();
        if (resume) {
          audio.play().then(() => status.remove()).catch(() => {
            status.textContent = 'Audio is ready. Press play to start.';
            audio.addEventListener('playing', () => status.remove(), {once: true});
          });
        } else {
          status.remove();
        }
      }).catch(() => {status.textContent = 'Audio could not load. Please reload or try Chrome.';});
    }
  }, {rootMargin: '200px'});
  document.querySelectorAll('audio').forEach(audio => {
    const src = audio.getAttribute('src') || audio.querySelector('source')?.getAttribute('src');
    if (src && /\.(?:flac|wav)(?:$|[?#])/i.test(src)) observer.observe(audio);
  });
})();
