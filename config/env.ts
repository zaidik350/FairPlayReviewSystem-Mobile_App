/**
 * Environment & App Configuration
 * 
 * Toggle USE_REAL_API to switch between mock data and your real backend.
 * Update BASE_URL to point to your deployed backend server.
 */

const isDevelopment = __DEV__;

export const API_CONFIG = {
  BASE_URL: isDevelopment
    ? 'http://10.0.2.2:8000/api'   // Android emulator → host machine
    : 'https://api.fairplayreview.com/api',
  /** Use http://localhost:8000/api for web, http://10.0.2.2:8000/api for Android emulator */
  WEB_URL: 'http://localhost:8000/api',
  TIMEOUT: 30000,
  /** Set to true to use the real FastAPI backend */
  USE_REAL_API: false,
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
