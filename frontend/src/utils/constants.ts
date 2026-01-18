export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hotstack.faa.zone/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'wss://hotstack.faa.zone/ws';
export const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN || 'fruitful.faa.zone';
export const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY || '';

export const ROUTES = {
  HOME: '/',
  OMNIGRID: '/omnigrid',
  DASHBOARD: '/dashboard',
  EXPLORE: '/explore',
  VAULTMESH: '/vaultmesh',
  SECTORS: '/sectors',
  TREATY: '/treaty',
  BAOBAB: '/baobab',
  ADMIN: '/admin',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
} as const;

export const PULSE_INTERVAL = 9000; // 9 seconds in milliseconds

export const APP_NAME = 'Fruitful™';
export const APP_TAGLINE = 'Innovate. Connect. Thrive.';
