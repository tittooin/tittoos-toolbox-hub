# MASTER_CONTEXT Update

## Phase 3A: AI Infrastructure Foundation

### 1. Executive Summary
Phase 3A focuses strictly on the AI Infrastructure Foundation, replacing the previous MVP architecture with a fully provider-neutral, parallel-execution model. The primary goal is to establish abstractions (`AIProviderRegistry`, `SearchProviderRegistry`, `StreamingCoordinator`) that eliminate tight coupling, sequential bottlenecks, and mock responses. This creates a scalable platform where future product, commerce, and community features can hook into the AI engine without risking architectural integrity.

### 2. Architecture Principles
- **Provider Abstraction:** No external service SDK or provider name shall leak into the application's core business logic.
- **Dependency Inversion:** High-level orchestrators rely on interfaces (`IAIProvider`, `ISearchProvider`), not concrete implementations.
- **Composition over Inheritance:** Modular adapters and registries are composed at runtime rather than relying on deep class hierarchies.
- **Repository as Source of Truth:** Documentation supports, but the actual repository state defines the final architecture.
- **Single Responsibility:** Each class has one reason to change. `AIRouter` handles routing, `StreamingCoordinator` handles orchestration, and `ResponseFormatter` handles serialization.
- **Pure Orchestration:** Coordinators manage the timeline and parallel execution without embedding any business logic or data transformation rules.
- **Configuration Centralization:** All timeouts, feature flags, and environment fallbacks are managed in one singleton `ConfigurationManager`.

### 3. Architecture Decision Records (ADR)

**ADR-001**
- **Title:** Provider Neutral Architecture
- **Status:** Approved
- **Context:** Hardcoding to specific services (like Workers AI or SerpAPI) prevents future expansion, failover handling, and testing.
- **Decision:** Implement abstract interfaces (`IAIProvider`, `ISearchProvider`) for all external LLM and Search integrations.
- **Alternatives Considered:** Direct SDK imports wrapped in try/catch. Rejected due to tight coupling.
- **Consequences:** Increases initial boilerplate but ensures long-term scalability and easy provider swapping.

**ADR-002**
- **Title:** Registry Pattern
- **Status:** Approved
- **Context:** We need a safe, dynamic way to select and instantiate providers at runtime based on the `ConfigurationManager`.
- **Decision:** Implement `AIProviderRegistry` and `SearchProviderRegistry` to act as central lookup factories for initialized provider adapters.
- **Alternatives Considered:** Switch-case blocks in the `AIRouter`. Rejected due to violation of the Open-Closed Principle.
- **Consequences:** New providers can be added without modifying the router or core logic.

**ADR-003**
- **Title:** StreamingCoordinator
- **Status:** Approved
- **Context:** Sequential processing of search, data fetching, and AI prompt generation causes high latency.
- **Decision:** Create a `StreamingCoordinator` responsible purely for parallel orchestration and timeline management.
- **Alternatives Considered:** Adding parallel logic directly into `ConversationManager`. Rejected as it violates Single Responsibility and bloats the manager.
- **Consequences:** Faster TTFB (Time to First Byte), but requires strict timeout configurations to prevent hanging promises.

**ADR-004**
- **Title:** Generic ResponseFormatter
- **Status:** Approved
- **Context:** AI response string manipulation was intertwined with routing and inference logic.
- **Decision:** Create `IResponseFormatter` and an AI-specific adapter (`AIResponseFormatter`) to handle serialization.
- **Alternatives Considered:** Formatting responses directly in `StreamingCoordinator`. Rejected as it violates pure orchestration.
- **Consequences:** Allows Commerce and Community engines to reuse formatting logic in the future.

**ADR-005**
- **Title:** Typed SSE
- **Status:** Approved
- **Context:** Sending raw strings over Server-Sent Events causes brittle frontend parsing and poor state management.
- **Decision:** Define a strict type union (`INIT`, `PRODUCTS`, `AI_TEXT`, etc.) for all SSE payloads.
- **Alternatives Considered:** WebSockets. Rejected due to infrastructure overhead for one-way streaming.
- **Consequences:** Frontend must enforce typed consumption; simplifies state machine updates in the UI.

**ADR-006**
- **Title:** ConfigurationManager
- **Status:** Approved
- **Context:** Reading `env.SOMETHING` across 10 different files leads to scattered fallback logic and configuration drift.
- **Decision:** Centralize all environmental configs, timeouts, and flags into a single `ConfigurationManager` singleton.
- **Alternatives Considered:** Passing `env` object directly and parsing locally. Rejected due to code duplication.
- **Consequences:** Centralized validation; easier to mock configurations during tests.

### 4. Non Goals
Phase 3A intentionally does **NOT** attempt to solve the following:
- Tuning or optimizing specific AI Prompts.
- Caching AI responses or Search results.
- Handling complex user session memory beyond passing the chat history array.
- Building frontend UI components for the new streaming events.
- Creating rate-limiting infrastructure for external APIs (handled in Phase 3B or by Cloudflare directly).

### 5. Locked Decisions
- **Provider Abstraction is Mandatory:** No AI or Search provider name/SDK shall leak into business logic (`ConversationManager`, `StreamingCoordinator`, etc.).
- **Pure Orchestration:** The `StreamingCoordinator` must never contain business logic. It only coordinates parallel execution and yields typed events.
- **Single Source of Configuration:** All timeouts, provider choices, and feature flags must be read exclusively from `ConfigurationManager`.
- **Strictly Typed SSE:** The frontend will only consume typed events from the event model. Raw strings are not permitted as event payloads.

### 6. Phase Boundary
The following features are intentionally **NOT** implemented in Phase 3A:
- Real Product Intelligence logic.
- Comparable Discovery processing.
- Recommendation Engine logic.
- Community UI/UX improvements.
- Commerce or Publishing enhancements.

### 7. Current Technical Debt
- Implementation of `StreamingCoordinator` is pending integration.
- `AIRouter` and `ConversationManager` need refactoring to hook into the new Registries.
- E2E testing of the parallel search + AI prompt pipeline is deferred to Phase 3B.
- Missing robust error normalization mappings for specific third-party provider failures.

### 8. Phase 3A Completion Criteria
- `IAIProvider` and `ISearchProvider` abstractions are fully built and registered.
- `StreamingCoordinator` and Typed Events are structured.
- `ConfigurationManager` safely loads environment properties without throwing runtime exceptions.
- Zero duplicate interfaces, utilities, or services exist for AI routing.
- The foundation is prepared to accept Phase 3B implementation without structural changes.

### 9. Phase 3B Entry Criteria
- The Phase 3A architecture (Registries, Coordinator, Formatter) must be successfully verified via TypeScript compilation and ESLint.
- No direct calls to `Env.AI` or `SERPAPI_KEY` exist outside of provider adapter files.
- All Phase 3A modules must pass basic runtime instantiation tests without crashing.

### 10. Future Documentation Standard
Every future phase must append its updates to the MASTER_CONTEXT using this mandatory template:
1. **Executive Summary**
2. **Architecture Principles**
3. **Architecture Decision Records (ADR)**
4. **New Features**
5. **Files Created / Modified**
6. **Architecture Changes**
7. **New Interfaces & Services**
8. **Decision Reasoning** 
9. **Locked Decisions**
10. **Non Goals**
11. **Phase Boundary**
12. **Breaking Changes**
13. **Current Technical Debt**
14. **Completion & Next Phase Entry Criteria**

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
