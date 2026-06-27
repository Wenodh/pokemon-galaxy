# Pokémon Galaxy — Premium Discovery Platform

Pokémon Galaxy is a production-ready, interactive Pokémon encyclopedia built with Next.js 15, Three.js, and PokeAPI. It features a unique 3D Galaxy Explorer, advanced tactical tools, and offline-first collection tracking.

## 🌌 Core Features

-   **Galaxy Explorer**: An interactive 3D universe where Pokémon are stars grouped into regional sectors (Kanto to Paldea).
-   **Advanced Pokédex**: Instant search with deep filtering by type and generation. Supports Grid and List views.
-   **Battle Analyzer**: Tactical simulation for comparing type effectiveness and base stats between species.
-   **Team Builder**: Construct squads of six and analyze cumulative team strengths and weaknesses with scoring.
-   **Collection Tracker**: Mark species as "Owned" or "Favorite" with persistent IndexedDB storage.
-   **Daily Discovery**: A date-seeded "Species of the Day" hero feature.
-   **Pokémon Quiz**: "Who's That Pokémon?" game with streak tracking and local high scores.

## 🛠 Tech Stack

-   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS 4.
-   **3D Graphics**: React Three Fiber, Three.js, Framer Motion.
-   **UI Components**: ShadCN UI, Radix UI.
-   **State & Data**: TanStack Query (24h cache), Zustand (with persistence), Dexie.js (IndexedDB).
-   **PWA**: `next-pwa` for offline support and browser installation.
-   **Mobile**: Capacitor for Android/iOS native wrappers.

## 🚀 Getting Started

### Environment Setup

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  **Run development server**:
    ```bash
    npm run dev
    ```
4.  **Open [http://localhost:3000](http://localhost:3000)**

### PWA & Offline Support

The application is configured as a Progressive Web App. To test PWA features:
1.  Build the project: `npm run build`
2.  Start production server: `npm run start`
3.  The browser will prompt to install "Pokémon Galaxy".

## 📱 Mobile Publishing Guide (Android)

### Prerequisites
-   Android Studio installed.
-   `npm run build` has been executed (the `out` directory must exist).

### Steps
1.  **Sync Capacitor**:
    ```bash
    npx cap sync
    ```
2.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
3.  **Build Signed Bundle**:
    -   In Android Studio, go to `Build > Generate Signed Bundle / APK`.
    -   Follow the prompts to create a keystore and generate an `.aab` file.
    -   Upload the `.aab` to the Google Play Console.

## 🎨 Design Philosophy

-   **Dark Theme First**: Deep blacks and vibrant neons for a premium, celestial feel.
-   **Glassmorphism**: Extensive use of backdrop blurs and semi-transparent surfaces.
-   **Mobile First**: Responsive navigation with a bottom bar for mobile and a sidebar for desktop.
-   **Performance**: Optimized 3D rendering and chunk-based data fetching to maintain 60 FPS.

## 📈 Lighthouse & SEO

The app is optimized for high Lighthouse scores:
-   Image optimization via PokeAPI official artwork.
-   Strict TypeScript and ESLint rules.
-   Semantic HTML and Aria-labels for accessibility.
-   Configured `manifest.json` and meta tags.
