# Data Flow - Pokémon Galaxy

## 🔄 Overview

Data flow in Pokémon Galaxy follows a unidirectional pattern, leveraging TanStack Query for server state and Zustand for client state.

## 📡 Server Data Flow (Pokédex)

1.  **User Action**: User navigates to `/pokedex` or changes the search query.
2.  **Hook Trigger**: `usePokemonList` hook is invoked with current search parameters.
3.  **Query Execution**:
    -   TanStack Query checks cache.
    -   If stale, it calls `PokedexRepository.getPokemonList()`.
4.  **Repository Logic**:
    -   `PokedexRepository` executes the GraphQL query via `graphql-client.ts`.
    -   Data is mapped from the GraphQL response shape to the internal `PokemonListItem` type.
5.  **State Update**:
    -   The query result is returned to the `PokedexContent` component.
    -   UI re-renders with new data or an empty state.
6.  **Persistence**: Results are cached in memory by TanStack Query for the session duration.

## 💾 Client State Flow (User Preferences)

1.  **User Action**: User toggles "Compact Mode" in the Pokédex.
2.  **Store Update**: `setCardDensity` is called in the `useUserPreferencesStore` (Zustand).
3.  **State Synchronization**:
    -   Zustand updates the local state.
    -   `persist` middleware automatically syncs changes to `localStorage`.
4.  **Re-render**:
    -   `PokedexContent` and `PokemonGrid` react to the store change.
    -   Layout adjusts from "comfortable" to "compact".

## 🛣 Route Synchronization

Search parameters in the URL act as the "source of truth" for the Pokédex state:
1.  Input change in `SearchInput` updates local state.
2.  Debounced effect updates the URL search params via `next/navigation`.
3.  `PokedexContent` reads search params and triggers a re-fetch.
4.  This ensures search state is shareable and persists through page refreshes.

## 🛡 Error Propagation

1.  **Repository**: Catches network or GraphQL errors and throws a descriptive `Error`.
2.  **Hook**: TanStack Query captures the error and sets the `isError` flag.
3.  **UI**: `PokedexContent` checks `isError` and renders the `ErrorMessage` component.
4.  **Global Boundary**: Unexpected runtime errors are caught by the `GlobalErrorBoundary` in `RootProvider`.
