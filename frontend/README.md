# Fruitful™ Frontend

Modern React application built with Vite, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Zustand** - State management
- **React Query** - Data fetching
- **Vitest** - Testing

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout
│   ├── ui/              # Button, Card, Badge
│   └── features/        # Feature-specific components
├── pages/               # Page components
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── OmniGrid.tsx
│   └── ...
├── services/
│   ├── api.ts           # API client
│   └── auth.ts          # Authentication
├── hooks/
│   ├── useAuth.ts
│   ├── usePulse.ts
│   └── useSectors.ts
├── types/               # TypeScript types
├── utils/               # Utilities
├── styles/              # Global styles
└── __tests__/           # Tests
```

## 🔗 Available Routes

- `/` - Home page
- `/omnigrid` - OmniGrid navigation hub
- `/dashboard` - Dashboard (protected)
- `/explore` - Explore sectors
- `/vaultmesh` - VaultMesh™
- `/sectors` - Sectors portal
- `/treaty` - Treaty System™
- `/baobab` - Baobab Terminal
- `/admin` - Admin portal (protected)
- `/checkout` - Checkout
- `/login` - Login

## 🧪 Testing

```bash
# Run tests
npm test

# Run with UI
npm run test:ui

# Coverage
npm run test:coverage
```

## 🎨 Styling

Uses Tailwind CSS with custom utility classes:

- `.glass` - Frosted glass effect
- `.gradient-purple` - Purple gradient
- `.gradient-text` - Gradient text
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card-hover` - Card hover effect
- `.pulse` - Pulse animation

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
VITE_API_URL=https://hotstack.faa.zone/api
VITE_WS_URL=wss://hotstack.faa.zone/ws
VITE_AUTH_DOMAIN=fruitful.faa.zone
```

### Vite Config

See `vite.config.ts` for:
- Path aliases
- Build optimization
- Dev server proxy

### Tailwind Config

See `tailwind.config.js` for theme customization.

## 📚 Documentation

- [Development Guide](../DEVELOPMENT.md)
- [Deployment Guide](../DEPLOYMENT.md)

## 🤝 Contributing

See main repository README for contribution guidelines.

## 📄 License

MIT License - See main repository for details.
