# 🚀 Deployment Guide

## Cloudflare Pages Deployment

This guide covers deploying the Fruitful™ frontend to Cloudflare Pages.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **API Token**: Create a token with Pages permissions
3. **Domain**: Configure `fruitful.faa.zone` in Cloudflare DNS

## Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
VITE_API_URL=https://hotstack.faa.zone/api
VITE_WS_URL=wss://hotstack.faa.zone/ws
VITE_AUTH_DOMAIN=fruitful.faa.zone
```

## GitHub Secrets

Add these secrets to your GitHub repository:

- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## Manual Deployment

### 1. Build the Project

```bash
cd frontend
npm ci
npm run build
```

### 2. Deploy with Wrangler

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy frontend/dist --project-name=fruitful-faa-zone
```

## Automatic Deployment (GitHub Actions)

Deployments happen automatically when pushing to `main` branch.

### Workflow: `.github/workflows-new/deploy.yml`

The workflow:
1. Checks out code
2. Installs dependencies
3. Builds the frontend
4. Deploys to Cloudflare Pages

## Custom Domain Configuration

### 1. Add Custom Domain in Cloudflare Pages

1. Go to Cloudflare Pages dashboard
2. Select your project
3. Navigate to "Custom domains"
4. Add `fruitful.faa.zone`

### 2. DNS Configuration

Add a CNAME record in Cloudflare DNS:

```
Type: CNAME
Name: fruitful
Content: fruitful-faa-zone.pages.dev
Proxy: Enabled (orange cloud)
```

## Environment-Specific Deployments

### Production

Deployed from `main` branch to `fruitful.faa.zone`

### Staging

Preview deployments are created for pull requests automatically at:
`https://<branch-name>.fruitful-faa-zone.pages.dev`

## Rollback Procedures

### Via Cloudflare Dashboard

1. Go to Cloudflare Pages
2. Select your project
3. Navigate to "Deployments"
4. Click "..." on a previous deployment
5. Select "Rollback to this deployment"

### Via Wrangler

```bash
# List deployments
wrangler pages deployment list --project-name=fruitful-faa-zone

# Rollback to a specific deployment
wrangler pages deployment rollback <deployment-id> --project-name=fruitful-faa-zone
```

## Monitoring

Monitor your deployment at:
- Cloudflare Pages Dashboard: https://dash.cloudflare.com/pages
- GitHub Actions: https://github.com/heyns1000/fruitful/actions

## Performance Optimization

### Build Optimization

The build is configured for optimal performance:
- Code splitting (vendor, api chunks)
- Tree shaking
- Minification
- Source maps for debugging

### Cloudflare Features

Enable these in Cloudflare Dashboard:
- Auto Minify (HTML, CSS, JS)
- Brotli compression
- HTTP/3
- 0-RTT Connection Resumption

## Troubleshooting

### Build Fails

Check:
1. All dependencies are in `package.json`
2. Environment variables are set
3. No TypeScript errors (`npm run type-check`)

### Deployment Fails

Verify:
1. Cloudflare API token has correct permissions
2. Account ID is correct
3. Project name matches in wrangler.toml

### Site Not Loading

Check:
1. Custom domain is configured correctly
2. DNS records are propagated (use `dig fruitful.faa.zone`)
3. SSL certificate is active

## Cost Estimates

### Cloudflare Pages (Free Tier)

- 500 builds per month: FREE
- Unlimited requests: FREE
- Unlimited bandwidth: FREE

### Estimated Monthly Cost: **$0**

Perfect for MVP and production use!

## Support

For deployment issues:
- Cloudflare Docs: https://developers.cloudflare.com/pages
- GitHub Issues: https://github.com/heyns1000/fruitful/issues
