/**
 * useCharacterDetail Hook
 * Fetches detailed character data including episodes
 */

import { useState, useEffect, useCallback } from 'react';
import type { Character, Episode, Location, AsyncStatus } from '../types';
import {
  getCharacterById,
  getEpisodesByIds,
  getLocationById,
  extractEpisodeIds,
  extractLocationId,
} from '../services/api';

interface CharacterDetail {
  character: Character;
  episodes: Episode[];
  originLocation: Location | null;
  currentLocation: Location | null;
}

interface UseCharacterDetailReturn {
  data: CharacterDetail | null;
  status: AsyncStatus;
  error: string | null;
  refetch: () => void;
}

export function useCharacterDetail(characterId: number): UseCharacterDetailReturn {
  const [data, setData] = useState<CharacterDetail | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchCharacterDetail = useCallback(async () => {
    if (!characterId || characterId <= 0) {
      setError('Invalid character ID');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      // Fetch character first
      const character = await getCharacterById(characterId);

      // Fetch episodes in parallel
      const episodeIds = extractEpisodeIds(character.episode);
      const episodesPromise = getEpisodesByIds(episodeIds);

      // Fetch locations in parallel (if they exist)
      const originId = extractLocationId(character.origin.url);
      const locationId = extractLocationId(character.location.url);

      const originPromise = originId ? getLocationById(originId) : Promise.resolve(null);
      const locationPromise = locationId ? getLocationById(locationId) : Promise.resolve(null);

      // Wait for all parallel requests
      const [episodes, originLocation, currentLocation] = await Promise.all([
        episodesPromise,
        originPromise,
        locationPromise,
      ]);

      setData({
        character,
        episodes,
        originLocation,
        currentLocation,
      });
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch character details';
      setError(message);
      setStatus('error');
    }
  }, [characterId]);

  useEffect(() => {
    fetchCharacterDetail();
  }, [fetchCharacterDetail]);

  return {
    data,
    status,
    error,
    refetch: fetchCharacterDetail,
  };
}
