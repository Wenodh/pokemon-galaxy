# Pokémon Galaxy 🌌

A premium, high-performance Pokémon explorer built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**.

## 🚀 Overview

Pokémon Galaxy is a production-grade foundation for a massive Pokémon universe explorer. It prioritizes performance, scalability, and a modern UI/UX inspired by industry leaders like Linear, Vercel, and Apple.

## 🏗️ Architecture

```text
                                    ┌───────────────────┐
                                    │    Next.js App    │
                                    │  (Server First)   │
                                    └─────────┬─────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
          ┌─────────▼─────────┐     ┌─────────▼─────────┐     ┌─────────▼─────────┐
          │  Feature Hooks    │     │   Global Stores   │     │   Shared UI Lib   │
          │  (TanStack Query) │     │     (Zustand)     │     │     (shadcn)      │
          └─────────┬─────────┘     └───────────────────┘     └───────────────────┘
                    │
          ┌─────────▼─────────┐
          │   Repositories    │
          └─────────┬─────────┘
                    │
          ┌─────────▼─────────┐
          │  GraphQL Client   │
          │ (PokeAPI v1beta2) │
          └───────────────────┘
```

### Folder Structure

```text
src/
├── app/              # Next.js App Router (Pages, Layouts, Error handling)
├── components/       # Shared UI components
│   ├── ui/           # Primitive components (Radix/shadcn)
│   ├── common/       # Business-agnostic reusable components
│   └── layout/       # Global navigation, header, footer
├── features/         # Feature-based encapsulation
│   └── [feature]/    # Components, hooks, services, types per feature
├── lib/              # Core infrastructure
│   ├── api/          # GraphQL client and Repository pattern
│   └── utils/        # Shared utility functions
├── store/            # Client-side state persistence (Zustand)
└── test/             # Test configuration and setup
```

## 🚥 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Quality Assurance

```bash
pnpm lint      # ESLint check
pnpm tsc       # Type check
pnpm test:run  # Unit tests (Vitest)
pnpm test:e2e  # E2E tests (Playwright)
```

## 🛠️ Tech Stack & Dependencies

| Dependency | Purpose | Phase |
| :--- | :--- | :--- |
| `Next.js 15` | App Framework (RSC, Routing) | Foundation |
| `React 19` | UI Library | Foundation |
| `Tailwind v4` | CSS-first Styling | Foundation |
| `Zustand` | Client State (UI/Prefs) | Foundation |
| `TanStack Query` | Server Data Caching | Phase 1+ |
| `GraphQL Request`| API Communication | Phase 1+ |
| `Framer Motion` | Animations | Foundation |
| `Lucide React` | Icon Library | Foundation |

## 🔮 Roadmap

- **Phase 0**: Project Foundation & Architecture (Current)
- **Phase 1**: Pokédex (Server-side search & filtering)
- **Phase 2**: Pokémon Details (Rich media & stats)
- **Phase 3**: Performance Optimization (Image optimization, Prefetching)
- **Phase 4**: PWA (Offline support, Push notifications)
- **Phase 5**: Favorites (Persisted user collections)
- **Phase 6**: Team Builder (Complex state & validation)
- **Phase 7**: Battle Analyzer (Algorithmic matchups)
- **Phase 8**: 3D Galaxy Explorer (React Three Fiber)

## 🛡️ Design Decisions

- **Server-First**: We use React Server Components by default to minimize client-side shipping.
- **Repository Pattern**: Prevents UI components from being tightly coupled to the GraphQL schema.
- **Strict Typing**: Strict mode enabled in `tsconfig` to ensure maximum stability.
- **Linear Inspiration**: Minimalist, high-contrast dark mode with subtle blurs and transitions.

---

Built with precision. Pokémon Galaxy &copy; 2025.
