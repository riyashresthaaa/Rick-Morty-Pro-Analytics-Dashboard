// API Response Types
export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiResponse<T> {
  info: ApiInfo;
  results: T[];
}

export interface ApiError {
  error: string;
}

// Character Types
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

// Episode Types
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

// Location Types
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

// Filter Types
export interface CharacterFilters {
  name: string;
  status: CharacterStatus | '';
  species: string;
  gender: CharacterGender | '';
}

// App State Types
export interface FavoritesState {
  characterIds: number[];
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Component Props Types
export interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface FilterPanelProps {
  filters: Omit<CharacterFilters, 'name'>;
  onFilterChange: <K extends keyof Omit<CharacterFilters, 'name'>>(
    key: K,
    value: Omit<CharacterFilters, 'name'>[K]
  ) => void;
  availableSpecies: string[];
}

// Async State Types
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}

// URL Search Params Type
export interface URLSearchParamsState {
  name: string;
  status: CharacterStatus | '';
  species: string;
  gender: CharacterGender | '';
  page: number;
}
