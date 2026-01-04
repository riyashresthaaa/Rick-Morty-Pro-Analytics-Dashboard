/**
 * Header Component
 * App header with navigation and favorites counter
 */

import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  favoritesCount: number;
}

export const Header = memo(function Header({ favoritesCount }: HeaderProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="relative">
            {/* Portal effect */}
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#97ce4c]/30 blur-md" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#97ce4c] to-[#00b0c8]">
              <span className="text-xl font-bold text-gray-900">R</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white">Rick & Morty</h1>
            <p className="text-xs text-gray-400">Pro Analytics Dashboard</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {!isHome && (
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </Link>
          )}

          {/* Favorites Counter */}
          <Link
            to="/?favorites=true"
            className="relative flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-400 transition-colors hover:border-red-500/50 hover:text-red-400"
          >
            <svg
              className="h-5 w-5"
              fill={favoritesCount > 0 ? 'currentColor' : 'none'}
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
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {favoritesCount > 99 ? '99+' : favoritesCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
});
