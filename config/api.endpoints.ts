/**
 * API Endpoints — single source of truth for all backend routes.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    UPDATE_AVATAR: '/user/avatar',
    NOTIFICATIONS: '/user/notifications',
  },
  MATCHES: {
    LIST: '/matches',
    CREATE: '/matches',
    DETAILS: (id: string) => `/matches/${id}`,
    UPDATE: (id: string) => `/matches/${id}`,
    DELETE: (id: string) => `/matches/${id}`,
  },
  REVIEWS: {
    LIST: '/reviews',
    CREATE: '/reviews',
    DETAILS: (id: string) => `/reviews/${id}`,
    BY_MATCH: (matchId: string) => `/reviews/match/${matchId}`,
    ANALYZE: '/reviews/analyze',
    UPLOAD_VIDEO: '/reviews/upload-video',
  },
  ANALYTICS: {
    USER_STATS: '/analytics/user',
  },
} as const;
