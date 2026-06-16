import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import './style.css';

// ============================================
// OBSIDIAN GATES — Main Application
// The World's Cryptoconomy — 3D Topographical Globe
// ============================================

class ObsidianGates {
  constructor() {
    this.container = document.getElementById('app');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.controls = null;
    this.globe = null;
    this.earthGroup = null;
    this.bots = [];
    this.markets = [];
    this.connections = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.selectedRegion = null;
    this.isZoomed = false;
    this.timelineNodes = [];
    this.fibonacciVisible = false;

    this.init();
  }

  init() {
    this.setupScene();
    this.setupLights();
    this.createGlobe();
    this.createStarField();
    this.createAtmosphere();
    this.setupMarkets();
    this.setupBots();
    this.setupConnections();
    this.setupTimeline();
    this.setupPostProcessing();
    this.setupControls();
    this.setupUI();
    this.setupEventListeners();
    this.animate();

    // Hide loading
    setTimeout(() => {
      document.getElementById('loading').classList.add('hidden');
    }, 1500);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.002);

    this.camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 10000
    );
    this.camera.position.set(0, 0, 350);

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(100, 50, 100);
    this.scene.add(sunLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 2, 500);
    purpleLight.position.set(-100, 100, 100);
    this.scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 1.5, 500);
    cyanLight.position.set(100, -100, -100);
    this.scene.add(cyanLight);
  }

  createGlobe() {
    this.earthGroup = new THREE.Group();

    // Main Earth sphere with topographical shader
    const earthGeometry = new THREE.SphereGeometry(100, 128, 128);

    // Create procedural topographical texture
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Draw base ocean
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGradient.addColorStop(0, '#0a1628');
    oceanGradient.addColorStop(0.5, '#0d1f3a');
    oceanGradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 2048, 1024);

    // Draw continents with topographical elevation
    const continents = [
      // North America
      { x: 400, y: 200, w: 350, h: 280, color: '#1a3a2a' },
      // South America
      { x: 520, y: 480, w: 180, h: 350, color: '#1a3a2a' },
      // Europe
      { x: 950, y: 180, w: 200, h: 150, color: '#1a3a2a' },
      // Africa
      { x: 980, y: 350, w: 220, h: 300, color: '#1a3a2a' },
      // Asia
      { x: 1150, y: 150, w: 500, h: 350, color: '#1a3a2a' },
      // Australia
      { x: 1550, y: 550, w: 200, h: 120, color: '#1a3a2a' },
      // Antarctica
      { x: 0, y: 900, w: 2048, h: 124, color: '#e8e8e8' },
    ];

    continents.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x + c.w/2, c.y + c.h/2, c.w/2, c.h/2, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();

      // Add elevation detail
      for (let i = 0; i < 50; i++) {
        const ex = c.x + Math.random() * c.w;
        const ey = c.y + Math.random() * c.h;
        const er = Math.random() * 30 + 5;
        ctx.beginPath();
        ctx.arc(ex, ey, er, 0, Math.PI * 2);
        const elevation = Math.random();
        if (elevation > 0.7) {
          ctx.fillStyle = `rgba(139, 92, 246, ${0.1 + Math.random() * 0.2})`;
        } else if (elevation > 0.4) {
          ctx.fillStyle = `rgba(6, 182, 212, ${0.1 + Math.random() * 0.2})`;
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${0.1 + Math.random() * 0.2})`;
        }
        ctx.fill();
      }
    });

    // Add grid lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 36; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 2048 / 36, 0);
      ctx.lineTo(i * 2048 / 36, 1024);
      ctx.stroke();
    }
    for (let i = 0; i <= 18; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * 1024 / 18);
      ctx.lineTo(2048, i * 1024 / 18);
      ctx.stroke();
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.8,
      metalness: 0.2,
      bumpScale: 2,
    });

    this.globe = new THREE.Mesh(earthGeometry, earthMaterial);
    this.earthGroup.add(this.globe);

    // Wireframe overlay for tech look
    const wireGeometry = new THREE.SphereGeometry(100.5, 64, 64);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
    });
    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    this.earthGroup.add(wireframe);

    this.scene.add(this.earthGroup);
  }

  createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 8000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const r = 500 + Math.random() * 1500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      const colorType = Math.random();
      if (colorType > 0.9) {
        colors[i3] = 0.54; colors[i3 + 1] = 0.36; colors[i3 + 2] = 0.96; // Purple
      } else if (colorType > 0.8) {
        colors[i3] = 0.02; colors[i3 + 1] = 0.71; colors[i3 + 2] = 0.83; // Cyan
      } else if (colorType > 0.7) {
        colors[i3] = 0.96; colors[i3 + 1] = 0.59; colors[i3 + 2] = 0.11; // Amber
      } else {
        colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 1; // White
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  createAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(105, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
          gl_FragColor = vec4(0.54, 0.36, 0.96, 1.0) * intensity * 0.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    this.scene.add(atmosphere);

    // Inner glow
    const glowGeometry = new THREE.SphereGeometry(102, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.02, 0.71, 0.83, 1.0) * intensity * 0.3;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(glow);
  }

  setupMarkets() {
    // Major crypto markets with real coordinates
    this.markets = [
      { name: 'Binance', city: 'Malta', lat: 35.8997, lon: 14.5148, type: 'cex', volume: 45.2, color: 0xf0b90b },
      { name: 'Coinbase', city: 'San Francisco', lat: 37.7749, lon: -122.4194, type: 'cex', volume: 12.8, color: 0x0052ff },
      { name: 'Kraken', city: 'San Francisco', lat: 37.7849, lon: -122.4094, type: 'cex', volume: 8.5, color: 0x5741d9 },
      { name: 'OKX', city: 'Seychelles', lat: -4.6796, lon: 55.4920, type: 'cex', volume: 18.3, color: 0x000000 },
      { name: 'Bybit', city: 'Dubai', lat: 25.2048, lon: 55.2708, type: 'cex', volume: 15.7, color: 0xf7a600 },
      { name: 'KuCoin', city: 'Seychelles', lat: -4.6896, lon: 55.5020, type: 'cex', volume: 6.2, color: 0x01bc8d },
      { name: 'Bitfinex', city: 'Hong Kong', lat: 22.3193, lon: 114.1694, type: 'cex', volume: 3.1, color: 0x00a3e0 },
      { name: 'Bitstamp', city: 'Luxembourg', lat: 49.6116, lon: 6.1319, type: 'cex', volume: 1.8, color: 0x00a3e0 },
      { name: 'Uniswap', city: 'New York', lat: 40.7128, lon: -74.0060, type: 'dex', volume: 2.5, color: 0xff007a },
      { name: 'PancakeSwap', city: 'Singapore', lat: 1.3521, lon: 103.8198, type: 'dex', volume: 1.9, color: 0xd1884f },
      { name: 'SushiSwap', city: 'Tokyo', lat: 35.6762, lon: 139.6503, type: 'dex', volume: 0.8, color: 0xfa52a0 },
      { name: 'Curve', city: 'Zug', lat: 47.1662, lon: 8.5155, type: 'dex', volume: 1.2, color: 0xff4d4d },
      { name: 'dYdX', city: 'New York', lat: 40.7228, lon: -73.9960, type: 'dex', volume: 0.9, color: 0x6966ff },
      { name: 'GMX', city: 'Dubai', lat: 25.2148, lon: 55.2808, type: 'dex', volume: 0.7, color: 0x2d62ff },
      { name: 'Lido', city: 'London', lat: 51.5074, lon: -0.1278, type: 'defi', volume: 1.5, color: 0x00a3ff },
      { name: 'Aave', city: 'London', lat: 51.5174, lon: -0.1378, type: 'defi', volume: 0.6, color: 0xb6509e },
      { name: 'Compound', city: 'San Francisco', lat: 37.7649, lon: -122.4294, type: 'defi', volume: 0.4, color: 0x00d395 },
      { name: 'MakerDAO', city: 'Copenhagen', lat: 55.6761, lon: 12.5683, type: 'defi', volume: 0.5, color: 0xf4b731 },
      { name: 'OpenSea', city: 'New York', lat: 40.7328, lon: -74.0160, type: 'nft', volume: 0.3, color: 0x2081e2 },
      { name: 'Blur', city: 'Los Angeles', lat: 34.0522, lon: -118.2437, type: 'nft', volume: 0.2, color: 0xff5500 },
      { name: 'Magic Eden', city: 'San Francisco', lat: 37.7549, lon: -122.4394, type: 'nft', volume: 0.15, color: 0xe93a88 },
    ];

    this.markets.forEach(market => {
      const pos = this.latLonToVector3(market.lat, market.lon, 102);

      // Market marker
      const markerGeometry = new THREE.SphereGeometry(market.volume * 0.3 + 0.5, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: market.color,
        transparent: true,
        opacity: 0.9,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(pos);
      marker.userData = { type: 'market', data: market };
      this.earthGroup.add(marker);

      // Glow ring
      const ringGeometry = new THREE.RingGeometry(
        market.volume * 0.5 + 0.8, 
        market.volume * 0.5 + 1.2, 
        32
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: market.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      this.earthGroup.add(ring);

      // Pulse animation
      market.mesh = marker;
      market.ring = ring;
      market.baseScale = 1;
    });
  }

  setupBots() {
    // Simulated trading bots
    this.bots = [
      { id: 'bot-001', name: 'Arbitrage Alpha', type: 'arbitrage', status: 'running', profit: 12.45, trades: 234, route: ['Binance', 'Coinbase', 'Kraken'], speed: 0.8 },
      { id: 'bot-002', name: 'Momentum Hunter', type: 'momentum', status: 'running', profit: 8.32, trades: 189, route: ['Bybit', 'OKX', 'Binance'], speed: 1.2 },
      { id: 'bot-003', name: 'Grid Master', type: 'grid', status: 'paused', profit: -2.14, trades: 456, route: ['KuCoin', 'Bitfinex'], speed: 0.5 },
      { id: 'bot-004', name: 'DEX Arbitrageur', type: 'dex-arb', status: 'running', profit: 5.67, trades: 123, route: ['Uniswap', 'SushiSwap', 'PancakeSwap'], speed: 1.5 },
      { id: 'bot-005', name: 'Flash Loan Bot', type: 'flash', status: 'running', profit: 18.92, trades: 67, route: ['Aave', 'Compound', 'dYdX'], speed: 2.0 },
    ];

    this.bots.forEach(bot => {
      // Create bot mesh
      const botGeometry = new THREE.ConeGeometry(1.5, 4, 4);
      const botMaterial = new THREE.MeshBasicMaterial({
        color: bot.profit > 0 ? 0x10b981 : 0xef4444,
        transparent: true,
        opacity: 0.8,
      });
      const botMesh = new THREE.Mesh(botGeometry, botMaterial);

      // Trail
      const trailGeometry = new THREE.BufferGeometry();
      const trailPositions = new Float32Array(50 * 3);
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      const trailMaterial = new THREE.LineBasicMaterial({
        color: bot.profit > 0 ? 0x10b981 : 0xef4444,
        transparent: true,
        opacity: 0.4,
      });
      const trail = new THREE.Line(trailGeometry, trailMaterial);

      this.scene.add(botMesh);
      this.scene.add(trail);

      bot.mesh = botMesh;
      bot.trail = trail;
      bot.trailPositions = [];
      bot.currentRouteIndex = 0;
      bot.progress = 0;
    });
  }

  setupConnections() {
    // Draw connections between major markets
    const majorMarkets = this.markets.filter(m => m.volume > 10);

    for (let i = 0; i < majorMarkets.length; i++) {
      for (let j = i + 1; j < majorMarkets.length; j++) {
        const m1 = majorMarkets[i];
        const m2 = majorMarkets[j];

        const pos1 = this.latLonToVector3(m1.lat, m1.lon, 102);
        const pos2 = this.latLonToVector3(m2.lat, m2.lon, 102);

        // Create curved connection
        const mid = pos1.clone().add(pos2).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(140);

        const curve = new THREE.QuadraticBezierCurve3(pos1, mid, pos2);
        const points = curve.getPoints(50);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.1,
        });

        const line = new THREE.Line(geometry, material);
        this.earthGroup.add(line);

        // Animated particle on connection
        const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.8,
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        this.earthGroup.add(particle);

        this.connections.push({
          line, particle, curve, progress: Math.random()
        });
      }
    }
  }

  setupTimeline() {
    // Blockchain timeline data
    this.timelineData = [
      { year: 2008, label: 'Bitcoin Whitepaper', type: 'bitcoin', region: 'Japan', lat: 35.6762, lon: 139.6503, desc: 'Satoshi Nakamoto publishes the Bitcoin whitepaper, introducing the concept of decentralized digital currency.' },
      { year: 2009, label: 'Genesis Block', type: 'bitcoin', region: 'Global', lat: 0, lon: 0, desc: 'The Bitcoin network goes live with the mining of the genesis block. The first transaction occurs between Satoshi and Hal Finney.' },
      { year: 2010, label: 'First Bitcoin Purchase', type: 'bitcoin', region: 'USA', lat: 28.5383, lon: -81.3792, desc: 'Laszlo Hanyecz purchases two pizzas for 10,000 BTC — the first real-world Bitcoin transaction.' },
      { year: 2011, label: 'Litecoin Launch', type: 'altcoin', region: 'USA', lat: 37.7749, lon: -122.4194, desc: 'Charlie Lee creates Litecoin as the "silver to Bitcoin's gold" with faster block times.' },
      { year: 2013, label: 'Ethereum Whitepaper', type: 'ethereum', region: 'Switzerland', lat: 47.3769, lon: 8.5417, desc: 'Vitalik Buterin publishes the Ethereum whitepaper, proposing a Turing-complete blockchain platform.' },
      { year: 2015, label: 'Ethereum Mainnet', type: 'ethereum', region: 'Switzerland', lat: 47.3769, lon: 8.5417, desc: 'Ethereum launches with the Frontier release, enabling smart contracts and decentralized applications.' },
      { year: 2016, label: 'The DAO Hack', type: 'ethereum', region: 'Global', lat: 0, lon: 0, desc: 'The DAO is exploited for 3.6M ETH, leading to the Ethereum hard fork and creation of Ethereum Classic.' },
      { year: 2017, label: 'ICO Boom', type: 'ethereum', region: 'Global', lat: 0, lon: 0, desc: 'Initial Coin Offerings raise over $5.6B. Regulatory scrutiny increases worldwide.' },
      { year: 2020, label: 'DeFi Summer', type: 'defi', region: 'Global', lat: 0, lon: 0, desc: 'Total Value Locked in DeFi protocols explodes from $1B to $15B. Compound, Aave, Uniswap lead.' },
      { year: 2021, label: 'NFT Mania', type: 'nft', region: 'Global', lat: 0, lon: 0, desc: 'NFT trading volume reaches $25B. Beeple sells artwork for $69M at Christie's.' },
      { year: 2022, label: 'The Merge', type: 'ethereum', region: 'Global', lat: 0, lon: 0, desc: 'Ethereum transitions from Proof-of-Work to Proof-of-Stake, reducing energy consumption by 99.95%.' },
      { year: 2023, label: 'Layer 2 Scaling', type: 'layer2', region: 'Global', lat: 0, lon: 0, desc: 'Arbitrum and Optimism process millions of transactions. ZK-rollups gain traction.' },
      { year: 2024, label: 'Bitcoin ETFs', type: 'bitcoin', region: 'USA', lat: 40.7128, lon: -74.0060, desc: 'SEC approves spot Bitcoin ETFs. Institutional adoption accelerates with billions in inflows.' },
      { year: 2025, label: 'AI + Blockchain', type: 'ai', region: 'Global', lat: 0, lon: 0, desc: 'AI agents begin autonomously interacting with smart contracts. Decentralized compute networks emerge.' },
      { year: 2026, label: 'Sovereign Identity', type: 'sovereign', region: 'Canada', lat: 43.6532, lon: -79.3832, desc: 'IAI Introverted Technologies launches the sovereign federacy identity protocol with 0-datum emotional anchoring core.' },
    ];
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5, 0.4, 0.85
    );
    this.composer.addPass(bloomPass);

    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms['resolution'].value.set(
      1 / window.innerWidth, 1 / window.innerHeight
    );
    this.composer.addPass(fxaaPass);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.8;
    this.controls.minDistance = 120;
    this.controls.maxDistance = 600;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
  }

  setupUI() {
    // Create UI layer
    const uiLayer = document.createElement('div');
    uiLayer.id = 'ui-layer';
    document.body.appendChild(uiLayer);

    // Top bar
    const topBar = document.createElement('div');
    topBar.className = 'top-bar';
    topBar.innerHTML = `
      <div class="brand">
        <div class="brand-icon">◈</div>
        <div class="brand-text">
          <div class="brand-title">Obsidian Gates</div>
          <div class="brand-subtitle">The World's Cryptoconomy</div>
        </div>
      </div>
      <div class="top-stats">
        <div class="stat-pill">
          <span class="indicator"></span>
          <span>Live Markets: ${this.markets.length}</span>
        </div>
        <div class="stat-pill">
          <span style="color:var(--text-green)">●</span>
          <span>Active Bots: ${this.bots.filter(b => b.status === 'running').length}</span>
        </div>
        <div class="stat-pill">
          <span style="color:var(--text-gold)">◈</span>
          <span>TVL: $2.4T</span>
        </div>
      </div>
    `;
    uiLayer.appendChild(topBar);

    // Toggle buttons
    const toggleLeft = document.createElement('button');
    toggleLeft.id = 'toggle-left';
    toggleLeft.className = 'toggle-btn active';
    toggleLeft.innerHTML = '☰ Markets';
    document.body.appendChild(toggleLeft);

    const toggleRight = document.createElement('button');
    toggleRight.id = 'toggle-right';
    toggleRight.className = 'toggle-btn active';
    toggleRight.innerHTML = 'Bots 🤖';
    document.body.appendChild(toggleRight);

    const toggleBottom = document.createElement('button');
    toggleBottom.id = 'toggle-bottom';
    toggleBottom.className = 'toggle-btn active';
    toggleBottom.innerHTML = 'Timeline ⏱';
    document.body.appendChild(toggleBottom);

    // Left sidebar
    const leftSidebar = document.createElement('div');
    leftSidebar.className = 'left-sidebar open';
    leftSidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-title">Market Explorer</div>
      </div>
      <div class="sidebar-section">
        <div class="section-label">Filters</div>
        <div class="filter-chips">
          <div class="chip active" data-filter="all">All</div>
          <div class="chip" data-filter="cex">CEX</div>
          <div class="chip" data-filter="dex">DEX</div>
          <div class="chip" data-filter="defi">DeFi</div>
          <div class="chip" data-filter="nft">NFT</div>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="section-label">Hot Pairs</div>
        <div class="market-list" id="market-list"></div>
      </div>
      <div class="sidebar-section">
        <div class="section-label">Arbitrage Opportunities</div>
        <div class="market-list" id="arb-list"></div>
      </div>
    `;
    document.body.appendChild(leftSidebar);

    // Right sidebar
    const rightSidebar = document.createElement('div');
    rightSidebar.className = 'right-sidebar open';
    rightSidebar.innerHTML = `
      <div class="sidebar-header">
        <div class="sidebar-title">Bot Fleet</div>
      </div>
      <div class="bot-list" id="bot-list"></div>
      <div class="sidebar-section" style="border-top:1px solid var(--border-subtle)">
        <div class="section-label">Quick Deploy</div>
        <button class="chip active" style="width:100%;text-align:center;padding:10px" id="deploy-bot-btn">
          + New Arbitrage Bot
        </button>
      </div>
    `;
    document.body.appendChild(rightSidebar);

    // Bottom panel (Timeline)
    const bottomPanel = document.createElement('div');
    bottomPanel.className = 'bottom-panel open';
    bottomPanel.innerHTML = `
      <div class="timeline-header">
        <div class="timeline-title">Blockchain Timeline</div>
        <div class="timeline-controls">
          <button class="timeline-btn active" data-period="all">All</button>
          <button class="timeline-btn" data-period="bitcoin">Bitcoin</button>
          <button class="timeline-btn" data-period="ethereum">Ethereum</button>
          <button class="timeline-btn" data-period="defi">DeFi</button>
          <button class="timeline-btn" data-period="nft">NFT</button>
        </div>
      </div>
      <div class="timeline-content" id="timeline-content"></div>
    `;
    document.body.appendChild(bottomPanel);

    // Center overlay (Search)
    const centerOverlay = document.createElement('div');
    centerOverlay.className = 'center-overlay';
    centerOverlay.innerHTML = `
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" placeholder="Search markets, cities, countries, blockchain events..." id="search-input">
      </div>
      <div class="info-card" id="info-card">
        <div class="info-header">
          <div class="info-title" id="info-title">Select a Region</div>
          <div class="info-close" id="info-close">✕</div>
        </div>
        <div class="info-stats-grid" id="info-stats"></div>
        <div class="info-description" id="info-desc">Click on any market marker or search for a location to explore the global crypto economy.</div>
      </div>
    `;
    document.body.appendChild(centerOverlay);

    // Fibonacci overlay
    const fibOverlay = document.createElement('div');
    fibOverlay.className = 'fib-overlay';
    fibOverlay.id = 'fib-overlay';
    fibOverlay.innerHTML = `
      <div class="fib-title">Fibonacci Levels</div>
      <div class="fib-spiral">
        <canvas id="fib-canvas" width="120" height="120"></canvas>
      </div>
      <div class="fib-levels" id="fib-levels"></div>
    `;
    document.body.appendChild(fibOverlay);

    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.id = 'tooltip';
    document.body.appendChild(tooltip);

    // Populate market list
    this.populateMarketList();
    this.populateBotList();
    this.populateTimeline();
    this.populateFibonacci();

    // Setup toggle handlers
    this.setupToggles();
    this.setupSearch();
    this.setupFilters();
  }

  populateMarketList() {
    const list = document.getElementById('market-list');
    const arbList = document.getElementById('arb-list');

    this.markets.forEach(m => {
      const item = document.createElement('div');
      item.className = 'market-item';
      item.dataset.type = m.type;
      const change = (Math.random() * 10 - 3).toFixed(2);
      const changeClass = change > 0 ? 'up' : 'down';
      item.innerHTML = `
        <div class="market-pair">
          <div class="icon" style="background:${'#' + m.color.toString(16).padStart(6, '0')};color:white">${m.name[0]}</div>
          <span class="name">${m.name}</span>
          <span class="exchange">${m.type.toUpperCase()}</span>
        </div>
        <div class="market-price">
          <div class="value">$${(m.volume * Math.random() * 1000).toFixed(1)}M</div>
          <div class="change ${changeClass}">${change > 0 ? '+' : ''}${change}%</div>
        </div>
      `;
      item.addEventListener('click', () => this.focusOnMarket(m));
      list.appendChild(item);
    });

    // Arbitrage opportunities
    const arbs = [
      { pair: 'BTC/USDT', spread: '0.12%', from: 'Binance', to: 'Coinbase' },
      { pair: 'ETH/USDC', spread: '0.08%', from: 'Kraken', to: 'OKX' },
      { pair: 'SOL/USDT', spread: '0.23%', from: 'Bybit', to: 'Binance' },
      { pair: 'ARB/ETH', spread: '0.15%', from: 'Uniswap', to: 'SushiSwap' },
    ];

    arbs.forEach(a => {
      const item = document.createElement('div');
      item.className = 'market-item';
      item.innerHTML = `
        <div class="market-pair">
          <span class="name">${a.pair}</span>
          <span class="exchange">${a.from} → ${a.to}</span>
        </div>
        <div class="market-price">
          <div class="value" style="color:var(--text-green)">${a.spread}</div>
          <div class="change up">+Profit</div>
        </div>
      `;
      arbList.appendChild(item);
    });
  }

  populateBotList() {
    const list = document.getElementById('bot-list');

    this.bots.forEach(bot => {
      const card = document.createElement('div');
      card.className = 'bot-card' + (bot.status === 'running' ? ' active' : '');
      card.dataset.botId = bot.id;
      card.innerHTML = `
        <div class="bot-header">
          <div class="bot-name">
            <span class="bot-status ${bot.status}"></span>
            ${bot.name}
          </div>
          <span style="font-size:11px;color:var(--text-muted);text-transform:uppercase">${bot.type}</span>
        </div>
        <div class="bot-route">
          ${bot.route.map((r, i) => `
            <span>${r}</span>
            ${i < bot.route.length - 1 ? '<span class="arrow">→</span>' : ''}
          `).join('')}
        </div>
        <div class="bot-metrics">
          <div class="metric">
            <div class="metric-label">Profit</div>
            <div class="metric-value ${bot.profit > 0 ? 'profit' : 'loss'}">${bot.profit > 0 ? '+' : ''}${bot.profit}%</div>
          </div>
          <div class="metric">
            <div class="metric-label">Trades</div>
            <div class="metric-value">${bot.trades}</div>
          </div>
          <div class="metric">
            <div class="metric-label">Speed</div>
            <div class="metric-value">${bot.speed}x</div>
          </div>
          <div class="metric">
            <div class="metric-label">Status</div>
            <div class="metric-value" style="color:${bot.status === 'running' ? 'var(--text-green)' : bot.status === 'paused' ? 'var(--text-gold)' : 'var(--text-red)'};text-transform:capitalize">${bot.status}</div>
          </div>
        </div>
      `;
      card.addEventListener('click', () => this.focusOnBot(bot));
      list.appendChild(card);
    });
  }

  populateTimeline() {
    const content = document.getElementById('timeline-content');
    const track = document.createElement('div');
    track.className = 'timeline-track';

    const line = document.createElement('div');
    line.className = 'timeline-line';
    track.appendChild(line);

    this.timelineData.forEach((item, i) => {
      const node = document.createElement('div');
      node.className = 'timeline-node';
      node.dataset.type = item.type;
      node.innerHTML = `
        <div class="node-dot ${item.type}"></div>
        <div class="node-label">${item.label}</div>
        <div class="node-date">${item.year}</div>
      `;
      node.addEventListener('click', () => this.focusOnTimelineEvent(item));
      track.appendChild(node);

      this.timelineNodes.push({ mesh: null, data: item });
    });

    content.appendChild(track);
  }

  populateFibonacci() {
    const canvas = document.getElementById('fib-canvas');
    const ctx = canvas.getContext('2d');
    const centerX = 60, centerY = 60;

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;

    let a = 0, b = 1;
    let angle = 0;
    const goldenAngle = 137.5 * Math.PI / 180;

    for (let i = 0; i < 100; i++) {
      const r = Math.sqrt(i) * 3;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 158, 11, ${0.3 + (i / 100) * 0.7})`;
      ctx.fill();

      angle += goldenAngle;
    }

    const levels = document.getElementById('fib-levels');
    const fibs = [
      { pct: '0%', price: '$67,432' },
      { pct: '23.6%', price: '$64,891' },
      { pct: '38.2%', price: '$62,156' },
      { pct: '50%', price: '$59,890' },
      { pct: '61.8%', price: '$57,234' },
      { pct: '78.6%', price: '$54,123' },
      { pct: '100%', price: '$51,890' },
    ];

    fibs.forEach(f => {
      const div = document.createElement('div');
      div.className = 'fib-level';
      div.innerHTML = `<span class="pct">${f.pct}</span><span class="price">${f.price}</span>`;
      levels.appendChild(div);
    });
  }

  setupToggles() {
    document.getElementById('toggle-left').addEventListener('click', () => {
      document.querySelector('.left-sidebar').classList.toggle('open');
    });
    document.getElementById('toggle-right').addEventListener('click', () => {
      document.querySelector('.right-sidebar').classList.toggle('open');
    });
    document.getElementById('toggle-bottom').addEventListener('click', () => {
      document.querySelector('.bottom-panel').classList.toggle('open');
    });
  }

  setupSearch() {
    const input = document.getElementById('search-input');
    const infoCard = document.getElementById('info-card');

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length < 2) return;

      // Search markets
      const market = this.markets.find(m => 
        m.name.toLowerCase().includes(query) ||
        m.city.toLowerCase().includes(query)
      );

      if (market) {
        this.focusOnMarket(market);
        infoCard.classList.add('visible');
      }

      // Search timeline events
      const event = this.timelineData.find(t =>
        t.label.toLowerCase().includes(query) ||
        t.region.toLowerCase().includes(query)
      );

      if (event) {
        this.focusOnTimelineEvent(event);
      }
    });

    document.getElementById('info-close').addEventListener('click', () => {
      infoCard.classList.remove('visible');
    });
  }

  setupFilters() {
    document.querySelectorAll('.chip[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-filter]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.dataset.filter;
        document.querySelectorAll('.market-item').forEach(item => {
          if (filter === 'all' || item.dataset.type === filter) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    document.querySelectorAll('.timeline-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const period = btn.dataset.period;
        document.querySelectorAll('.timeline-node').forEach(node => {
          if (period === 'all' || node.dataset.type === period) {
            node.style.opacity = '1';
          } else {
            node.style.opacity = '0.2';
          }
        });
      });
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());

    this.renderer.domElement.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.earthGroup.children);

      const tooltip = document.getElementById('tooltip');
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.type === 'market') {
          tooltip.textContent = `${obj.userData.data.name} — ${obj.userData.data.city}`;
          tooltip.style.left = e.clientX + 15 + 'px';
          tooltip.style.top = e.clientY + 15 + 'px';
          tooltip.classList.add('visible');
          document.body.style.cursor = 'pointer';
        }
      } else {
        tooltip.classList.remove('visible');
        document.body.style.cursor = 'default';
      }
    });

    this.renderer.domElement.addEventListener('click', (e) => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.earthGroup.children);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.type === 'market') {
          this.focusOnMarket(obj.userData.data);
        }
      }
    });
  }

  latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  focusOnMarket(market) {
    const pos = this.latLonToVector3(market.lat, market.lon, 180);

    // Animate camera
    const startPos = this.camera.position.clone();
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, pos, ease);
      this.camera.lookAt(0, 0, 0);

      if (t < 1) requestAnimationFrame(animate);
    };

    animate();
    this.controls.autoRotate = false;

    // Show info card
    const infoCard = document.getElementById('info-card');
    document.getElementById('info-title').textContent = market.name;
    document.getElementById('info-stats').innerHTML = `
      <div class="info-stat">
        <div class="info-stat-label">Location</div>
        <div class="info-stat-value">${market.city}</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">Type</div>
        <div class="info-stat-value">${market.type.toUpperCase()}</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">24h Volume</div>
        <div class="info-stat-value">$${market.volume}B</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">Active Pairs</div>
        <div class="info-stat-value">${Math.floor(Math.random() * 500 + 100)}</div>
      </div>
    `;
    document.getElementById('info-desc').textContent = `${market.name} is a leading ${market.type.toUpperCase()} platform based in ${market.city}, processing billions in daily trading volume across multiple asset pairs.`;
    infoCard.classList.add('visible');

    // Show fibonacci
    document.getElementById('fib-overlay').classList.add('visible');
    this.fibonacciVisible = true;
  }

  focusOnTimelineEvent(event) {
    if (event.lat === 0 && event.lon === 0) {
      // Global event - zoom out
      const pos = new THREE.Vector3(0, 0, 400);
      this.camera.position.lerp(pos, 0.05);
      this.controls.autoRotate = true;
    } else {
      const pos = this.latLonToVector3(event.lat, event.lon, 180);
      this.camera.position.lerp(pos, 0.05);
      this.controls.autoRotate = false;
    }

    const infoCard = document.getElementById('info-card');
    document.getElementById('info-title').textContent = `${event.year} — ${event.label}`;
    document.getElementById('info-stats').innerHTML = `
      <div class="info-stat">
        <div class="info-stat-label">Year</div>
        <div class="info-stat-value">${event.year}</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">Region</div>
        <div class="info-stat-value">${event.region}</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">Category</div>
        <div class="info-stat-value">${event.type.toUpperCase()}</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">Impact</div>
        <div class="info-stat-value">${['High', 'Critical', 'Transformative'][Math.floor(Math.random() * 3)]}</div>
      </div>
    `;
    document.getElementById('info-desc').textContent = event.desc;
    infoCard.classList.add('visible');
  }

  focusOnBot(bot) {
    // Highlight bot in 3D
    if (bot.mesh) {
      bot.mesh.scale.setScalar(2);
      setTimeout(() => {
        bot.mesh.scale.setScalar(1);
      }, 1000);
    }

    // Show bot details
    const infoCard = document.getElementById('info-card');
    document.getElementById('info-title').textContent = bot.name;
    document.getElementById('info-stats').innerHTML = `
      <div class="info-stat">
        <div class="info-stat-label">Type</div>
        <div class="info-stat-value">${bot.type.toUpperCase()}</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">Profit</div>
        <div class="info-stat-value ${bot.profit > 0 ? 'profit' : 'loss'}">${bot.profit > 0 ? '+' : ''}${bot.profit}%</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">Trades</div>
        <div class="info-stat-value">${bot.trades}</div>
      </div>
      <div class="info-stat">
        <div class="info-stat-label">Route</div>
        <div class="info-stat-value">${bot.route.join(' → ')}</div>
      </div>
    `;
    document.getElementById('info-desc').textContent = `Autonomous trading bot executing ${bot.type} strategies across ${bot.route.join(', ')}. Current status: ${bot.status}. Speed multiplier: ${bot.speed}x.`;
    infoCard.classList.add('visible');
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Rotate globe
    if (this.earthGroup) {
      this.earthGroup.rotation.y += 0.0005;
    }

    // Animate stars
    if (this.stars) {
      this.stars.rotation.y += 0.0001;
      this.stars.rotation.x += 0.00005;
    }

    // Animate market markers
    this.markets.forEach(market => {
      if (market.mesh && market.ring) {
        const scale = market.baseScale + Math.sin(time * 2 + market.volume) * 0.2;
        market.mesh.scale.setScalar(scale);
        market.ring.scale.setScalar(scale * 1.2);
        market.ring.rotation.z += 0.01;
      }
    });

    // Animate bots
    this.bots.forEach(bot => {
      if (bot.status === 'running' && bot.mesh) {
        // Move bot along route
        const markets = bot.route.map(r => this.markets.find(m => m.name === r)).filter(Boolean);
        if (markets.length >= 2) {
          bot.progress += delta * bot.speed * 0.1;
          if (bot.progress >= 1) {
            bot.progress = 0;
            bot.currentRouteIndex = (bot.currentRouteIndex + 1) % (markets.length - 1);
          }

          const from = markets[bot.currentRouteIndex];
          const to = markets[(bot.currentRouteIndex + 1) % markets.length];

          if (from && to) {
            const pos1 = this.latLonToVector3(from.lat, from.lon, 120);
            const pos2 = this.latLonToVector3(to.lat, to.lon, 120);

            // Arc path
            const mid = pos1.clone().add(pos2).multiplyScalar(0.5);
            mid.normalize().multiplyScalar(160 + Math.sin(time * 3) * 20);

            const t = bot.progress;
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            const pos = new THREE.Vector3()
              .copy(pos1).multiplyScalar((1 - ease) * (1 - ease))
              .add(mid.clone().multiplyScalar(2 * (1 - ease) * ease))
              .add(pos2.clone().multiplyScalar(ease * ease));

            bot.mesh.position.copy(pos);
            bot.mesh.lookAt(pos2);

            // Update trail
            bot.trailPositions.push(pos.clone());
            if (bot.trailPositions.length > 50) bot.trailPositions.shift();

            const positions = new Float32Array(bot.trailPositions.length * 3);
            bot.trailPositions.forEach((p, i) => {
              positions[i * 3] = p.x;
              positions[i * 3 + 1] = p.y;
              positions[i * 3 + 2] = p.z;
            });
            bot.trail.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          }
        }
      }
    });

    // Animate connection particles
    this.connections.forEach(conn => {
      conn.progress += delta * 0.2;
      if (conn.progress >= 1) conn.progress = 0;

      const point = conn.curve.getPoint(conn.progress);
      conn.particle.position.copy(point);
    });

    this.controls.update();
    this.composer.render();
  }
}

// Initialize
new ObsidianGates();
