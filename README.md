# Pokémon Galaxy

A premium, high-performance Pokémon discovery platform built with Next.js 15, React 19, and Tailwind CSS v4.

## 🌌 Overview

Pokémon Galaxy is designed as a production-grade foundation for a comprehensive Pokémon ecosystem. It prioritizes developer experience, scalability, and modern UI/UX principles inspired by industry leaders like Linear and Vercel.

### Phase 0 & 1A Complete:
- **Foundation:** Next.js 15 (App Router), React 19, Tailwind v4, TypeScript.
- **State & Data:** Zustand (persisted), TanStack Query, GraphQL.
- **Discovery Experience:** Landing Page with featured Pokémon and a fully functional, infinite-scroll Pokédex with URL-synced search.
- **Infrastructure:** Repository pattern for API decoupling, comprehensive testing suite (Vitest + Playwright), and CI/CD ready.

## 🛠 Tech Stack

- **Framework:** Next.js 15.1.8 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS v4, shadcn/ui (customized), Framer Motion
- **Data Fetching:** TanStack Query v5, GraphQL Request
- **State Management:** Zustand (Persisted)
- **Forms & Validation:** React Hook Form, Zod
- **Testing:** Vitest, Playwright
- **Linting & Formatting:** ESLint, Prettier

## 🏗 Architecture

The project follows a hybrid architecture designed for scalability:

```
src/
├── app/              # Next.js App Router (Pages & Layouts)
├── components/       # Shared UI library & Global layouts
├── features/         # Feature-based organization (Pokedex, etc.)
│   └── pokedex/
│       ├── api/      # GraphQL queries
│       ├── components/
│       ├── hooks/    # Feature-specific hooks
│       ├── services/ # Repositories & Business logic
│       └── types/
├── hooks/            # Global reusable hooks
├── lib/              # Core configurations (API, utils)
└── store/            # Global state (Theme, UI)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (Recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

### Development

Run the development server:
```bash
pnpm dev
```
The application will be available at `http://localhost:3000`.

### Testing

- **Unit Tests:** `pnpm test`
- **E2E Tests:** `pnpm exec playwright test`

## 📡 API Layer

The project utilizes the **PokeAPI GraphQL (v1beta2)** endpoint.
- Data fetching is abstracted through the `PokedexRepository` in `src/features/pokedex/services/`.
- Types are strictly defined to ensure data integrity across the application.

## 🎨 Theme & Accessibility

- **Dark Mode First:** Optimized for a premium dark aesthetic with full light mode support.
- **A11y:** Follows WCAG AA guidelines with proper ARIA labels and keyboard navigation.
- **Performance:** Leverages React Server Components (RSC) by default with minimal client-side hydration.

## 🗺 Roadmap

- [x] Phase 0: Foundation & Core UI
- [x] Phase 1A: Discovery Experience (Landing + Pokedex)
- [ ] Phase 1B: Detailed Insights (Pokemon Details, Evolution Chains)
- [ ] Phase 2: Personalization (Team Builder, Favorites)
- [ ] Phase 3: Engagement (Battle Analyzer, Quiz)
- [ ] Phase 4: Innovation (3D Galaxy Explorer)

---
Built with precision. Pokemon Galaxy © 2026.
