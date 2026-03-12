/**
 * Lightweight fetch-based HTTP client.
 *
 * Automatically attaches Bearer tokens, handles JSON, and provides
 * typed convenience methods (get / post / put / patch / delete / upload).
 *
 * The backend returns { status: "success"|"error", data: T, message: string }.
 * This client normalises errors and always resolves with ApiResponse<T>.
 */

import { API_CONFIG, STORAGE_KEYS } from '@/config/env';
import type { ApiResponse } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class ApiClient {
  private timeout = API_CONFIG.TIMEOUT;

  /** Resolve base URL — web uses localhost, native uses 10.0.2.2 (Android) */
  private get baseURL(): string {
    if (Platform.OS === 'web') return API_CONFIG.WEB_URL;
    return API_CONFIG.BASE_URL;
  }

  /* ── Token helpers ── */

  async getToken(): Promise<string | null> {
    try { return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN); }
    catch { return null; }
  }

  async setToken(token: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  async clearTokens() {
    await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
  }

  /* ── Internal request ── */

  private async request<T>(endpoint: string, opts: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(opts.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url, { ...opts, headers, signal: controller.signal });
      clearTimeout(timer);

      if (res.status === 401) {
        await this.clearTokens();
      }

      const json = await res.json().catch(() => ({ status: 'error', data: null, message: 'Invalid JSON response' }));
      if (!res.ok) throw { status: 'error', data: null, message: json?.message || json?.detail || `HTTP ${res.status}` };
      return json as ApiResponse<T>;
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw { status: 'error', data: null, message: 'Request timed out' };
      }
      throw err;
    }
  }

  /* ── Public methods ── */

  get<T>(endpoint: string, params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(`${endpoint}${qs}`, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = await this.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { method: 'POST', headers, body: formData });
    const json = await res.json();
    if (!res.ok) throw { status: 'error', data: null, message: json?.message || json?.detail || `HTTP ${res.status}` };
    return json as ApiResponse<T>;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
