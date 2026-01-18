# 🛠️ Development Guide

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/heyns1000/fruitful.git
cd fruitful
```

2. **Install dependencies**

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../
npm install
```

3. **Configure environment**

Create `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

Edit values as needed.

4. **Start development servers**

```bash
# Terminal 1: Backend server
npm run dev

# Terminal 2: Frontend dev server
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend will be available at `http://localhost:3000`

## Project Structure

```
fruitful/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── layout/    # Layout components (Header, Footer)
│   │   │   └── ui/        # UI components (Button, Card, Badge)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   └── __tests__/         # Tests
├── backend/               # Express backend
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
└── .github/
    └── workflows/        # CI/CD workflows
```

## Available Scripts

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run test coverage
npm run test:coverage

# Lint code
npm run lint

# Type check
npm run type-check
```

### Backend

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Run tests
npm test

# Run backend tests only
npm run test:backend

# Lint code
npm run lint
```

## Component Architecture

### Creating a New Component

1. **Create component file**

```typescript
// frontend/src/components/ui/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  title: string;
  children?: React.ReactNode;
}

const NewComponent: React.FC<NewComponentProps> = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default NewComponent;
```

2. **Create test file**

```typescript
// frontend/src/__tests__/components/NewComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewComponent from '@/components/ui/NewComponent';

describe('NewComponent', () => {
  it('renders with title', () => {
    render(<NewComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

3. **Use the component**

```typescript
import NewComponent from '@/components/ui/NewComponent';

<NewComponent title="Hello">
  <p>Content here</p>
</NewComponent>
```

## API Integration

### Adding a New API Endpoint

1. **Backend: Add route**

```javascript
// backend/routes/api.js
router.get('/new-endpoint', (req, res) => {
  try {
    const data = { message: 'Hello' };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

2. **Frontend: Add service method**

```typescript
// frontend/src/services/api.ts
async getNewData(): Promise<ApiResponse<NewData>> {
  const response = await this.client.get('/new-endpoint');
  return response.data;
}
```

3. **Frontend: Use in component**

```typescript
import { api } from '@/services/api';

const MyComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.getNewData();
      if (response.success) {
        console.log(response.data);
      }
    };
    fetchData();
  }, []);
};
```

## Custom Hooks

### Creating a Custom Hook

```typescript
// frontend/src/hooks/useCustomHook.ts
import { useState, useEffect } from 'react';

export const useCustomHook = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    setLoading(false);
  }, []);

  return { data, loading };
};
```

## Styling Guidelines

### Using Tailwind CSS

```tsx
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold gradient-text">Title</h2>
</div>
```

### Custom CSS Classes

Available in `globals.css`:
- `.glass` - Frosted glass effect
- `.gradient-purple` - Purple gradient background
- `.gradient-text` - Gradient text
- `.pulse` - Pulse animation
- `.card-hover` - Card hover effect
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style

## Testing Strategies

### Unit Tests

Test individual components and functions:

```typescript
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test component interactions:

```typescript
describe('Login Flow', () => {
  it('logs in user', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.click(screen.getByText('Sign In'));
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
```

## Code Quality

### ESLint

Configuration in `frontend/.eslintrc.cjs`

```bash
npm run lint
```

### TypeScript

Configuration in `frontend/tsconfig.json`

```bash
npm run type-check
```

## Performance Optimization

### Code Splitting

Automatic via Vite configuration in `vite.config.ts`:
- Vendor chunk (React, React Router)
- API chunk (Axios)

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

## Debugging

### Frontend

Use React Developer Tools and browser DevTools

### Backend

```bash
DEBUG=* npm run dev
```

### VS Code Launch Configuration

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "program": "${workspaceFolder}/backend/server.js"
    }
  ]
}
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Commit: `git commit -m 'Add my feature'`
6. Push: `git push origin feature/my-feature`
7. Create Pull Request

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Regenerate types
npm run type-check
```

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
- [React Router](https://reactrouter.com)
