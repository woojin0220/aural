// Anonymous GitHub does not serve byte ranges, which Safari requires for MP4 URLs.
// Load the same video bytes as a classic script and play them from a local Blob URL.
(() => {
  if (!/AppleWebKit/.test(navigator.userAgent) || /Chrome|Chromium|Edg|OPR/.test(navigator.userAgent) || location.protocol === 'file:') return;

  const pending = new Map();
  window.auralReceiveAnnotationVideo = (filename, base64) => {
    const request = pending.get(filename);
    if (!request) return;
    try {
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
      request.resolve(URL.createObjectURL(new Blob([bytes], {type: 'video/mp4'})));
    } catch (error) {
      request.reject(error);
    }
  };

  document.querySelectorAll('#annotation-demos video').forEach(video => {
    const source = video.querySelector('source');
    if (!source) return;
    const filename = source.getAttribute('src').split('/').pop();
    const status = document.createElement('span');
    status.className = 'annotation-video-status';
    status.setAttribute('role', 'status');
    status.textContent = 'Loading video…';
    video.after(status);
    video.controls = false;
    video.preload = 'none';

    const request = {};
    request.promise = new Promise((resolve, reject) => Object.assign(request, {resolve, reject}));
    pending.set(filename, request);
    const script = document.createElement('script');
    script.src = `${source.getAttribute('src')}.js?v=1a5770d`;
    script.onerror = () => request.reject(new Error('Video payload failed to load'));
    document.head.append(script);

    request.promise.then(blobUrl => {
      video.src = blobUrl;
      video.controls = true;
      video.preload = 'metadata';
      video.load();
      status.remove();
    }).catch(() => {
      status.textContent = 'Video could not load. Please reload or try Chrome.';
    }).finally(() => {
      script.remove();
      pending.delete(filename);
    });
  });
})();
