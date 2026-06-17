/**
 * AIRFORCEONE BRIDGE INTEGRATION
 * Trustless Bridging + Obsidian Gates Sphere UI
 * 
 * Real-time bridge transaction visualization on the 3D globe
 */

import * as THREE from 'three';

export class BridgeIntegration {
  constructor(scene, earthGroup, latLonToVector3Fn) {
    this.scene = scene;
    this.earthGroup = earthGroup;
    this.latLonToVector3 = latLonToVector3Fn;
    
    this.bridgeTransactions = [];
    this.liquidityPools = [];
    this.chainMarkers = [];
    this.bridgeConnections = [];
    
    this.initChainMarkers();
    this.initLiquidityPools();
  }

  /**
   * Initialize blockchain chain markers (settlement points)
   */
  initChainMarkers() {
    const chains = [
      { name: 'Ethereum', symbol: 'ETH', lat: 47.3769, lon: 8.5417, color: 0x627eea, tvl: 180 },
      { name: 'Arbitrum', symbol: 'ARB', lat: 40.7128, lon: -74.0060, color: 0x28a0f0, tvl: 45 },
      { name: 'Polygon', symbol: 'POL', lat: 23.6345, lon: 85.2993, color: 0x8247e5, tvl: 35 },
      { name: 'Optimism', symbol: 'OP', lat: -33.8688, lon: 151.2093, color: 0xff0420, tvl: 28 },
      { name: 'Base', symbol: 'BASE', lat: 37.7749, lon: -122.4194, color: 0x0052ff, tvl: 20 },
      { name: 'Solana', symbol: 'SOL', lat: 1.3521, lon: 103.8198, color: 0x14f195, tvl: 15 },
      { name: 'Avalanche', symbol: 'AVAX', lat: 39.7392, lon: -104.9903, color: 0xe84142, tvl: 12 },
    ];

    chains.forEach(chain => {
      const pos = this.latLonToVector3(chain.lat, chain.lon, 108);
      
      // Chain settlement marker
      const markerGeometry = new THREE.SphereGeometry(2, 32, 32);
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: chain.color,
        emissive: chain.color,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(pos);
      marker.userData = { type: 'chain', data: chain };
      this.earthGroup.add(marker);

      // Pulsing halo
      const haloGeometry = new THREE.SphereGeometry(3.5, 32, 32);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: chain.color,
        transparent: true,
        opacity: 0,
        wireframe: true,
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.position.copy(pos);
      this.earthGroup.add(halo);

      this.chainMarkers.push({
        mesh: marker,
        halo: halo,
        data: chain,
        position: pos,
        pulseTime: 0
      });
    });
  }

  /**
   * Initialize liquidity pool visualization nodes
   */
  initLiquidityPools() {
    const pools = [
      { 
        name: 'Ethereum Liquidity Hub',
        lat: 47.3769, lon: 8.5417,
        tvl: 180, 
        color: 0x627eea,
        assets: ['ETH', 'USDC', 'USDT', 'DAI'],
        apr: 12.5
      },
      {
        name: 'Arbitrum Bridge Pool',
        lat: 40.7128, lon: -74.0060,
        tvl: 45,
        color: 0x28a0f0,
        assets: ['ETH', 'ARB', 'USDC'],
        apr: 18.3
      },
      {
        name: 'Polygon Treasury',
        lat: 23.6345, lon: 85.2993,
        tvl: 35,
        color: 0x8247e5,
        assets: ['MATIC', 'USDC', 'ETH'],
        apr: 14.8
      },
    ];

    pools.forEach(pool => {
      const pos = this.latLonToVector3(pool.lat, pool.lon, 105);
      this.liquidityPools.push({
        data: pool,
        position: pos,
        volume: pool.tvl,
        transactions: [],
      });
    });
  }

  /**
   * Add a bridge transaction to visualize
   */
  addBridgeTransaction(tx) {
    // tx = { from, to, amount, asset, timestamp, txHash }
    const fromChain = this.chainMarkers.find(c => c.data.symbol === tx.from);
    const toChain = this.chainMarkers.find(c => c.data.symbol === tx.to);

    if (!fromChain || !toChain) return;

    const transaction = {
      id: Math.random().toString(36),
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
      asset: tx.asset,
      fromPos: fromChain.position.clone(),
      toPos: toChain.position.clone(),
      startTime: Date.now(),
      status: 'pending', // pending, confirming, settled
      progress: 0,
      mesh: null,
      trail: [],
    };

    // Create transaction visual (particle)
    const txGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const txMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(fromChain.data.color),
      transparent: true,
      opacity: 0.9,
    });
    const txMesh = new THREE.Mesh(txGeometry, txMaterial);
    txMesh.position.copy(transaction.fromPos);
    this.scene.add(txMesh);
    transaction.mesh = txMesh;

    // Create curved path
    const mid = transaction.fromPos.clone()
      .add(transaction.toPos)
      .multiplyScalar(0.5);
    mid.normalize().multiplyScalar(140);

    transaction.curve = new THREE.QuadraticBezierCurve3(
      transaction.fromPos,
      mid,
      transaction.toPos
    );

    this.bridgeTransactions.push(transaction);
    return transaction;
  }

  /**
   * Simulate incoming transactions (for demo)
   */
  simulateTransactions(callback) {
    const txExamples = [
      { from: 'ETH', to: 'ARB', amount: 10.5, asset: 'ETH' },
      { from: 'POL', to: 'ETH', amount: 500, asset: 'USDC' },
      { from: 'AVAX', to: 'BASE', amount: 25, asset: 'AVAX' },
      { from: 'ARB', to: 'OP', amount: 100, asset: 'ETH' },
      { from: 'SOL', to: 'ETH', amount: 50, asset: 'SOL' },
    ];

    setInterval(() => {
      const tx = txExamples[Math.floor(Math.random() * txExamples.length)];
      const transaction = this.addBridgeTransaction(tx);
      if (callback) callback(transaction);
    }, 3000);
  }

  /**
   * Update all bridge visuals
   */
  update(time) {
    // Update chain markers with pulse
    this.chainMarkers.forEach(chain => {
      chain.pulseTime += 0.016;
      const pulse = 1 + Math.sin(chain.pulseTime * 3) * 0.2;
      chain.halo.scale.setScalar(pulse);
      chain.halo.material.opacity = 0.15 * Math.abs(Math.sin(chain.pulseTime * 2));
    });

    // Update bridge transactions
    this.bridgeTransactions.forEach((tx, idx) => {
      const duration = 5000; // 5 seconds to settle
      const elapsed = Date.now() - tx.startTime;
      tx.progress = Math.min(elapsed / duration, 1);

      if (tx.mesh) {
        // Move along curve
        const point = tx.curve.getPoint(tx.progress);
        tx.mesh.position.copy(point);

        // Color transition based on status
        if (tx.progress < 0.3) {
          tx.status = 'pending';
          tx.mesh.material.color.setHex(0xff9500); // orange
        } else if (tx.progress < 0.7) {
          tx.status = 'confirming';
          tx.mesh.material.color.setHex(0xf0b90b); // gold
        } else {
          tx.status = 'settled';
          tx.mesh.material.color.setHex(0x10b981); // green
        }

        // Pulsing scale
        const scale = 1 + Math.sin(time * 4) * 0.15;
        tx.mesh.scale.setScalar(scale);

        // Add trail
        tx.trail.push(point.clone());
        if (tx.trail.length > 30) tx.trail.shift();

        // Remove when settled
        if (tx.progress >= 1) {
          this.scene.remove(tx.mesh);
          this.bridgeTransactions.splice(idx, 1);
        }
      }
    });
  }

  /**
   * Get bridge stats for UI
   */
  getBridgeStats() {
    const totalValue = this.liquidityPools.reduce((sum, p) => sum + p.data.tvl, 0);
    const totalTransactions = this.bridgeTransactions.length;
    const settledCount = this.bridgeTransactions.filter(t => t.status === 'settled').length;

    return {
      totalTVL: `$${totalValue}B`,
      activeTransactions: totalTransactions,
      settledToday: settledCount,
      chains: this.chainMarkers.length,
    };
  }

  /**
   * Get chain details for UI
   */
  getChainDetails(symbol) {
    return this.chainMarkers.find(c => c.data.symbol === symbol)?.data;
  }

  /**
   * Get transaction route path
   */
  getTransactionPath(tx) {
    return {
      from: tx.from,
      to: tx.to,
      distance: tx.fromPos.distanceTo(tx.toPos),
      eta: 4 - Math.floor(tx.progress * 5),
    };
  }
}
