/**
 * API Endpoints — single source of truth for all backend routes.
 * Must match the FastAPI router prefixes in API/main_api.py
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    CHANGE_PASSWORD: '/auth/change-password',
    PROFILE: '/auth/profile',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    AVATAR: '/profile/avatar',
  },
  MATCHES: {
    LIST: '/matches',
    CREATE: '/matches',
    DETAILS: (id: string | number) => `/matches/${id}`,
    UPDATE: (id: string | number) => `/matches/${id}`,
    DELETE: (id: string | number) => `/matches/${id}`,
    WICKET_CONFIG: (id: string | number) => `/matches/${id}/wicket-config`,
    WICKET_CONFIG_AUTO: (id: string | number) => `/matches/${id}/wicket-config/auto`,
    UPDATE_WICKET_CONFIG: (id: string | number) => `/matches/${id}/wicket-config`,
  },
  REVIEWS: {
    LIST: '/reviews',
    CREATE: '/reviews',
    DETAILS: (id: string | number) => `/reviews/${id}`,
    BY_MATCH: (matchId: string | number) => `/reviews/match/${matchId}`,
  },
  DETECTION: {
    ANALYZE_VIDEO: '/analyze-video',
    DETECT_BALL: '/detect/ball',
    DETECT_BATSMAN: '/detect/batsman',
    DETECT_WICKET: '/detect/wicket',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/read',
    SETTINGS: '/notifications/settings',
  },
  HEALTH: '/health',
} as const;
