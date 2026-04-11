import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "fps_device_id";

function createFallbackId() {
  return `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function getOrCreateDeviceId() {
  const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const nextId = globalThis.crypto?.randomUUID?.() ?? createFallbackId();
  await AsyncStorage.setItem(DEVICE_ID_KEY, nextId);
  return nextId;
}
