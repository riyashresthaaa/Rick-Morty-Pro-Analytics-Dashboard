import { useState, useEffect, useCallback } from 'react';
import type { Character, CharacterFilters, ApiInfo, AsyncStatus } from '../types';
import { getCharacters, ApiError } from '../services/api';

interface UseCharactersReturn {
  characters: Character[];
  status: AsyncStatus;
  error: string | null;
  pageInfo: ApiInfo | null;
  refetch: () => void;
}

export function useCharacters(
  filters: Partial<CharacterFilters>,
  page: number
): UseCharactersReturn {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<ApiInfo | null>(null);

  const fetchCharacters = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await getCharacters(filters, page);
      setCharacters(response.results);
      setPageInfo(response.info);
      setStatus('success');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 404) {
          setCharacters([]);
          setPageInfo(null);
          setError('No characters found matching your criteria');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
      setStatus('error');
    }
  }, [filters, page]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return {
    characters,
    status,
    error,
    pageInfo,
    refetch: fetchCharacters,
  };
}
