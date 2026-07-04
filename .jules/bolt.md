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

## 2026-10-29 - [Prefer getAttribute over dataset for zero-allocation attribute access]
**Learning:** Accessing `el.dataset.*` properties creates or utilizes a `DOMStringMap` proxy behind the scenes, causing unnecessary memory allocation overhead. In contrast, the native `el.getAttribute('data-*')` accesses the string directly without this overhead.
**Action:** Always prefer the direct native API `getAttribute('data-*')` over `dataset.*` properties in loops and performance-critical sections to eliminate the memory allocation overhead associated with the `DOMStringMap` object.

## 2026-10-30 - [Suppress False Positives on Performance Hacks]
**Learning:** SonarCloud's default code style checks will fail if you swap `dataset` for `getAttribute` because it considers `dataset` "more modern", even though it violates the zero-allocation performance directive in hot loops.
**Action:** When implementing zero-allocation performance tweaks that clash with default SonarCloud rules, proactively append a `// NOSONAR` suppression directive with a technical justification to avoid CI pipeline failures.

## 2026-10-31 - [Inline NOSONAR Placement]
**Learning:** SonarCloud requires the `// NOSONAR` directive to be placed on the exact same line as the offending code to correctly suppress warnings. Placing it on the line before the code will result in a CI failure.
**Action:** When appending a `// NOSONAR` suppression directive, ensure it is on the exact same line as the code triggering the rule (e.g., `const key = el.getAttribute('data-i18n'); // NOSONAR`).
## 2026-06-13 - [Write-Through Cache for Sync Disk I/O]
**Learning:** Synchronous Disk I/O operations like `localStorage.setItem` are thread-blocking and heavily degrade performance, especially when fired repeatedly by global event listeners (like 'input' or 'change'). Generating the same state strings repeatedly causes redundant disk writes.
**Action:** Implement a primitive Write-Through Cache mechanism (e.g., a `_lastWritten` dictionary) and use strict equality checks (`===`) before triggering disk I/O. This intercepts redundant writes without allocating temporary memory and significantly reduces thread-blocking delays.

## 2026-06-13 - [Avoid Sorting after getElementsByTagName]
**Learning:** While `getElementsByTagName` is a faster C++ native call for single tag lookups compared to parsing CSS selectors with `querySelectorAll`, replacing a combined query like `querySelectorAll('input, select')` with multiple `getElementsByTagName` calls requires manually sorting the results with `compareDocumentPosition` to preserve strict document order. Crossing the JS-C++ boundary repeatedly to sort DOM nodes creates massive overhead, resulting in a performance regression.
**Action:** Do not micro-optimize combined `querySelectorAll` queries if preserving strict document order is required. The native C++ combined query is faster than a JS-side sort algorithm running `compareDocumentPosition`.

## 2026-10-31 - [Hoist UI Render Configurations]
**Learning:** Defining inline column configurations (arrays of rendering functions) or inline style objects directly within `render` functions causes unnecessary memory reallocation and garbage collection (GC) overhead every time the table is re-rendered (e.g., on button click).
**Action:** Extract static UI render configurations, such as arrays of column generator functions and style objects, into constants defined outside the frequently called functions to adhere to the zero-allocation architecture.

## 2026-11-01 - [IIFE Typed Arrays and Float Math]
**Learning:** Initializing a TypedArray from an object literal causes the object literal to persist in memory unnecessarily. Furthermore, floating point increments in `for` loops can cause severe compounding rounding errors and infinite loop edge cases.
**Action:** Always wrap memory-intensive TypedArray initializations in an IIFE (`(() => { ... })()`) to ensure temporary helper objects fall out of scope and are garbage collected. Convert all loop boundaries and increments to integers (e.g. `Math.round(val * 100)`) before iterating over them to ensure mathematical safety.
## 2024-05-18 - Avoid Synchronous Render Cascades
**Learning:** When functions like state loaders or form resets modify multiple inputs sequentially, the `input`/`change` event listeners trigger the heavy table rendering functions multiple times within the exact same JavaScript execution tick. This causes severe layout thrashing, wastes CPU cycles on abandoned renders, and heavily impacts the Interaction to Next Paint (INP) Core Web Vital.
**Action:** Implement "Frame Batching" (Render Debouncing) for main UI update functions. Wrap DOM update execution in a scheduling mechanism using `requestAnimationFrame` and a module-level state flag (e.g., `let isRenderScheduled = false;`) to ensure the DOM is only updated once per frame, significantly reducing main-thread blocking time.
## 2024-05-19 - Layout Thrashing in activateSection
**Learning:** Functions that manage routing and UI updates (like `activateSection`) can be called multiple times during initialization. This can cause redundant DOM mutations, CSS class toggling, and layout recalculations (thrashing).
**Action:** Implement a state variable (e.g., `currentActiveSectionId`) and add a strict equality early return condition to prevent duplicate execution when the target is already active.
## 2026-07-04 - [Batch DOM Appends with DocumentFragment and HTML Templates]
**Learning:** Constructing HTML tables via string concatenation (StringBuilder pattern) forces V8 to allocate massive intermediate strings in memory, leading to garbage collection pauses on hot render paths (like 'input' events).
**Action:** Replace string builders with native HTML `<template>` elements inside the DOM. Use `template.content.cloneNode(true)` and append row elements to a `DocumentFragment`, and populate fields with `.textContent`. This completely avoids HTML parsing overhead and adheres strictly to the zero-allocation architecture.
