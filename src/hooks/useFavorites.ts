import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

const FAVORITES_KEY = 'rick-morty-favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorage<number[]>(
    FAVORITES_KEY,
    []
  );

  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback(
    (id: number): boolean => favoritesSet.has(id),
    [favoritesSet]
  );

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

  const addFavorite = useCallback(
    (id: number) => {
      setFavoriteIds((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    },
    [setFavoriteIds]
  );

  const removeFavorite = useCallback(
    (id: number) => {
      setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
    },
    [setFavoriteIds]
  );

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
