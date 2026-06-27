# Technical Debt - Pokémon Galaxy

## 📋 Current Debt Log (v0.2.0)

| Item | Description | Impact | Priority | Target Phase |
| :--- | :--- | :--- | :--- | :--- |
| **API Retry Strategy** | Missing automated retry logic for failed GraphQL requests. | Medium | Medium | 1B |
| **Unit Test Coverage** | Only core repository and button components have tests. | Low | Medium | 1B |
| **Skip Navigation** | Accessibility feature for keyboard users is missing. | Low | Medium | 1B |
| **Placeholder Pages** | Team Builder, Battle, and Quiz pages are "Coming Soon". | High | High | 2/3 |
| **Skeleton Refinement** | Pokédex skeletons could more closely match card density. | Low | Low | 1B |
| **Image Fallbacks** | Missing robust placeholder for Pokémon with missing sprites. | Low | Medium | 1B |
| **State Persistence** | UI state (sidebar open) is persisted but might not be desired. | Low | Low | 1B |

## 🔍 Detail & Justification

### API Retry Strategy
Currently, if the PokeAPI fails, we show an error message with a manual retry button. Implementing exponential backoff would improve UX on unstable connections.

### Unit Test Coverage
The focus of Phase 0/1A was on architecture and visual fidelity. Future phases must include 80%+ coverage for hooks and business logic in `src/features`.

### Placeholder Pages
These are intentional placeholders to establish the site's information architecture. They will be replaced as feature phases commence.

### Hydration Warnings
A known issue with `next-themes` and Zustand persistence can occasionally cause hydration mismatches if not handled with a `mounted` check. This has been mitigated but should be monitored.
