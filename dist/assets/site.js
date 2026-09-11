// The content and navigation work without WebGL or JavaScript.
if ('IntersectionObserver' in window) {
 const art = document.querySelector('#hero-art');
 if (art) {
  const observer = new IntersectionObserver((entries) => {
   if (entries.some(entry => entry.isIntersecting)) {
    observer.disconnect();
    import('./scene.js').then(module => module.mountScene(art)).catch(() => { /* Keep the supplied brand-mark fallback. */ });
   }
  }, { rootMargin: '100px' });
  observer.observe(art);
 }
}
