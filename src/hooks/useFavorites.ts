/**
 * useFavorites Hook
 * Manages favorite characters with localStorage persistence
 */

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const FAVORITES_KEY = 'rick-morty-favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<number[]>(
    FAVORITES_KEY,
    []
  );

  // Check if a character is favorited
  // useMemo creates a Set for O(1) lookup performance
  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback(
    (id: number): boolean => favoritesSet.has(id),
    [favoritesSet]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (id: number) => {
      setFavoriteIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((favId) => favId !== id);
        }
        return [...prev, id];
      });
    },
    [setFavoriteIds]
  );

  // Add to favorites
  const addFavorite = useCallback(
    (id: number) => {
      setFavoriteIds((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    },
    [setFavoriteIds]
  );

  // Remove from favorites
  const removeFavorite = useCallback(
    (id: number) => {
      setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
    },
    [setFavoriteIds]
  );

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
  }, [setFavoriteIds]);

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
  };
}
