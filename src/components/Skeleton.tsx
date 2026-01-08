import { memo } from 'react';

export const CharacterCardSkeleton = memo(function CharacterCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="skeleton aspect-square w-full bg-gray-200" />

      <div className="p-4">
        <div className="skeleton mb-2 h-6 w-3/4 rounded bg-gray-200" />
        <div className="skeleton mb-3 h-4 w-1/2 rounded bg-gray-200" />
        <div className="skeleton mb-2 h-3 w-full rounded bg-gray-200" />
        <div className="skeleton mb-3 h-3 w-4/5 rounded bg-gray-200" />
        <div className="skeleton h-3 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
});

interface CharacterGridSkeletonProps {
  count?: number;
}

export const CharacterGridSkeleton = memo(function CharacterGridSkeleton({
  count = 8,
}: CharacterGridSkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </div>
  );
});

export const CharacterDetailSkeleton = memo(function CharacterDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="md:flex">
          <div className="skeleton h-80 w-full bg-gray-200 md:h-auto md:w-1/3" />

          <div className="flex-1 p-6">
            <div className="skeleton mb-4 h-10 w-3/4 rounded bg-gray-200" />

            <div className="mb-6 flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full bg-gray-200" />
              <div className="skeleton h-6 w-16 rounded-full bg-gray-200" />
              <div className="skeleton h-6 w-24 rounded-full bg-gray-200" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i}>
                  <div className="skeleton mb-2 h-4 w-20 rounded bg-gray-200" />
                  <div className="skeleton h-5 w-48 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="skeleton mb-4 h-6 w-32 rounded bg-gray-200" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton h-12 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export const SearchBarSkeleton = memo(function SearchBarSkeleton() {
  return (
    <div className="skeleton h-12 w-full max-w-md rounded-lg bg-gray-200" />
  );
});

export const FilterPanelSkeleton = memo(function FilterPanelSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="skeleton mb-4 h-6 w-20 rounded bg-gray-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i}>
            <div className="skeleton mb-2 h-4 w-16 rounded bg-gray-200" />
            <div className="skeleton h-10 w-full rounded-lg bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
});
