/**
 * Lightweight fetch-based HTTP client.
 *
 * Automatically attaches Bearer tokens, handles JSON, and provides
 * typed convenience methods (get / post / put / patch / delete / upload).
 *
 * The backend returns { status: "success"|"error", data: T, message: string }.
 * This client normalises errors and always resolves with ApiResponse<T>.
 */

import { API_CONFIG, STORAGE_KEYS } from "@/config/env";
import type { ApiResponse } from "@/types/api.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

class ApiClient {
  private timeout = API_CONFIG.TIMEOUT;

  private get baseURLs(): string[] {
    const primary =
      Platform.OS === "web" ? API_CONFIG.WEB_URL : API_CONFIG.BASE_URL;
    const candidates: string[] = [primary];

    if (API_CONFIG.LAN_URL) {
      candidates.push(API_CONFIG.LAN_URL);
    }

    if (API_CONFIG.LOCAL_URL) {
      candidates.push(API_CONFIG.LOCAL_URL);
    }

    if (Platform.OS === "android") {
      candidates.push("http://10.0.2.2:8000/api");
    }

    // Keep localhost fallback for web/iOS simulator/dev setups.
    candidates.push("http://localhost:8000/api");

    return Array.from(new Set(candidates.filter(Boolean)));
  }

  private async parseApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
    const raw = await res.text();
    const contentType = res.headers.get("content-type") || "";

    if (!raw) {
      return {
        status: res.ok ? "success" : "error",
        data: null as T,
        message: res.ok ? "OK" : `HTTP ${res.status}`,
      };
    }

    const looksLikeJson =
      contentType.includes("application/json") ||
      raw.trim().startsWith("{") ||
      raw.trim().startsWith("[");
    if (looksLikeJson) {
      try {
        return JSON.parse(raw) as ApiResponse<T>;
      } catch {
        // Fall through to a readable error payload when JSON is malformed.
      }
    }

    return {
      status: "error",
      data: null as T,
      message: `Non-JSON response (${contentType || "unknown content-type"}): ${raw.slice(0, 180)}`,
    };
  }

  private shouldRetryOnFallback(error: unknown): boolean {
    if (!error || typeof error !== "object") return false;
    const message = (error as { message?: string }).message || "";
    return (
      message.includes("ERR_NGROK_3004") ||
      message.includes("ngrok gateway error") ||
      message.includes("Non-JSON response") ||
      message.includes("fetch") ||
      message.includes("Network request failed") ||
      message.includes("Request timed out")
    );
  }

  /** Resolve base URL — web uses localhost, native uses 10.0.2.2 (Android) */
  private get baseURL(): string {
    if (Platform.OS === "web") return API_CONFIG.WEB_URL;
    return API_CONFIG.BASE_URL;
  }

  /* ── Token helpers ── */

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  async setToken(token: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  async clearTokens() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  }

  /* ── Internal request ── */

  private async request<T>(
    endpoint: string,
    opts: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      // Required for ngrok free domains to bypass browser warning interstitial.
      "ngrok-skip-browser-warning": "true",
      ...(opts.headers as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let lastError: any = null;

    for (const baseURL of this.baseURLs) {
      const url = `${baseURL}${endpoint}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);

      try {
        console.log("[ApiClient][request] try", { endpoint, baseURL });
        const res = await fetch(url, {
          ...opts,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (res.status === 401) {
          await this.clearTokens();
        }

        const json = await this.parseApiResponse<T>(res);
        if (!res.ok)
          throw {
            status: "error",
            data: null,
            message: json?.message || `HTTP ${res.status}`,
            baseURL,
          };
        if (json.status === "error") {
          throw {
            status: "error",
            data: null,
            message: json?.message || "API returned error payload",
            baseURL,
          };
        }
        console.log("[ApiClient][request] success", { endpoint, baseURL });
        return json as ApiResponse<T>;
      } catch (err: any) {
        clearTimeout(timer);
        lastError = err;

        if (err?.name === "AbortError") {
          lastError = {
            status: "error",
            data: null,
            message: "Request timed out",
            baseURL,
          };
        }

        console.log("[ApiClient][request] failed", {
          endpoint,
          baseURL,
          message: lastError?.message,
        });

        if (
          baseURL !== this.baseURLs[this.baseURLs.length - 1] &&
          this.shouldRetryOnFallback(lastError)
        ) {
          continue;
        }
        throw lastError;
      }
    }

    throw lastError;
  }

  /* ── Public methods ── */

  get<T>(endpoint: string, params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<T>(`${endpoint}${qs}`, { method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
  ): Promise<ApiResponse<T>> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let lastError: any = null;

    for (const baseURL of this.baseURLs) {
      const url = `${baseURL}${endpoint}`;
      try {
        console.log("[ApiClient][upload] try", { endpoint, baseURL });
        const res = await fetch(url, {
          method: "POST",
          headers,
          body: formData,
        });
        const json = await this.parseApiResponse<T>(res);
        if (!res.ok)
          throw {
            status: "error",
            data: null,
            message: json?.message || `HTTP ${res.status}`,
            baseURL,
          };
        if (json.status === "error")
          throw {
            status: "error",
            data: null,
            message: json?.message || "Upload failed",
            baseURL,
          };
        console.log("[ApiClient][upload] success", { endpoint, baseURL });
        return json as ApiResponse<T>;
      } catch (err: any) {
        lastError = err;
        console.log("[ApiClient][upload] failed", {
          endpoint,
          baseURL,
          message: lastError?.message,
        });
        if (
          baseURL !== this.baseURLs[this.baseURLs.length - 1] &&
          this.shouldRetryOnFallback(lastError)
        ) {
          continue;
        }
        throw lastError;
      }
    }

    throw lastError;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
