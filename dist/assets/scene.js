import * as THREE from '../vendor/three.module.min.js';

export async function mountScene(host) {
 const canvas = host.querySelector('canvas');
 const button = host.querySelector('#motion-toggle');
 const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
 const texture = await new THREE.TextureLoader().loadAsync('/assets/zucchini-mark-v3.png');
 texture.colorSpace = THREE.SRGBColorSpace;
 let renderer;
 try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); }
 catch { texture.dispose(); return; }
 renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 2));
 renderer.outputColorSpace = THREE.SRGBColorSpace;
 renderer.toneMapping = THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure = 1.45;
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
 camera.position.set(0, 0.05, 8.5);
 const sculpture = new THREE.Group();
 scene.add(sculpture);
 // Preserve the supplied brand artwork; the surrounding rings remain real 3D.
 const artwork = new THREE.Mesh(
  new THREE.PlaneGeometry(3.5, 3.5),
  new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .05, toneMapped: false, side: THREE.DoubleSide })
 );
 sculpture.add(artwork);
 sculpture.position.set(0, .05, 0);
 const orbit = new THREE.Group(); scene.add(orbit);
 const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xc2c8a5, metalness: .65, roughness: .35, transparent: true, opacity: .53 });
 const ring = new THREE.Mesh(new THREE.TorusGeometry(1.94, .018, 8, 180), ringMaterial);
 ring.rotation.set(1.05, -.3, -.4); orbit.add(ring);
 const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.12, .009, 8, 180), ringMaterial);
 ring2.rotation.set(1.25, .6, .2); orbit.add(ring2);
 const satellite = new THREE.Mesh(new THREE.IcosahedronGeometry(.1, 1), new THREE.MeshStandardMaterial({ color: 0xfce295, metalness: .6, roughness: .22 }));
 satellite.position.set(-1.7, -.8, .35); orbit.add(satellite);
 scene.add(new THREE.HemisphereLight(0xfff9dc, 0x293121, 3));
 const key = new THREE.DirectionalLight(0xfff3d0, 6); key.position.set(-3, 5, 5); scene.add(key);
 const rim = new THREE.DirectionalLight(0xeaffc4, 3); rim.position.set(4, 2, -2); scene.add(rim);
 const fill = new THREE.DirectionalLight(0xffc73a, 1.5); fill.position.set(1, -3, 3); scene.add(fill);
 let paused = reducedMotion.matches, visible = true, frame = 0, elapsed = 0, lastTime = 0;
 let pointerX = 0, pointerY = 0, disposed = false;
 const updateButton = () => { button.hidden = false; button.setAttribute('aria-pressed', String(paused)); button.textContent = paused ? 'Play motion ▷' : 'Pause motion Ⅱ'; };
 function render(time = 0) {
  frame = 0;
  if (disposed) return;
  const dt = lastTime ? Math.min((time-lastTime)/1000, .04) : 0;
  lastTime = time;
  if (!paused && visible && !document.hidden) {
   elapsed += dt;
   sculpture.rotation.y += ((pointerX * .08 + Math.sin(elapsed*.35)*.02) - sculpture.rotation.y) * .045;
   sculpture.rotation.x += ((pointerY * .05) - sculpture.rotation.x) * .045;
   sculpture.position.y = .05 + Math.sin(elapsed*.65)*.05;
   orbit.rotation.y = Math.sin(elapsed*.2)*.1;
   orbit.rotation.z = elapsed*.035;
  }
  renderer.render(scene, camera);
  if (!paused && visible && !document.hidden) frame = requestAnimationFrame(render);
 }
 function start() { if (!frame && !disposed) { lastTime = 0; frame = requestAnimationFrame(render); } }
 function resize() {
  const { width, height } = host.getBoundingClientRect();
  if (!width || !height) return;
  renderer.setSize(width, height, false); camera.aspect = width / height;
  camera.position.z = camera.aspect < .8 ? 10.5 : 8.5;
  camera.updateProjectionMatrix(); start();
 }
 const pointer = event => { const r = host.getBoundingClientRect(); pointerX = ((event.clientX-r.left)/r.width-.5)*2; pointerY = ((event.clientY-r.top)/r.height-.5)*2; };
 const toggle = () => { paused = !paused; updateButton(); start(); };
 const preference = () => { paused = reducedMotion.matches; updateButton(); start(); };
 const visibility = () => { if (!document.hidden) start(); };
 const loss = event => { event.preventDefault(); dispose(); };
 const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
 const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) start(); }); observer.observe(host);
 host.addEventListener('pointermove', pointer, { passive: true });
 button.addEventListener('click', toggle);
 reducedMotion.addEventListener('change', preference);
 document.addEventListener('visibilitychange', visibility);
 canvas.addEventListener('webglcontextlost', loss);
 function dispose() {
  if (disposed) return;
  disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect(); observer.disconnect();
  host.removeEventListener('pointermove', pointer); button.removeEventListener('click', toggle);
  reducedMotion.removeEventListener('change', preference); document.removeEventListener('visibilitychange', visibility);
  canvas.removeEventListener('webglcontextlost', loss);
  scene.traverse(object => { object.geometry?.dispose(); if (object.material) object.material.dispose(); });
  texture.dispose(); renderer.dispose(); host.classList.remove('scene-ready'); button.hidden = true;
 }
 resize(); updateButton(); host.classList.add('scene-ready');
 window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); } );
}
