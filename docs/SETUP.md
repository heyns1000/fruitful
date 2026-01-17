# Baobab Bush Portal - Setup & Deployment Guide

## Quick Start

Get the Baobab Bush Portal running in 5 minutes.

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/heyns1000/fruitful.git
cd fruitful

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run tests
npm test

# Start development server
npm run dev
```

Access the portal at **http://localhost:3000**

---

## Detailed Setup

### 1. System Requirements

#### Minimum Requirements
- **OS:** Windows 10, macOS 10.15, Ubuntu 20.04 or newer
- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher
- **RAM:** 2GB minimum, 4GB recommended
- **Disk Space:** 500MB

#### Recommended Requirements
- **OS:** Latest stable versions
- **Node.js:** 20.x LTS
- **npm:** 10.x
- **RAM:** 8GB
- **Disk Space:** 2GB

### 2. Install Node.js

#### macOS (using Homebrew)
```bash
brew install node@20
```

#### Ubuntu/Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Windows
Download from [nodejs.org](https://nodejs.org/) and run the installer.

#### Verify Installation
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

### 3. Clone Repository

```bash
git clone https://github.com/heyns1000/fruitful.git
cd fruitful
```

### 4. Install Dependencies

```bash
npm install
```

This installs:
- Express.js (web server)
- Security middleware (helmet, cors)
- Development tools (nodemon, jest)
- Testing utilities (supertest)

### 5. Environment Configuration

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Settings (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Future: Add database credentials, API keys, etc.
```

### 6. Verify Installation

Run the test suite:
```bash
npm test
```

Expected output:
```
PASS  tests/backend/api.test.js
PASS  tests/frontend/html-pages.test.js

Test Suites: 2 passed, 2 total
Tests:       130+ passed, 130+ total
```

### 7. Start Development Server

```bash
npm run dev
```

You should see:
```
🌳 Baobab Bush Portal running on port 3000
🌍 Environment: development
📡 Health check: http://localhost:3000/health
```

### 8. Access the Portal

Open your browser to:
- **Main Portal:** http://localhost:3000
- **Landing Page:** http://localhost:3000/landing_page
- **Baobab Portal:** http://localhost:3000/baobab
- **Dashboard:** http://localhost:3000/dashboard
- **Health Check:** http://localhost:3000/health

---

## Development Workflow

### Running in Development Mode

```bash
npm run dev
```

Features:
- Auto-restart on file changes (nodemon)
- Detailed error messages
- Request logging
- Stack traces in API errors

### Making Changes

1. Edit files in `backend/` or HTML files
2. Server auto-restarts (backend changes)
3. Refresh browser (frontend changes)
4. Run tests: `npm test`

### Testing

```bash
# All tests
npm test

# Backend only
npm run test:backend

# Frontend only
npm run test:frontend

# Watch mode (re-runs on changes)
npm run test:watch

# With coverage report
npm test -- --coverage
```

### Linting

```bash
npm run lint
```

Fix issues automatically:
```bash
npm run lint -- --fix
```

---

## Production Deployment

### Option 1: Direct Node.js

1. **Set production environment**
   ```bash
   export NODE_ENV=production
   export PORT=3000
   ```

2. **Start server**
   ```bash
   npm start
   ```

### Option 2: PM2 Process Manager (Recommended)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start application**
   ```bash
   pm2 start backend/server.js --name baobab-portal
   ```

3. **Configure auto-restart**
   ```bash
   pm2 startup
   pm2 save
   ```

4. **Monitor**
   ```bash
   pm2 status
   pm2 logs baobab-portal
   pm2 monit
   ```

5. **Management commands**
   ```bash
   pm2 restart baobab-portal
   pm2 stop baobab-portal
   pm2 delete baobab-portal
   ```

### Option 3: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   EXPOSE 3000
   
   ENV NODE_ENV=production
   
   CMD ["npm", "start"]
   ```

2. **Build image**
   ```bash
   docker build -t baobab-portal .
   ```

3. **Run container**
   ```bash
   docker run -d \
     --name baobab-portal \
     -p 3000:3000 \
     -e NODE_ENV=production \
     baobab-portal
   ```

4. **With docker-compose**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       restart: unless-stopped
   ```

   ```bash
   docker-compose up -d
   ```

### Option 4: Cloud Platforms

#### Heroku

1. **Create Heroku app**
   ```bash
   heroku create baobab-portal
   ```

2. **Deploy**
   ```bash
   git push heroku main
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   ```

#### AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   eb init -p node.js baobab-portal
   ```

3. **Create environment**
   ```bash
   eb create baobab-production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Select Node.js
3. Set build command: `npm install`
4. Set run command: `npm start`
5. Deploy

---

## Reverse Proxy Setup

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name portal.faa.zone;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name portal.faa.zone;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName portal.faa.zone
    Redirect permanent / https://portal.faa.zone/
</VirtualHost>

<VirtualHost *:443>
    ServerName portal.faa.zone

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # WebSocket support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*)           ws://localhost:3000/$1 [P,L]
</VirtualHost>
```

---

## SSL/TLS Setup

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d portal.faa.zone

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs baobab-portal

# View specific lines
pm2 logs baobab-portal --lines 100
```

### Log Files

Logs are written to:
- Development: Console output
- Production: PM2 logs or system logs

### Health Checks

Monitor server health:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-11T02:43:19.564Z",
  "uptime": 123.45,
  "service": "Baobab Bush Portal",
  "version": "2.0.0"
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Permission Errors

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Tests Failing

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests in verbose mode
npm test -- --verbose
```

---

## Performance Optimization

### Enable Compression

Already configured via `compression` middleware.

### Use Production Mode

```bash
NODE_ENV=production npm start
```

Benefits:
- Faster routing
- Caching enabled
- Reduced error details
- Optimized performance

### PM2 Cluster Mode

```bash
pm2 start backend/server.js -i max --name baobab-cluster
```

Utilizes all CPU cores.

---

## Security Checklist

- [x] Helmet.js configured
- [x] CORS configured
- [x] Input validation
- [x] Environment variables
- [ ] HTTPS enabled (production)
- [ ] Rate limiting (future)
- [ ] Authentication (future)
- [ ] Database encryption (future)

---

## Backup Strategy

### Code Backup
- Version controlled with Git
- GitHub repository backup

### Future: Database Backup
```bash
# PostgreSQL backup
pg_dump -U username dbname > backup.sql

# MongoDB backup
mongodump --db dbname --out backup/
```

---

## Update Procedure

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run tests
npm test

# Restart server
pm2 restart baobab-portal
```

---

## Support Resources

- **Documentation:** `/docs` directory
- **GitHub Issues:** https://github.com/heyns1000/fruitful/issues
- **API Reference:** `/docs/API.md`
- **Rebuild Documentation:** `/docs/REBUILD.md`

---

## Next Steps

1. Review the [API Documentation](API.md)
2. Read the [Rebuild Documentation](REBUILD.md)
3. Customize the portal for your needs
4. Set up monitoring and alerts
5. Configure backups
6. Deploy to production

---

**Last Updated:** January 11, 2026  
**Version:** 1.0.0
