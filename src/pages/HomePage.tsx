// HomePage Component
import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterGridSkeleton } from '../components/Skeleton';
import { ErrorState, EmptyState } from '../components/ErrorState';
import { Pagination } from '../components/Pagination';
import { useURLSearchParamsState } from '../hooks/useURLSearchParams';
import { useCharacters } from '../hooks/useCharacters';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';
import { getCharactersByIds } from '../services/api';
import { useEffect, useState } from 'react';
import type { Character } from '../types';

export function HomePage() {
  const [searchParams] = useSearchParams();
  const showFavorites = searchParams.get('favorites') === 'true';

  // Manage filters and page number via URL
  const {
    name,
    status,
    species,
    gender,
    page,
    updateParam,
    resetFilters,
  } = useURLSearchParamsState();

  // Manage favorites
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  // Debounce search input
  const debouncedName = useDebounce(name, 300);

  // Filter params
  const filters = useMemo(
    () => ({
      name: debouncedName,
      status,
      species,
      gender,
    }),
    [debouncedName, status, species, gender]
  );

  // Fetch characters
  const { characters, status: fetchStatus, error, pageInfo, refetch } = useCharacters(
    showFavorites ? {} : filters,
    showFavorites ? 1 : page
  );

  // Favorites state
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Fetch favorite characters
  useEffect(() => {
    if (showFavorites && favoriteIds.length > 0) {
      setFavoritesLoading(true);
      getCharactersByIds(favoriteIds)
        .then(setFavoriteCharacters)
        .catch(() => setFavoriteCharacters([]))
        .finally(() => setFavoritesLoading(false));
    } else if (showFavorites) {
      setFavoriteCharacters([]);
    }
  }, [showFavorites, favoriteIds]);

  // Determine display list
  const displayCharacters = showFavorites ? favoriteCharacters : characters;
  const isLoading = showFavorites ? favoritesLoading : fetchStatus === 'loading';

  // URL updates
  const handleNameChange = useCallback(
    (value: string) => updateParam('name', value),
    [updateParam]
  );

  const handleStatusChange = useCallback(
    (value: typeof status) => updateParam('status', value),
    [updateParam]
  );

  const handleSpeciesChange = useCallback(
    (value: string) => updateParam('species', value),
    [updateParam]
  );

  const handleGenderChange = useCallback(
    (value: typeof gender) => updateParam('gender', value),
    [updateParam]
  );

  const handlePageChange = useCallback(
    (newPage: number) => updateParam('page', newPage),
    [updateParam]
  );

  // Total count
  const totalCharacters = pageInfo?.count ?? displayCharacters.length;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {showFavorites ? '❤️ Favorite Characters' : 'Character Explorer'}
          </h1>
          <p className="text-gray-600">
            {showFavorites
              ? `You have ${favoriteIds.length} favorite character${favoriteIds.length !== 1 ? 's' : ''}`
              : `Discover the characters.`}
          </p>
        </div>

        {/* Search and Filters */}
        {!showFavorites && (
          <div className="mb-8 space-y-4">
            <div className="flex justify-center">
              <SearchBar
                value={name}
                onChange={handleNameChange}
                placeholder="Search characters by name..."
              />
            </div>

            <FilterPanel
              status={status}
              species={species}
              gender={gender}
              onStatusChange={handleStatusChange}
              onSpeciesChange={handleSpeciesChange}
              onGenderChange={handleGenderChange}
              onReset={resetFilters}
            />
          </div>
        )}

        {/* Results Count */}
        {!isLoading && displayCharacters.length > 0 && (
          <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {displayCharacters.length}
              {!showFavorites && pageInfo && ` of ${pageInfo.count.toLocaleString()}`} characters
            </span>
            {!showFavorites && pageInfo && pageInfo.pages > 1 && (
              <span>
                Page {page} of {pageInfo.pages}
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <CharacterGridSkeleton count={8} />}

        {/* Error State */}
        {!isLoading && fetchStatus === 'error' && error && !showFavorites && (
          <ErrorState
            message={error}
            onRetry={refetch}
          />
        )}

        {/* Empty State */}
        {!isLoading && displayCharacters.length === 0 && fetchStatus !== 'error' && (
          <EmptyState
            title={showFavorites ? 'No favorites yet' : 'No characters found'}
            message={
              showFavorites
                ? 'Start exploring and add characters to your favorites!'
                : 'Try adjusting your search or filters'
            }
            actionLabel={showFavorites ? 'Browse Characters' : 'Clear Filters'}
            onAction={showFavorites ? () => window.location.href = '/' : resetFilters}
          />
        )}

        {/* Character Grid */}
        {!isLoading && displayCharacters.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isFavorite={isFavorite(character.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Pagination - Only show when not in favorites view */}
        {!isLoading && !showFavorites && pageInfo && pageInfo.pages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={pageInfo.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
