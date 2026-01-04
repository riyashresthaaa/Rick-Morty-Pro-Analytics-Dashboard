/**
 * useURLSearchParams Hook
 * Syncs filter state with URL search parameters
 * Enables shareable URLs and browser back/forward navigation
 */

import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { CharacterFilters, CharacterStatus, CharacterGender } from '../types';

interface URLState extends CharacterFilters {
  page: number;
}

const DEFAULT_STATE: URLState = {
  name: '',
  status: '',
  species: '',
  gender: '',
  page: 1,
};

export function useURLSearchParamsState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params into typed state
  // useMemo prevents unnecessary recalculations
  const state = useMemo<URLState>(() => {
    const name = searchParams.get('name') ?? DEFAULT_STATE.name;
    const status = (searchParams.get('status') ?? DEFAULT_STATE.status) as CharacterStatus | '';
    const species = searchParams.get('species') ?? DEFAULT_STATE.species;
    const gender = (searchParams.get('gender') ?? DEFAULT_STATE.gender) as CharacterGender | '';
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : DEFAULT_STATE.page;

    return { name, status, species, gender, page };
  }, [searchParams]);

  // Update a single parameter while preserving others
  const updateParam = useCallback(
    <K extends keyof URLState>(key: K, value: URLState[K]) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        // If setting a filter (not page), reset page to 1
        if (key !== 'page') {
          newParams.set('page', '1');
        }

        // Remove param if empty/default, otherwise set it
        if (value === '' || value === DEFAULT_STATE[key]) {
          newParams.delete(String(key));
        } else {
          newParams.set(String(key), String(value));
        }

        return newParams;
      });
    },
    [setSearchParams]
  );

  // Update multiple parameters at once
  const updateParams = useCallback(
    (updates: Partial<URLState>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        // If any filter changed (not just page), reset page to 1
        const hasFilterChange = Object.keys(updates).some((key) => key !== 'page');
        if (hasFilterChange && !('page' in updates)) {
          newParams.set('page', '1');
        }

        Object.entries(updates).forEach(([key, value]) => {
          const typedKey = key as keyof URLState;
          if (value === '' || value === DEFAULT_STATE[typedKey]) {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
        });

        return newParams;
      });
    },
    [setSearchParams]
  );

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    ...state,
    filters: {
      name: state.name,
      status: state.status,
      species: state.species,
      gender: state.gender,
    },
    updateParam,
    updateParams,
    resetFilters,
  };
}
