# 🚀 Getting Started with the New React Frontend

## What Changed?

The Fruitful™ portal has been upgraded from static HTML to a modern React application while preserving 100% of the visual design.

## Quick Start

### Development

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

### Production Build

```bash
cd frontend
npm run build

# Output in frontend/dist/
```

## New Features

### 🔐 Authentication
- JWT-based authentication
- Protected routes (Dashboard, Admin)
- Role-based access control

### 📊 Real-time Data
- Live pulse updates (9s interval)
- Real-time share price tracking
- Seedwave brand growth metrics
- Ecosystem status monitoring

### 🎨 Modern UI
- All original designs preserved
- Smooth transitions and animations
- Responsive layout
- Dark mode support

### 🔗 Enhanced Navigation
- Client-side routing (no page reloads)
- 15+ navigation links on OmniGrid
- External ecosystem links
- Breadcrumb support

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components (11 pages)
│   ├── services/        # API integration
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript definitions
│   └── styles/          # Global styles
├── public/              # Static assets
└── dist/                # Production build (gitignored)
```

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
npm run type-check   # Check TypeScript types
```

## Environment Configuration

Create `frontend/.env`:

```env
VITE_API_URL=https://hotstack.faa.zone/api
VITE_WS_URL=wss://hotstack.faa.zone/ws
VITE_AUTH_DOMAIN=fruitful.faa.zone
```

## API Endpoints

The frontend connects to these backend endpoints:

### Existing
- `GET /api/share-price` - Real-time share price
- `GET /api/seedwave` - Seedwave data
- `GET /api/ecosystem` - Ecosystem status
- `GET /api/pulse` - Current pulse status

### New
- `GET /api/users` - List users
- `GET /api/sectors` - List sectors
- `GET /api/pulses` - Pulse history
- `POST /api/sectors/:id/subscribe` - Subscribe to sector

## Pages & Routes

| Route | Component | Description | Protected |
|-------|-----------|-------------|-----------|
| `/` | Home | Landing page | No |
| `/omnigrid` | OmniGrid | Navigation hub | No |
| `/dashboard` | Dashboard | Metrics dashboard | Yes |
| `/explore` | Explore | Sector exploration | No |
| `/vaultmesh` | VaultMesh | VaultMesh™ info | No |
| `/sectors` | Sectors | Sector portal | No |
| `/treaty` | Treaty | Treaty System™ | No |
| `/baobab` | BaobabTerminal | Security portal | No |
| `/admin` | SeedwaveAdmin | Admin portal | Yes (admin only) |
| `/checkout` | Checkout | Purchase flow | No |
| `/login` | Login | Authentication | No |

## Development Workflow

1. **Make changes** to components/pages in `frontend/src/`
2. **Test locally** with `npm run dev`
3. **Run tests** with `npm test`
4. **Lint code** with `npm run lint`
5. **Build** with `npm run build`
6. **Commit** changes to Git
7. **Push** to trigger CI/CD

## Deployment

### Automatic (Recommended)
Push to `main` branch triggers automatic deployment to Cloudflare Pages.

### Manual
```bash
cd frontend
npm ci
npm run build
npx wrangler pages deploy dist --project-name=fruitful-faa-zone
```

## Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Detailed development guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions
- **[frontend/README.md](./frontend/README.md)** - Frontend-specific docs
- **[MVP_IMPLEMENTATION_COMPLETE.md](./MVP_IMPLEMENTATION_COMPLETE.md)** - Implementation summary

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vitest** - Unit testing
- **Playwright** - E2E testing (ready)

## Performance

- **Build time**: 1.76s
- **Bundle size**: 273KB (83KB gzipped)
- **Page load**: <2s target
- **First paint**: <1.5s target

## Support

For issues or questions:
- Create an issue: https://github.com/heyns1000/fruitful/issues
- Check documentation in `DEVELOPMENT.md`
- Review API docs in backend/routes/api.js

## Migration Notes

### For Developers
- All HTML pages are now React components in `frontend/src/pages/`
- Static assets moved to `frontend/public/`
- CSS now uses Tailwind + custom classes
- Navigation uses React Router (no page reloads)

### For Users
- **Visual design**: Identical to before
- **Navigation**: Same links, smoother experience
- **New features**: Real-time data, authentication
- **Performance**: Faster page transitions

## Contributing

See main [README.md](./README.md) for contribution guidelines.

---

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **License**: MIT / Apache-2.0
