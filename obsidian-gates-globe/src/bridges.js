// ============================================
// BRIDGE REGISTRY — All Registered Bridges
// Hierarchical & Chronological Order
// ============================================

export const BRIDGE_REGISTRY = {
  // ========== TIER 1: MAJOR CROSS-CHAIN BRIDGES ==========
  // Established 2021-2022, highest liquidity
  
  'ethereum-polygon': {
    name: 'Polygon Bridge',
    category: 'major',
    launched: 2021,
    region: 'Europe',
    regionCoords: { lat: 48.8566, lon: 2.3522 }, // Paris
    from: 'Ethereum',
    to: 'Polygon',
    chains: ['ethereum', 'polygon'],
    fee: 0.05,
    speed: 'fast',
    liquidity: 2400,
    tvl: '$8.5B',
    operator: 'Polygon Foundation',
    type: 'validation',
  },

  'ethereum-arbitrum': {
    name: 'Arbitrum Bridge',
    category: 'major',
    launched: 2021,
    region: 'North America',
    regionCoords: { lat: 37.7749, lon: -122.4194 }, // San Francisco
    from: 'Ethereum',
    to: 'Arbitrum',
    chains: ['ethereum', 'arbitrum'],
    fee: 0.08,
    speed: 'medium',
    liquidity: 1800,
    tvl: '$5.2B',
    operator: 'Offchain Labs',
    type: 'validation',
  },

  'ethereum-optimism': {
    name: 'Optimism Bridge',
    category: 'major',
    launched: 2021,
    region: 'North America',
    regionCoords: { lat: 40.7128, lon: -74.0060 }, // New York
    from: 'Ethereum',
    to: 'Optimism',
    chains: ['ethereum', 'optimism'],
    fee: 0.07,
    speed: 'medium',
    liquidity: 1200,
    tvl: '$3.1B',
    operator: 'Optimism PBC',
    type: 'validation',
  },

  // ========== TIER 2: MULTI-CHAIN ROUTERS ==========
  // 2022-2023, cross-multiple chains
  
  'stargate': {
    name: 'Stargate (LayerZero)',
    category: 'omnichain',
    launched: 2022,
    region: 'Global',
    regionCoords: { lat: 0, lon: 0 },
    from: 'Multi',
    to: 'Multi',
    chains: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'fantom', 'base', 'linea', 'zksync'],
    fee: 0.15,
    speed: 'fast',
    liquidity: 900,
    tvl: '$850M',
    operator: 'StargateProtocol',
    type: 'message-passing',
  },

  'hyperlane': {
    name: 'Hyperlane',
    category: 'omnichain',
    launched: 2022,
    region: 'Global',
    regionCoords: { lat: 0, lon: 0 },
    from: 'Multi',
    to: 'Multi',
    chains: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'avalanche', 'celo', 'gnosis'],
    fee: 0.12,
    speed: 'fast',
    liquidity: 650,
    tvl: '$420M',
    operator: 'Hyperlane Foundation',
    type: 'message-passing',
  },

  'wormhole': {
    name: 'Wormhole (Portal)',
    category: 'omnichain',
    launched: 2021,
    region: 'Global',
    regionCoords: { lat: 0, lon: 0 },
    from: 'Multi',
    to: 'Multi',
    chains: ['ethereum', 'solana', 'polygon', 'avalanche', 'fantom', 'aptos', 'sui'],
    fee: 0.1,
    speed: 'medium',
    liquidity: 1100,
    tvl: '$1.2B',
    operator: 'Jump Crypto',
    type: 'validation',
  },

  // ========== TIER 3: BURN-BASED BRIDGES (YOUR NATIVE INFRASTRUCTURE) ==========
  // 2024-2026, Proof-of-Burn mechanism
  
  'airforce-one-pob': {
    name: 'AirForce One (Proof-of-Burn)',
    category: 'native',
    launched: 2025,
    region: 'Global',
    regionCoords: { lat: 43.6532, lon: -79.3832 }, // Toronto, HQ
    from: 'Multi',
    to: 'Multi',
    chains: ['ethereum', 'bitcoin', 'polygon', 'arbitrum', 'solana', 'avalanche'],
    fee: 0.02, // CHEAPEST - Only wrapper receipt fee
    speed: 'instant',
    liquidity: 500,
    tvl: '$2.4B',
    operator: 'chuckyLeeVIII - IAI Introverted',
    type: 'burn-wrapper',
    burnMechanic: {
      method: 'partial-burn',
      wrapperReceipt: true,
      satoshiOrdinal: true,
      immutableTracking: true,
      description: 'No full burn = cheaper. Wrapper receipt proves value locked. Satoshi Ordinals track forwarding value.',
    },
  },

  // ========== TIER 4: DEX-INTEGRATED BRIDGES ==========
  // 2023-2024, swap + bridge in one
  
  'uniswap-v3': {
    name: 'Uniswap V3 (Cross-Chain)',
    category: 'dex-bridge',
    launched: 2023,
    region: 'North America',
    regionCoords: { lat: 40.7128, lon: -74.0060 },
    from: 'Ethereum',
    to: 'Polygon/Arbitrum/Optimism',
    chains: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base'],
    fee: 0.25,
    speed: 'fast',
    liquidity: 2800,
    tvl: '$12.5B',
    operator: 'Uniswap Labs',
    type: 'liquidity-pool',
  },

  'curve-tricrypto': {
    name: 'Curve TriCrypto (Cross-Chain)',
    category: 'dex-bridge',
    launched: 2023,
    region: 'Switzerland',
    regionCoords: { lat: 47.1662, lon: 8.5155 },
    from: 'Ethereum',
    to: 'Polygon/Arbitrum',
    chains: ['ethereum', 'polygon', 'arbitrum', 'optimism'],
    fee: 0.08,
    speed: 'medium',
    liquidity: 1500,
    tvl: '$4.2B',
    operator: 'Curve Finance',
    type: 'liquidity-pool',
  },

  // ========== TIER 5: CEX BRIDGES ==========
  // 2024, Centralized exchange bridges
  
  'binance-bridge': {
    name: 'Binance Bridge',
    category: 'cex',
    launched: 2024,
    region: 'Malta',
    regionCoords: { lat: 35.8997, lon: 14.5148 },
    from: 'Multi',
    to: 'Multi',
    chains: ['ethereum', 'bsc', 'polygon', 'arbitrum', 'bitcoin'],
    fee: 0.1,
    speed: 'medium',
    liquidity: 3500,
    tvl: '$15.8B',
    operator: 'Binance',
    type: 'cex-native',
  },

  'coinbase-bridge': {
    name: 'Coinbase Bridge',
    category: 'cex',
    launched: 2024,
    region: 'San Francisco',
    regionCoords: { lat: 37.7749, lon: -122.4194 },
    from: 'Ethereum',
    to: 'Base/Polygon',
    chains: ['ethereum', 'base', 'polygon'],
    fee: 0.06,
    speed: 'fast',
    liquidity: 800,
    tvl: '$1.6B',
    operator: 'Coinbase',
    type: 'cex-native',
  },

  // ========== TIER 6: BITCOIN-SPECIFIC BRIDGES ==========
  // 2024-2026, BTC to/from other chains
  
  'stacks-bridge': {
    name: 'Stacks Bridge',
    category: 'bitcoin-native',
    launched: 2021,
    region: 'Canada',
    regionCoords: { lat: 43.6532, lon: -79.3832 },
    from: 'Bitcoin',
    to: 'Stacks',
    chains: ['bitcoin', 'stacks'],
    fee: 0.05,
    speed: 'slow',
    liquidity: 120,
    tvl: '$340M',
    operator: 'Stacks Foundation',
    type: 'bitcoin-native',
  },

  'btc-eth-wrapped': {
    name: 'wBTC (Wrapped Bitcoin)',
    category: 'bitcoin-wrapped',
    launched: 2019,
    region: 'Global',
    regionCoords: { lat: 0, lon: 0 },
    from: 'Bitcoin',
    to: 'Ethereum/Polygon/Arbitrum',
    chains: ['bitcoin', 'ethereum', 'polygon', 'arbitrum'],
    fee: 0.2,
    speed: 'fast',
    liquidity: 5200,
    tvl: '$18.9B',
    operator: 'Kyber Ventures',
    type: 'wrapped-token',
  },

  'airforce-btc-ordinals': {
    name: 'AirForce Bitcoin Ordinals',
    category: 'bitcoin-native',
    launched: 2025,
    region: 'Canada',
    regionCoords: { lat: 43.6532, lon: -79.3832 },
    from: 'Bitcoin',
    to: 'Multi',
    chains: ['bitcoin', 'ethereum', 'solana', 'polygon'],
    fee: 0.01, // ULTRA-CHEAP with Satoshi Ordinals
    speed: 'instant',
    liquidity: 250,
    tvl: '$1.8B',
    operator: 'chuckyLeeVIII - IAI Introverted',
    type: 'bitcoin-native',
    ordinalMechanic: {
      satoshiTracking: true,
      immutableForwarding: true,
      description: 'Each Satoshi tracked via Ordinals. Immutable forwarding value recorded on-chain forever.',
    },
  },
};

// ========== BRIDGE COMPARISON TABLE ==========
export const BRIDGE_TIERS = [
  {
    tier: 'Ultra-Premium (Native)',
    operators: ['AirForce One POB', 'AirForce Bitcoin Ordinals'],
    avgFee: 0.015,
    speed: 'instant',
    avgTVL: 2.1,
    advantage: 'Proof-of-Burn, Satoshi Ordinals, Immutable Tracking',
  },
  {
    tier: 'Premium (CEX)',
    operators: ['Binance Bridge', 'Coinbase Bridge'],
    avgFee: 0.08,
    speed: 'medium',
    avgTVL: 8.7,
    advantage: 'High liquidity, fast KYC',
  },
  {
    tier: 'Standard (Multi-Chain)',
    operators: ['Stargate', 'Hyperlane', 'Wormhole'],
    avgFee: 0.12,
    speed: 'fast-medium',
    avgTVL: 0.8,
    advantage: 'Cross-chain message passing, many chains',
  },
  {
    tier: 'Classic (Layer 2)',
    operators: ['Polygon', 'Arbitrum', 'Optimism'],
    avgFee: 0.067,
    speed: 'medium',
    avgTVL: 5.6,
    advantage: 'Established, battle-tested',
  },
  {
    tier: 'Specialized (Bitcoin)',
    operators: ['wBTC', 'Stacks'],
    avgFee: 0.125,
    speed: 'slow-medium',
    avgTVL: 9.6,
    advantage: 'Native Bitcoin integration',
  },
];

// ========== CHRONOLOGICAL LAUNCH ORDER ==========
export const BRIDGE_TIMELINE = [
  // 2019
  { year: 2019, bridges: ['btc-eth-wrapped'], label: 'wBTC Launches' },
  // 2021
  { year: 2021, bridges: ['ethereum-polygon', 'ethereum-arbitrum', 'wormhole', 'stacks-bridge'], label: 'Bridge Boom Begins' },
  // 2022
  { year: 2022, bridges: ['ethereum-optimism', 'stargate', 'hyperlane'], label: 'Multi-Chain Era' },
  // 2023
  { year: 2023, bridges: ['uniswap-v3', 'curve-tricrypto'], label: 'DEX Integration' },
  // 2024
  { year: 2024, bridges: ['binance-bridge', 'coinbase-bridge'], label: 'CEX Bridges Launch' },
  // 2025-2026
  { year: 2025, bridges: ['airforce-one-pob', 'airforce-btc-ordinals'], label: 'Proof-of-Burn Revolution' },
];

// ========== REGIONAL BRIDGE CLUSTERS ==========
export const REGIONAL_CLUSTERS = {
  'north-america': {
    name: 'North America',
    coords: { lat: 40.7128, lon: -74.0060 },
    bridges: ['ethereum-arbitrum', 'ethereum-optimism', 'uniswap-v3', 'coinbase-bridge', 'airforce-one-pob'],
    tvl: '$22.8B',
    volume24h: '$18.5B',
  },
  'europe': {
    name: 'Europe',
    coords: { lat: 48.8566, lon: 2.3522 },
    bridges: ['ethereum-polygon', 'curve-tricrypto', 'hyperlane'],
    tvl: '$13.2B',
    volume24h: '$9.2B',
  },
  'asia-pacific': {
    name: 'Asia Pacific',
    coords: { lat: 35.6762, lon: 139.6503 },
    bridges: ['binance-bridge', 'stargate', 'wormhole'],
    tvl: '$16.4B',
    volume24h: '$24.8B',
  },
  'defi-hub': {
    name: 'DeFi Hub (Zug/Switzerland)',
    coords: { lat: 47.1662, lon: 8.5155 },
    bridges: ['curve-tricrypto', 'hyperlane', 'stargate'],
    tvl: '$7.5B',
    volume24h: '$6.1B',
  },
  'bitcoin-native': {
    name: 'Bitcoin Native (Toronto)',
    coords: { lat: 43.6532, lon: -79.3832 },
    bridges: ['stacks-bridge', 'airforce-btc-ordinals', 'airforce-one-pob'],
    tvl: '$2.1B',
    volume24h: '$340M',
  },
};

// ========== CHEAPEST BRIDGE FINDER ==========
export function getCheapestBridge(fromChain, toChain) {
  const bridges = Object.entries(BRIDGE_REGISTRY).filter(
    ([_, b]) => b.chains.includes(fromChain) && b.chains.includes(toChain)
  );
  
  if (bridges.length === 0) return null;
  
  return bridges.reduce((cheapest, [key, bridge]) => {
    return bridge.fee < cheapest.fee ? { key, ...bridge } : cheapest;
  });
}

// ========== CHAIN REGISTRY ==========
export const CHAIN_REGISTRY = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', color: 0xf7931a, region: 'global' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', color: 0x627eea, region: 'europe' },
  polygon: { name: 'Polygon', symbol: 'MATIC', color: 0x8247e5, region: 'europe' },
  arbitrum: { name: 'Arbitrum', symbol: 'ARB', color: 0x28a0f0, region: 'north-america' },
  optimism: { name: 'Optimism', symbol: 'OP', color: 0xff0420, region: 'north-america' },
  solana: { name: 'Solana', symbol: 'SOL', color: 0x14f195, region: 'asia-pacific' },
  avalanche: { name: 'Avalanche', symbol: 'AVAX', color: 0xe84142, region: 'north-america' },
  fantom: { name: 'Fantom', symbol: 'FTM', color: 0x1969ff, region: 'asia-pacific' },
  base: { name: 'Base', symbol: 'BASE', color: 0x0052ff, region: 'north-america' },
  linea: { name: 'Linea', symbol: 'ETH', color: 0xf0db4f, region: 'europe' },
  zksync: { name: 'zkSync', symbol: 'ETH', color: 0x8c8dfc, region: 'europe' },
  stacks: { name: 'Stacks', symbol: 'STX', color: 0xf0ad4e, region: 'north-america' },
  bsc: { name: 'BSC', symbol: 'BNB', color: 0xf3ba2f, region: 'asia-pacific' },
  aptos: { name: 'Aptos', symbol: 'APT', color: 0x000000, region: 'global' },
  sui: { name: 'Sui', symbol: 'SUI', color: 0x6fbcf0, region: 'asia-pacific' },
  celo: { name: 'Celo', symbol: 'CELO', color: 0xfcff52, region: 'africa' },
  gnosis: { name: 'Gnosis', symbol: 'GNO', color: 0x04795b, region: 'europe' },
};

export default BRIDGE_REGISTRY;
