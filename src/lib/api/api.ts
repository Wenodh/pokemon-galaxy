/**
 * Base Repository interface for data fetching
 */
export interface Repository<T> {
  getById(id: string | number): Promise<T | null>;
  getAll(params?: any): Promise<T[]>;
}

/**
 * Placeholder for future API service implementation
 */
export const api = {
  // Pokedex repository will be added here
  // Pokemon repository will be added here
};
