/**
 * FilterPanel Component
 * Lets users filter by Status, Species, and Gender.
 */

import { memo } from 'react';
import type { CharacterStatus, CharacterGender } from '../../types';

interface FilterPanelProps {
  status: CharacterStatus | '';
  species: string;
  gender: CharacterGender | '';
  onStatusChange: (value: CharacterStatus | '') => void;
  onSpeciesChange: (value: string) => void;
  onGenderChange: (value: CharacterGender | '') => void;
  onReset: () => void;
}

// Filter options
const STATUS_OPTIONS: (CharacterStatus | '')[] = ['', 'Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS: (CharacterGender | '')[] = ['', 'Female', 'Male', 'Genderless', 'unknown'];
const SPECIES_OPTIONS = [
  '',
  'Human',
  'Alien',
  'Humanoid',
  'Robot',
  'Animal',
  'Mythological Creature',
  'Cronenberg',
  'Poopybutthole',
  'unknown',
];

// Memoized so it doesn't re-render unless the filters actually change.
export const FilterPanel = memo(function FilterPanel({
  status,
  species,
  gender,
  onStatusChange,
  onSpeciesChange,
  onGenderChange,
  onReset,
}: FilterPanelProps) {
  const hasActiveFilters = status || species || gender;

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-[#97ce4c] transition-colors hover:text-[#b8e87c]"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Status Filter */}
        <FilterSelect
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => onStatusChange(v as CharacterStatus | '')}
          getOptionLabel={getStatusLabel}
        />

        {/* Species Filter */}
        <FilterSelect
          label="Species"
          value={species}
          options={SPECIES_OPTIONS}
          onChange={onSpeciesChange}
          getOptionLabel={getSpeciesLabel}
        />

        {/* Gender Filter */}
        <FilterSelect
          label="Gender"
          value={gender}
          options={GENDER_OPTIONS}
          onChange={(v) => onGenderChange(v as CharacterGender | '')}
          getOptionLabel={getGenderLabel}
        />
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {status && (
            <FilterTag
              label={`Status: ${status}`}
              onRemove={() => onStatusChange('')}
            />
          )}
          {species && (
            <FilterTag
              label={`Species: ${species}`}
              onRemove={() => onSpeciesChange('')}
            />
          )}
          {gender && (
            <FilterTag
              label={`Gender: ${gender}`}
              onRemove={() => onGenderChange('')}
            />
          )}
        </div>
      )}
    </div>
  );
});

// Helper components
interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  getOptionLabel: (option: string) => string;
}

const FilterSelect = memo(function FilterSelect({
  label,
  value,
  options,
  onChange,
  getOptionLabel,
}: FilterSelectProps) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white transition-colors focus:border-[#97ce4c] focus:outline-none focus:ring-2 focus:ring-[#97ce4c]/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
});

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = memo(function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#97ce4c]/20 px-3 py-1 text-sm text-[#97ce4c]">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 transition-colors hover:bg-[#97ce4c]/30"
        aria-label={`Remove ${label} filter`}
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
});

// Label formatters
function getStatusLabel(status: string): string {
  if (!status) return 'All Statuses';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getSpeciesLabel(species: string): string {
  if (!species) return 'All Species';
  return species;
}

function getGenderLabel(gender: string): string {
  if (!gender) return 'All Genders';
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}
