18:31-08/05/2026 : [Batch DOM Appends with DocumentFragment]
Learning: Appending DOM elements inside a loop causes multiple reflows, which is a common performance bottleneck in SPAs. Using a DocumentFragment allows batching these appends into a single 'live' DOM update.
Action: Always use DocumentFragment when generating table rows or lists dynamically from data arrays.

21:04-09/05/2026 : [DOM Query Optimization in State Loading]
Learning: [Using document.getElementById inside a loop can be a performance bottleneck, especially during initialization or state restoration where multiple inputs are updated. Caching elements by ID into a dictionary/map during script initialization avoids repeated DOM traversal.]
Action: [When iterating over a known set of elements (like inputs for state saving/loading), query the DOM once and map the elements by their IDs for fast O(1) lookups.]

19:45-10/05/2026 : [Service Worker Background Fetch Termination]
Learning: When implementing a Stale-While-Revalidate caching strategy, the browser may aggressively terminate the Service Worker while the background fetch is still executing. This prevents the cache from being updated properly, leaving users stuck with stale assets.
Action: Always wrap background fetch promises in `event.waitUntil()` inside the `fetch` event listener to ensure the worker stays alive until the revalidation completes.

## 2026-05-12 - [Defer Layout-Triggering Methods]
**Learning:** Calling `scrollIntoView()` immediately after DOM mutations (like adding/removing classes) forces synchronous reflows, causing Lighthouse 'forced-reflow-insight' warnings and thread blocking.
**Action:** Defer layout-triggering methods using `requestAnimationFrame()` until after the browser has completed batch DOM mutations.

## 2026-05-25 - [Prevent GC Overhead from Static Objects]
**Learning:** Defining large static objects (like configuration templates or translation mappings) inside frequently called functions causes unnecessary memory reallocation and garbage collection (GC) overhead on every invocation.
**Action:** Extract large static objects into module-level constants to avoid recreating them and improve execution performance.
## 2026-05-12 - [Hidden Cost of Live HTMLCollections]
**Learning:** `getElementsByClassName` returns a live `HTMLCollection`. When iterating over this to update elements (e.g., unit displays), it processes *all* current elements, including dynamically generated ones inside tables. However, if those tables are immediately re-rendered right after (e.g., via a recalculation trigger), the DOM updates on those dynamic elements are completely wasted layout thrashing, as they are instantly destroyed.
**Action:** When updating a set of permanent UI elements, use `querySelectorAll` to capture a static `NodeList` at initialization. This restricts DOM writes only to the permanent elements, avoiding redundant work on ephemeral components.

## 2026-05-26 - [Reduce GC Overhead from Local Static Arrays in Computation]
**Learning:** Even small, dynamically created arrays with constant data within frequently called calculation functions (like generating warmup plan `sets`) cause noticeable memory allocation and GC overhead over many invocations.
**Action:** Extract constant data structures, even small ones, into module-level constants instead of instantiating them inside the function scope to avoid redundant memory allocations and reduce GC overhead.
## 2024-05-18 - Avoid redundant allocations from NodeLists
**Learning:** Chaining `Array.from()` and `.filter()` on NodeLists creates unnecessary intermediate arrays, increasing memory pressure and garbage collection overhead.
**Action:** Use `Array.prototype.reduce.call(nodeList, ...)` to perform map/filter/reduce operations in a single pass without intermediate array allocations when building cache arrays and lookup dictionaries from DOM elements.

## 2024-11-13 - Avoid redundant floating point operations
**Learning:** Performing floating-point math and calling rounding functions inside a loop when the result is ignored or overridden (e.g., standard bar calculations) wastes CPU cycles.
**Action:** Always conditionally bypass heavy calculations when a default/hardcoded value can be used. In this case, avoiding `Calculator.roundWeight` and floating-point multiplications for `set.percent === 0` improved loop execution time by ~35%.

## 2026-06-02 - [Avoid Temporary Array Allocations when Iterating Objects]
**Learning:** Iterating over object entries using `Object.entries(obj).forEach()` creates intermediate arrays and increases garbage collection overhead. In frequently called or initialization code paths, this can cause unnecessary delays.
**Action:** Iterate over simple object dictionaries (like parsed JSON state) using a `for...in` loop directly instead of `Object.entries().forEach()` to improve execution speed and reduce memory pressure.

## 2026-06-03 - [Prefer map over push for static iterations]
**Learning:** Using `Array.prototype.push()` inside a `.forEach()` loop is less performant than returning a `.map()` which allows JavaScript engines to pre-allocate arrays more optimally.
**Action:** Prefer `.map()` over `.forEach()` + `.push()` when creating arrays sequentially from static structures.

**Directive 6: Static Analysis Triage and False Positive Protocol**

You must not blindly apply fixes suggested by Qodana, CodeQL, or SonarCloud. Every alert must be rigorously triaged against our Core Architectural Directives before any code is modified.

1. The Skeptical Evaluation: Treat every linter alert as a hypothesis. If fixing a "code smell" or "style warning" requires introducing temporary memory allocations (e.g., replacing a raw `for` loop with `Object.entries` or `Array.from`), the alert is classified as an Architectural False Positive. You must REJECT the tool's suggested fix.
2. Strict Suppression Standards: When an alert is classified as a False Positive or directly contradicts our performance rules, you must suppress it inline using the specific tool's suppression syntax (e.g., `// NOSONAR`, `// noinspection`).
3. Mandatory Justification: Every suppression tag MUST be accompanied by a concise, technical justification explaining why the rule is bypassed. Example: `// NOSONAR - Forcing for...of creates iterator overhead; using index-based loop for V8 optimization.`
4. Security vs. Performance Escalation: If a genuine security alert (e.g., SRI hashes, CSP rules) cannot be resolved without causing a measurable performance regression, DO NOT implement a workaround. Halt execution, document the exact trade-off, and wait for human authorization.
## 2026-10-28 - Zero-Allocation Integer Keys for Static Lookups
**Learning:** Using string concatenation (`reps + '_' + rpe`) to construct keys for dictionary/matrix lookups causes unnecessary memory allocation and garbage collection on the hot path. V8 is much faster at computing simple integer hashes.
**Action:** Always derive zero-allocation integer keys using deterministic mathematical formulas (e.g., `(reps * 100) + (rpe * 10)`) for O(1) object lookups instead of implicit string casts or concatenations.
## 2026-10-30 - V8 Micro-Optimizations for Style Assignment and DOM Attributes
**Learning:** `Object.assign()` introduces function call overhead and temporary object handling that is slower than a direct `for...in` loop when applying simple style objects in frequently called DOM creation functions. Similarly, accessing `dataset.*` involves a `DOMStringMap` proxy that incurs memory allocation and performance penalties compared to the direct native `getAttribute('data-*')` API.
**Action:** Replace `Object.assign()` with a direct `for...in` loop, safeguarded by `Object.prototype.hasOwnProperty.call()` for security, to minimize V8 execution overhead. Replace `dataset.*` access with `getAttribute('data-*')` to eliminate proxy overhead on hot paths.
