/**
 * Match Service — CRUD + filtering.
 * Falls back to AsyncStorage mock when USE_REAL_API is false.
 */

import { API_ENDPOINTS } from '@/config/api.endpoints';
import { API_CONFIG, STORAGE_KEYS } from '@/config/env';
import { apiClient } from '@/services/api/apiClient';
import type { Match } from '@/types';
import type { ApiMatch, CreateMatchRequest, UpdateMatchRequest } from '@/types/api.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

function normalizeStatus(status: string): Match['status'] {
  const normalized = status?.toLowerCase();
  if (normalized === 'scheduled') return 'upcoming';
  if (normalized === 'live' || normalized === 'upcoming' || normalized === 'completed') {
    return normalized;
  }
  return 'upcoming';
}

/** Map backend ApiMatch (id: number) → frontend Match (id: string) */
function toMatch(api: ApiMatch): Match {
  return {
    id: String(api.id),
    name: api.name,
    teams: api.teams,
    venue: api.venue,
    date: api.date,
    status: normalizeStatus(api.status),
  };
}

const DEFAULT_MATCHES: Match[] = [
  { id: '1', name: 'IPL 2024 - Match 1', teams: 'Mumbai Indians vs Chennai Super Kings', venue: 'Wankhede Stadium, Mumbai', date: 'Feb 10, 2026', status: 'live' },
  { id: '2', name: 'IPL 2024 - Match 2', teams: 'Royal Challengers vs Delhi Capitals', venue: 'M. Chinnaswamy Stadium, Bangalore', date: 'Feb 12, 2026', status: 'upcoming' },
  { id: '3', name: 'IPL 2024 - Qualifier', teams: 'Gujarat Titans vs Rajasthan Royals', venue: 'Narendra Modi Stadium, Ahmedabad', date: 'Feb 8, 2026', status: 'completed' },
];

class MatchService {
  /* ── Read ── */

  async getAll(): Promise<Match[]> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.get<ApiMatch[]>(API_ENDPOINTS.MATCHES.LIST);
      return res.data.map(toMatch);
    }
    const json = await AsyncStorage.getItem(STORAGE_KEYS.MATCHES);
    return json ? JSON.parse(json) : DEFAULT_MATCHES;
  }

  async getById(id: string): Promise<Match | null> {
    if (API_CONFIG.USE_REAL_API) {
      const res = await apiClient.get<ApiMatch>(API_ENDPOINTS.MATCHES.DETAILS(id));
      return toMatch(res.data);
    }
    const all = await this.getAll();
    return all.find(m => m.id === id) ?? null;
  }

  /* ── Create ── */

  async create(data: CreateMatchRequest): Promise<Match> {
    console.log('[MatchService][create] payload:', data);
    if (API_CONFIG.USE_REAL_API) {
      try {
        const res = await apiClient.post<ApiMatch>(API_ENDPOINTS.MATCHES.CREATE, data);
        console.log('[MatchService][create] api response:', res.data);
        return toMatch(res.data);
      } catch (error) {
        console.log('[MatchService][create] api error:', error);
        throw error;
      }
    }
    const newMatch: Match = { ...data, id: Date.now().toString(), status: data.status as Match['status'] || 'upcoming' };
    const all = await this.getAll();
    all.push(newMatch);
    await AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(all));
    console.log('[MatchService][create] local created:', newMatch);
    return newMatch;
  }

  /* ── Update ── */

  async update(id: string, data: UpdateMatchRequest): Promise<void> {
    console.log('[MatchService][update] payload:', { id, data });
    if (API_CONFIG.USE_REAL_API) {
      try {
        const res = await apiClient.put<ApiMatch>(API_ENDPOINTS.MATCHES.UPDATE(id), data);
        console.log('[MatchService][update] api response:', res.data);
        return;
      } catch (error) {
        console.log('[MatchService][update] api error:', error);
        throw error;
      }
    }
    const all = await this.getAll();
    const idx = all.findIndex(m => m.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data } as Match;
      await AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(all));
      console.log('[MatchService][update] local updated:', all[idx]);
    }
  }

  /* ── Delete ── */

  async remove(id: string): Promise<void> {
    console.log('[MatchService][delete] payload:', { id });
    if (API_CONFIG.USE_REAL_API) {
      try {
        await apiClient.delete(API_ENDPOINTS.MATCHES.DELETE(id));
        console.log('[MatchService][delete] api success:', { id });
        return;
      } catch (error) {
        console.log('[MatchService][delete] api error:', error);
        throw error;
      }
    }
    const all = await this.getAll();
    const filtered = all.filter(m => m.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(filtered));
    console.log('[MatchService][delete] local success:', { id });
  }
}

export const matchService = new MatchService();
export default matchService;
