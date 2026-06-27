# Architecture - Pokémon Galaxy

## 🏗 System Overview

Pokémon Galaxy is built with a modern, scalable frontend architecture using **Next.js 15**, **React 19**, and **Tailwind CSS v4**. It follows a feature-based organization principle to ensure maintainability as the project grows.

## 📂 Directory Structure

### `src/app`
Next.js App Router directory. Contains pages, layouts, and route-specific logic.
- Follows the convention of `(route)/page.tsx`.
- Leverages Server Components by default for optimal performance.

### `src/features`
The core of the application's domain logic. Each directory represents a major functional area (e.g., `pokedex`, `battle`, `team`).
- **`api/`**: GraphQL queries and mutations.
- **`components/`**: Feature-specific UI components.
- **`hooks/`**: Custom hooks specific to the feature.
- **`services/`**: Business logic, repositories, and data mapping.
- **`types/`**: Domain-specific TypeScript interfaces.

### `src/components`
- **`ui/`**: Low-level, reusable primitive components (mostly shadcn/ui).
- **`common/`**: Shared higher-level components (e.g., `PageHeader`, `Container`).
- **`layout/`**: Global layout components (e.g., `Header`, `Footer`).
- **`providers/`**: Context providers (Theme, Query, State).

### `src/lib`
Core configuration and utility functions.
- **`api/`**: GraphQL client configuration and API constants.
- **`utils.ts`**: Global utility functions (e.g., `cn`).

## 🛠 Tech Stack Decisions

- **React 19 & Next.js 15**: Leveraging the latest stability and performance features like Actions and improved hydration.
- **TanStack Query v5**: Handles all server-state management with robust caching and synchronization.
- **Zustand**: Used for lightweight, persisted client-state (e.g., user preferences, UI state).
- **GraphQL Request**: Chosen for its simplicity and small bundle size compared to Apollo Client.
- **Tailwind CSS v4**: Utilizes the latest CSS-first engine for rapid UI development.

## 📡 API Integration Strategy

The project uses a **Repository Pattern** located in `src/features/[feature]/services/`. This decouples the UI from the data source, allowing for easier testing and future migrations to different API endpoints or mock data.

- **GraphQL Endpoint**: Interacts with the PokeAPI GraphQL v1beta2.
- **Error Handling**: Centralized through React Error Boundaries and local repository-level try/catch blocks.

## 🚀 Performance Patterns

- **RSC (React Server Components)**: Used for initial data fetching where interactivity isn't required.
- **Suspense**: Implemented for granular loading states in the Pokédex and search results.
- **Infinite Scrolling**: Optimized using `react-intersection-observer` and TanStack Query's `useInfiniteQuery`.
