import { API_CONFIG } from "@/config/env";

/** Resolve stored review media path to a playable/displayable URI (same rules as review detail). */
export function resolveVideoUri(rawUri?: string): string {
  if (!rawUri) return "";
  if (/^(https?:|file:|content:|ph:)/i.test(rawUri)) return rawUri;

  const apiHost = API_CONFIG.BASE_URL.replace(/\/api\/?$/, "");
  const normalizedPath = rawUri.startsWith("/") ? rawUri : `/${rawUri}`;
  return `${apiHost}${normalizedPath}`;
}

export function isProbablyImageUri(uri: string): boolean {
  if (!uri) return false;
  const path = uri.split("?")[0] ?? uri;
  return /\.(jpe?g|png|gif|webp)$/i.test(path);
}
