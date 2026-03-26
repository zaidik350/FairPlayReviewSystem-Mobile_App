/**
 * MatchContext — match list state, CRUD, filtering.
 * Delegates to matchService which handles mock vs real API.
 */

import { useAuth } from '@/context/AuthContext';
import { matchService } from '@/services/match/matchService';
import { Match } from '@/types';
import createContextHook from '@nkzw/create-context-hook';
import { useCallback, useEffect, useState } from 'react';

export const [MatchProvider, useMatchContext] = createContextHook(() => {
  const [matches, setMatches] = useState<Match[]>([]);
  const { isLoggedIn, isLoading } = useAuth();

  /* Load matches only for authenticated user */
  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      setMatches([]);
      return;
    }

    (async () => {
      try {
        const data = await matchService.getAll();
        setMatches(data);
      } catch (e) {
        console.log('Error loading matches:', e);
      }
    })();
  }, [isLoggedIn, isLoading]);

  const refreshMatches = useCallback(async () => {
    const data = await matchService.getAll();
    setMatches(data);
  }, []);

  const addMatch = useCallback(async (match: Omit<Match, 'id'>) => {
    try {
      console.log('[MatchContext][addMatch] input:', match);
      const created = await matchService.create(match);
      setMatches(prev => [...prev, created]);
      console.log('[MatchContext][addMatch] created:', created);
      return created;
    } catch (error) {
      console.log('[MatchContext][addMatch] error:', error);
      throw error;
    }
  }, []);

  const updateMatch = useCallback(async (id: string, updates: Partial<Match>) => {
    try {
      console.log('[MatchContext][updateMatch] input:', { id, updates });
      await matchService.update(id, updates);
      setMatches(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
      console.log('[MatchContext][updateMatch] success:', { id, updates });
    } catch (error) {
      console.log('[MatchContext][updateMatch] error:', error);
      throw error;
    }
  }, []);

  const deleteMatch = useCallback(async (id: string) => {
    try {
      console.log('[MatchContext][deleteMatch] input:', { id });
      await matchService.remove(id);
      setMatches(prev => prev.filter(m => m.id !== id));
      console.log('[MatchContext][deleteMatch] success:', { id });
    } catch (error) {
      console.log('[MatchContext][deleteMatch] error:', error);
      throw error;
    }
  }, []);

  const syncPitchConfig = useCallback(async (matchId: string) => {
    const cfg = await matchService.getWicketConfig(matchId);
    const current = matches.find(m => m.id === matchId) ?? null;
    const synced: Match | null = current ? { ...current, pitchConfigured: cfg.configured } : null;
    if (synced) {
      setMatches(prev => prev.map(m => (m.id === matchId ? synced : m)));
    }
    return synced;
  }, [matches]);

  const configurePitch = useCallback(async (matchId: string, mediaUri: string) => {
    try {
      const cfg = await matchService.configurePitch(matchId, mediaUri);
      let updatedMatch: Match | null = null;
      setMatches(prev => prev.map(m => {
        if (m.id !== matchId) return m;
        updatedMatch = {
          ...m,
          pitchConfigured: cfg.configured,
          pitchImageUri: mediaUri,
        };
        return updatedMatch;
      }));

      if (updatedMatch) return updatedMatch;
      throw new Error('Match not found in local state');
    } catch (error) {
      console.log('[MatchContext][configurePitch] error:', error);
      throw error;
    }
  }, []);

  const getMatchById = useCallback((id: string) => matches.find(m => m.id === id), [matches]);
  const getLiveMatches = useCallback(() => matches.filter(m => m.status === 'live'), [matches]);
  const getUpcomingMatches = useCallback(() => matches.filter(m => m.status === 'upcoming'), [matches]);
  const getCompletedMatches = useCallback(() => matches.filter(m => m.status === 'completed'), [matches]);

  return { matches, addMatch, updateMatch, deleteMatch, configurePitch, syncPitchConfig, refreshMatches, getMatchById, getLiveMatches, getUpcomingMatches, getCompletedMatches };
});
