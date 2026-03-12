/**
 * MatchContext — match list state, CRUD, filtering.
 */

import { Match } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@cricket_drs_matches';

const DEFAULT_MATCHES: Match[] = [
  { id: '1', name: 'IPL 2024 - Match 1', teams: 'Mumbai Indians vs Chennai Super Kings', venue: 'Wankhede Stadium, Mumbai', date: 'Feb 10, 2026', status: 'live' },
  { id: '2', name: 'IPL 2024 - Match 2', teams: 'Royal Challengers vs Delhi Capitals', venue: 'M. Chinnaswamy Stadium, Bangalore', date: 'Feb 12, 2026', status: 'upcoming' },
  { id: '3', name: 'IPL 2024 - Qualifier', teams: 'Gujarat Titans vs Rajasthan Royals', venue: 'Narendra Modi Stadium, Ahmedabad', date: 'Feb 8, 2026', status: 'completed' },
];

export const [MatchProvider, useMatchContext] = createContextHook(() => {
  const [matches, setMatches] = useState<Match[]>(DEFAULT_MATCHES);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setMatches(JSON.parse(json));
      } catch (e) {
        console.log('Error loading matches:', e);
      }
    })();
  }, []);

  const addMatch = useCallback(async (match: Omit<Match, 'id'>) => {
    const newMatch: Match = { ...match, id: Date.now().toString() };
    const updated = [...matches, newMatch];
    setMatches(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newMatch;
  }, [matches]);

  const updateMatch = useCallback(async (id: string, updates: Partial<Match>) => {
    const updated = matches.map(m => (m.id === id ? { ...m, ...updates } : m));
    setMatches(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [matches]);

  const getMatchById = useCallback((id: string) => matches.find(m => m.id === id), [matches]);
  const getLiveMatches = useCallback(() => matches.filter(m => m.status === 'live'), [matches]);
  const getUpcomingMatches = useCallback(() => matches.filter(m => m.status === 'upcoming'), [matches]);
  const getCompletedMatches = useCallback(() => matches.filter(m => m.status === 'completed'), [matches]);

  return { matches, addMatch, updateMatch, getMatchById, getLiveMatches, getUpcomingMatches, getCompletedMatches };
});
