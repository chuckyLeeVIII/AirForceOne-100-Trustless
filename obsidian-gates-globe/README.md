# Obsidian Gates — The World's Cryptoconomy

A real-time 3D topographical globe visualization of the global cryptocurrency economy, built with Three.js and Vite.

## Features

- **3D Topographical Globe** — Procedurally generated Earth with elevation data, wireframe overlay, and atmospheric glow
- **Live Market Markers** — 20+ major CEX, DEX, DeFi, and NFT platforms positioned at their real-world headquarters
- **Animated Trading Bots** — Autonomous bots flying between markets in real-time with visible flight trails
- **Blockchain Timeline** — Chronological timeline from Bitcoin genesis (2008) to present, filterable by era
- **Arbitrage Detection** — Live arbitrage opportunities displayed with spread percentages
- **Fibonacci Overlay** — Real-time Fibonacci retracement levels with golden spiral visualization
- **Search & Zoom** — Search any market, city, country, or blockchain event to fly the camera there
- **Dark Artificially Advanced Aesthetic** — Purple/cyan/amber accent colors with bloom post-processing

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

- **Vite** — Build tool and dev server
- **Three.js** — 3D rendering engine
- **Custom Shaders** — Atmospheric glow, procedural textures
- **Post-Processing** — Bloom, FXAA for cinematic quality
- **No UI Libraries** — Hand-written CSS with Inter font

## Data Sources (Free APIs)

- World Bank Open Data API — Trade & economic indicators
- UN Comtrade API — International trade statistics
- CoinGecko/CoinMarketCap (free tiers) — Market data
- Overpass API — OpenStreetMap geospatial data
- Country State City API — Geographic coordinates

## License

Built by IAI Introverted Technologies — The inward folding algorithm.
