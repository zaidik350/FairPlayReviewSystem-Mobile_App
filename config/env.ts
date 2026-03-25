/**
 * Environment & App Configuration
 *
 * Toggle USE_REAL_API to switch between mock data and your real backend.
 * In development, set EXPO_PUBLIC_API_BASE_URL to override the default API URL.
 */

const isDevelopment = __DEV__;
const DEV_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://narcissistically-inventoriable-wynell.ngrok-free.dev/api';

export const API_CONFIG = {
  BASE_URL: isDevelopment
    ? DEV_API_BASE_URL
    : 'https://api.fairplayreview.com/api',
  WEB_URL: DEV_API_BASE_URL,
  TIMEOUT: 30000,
  /** Set to true to use the real FastAPI backend */
  USE_REAL_API: true,
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@fairplay_access_token',
  REFRESH_TOKEN: '@fairplay_refresh_token',
  USER: '@cricket_drs_user',
  MATCHES: '@cricket_drs_matches',
  REVIEWS: '@cricket_drs_reviews',
  IS_LOGGED_IN: '@cricket_drs_logged_in',
  NOTIFICATIONS: '@cricket_drs_notifications',
} as const;
