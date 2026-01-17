# Perplexity API Setup Guide

This guide explains how to configure your Perplexity API key for the Sector Terminals feature.

## Quick Setup

### Step 1: Create `.env` file

In the `frontend/` directory, create a new file named `.env` (without the `.example` suffix):

```bash
cd frontend
cp .env.example .env
```

### Step 2: Add your Perplexity API key

Open the newly created `frontend/.env` file and replace `your_perplexity_api_key_here` with your actual API key:

```env
VITE_API_URL=https://hotstack.faa.zone/api
VITE_WS_URL=wss://hotstack.faa.zone/ws
VITE_AUTH_DOMAIN=fruitful.faa.zone
VITE_PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Restart the development server

If you're running the dev server, restart it to load the new environment variables:

```bash
npm run dev
```

## Getting a Perplexity API Key

1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up or log in to your account
3. Navigate to API settings or developer portal
4. Generate a new API key
5. Copy the key and paste it into your `frontend/.env` file

## Important Notes

- ✅ The `.env` file is already in `.gitignore` and will NOT be committed to Git
- ✅ Never commit your API keys to version control
- ✅ For production deployment on Cloudflare Pages, add the environment variable in the Cloudflare dashboard:
  - Go to your Cloudflare Pages project settings
  - Navigate to "Environment variables"
  - Add `VITE_PERPLEXITY_API_KEY` with your production API key

## File Structure

```
frontend/
├── .env.example          # Template file (committed to Git)
├── .env                  # Your actual config (NOT committed to Git)
└── PERPLEXITY_SETUP.md  # This guide
```

## Verification

After setting up your API key, the Sector Terminals on the `/omnigrid` page should load properly with Perplexity AI integration instead of showing 404 errors.

## Troubleshooting

**Issue**: Terminals still show 404 or errors
- **Solution**: Make sure you created `.env` (not `.env.local` or `.env.development`)
- **Solution**: Verify the file is in the `frontend/` directory
- **Solution**: Restart the dev server after creating the file

**Issue**: Environment variable not loading
- **Solution**: Vite only loads variables prefixed with `VITE_`
- **Solution**: Check that the variable name is exactly `VITE_PERPLEXITY_API_KEY`

## Production Deployment

For Cloudflare Pages deployment:

1. Go to Cloudflare Dashboard
2. Select your Pages project: `fruitful-faa-zone`
3. Settings → Environment Variables
4. Add new variable:
   - **Name**: `VITE_PERPLEXITY_API_KEY`
   - **Value**: `your_production_api_key`
   - **Environment**: Production (or both Production and Preview)
5. Redeploy to apply changes
