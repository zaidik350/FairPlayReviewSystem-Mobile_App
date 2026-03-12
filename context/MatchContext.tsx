/**
 * MatchContext — match list state, CRUD, filtering.
 * Delegates to matchService which handles mock vs real API.
 */

import { matchService } from '@/services/match/matchService';
import { Match } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useState } from 'react';

export const [MatchProvider, useMatchContext] = createContextHook(() => {
  const [matches, setMatches] = useState<Match[]>([]);

  /* Load matches on mount */
  useEffect(() => {
    (async () => {
      try {
        const data = await matchService.getAll();
        setMatches(data);
      } catch (e) {
        console.log('Error loading matches:', e);
      }
    })();
  }, []);

  const refreshMatches = useCallback(async () => {
    const data = await matchService.getAll();
    setMatches(data);
  }, []);

  const addMatch = useCallback(async (match: Omit<Match, 'id'>) => {
    const created = await matchService.create(match);
    setMatches(prev => [...prev, created]);
    return created;
  }, []);

  const updateMatch = useCallback(async (id: string, updates: Partial<Match>) => {
    await matchService.update(id, updates);
    setMatches(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteMatch = useCallback(async (id: string) => {
    await matchService.remove(id);
    setMatches(prev => prev.filter(m => m.id !== id));
  }, []);

  const getMatchById = useCallback((id: string) => matches.find(m => m.id === id), [matches]);
  const getLiveMatches = useCallback(() => matches.filter(m => m.status === 'live'), [matches]);
  const getUpcomingMatches = useCallback(() => matches.filter(m => m.status === 'upcoming'), [matches]);
  const getCompletedMatches = useCallback(() => matches.filter(m => m.status === 'completed'), [matches]);

  return { matches, addMatch, updateMatch, deleteMatch, refreshMatches, getMatchById, getLiveMatches, getUpcomingMatches, getCompletedMatches };
});
