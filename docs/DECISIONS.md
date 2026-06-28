# Engineering Decisions (ADR) - Pokémon Galaxy

## ADR 001: GraphQL vs. REST
**Context**: We need to fetch Pokémon data efficiently with nested relationships (types, stats).
**Decision**: Use **GraphQL** (v1beta2 endpoint).
**Rationale**: Allows fetching only the required fields in a single request, reducing over-fetching and simplifying client-side data mapping compared to REST.

## ADR 002: Tailwind CSS v4
**Context**: Modern styling engine for a production-grade app.
**Decision**: Use **Tailwind v4**.
**Rationale**: Performance improvements, native CSS variables, and simplified configuration. It aligns with our "modern tech stack" requirement.

## ADR 003: Zustand for Client State
**Context**: Need to persist user preferences (theme, density).
**Decision**: Use **Zustand** with `persist` middleware.
**Rationale**: Lower boilerplate than Redux, easier to understand for a "Galaxy" scale app, and native support for middleware like persistence.

## ADR 004: Repository Pattern in `src/features`
**Context**: Separation of concerns between UI and Data fetching.
**Decision**: Abstract GraphQL calls into **Repository Services**.
**Rationale**: Makes the code testable with Vitest by allowing us to mock repositories. It also prepares the app for potential future API migrations without touching the UI layer.

## ADR 005: URL-Synced Search State
**Context**: Users expect to share search results via links.
**Decision**: Sync search queries to **URL Search Params**.
**Rationale**: Provides a better user experience (back button works, shareable links) and ensures the search state persists through refreshes.

## ADR 006: Persistence of User Preferences
**Context**: Users should not have to re-select "Compact Mode" on every visit.
**Decision**: Persist preference store to `localStorage`.
**Rationale**: Improves retention and UX. We use a `mounted` check to avoid hydration mismatches.

## ADR 007: Favorites Domain Layer
**Context**: Need a scalable way to manage user favorites.
**Decision**: Implement a dedicated Favorites feature with Zustand persistence.
**Rationale**: By isolating favorites into its own domain with granular hooks and selectors, we ensure UI components remain decoupled from the storage implementation. Using `localStorage` via Zustand `persist` provides instant hydration and simplicity for this lightweight data.

## ADR 008: Collection Tracking System
**Context**: Need to track complex player progress (Seen, Caught, Shiny, etc.).
**Decision**: Implement a schema-based Collection store keyed by Pokémon ID.
**Rationale**: Using a Record (Map) keyed by ID ensures O(1) lookups for status checks. Normalizing every entry into a standard interface (seen/caught/etc.) provides a flexible foundation for analytics and future game mechanics (like Team Building) without duplicating tracking logic.

## ADR 009: Unified Search Engine
**Context**: Multiple features (Pokédex, Favorites, Collection) require robust search capabilities.
**Decision**: Implement a centralized, high-performance Search Engine feature.
**Rationale**: By decoupling search logic from specific UI features, we ensure consistency in results and ranking across the application. The engine uses a 5-level priority system (ID > Name > Prefix > Partial > Fuzzy) and is optimized for <10ms execution on standard mobile hardware for datasets up to 2000 items.
