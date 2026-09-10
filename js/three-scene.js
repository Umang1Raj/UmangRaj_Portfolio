/**
 * Minimalist 3D WebGL Scene for Umang Raj Portfolio
 * Clean, lightweight, calm, and elegant Three.js experience.
 */

class WebGLPortfolioScene {
  constructor() {
    this.container = document.getElementById('webgl-canvas-container');
    if (!this.container || typeof THREE === 'undefined') {
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Smooth Mouse & Scroll Lerp
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    // Minimalist 3D Objects
    this.mainGroup = null;
    this.wireframeCore = null;
    this.innerSphere = null;
    this.orbitRing = null;
    this.particles = null;

    // Calm camera positions for each section
    this.waypoints = [
      { pos: [0, 0, 14], rot: [0, 0, 0] },         // Hero
      { pos: [-2.5, 1, 13], rot: [0.05, 0.15, 0] }, // Profile
      { pos: [2.5, -1, 13.5], rot: [-0.05, -0.15, 0] }, // Certificates
      { pos: [0, 2, 12.5], rot: [0.1, 0, 0] },     // Education
      { pos: [-2, -1.5, 13], rot: [-0.08, 0.1, 0] },// Projects
      { pos: [2, 1, 12], rot: [0.08, -0.1, 0] },   // Skills
      { pos: [0, 0, 14], rot: [0, 0, 0] }          // Contact
    ];

    this.init();
    this.createLights();
    this.createMinimalSculpture();
    this.createAmbientDust();
    this.addListeners();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0b0d, 0.04);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 14);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.container.appendChild(this.renderer.domElement);
  }

  createLights() {
    // Soft ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    // Subtle soft key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 8, 10);
    this.scene.add(keyLight);

    // Tasteful accent light (Lime)
    const limeAccent = new THREE.PointLight(0xc7ff58, 1.5, 25);
    limeAccent.position.set(-6, -4, 6);
    this.scene.add(limeAccent);
  }

  createMinimalSculpture() {
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    // 1. Inner sleek matte core
    const innerGeo = new THREE.IcosahedronGeometry(1.4, 3);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.35,
      metalness: 0.8
    });
    this.innerSphere = new THREE.Mesh(innerGeo, innerMat);
    this.mainGroup.add(this.innerSphere);

    // 2. Elegant wireframe outer cage (clean, fine lines)
    const wireGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc7ff58,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.wireframeCore = new THREE.Mesh(wireGeo, wireMat);
    this.mainGroup.add(this.wireframeCore);

    // 3. Single minimalist thin orbital ring
    const ringGeo = new THREE.TorusGeometry(3.0, 0.015, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25
    });
    this.orbitRing = new THREE.Mesh(ringGeo, ringMat);
    this.orbitRing.rotation.x = Math.PI / 3;
    this.mainGroup.add(this.orbitRing);
  }

  createAmbientDust() {
    // Just 160 tiny, calm, floating dust motes (not crowded!)
    const count = 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 22;
      positions[i3 + 1] = (Math.random() - 0.5) * 24;
      positions[i3 + 2] = (Math.random() - 0.5) * 16;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xc7ff58,
      transparent: true,
      opacity: 0.35
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  addListeners() {
    window.addEventListener('resize', () => {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetScrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }, { passive: true });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Gentle mouse easing
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    // Smooth scroll interpolation
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.05;

    // Slow, calm rotation of sculpture
    if (this.mainGroup) {
      this.mainGroup.rotation.y = time * 0.12 + this.mouse.x * 0.3;
      this.mainGroup.rotation.x = time * 0.06 + this.mouse.y * 0.2;

      if (this.orbitRing) {
        this.orbitRing.rotation.z = time * 0.2;
      }
      if (this.wireframeCore) {
        this.wireframeCore.rotation.y = time * -0.1;
      }
    }

    // Slow subtle dust drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
    }

    // Camera movement along waypoints
    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }

  updateCamera() {
    const total = this.waypoints.length - 1;
    const progress = Math.max(0, Math.min(1, this.scrollProgress));
    const scaled = progress * total;
    const idx = Math.min(Math.floor(scaled), total - 1);
    const frac = scaled - idx;
    const ease = frac * frac * (3 - 2 * frac);

    const a = this.waypoints[idx];
    const b = this.waypoints[idx + 1];

    const targetX = a.pos[0] + (b.pos[0] - a.pos[0]) * ease + (this.mouse.x * 0.6);
    const targetY = a.pos[1] + (b.pos[1] - a.pos[1]) * ease + (this.mouse.y * 0.6);
    const targetZ = a.pos[2] + (b.pos[2] - a.pos[2]) * ease;

    this.camera.position.x += (targetX - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.06;

    this.camera.lookAt(new THREE.Vector3(this.mouse.x * 0.3, this.mouse.y * 0.2, 0));
  }

  pulseWave() {
    if (!this.wireframeCore) return;
    const base = 2.1;
    let frame = 0;
    const anim = () => {
      frame++;
      const s = (base + Math.sin(frame * 0.18) * 0.25 * Math.exp(-frame * 0.06)) / base;
      this.wireframeCore.scale.set(s, s, s);
      if (frame < 25) requestAnimationFrame(anim);
    };
    anim();
  }
}

window.WebGLPortfolioScene = WebGLPortfolioScene;
