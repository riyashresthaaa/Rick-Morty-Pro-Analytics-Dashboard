/**
 * API Service for Rick & Morty API
 * Handles all HTTP requests with proper typing and error handling
 */

import type {
  ApiResponse,
  Character,
  CharacterFilters,
  Episode,
  Location,
} from '../types';

const BASE_URL = 'https://rickandmortyapi.com/api';

// ============================================
// Custom Error Class for API Errors
// ============================================

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

// ============================================
// Generic Fetch Handler
// ============================================

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError('No results found', 404);
    }
    throw new ApiError(
      `API request failed: ${response.statusText}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

// ============================================
// Character API Functions
// ============================================

/**
 * Fetch characters with optional filters and pagination
 */
export async function getCharacters(
  filters: Partial<CharacterFilters> = {},
  page = 1
): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams();

  // Add pagination
  params.append('page', String(page));

  // Add filters (only non-empty values)
  if (filters.name) params.append('name', filters.name);
  if (filters.status) params.append('status', filters.status);
  if (filters.species) params.append('species', filters.species);
  if (filters.gender) params.append('gender', filters.gender);

  const url = `${BASE_URL}/character?${params.toString()}`;
  return fetchWithErrorHandling<ApiResponse<Character>>(url);
}

/**
 * Fetch a single character by ID
 */
export async function getCharacterById(id: number): Promise<Character> {
  const url = `${BASE_URL}/character/${id}`;
  return fetchWithErrorHandling<Character>(url);
}

/**
 * Fetch multiple characters by their IDs
 */
export async function getCharactersByIds(ids: number[]): Promise<Character[]> {
  if (ids.length === 0) return [];
  if (ids.length === 1) {
    const character = await getCharacterById(ids[0]);
    return [character];
  }
  const url = `${BASE_URL}/character/${ids.join(',')}`;
  return fetchWithErrorHandling<Character[]>(url);
}

// ============================================
// Episode API Functions
// ============================================

/**
 * Fetch a single episode by ID
 */
export async function getEpisodeById(id: number): Promise<Episode> {
  const url = `${BASE_URL}/episode/${id}`;
  return fetchWithErrorHandling<Episode>(url);
}

/**
 * Fetch multiple episodes by their IDs
 */
export async function getEpisodesByIds(ids: number[]): Promise<Episode[]> {
  if (ids.length === 0) return [];
  if (ids.length === 1) {
    const episode = await getEpisodeById(ids[0]);
    return [episode];
  }
  const url = `${BASE_URL}/episode/${ids.join(',')}`;
  return fetchWithErrorHandling<Episode[]>(url);
}

/**
 * Extract episode IDs from episode URLs
 * Example: "https://rickandmortyapi.com/api/episode/1" -> 1
 */
export function extractEpisodeIds(episodeUrls: string[]): number[] {
  return episodeUrls.map((url) => {
    const match = url.match(/\/episode\/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }).filter((id) => id > 0);
}

// ============================================
// Location API Functions
// ============================================

/**
 * Fetch a single location by ID
 */
export async function getLocationById(id: number): Promise<Location> {
  const url = `${BASE_URL}/location/${id}`;
  return fetchWithErrorHandling<Location>(url);
}

/**
 * Extract location ID from location URL
 * Example: "https://rickandmortyapi.com/api/location/1" -> 1
 */
export function extractLocationId(locationUrl: string): number | null {
  if (!locationUrl) return null;
  const match = locationUrl.match(/\/location\/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

// ============================================
// Utility: Get All Unique Species (for filters)
// ============================================

/**
 * Fetch all characters to extract unique species
 * Note: In production, this would ideally be a cached endpoint
 */
export async function getAllSpecies(): Promise<string[]> {
  // Common species in Rick & Morty - hardcoded for performance
  // The API doesn't provide a species list endpoint
  return [
    'Human',
    'Alien',
    'Humanoid',
    'Robot',
    'Animal',
    'Mythological Creature',
    'Disease',
    'Cronenberg',
    'Poopybutthole',
    'unknown',
  ];
}
