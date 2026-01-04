/**
 * CharacterCard Component
 * Displays character information in a card format
 * Includes favorite toggle functionality
 */

import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

// Using React.memo with custom comparison for optimal performance
// Only re-renders when character data or favorite status changes
export const CharacterCard = memo(
  function CharacterCard({
    character,
    isFavorite,
    onToggleFavorite,
  }: CharacterCardProps) {
    const statusColor = getStatusColor(character.status);

    return (
      <article className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-[#97ce4c]/50 hover:shadow-lg hover:shadow-[#97ce4c]/10">
        {/* Favorite Button - Positioned absolutely */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(character.id);
          }}
          className={`absolute right-2 top-2 z-10 rounded-full p-2 transition-all duration-200 ${isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-900/70 text-gray-400 hover:bg-red-500 hover:text-white'
            }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className="h-5 w-5"
            fill={isFavorite ? 'currentColor' : 'none'}
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

        <Link to={`/character/${character.id}`} className="block">
          {/* Character Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={character.image}
              alt={character.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Status Badge */}
            <div className="absolute bottom-2 left-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
              >
                <span className={`h-2 w-2 rounded-full ${statusColor.dot}`} />
                {character.status}
              </span>
            </div>
          </div>

          {/* Character Info */}
          <div className="p-4">
            <h3 className="mb-1 truncate text-lg font-bold text-white transition-colors group-hover:text-[#97ce4c]">
              {character.name}
            </h3>
            <p className="mb-2 text-sm text-gray-400">
              {character.species}
              {character.type && ` • ${character.type}`}
            </p>

            {/* Location Info */}
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-start gap-1">
                <span className="shrink-0 text-gray-600">Origin:</span>
                <span className="truncate text-gray-400">{character.origin.name}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="shrink-0 text-gray-600">Location:</span>
                <span className="truncate text-gray-400">{character.location.name}</span>
              </div>
            </div>

            {/* Episode Count */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {character.episode.length} episode{character.episode.length !== 1 ? 's' : ''}
              </span>
              <span className="text-[#97ce4c] opacity-0 transition-opacity group-hover:opacity-100">
                View Details →
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  },
  // Custom comparison function for React.memo
  (prevProps, nextProps) => {
    return (
      prevProps.character.id === nextProps.character.id &&
      prevProps.isFavorite === nextProps.isFavorite
    );
  }
);

// Status color mapping
function getStatusColor(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case 'Alive':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        dot: 'bg-green-400',
      };
    case 'Dead':
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        dot: 'bg-red-400',
      };
    default:
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        dot: 'bg-gray-400',
      };
  }
}
