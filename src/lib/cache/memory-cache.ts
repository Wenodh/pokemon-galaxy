export const CACHE_CONFIG = {
  POKEMON_METADATA: 24 * 60 * 60 * 1000, // 24 hours
  SPECIES_DATA: 24 * 60 * 60 * 1000, // 24 hours
  EVOLUTION_CHAINS: 24 * 60 * 60 * 1000, // 24 hours
  SEARCH_RESULTS: 10 * 60 * 1000, // 10 minutes
};

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private static instance: MemoryCache;

  private constructor() {}

  static getInstance(): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache();
    }
    return MemoryCache.instance;
  }

  set<T>(key: string, data: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });

    // Simple eviction policy: clear old entries when setting new ones if cache gets too large
    if (this.cache.size > 1000) {
        this.evictExpired();
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
