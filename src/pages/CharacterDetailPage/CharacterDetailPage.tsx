/**
 * CharacterDetailPage Component
 * Shows full details, location info, and episodes for a character.
 */

import { memo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCharacterDetail, useFavorites } from '../../hooks';
import { CharacterDetailSkeleton, ErrorState } from '../../components';
import type { Episode } from '../../types';

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const characterId = id ? parseInt(id, 10) : 0;

  // Load character data directly from the API.
  const { data, status, error, refetch } = useCharacterDetail(characterId);

  // Allow adding/removing from favorites here too.
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Show a loading skeleton while fetching.
  if (status === 'loading') {
    return (
      <div className="min-h-screen px-4 py-8">
        <CharacterDetailSkeleton />
      </div>
    );
  }

  // Error state
  if (status === 'error' || !data) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <ErrorState
            title="Character not found"
            message={error ?? 'Unable to load character details'}
            onRetry={refetch}
          />
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-[#97ce4c] transition-colors hover:text-[#b8e87c]"
            >
              ← Back to characters
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { character, episodes, originLocation, currentLocation } = data;
  const isFav = isFavorite(character.id);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Character Card */}
        <article className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="md:flex">
            {/* Character Image */}
            <div className="relative md:w-1/3">
              <img
                src={character.image}
                alt={character.name}
                className="h-80 w-full object-cover md:h-full"
              />
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(character.id)}
                className={`absolute right-4 top-4 rounded-full p-3 transition-all duration-200 ${isFav
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-900/70 text-gray-400 hover:bg-red-500 hover:text-white'
                  }`}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className="h-6 w-6"
                  fill={isFav ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Character Info */}
            <div className="flex-1 p-6">
              {/* Name */}
              <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                {character.name}
              </h1>

              {/* Status Badges */}
              <div className="mb-6 flex flex-wrap gap-2">
                <StatusBadge status={character.status} />
                <Badge label={character.species} color="blue" />
                <Badge label={character.gender} color="purple" />
                {character.type && <Badge label={character.type} color="gray" />}
              </div>

              {/* Info Sections */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoSection
                  icon="🌍"
                  label="Origin"
                  value={character.origin.name}
                  subValue={originLocation?.type}
                />
                <InfoSection
                  icon="📍"
                  label="Last Known Location"
                  value={character.location.name}
                  subValue={currentLocation?.type}
                />
                {originLocation?.dimension && (
                  <InfoSection
                    icon="🌌"
                    label="Origin Dimension"
                    value={originLocation.dimension}
                  />
                )}
                {currentLocation?.dimension && (
                  <InfoSection
                    icon="✨"
                    label="Current Dimension"
                    value={currentLocation.dimension}
                  />
                )}
              </div>

              {/* Created Date */}
              <p className="mt-4 text-sm text-gray-500">
                Created: {new Date(character.created).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Episodes Section */}
          <div className="border-t border-gray-700 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <span>📺</span>
              Episode Appearances ({episodes.length})
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

// Helper Components (memoized for performance)
const StatusBadge = memo(function StatusBadge({
  status,
}: {
  status: string;
}) {
  const colors = {
    Alive: 'bg-green-500/20 text-green-400 border-green-500/30',
    Dead: 'bg-red-500/20 text-red-400 border-red-500/30',
    unknown: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const dotColors = {
    Alive: 'bg-green-400',
    Dead: 'bg-red-400',
    unknown: 'bg-gray-400',
  };

  const colorClass = colors[status as keyof typeof colors] ?? colors.unknown;
  const dotColor = dotColors[status as keyof typeof dotColors] ?? dotColors.unknown;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${colorClass}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
});

const Badge = memo(function Badge({
  label,
  color,
}: {
  label: string;
  color: 'blue' | 'purple' | 'gray';
}) {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${colors[color]}`}
    >
      {label}
    </span>
  );
});

const InfoSection = memo(function InfoSection({
  icon,
  label,
  value,
  subValue,
}: {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-sm text-gray-500">
        <span>{icon}</span>
        {label}
      </p>
      <p className="font-medium text-white">{value}</p>
      {subValue && <p className="text-sm text-gray-400">{subValue}</p>}
    </div>
  );
});

const EpisodeCard = memo(function EpisodeCard({
  episode,
}: {
  episode: Episode;
}) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-700/50 p-3 transition-colors hover:border-[#97ce4c]/50">
      <div className="flex items-center gap-2">
        <span className="shrink-0 rounded bg-[#97ce4c]/20 px-2 py-0.5 text-xs font-bold text-[#97ce4c]">
          {episode.episode}
        </span>
        <span className="truncate text-sm text-gray-400">{episode.air_date}</span>
      </div>
      <p className="mt-1 truncate font-medium text-white" title={episode.name}>
        {episode.name}
      </p>
    </div>
  );
});
