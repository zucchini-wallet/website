import * as THREE from '../vendor/three.module.min.js';

export function mountScene(host) {
 const canvas = host.querySelector('canvas');
 const button = host.querySelector('#motion-toggle');
 const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
 let renderer;
 try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' }); }
 catch { return; }
 renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.5 : 2));
 renderer.outputColorSpace = THREE.SRGBColorSpace;
 renderer.toneMapping = THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure = 1.05;
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
 camera.position.set(0, 0.05, 8.5);
 const sculpture = new THREE.Group();
 scene.add(sculpture);
 // A faceted, curved golden zucchini — shaped to match the supplied wallet mark.
 const profile = [];
 for (let i = 0; i <= 28; i++) {
  const t = i / 28;
  const radius = i === 28 ? 0 : (0.18 + 0.67 * Math.pow(Math.sin(t * Math.PI * 0.78), 1.45)) * (t > .9 ? Math.sqrt((1-t)/.1) : 1);
  profile.push(new THREE.Vector2(radius, 1.7 - t * 3.15));
 }
 const bodyGeometry = new THREE.LatheGeometry(profile.reverse(), 24);
 const positions = bodyGeometry.attributes.position;
 for (let i = 0; i < positions.count; i++) {
  const t = (1.7 - positions.getY(i)) / 3.15;
  positions.setX(i, positions.getX(i) + .52 * Math.sin(t * Math.PI * 1.12));
 }
 bodyGeometry.computeVertexNormals();
 const body = new THREE.Mesh(bodyGeometry, new THREE.MeshPhysicalMaterial({ color: 0xf4cb32, metalness: .08, roughness: .6, clearcoat: .12, clearcoatRoughness: .28, flatShading: true }));
 sculpture.add(body);
 const stem = new THREE.Mesh(new THREE.CylinderGeometry(.14, .2, .42, 7), new THREE.MeshStandardMaterial({ color: 0x3d6635, roughness: .72, flatShading: true }));
 stem.position.set(-.015, 1.87, 0); stem.rotation.z = .12; sculpture.add(stem);
 const collar = new THREE.Mesh(new THREE.CylinderGeometry(.19, .22, .15, 9), new THREE.MeshStandardMaterial({ color: 0x788a31, roughness: .6, flatShading: true }));
 collar.position.y = 1.68; sculpture.add(collar);
 sculpture.rotation.set(.07, -.28, .63);
 sculpture.position.set(-.2, .05, 0);
 sculpture.scale.setScalar(.78);
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
   sculpture.rotation.y += ((-.28 + pointerX * .1 + Math.sin(elapsed*.25)*.03) - sculpture.rotation.y) * .045;
   sculpture.rotation.x += ((pointerY * .06) - sculpture.rotation.x) * .045;
   sculpture.position.y = .05 + Math.sin(elapsed*.6)*.035;
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
  renderer.dispose(); host.classList.remove('scene-ready'); button.hidden = true;
 }
 resize(); updateButton(); host.classList.add('scene-ready');
 window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); } );
}
