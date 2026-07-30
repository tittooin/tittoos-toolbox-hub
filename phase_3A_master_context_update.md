# MASTER_CONTEXT Update

## Phase 3A: AI Infrastructure Foundation

### 1. Executive Summary
Phase 3A focuses strictly on the AI Infrastructure Foundation, replacing the previous MVP architecture with a fully provider-neutral, parallel-execution model. The primary goal is to establish abstractions (`AIProviderRegistry`, `SearchProviderRegistry`, `StreamingCoordinator`) that eliminate tight coupling, sequential bottlenecks, and mock responses. This creates a scalable platform where future product, commerce, and community features can hook into the AI engine without risking architectural integrity.

### 2. Decision Reasoning
- **Provider-Neutral Architecture:** Tightly coupling to `Workers AI` or `SerpAPI` would make future migrations or multi-model routing impossible. The Registry pattern allows dynamic runtime selection based on config, preventing vendor lock-in.
- **Centralized Configuration:** Prevents configuration drift and scattered environment variable checks. It ensures that fallbacks, timeouts, and feature flags are uniformly applied across the entire AI layer.
- **Parallel Execution Orchestration:** Sequential AI fetching introduces high latency. The `StreamingCoordinator` splits Product/Search Context and AI Prompting, preventing the user from waiting on sequential blocking calls.
- **Typed Streaming Events:** Raw text streams are brittle. A strongly-typed event system (`INIT`, `PRODUCTS`, `AI_TEXT`, etc.) prevents frontend parsing errors and clearly delineates state transitions during long-running inferences.
- **Generic Response Formatting:** AI response formatting was previously bundled into business logic. The `IResponseFormatter` decouples this, allowing future modules (like Commerce and Community) to reuse standard formatting adapters.

### 3. Locked Decisions
- **Provider Abstraction is Mandatory:** No AI or Search provider name/SDK shall leak into business logic (`ConversationManager`, `StreamingCoordinator`, etc.).
- **Pure Orchestration:** The `StreamingCoordinator` must never contain business logic. It only coordinates parallel execution and yields typed events.
- **Single Source of Configuration:** All timeouts, provider choices, and feature flags must be read exclusively from `ConfigurationManager`.
- **Strictly Typed SSE:** The frontend will only consume typed events from the event model. Raw strings are not permitted as event payloads.

### 4. Phase Boundary
The following features are intentionally **NOT** implemented in Phase 3A:
- Real Product Intelligence logic.
- Comparable Discovery processing.
- Recommendation Engine logic.
- Community UI/UX improvements.
- Commerce or Publishing enhancements.

### 5. Current Technical Debt
- Implementation of `StreamingCoordinator` is pending integration.
- `AIRouter` and `ConversationManager` need refactoring to hook into the new Registries.
- E2E testing of the parallel search + AI prompt pipeline is deferred to Phase 3B.
- Missing robust error normalization mappings for specific third-party provider failures.

### 6. Phase 3A Completion Criteria
- `IAIProvider` and `ISearchProvider` abstractions are fully built and registered.
- `StreamingCoordinator` and Typed Events are structured.
- `ConfigurationManager` safely loads environment properties without throwing runtime exceptions.
- Zero duplicate interfaces, utilities, or services exist for AI routing.
- The foundation is prepared to accept Phase 3B implementation without structural changes.

### 7. Phase 3B Entry Criteria
- The Phase 3A architecture (Registries, Coordinator, Formatter) must be successfully verified via TypeScript compilation and ESLint.
- No direct calls to `Env.AI` or `SERPAPI_KEY` exist outside of provider adapter files.
- All Phase 3A modules must pass basic runtime instantiation tests without crashing.

### 8. Future Documentation Standard
Every future phase must append its updates to the MASTER_CONTEXT using this mandatory template:
1. **Executive Summary**
2. **New Features**
3. **Files Created / Modified**
4. **Architecture Changes**
5. **New Interfaces & Services**
6. **Decision Reasoning** (Why decisions were made & problems prevented)
7. **Locked Decisions** (Permanent architectural rules)
8. **Phase Boundary** (What is intentionally excluded)
9. **Breaking Changes**
10. **Current Technical Debt**
11. **Completion & Next Phase Entry Criteria**

---

### New Features
- Provider Neutral Architecture via Registries (AI and Search).
- Centralized Configuration Manager.
- Typed Streaming Events.
- Generic Response Formatting.

### Files Created
- `src/types/streaming.ts`
- `src/types/ai.ts`
- `src/types/search.ts`
- `functions/api/shopping/core/ConfigurationManager.ts`
- `functions/api/shopping/formatters/IResponseFormatter.ts`
- `functions/api/shopping/formatters/AIResponseFormatter.ts`
- `functions/api/shopping/providers/ai/IAIProvider.ts`
- `functions/api/shopping/providers/ai/AIProviderRegistry.ts`
- `functions/api/shopping/providers/ai/WorkersAIProvider.ts`
- `functions/api/shopping/providers/search/ISearchProvider.ts`
- `functions/api/shopping/providers/search/SearchProviderRegistry.ts`
- `functions/api/shopping/providers/search/SerpApiProvider.ts`

### Files Modified
- (Planned) `AIRouter.ts` and `ConversationManager.ts` to implement registry delegation and pure orchestration.

### Architecture Changes
- Moved away from tight coupling to specific providers.
- Replaced direct instantiation with Registry lookups.
- Abstracted response formatting into generic adapter implementations.

### New Interfaces & Services
- `IAIProvider` & `AIProviderRegistry`
- `ISearchProvider` & `SearchProviderRegistry`
- `ConfigurationManager`
- `IResponseFormatter` & `AIResponseFormatter`

### Breaking Changes
- Consumers of `AIRouter` and `ConversationManager` will now need to adhere to the typed SSE event structure and rely on the new `ConfigurationManager`.

### Future TODOs
- Complete the integration of `StreamingCoordinator`.
- Refactor `AIRouter` and `ConversationManager` to use the new Registries.
- Add complete unit and E2E regression tests for the parallel pipeline.
