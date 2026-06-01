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
## 2026-06-01 - [Async Font Loading for FCP]
**Learning:** Google Fonts are render-blocking by default. In a codebase without build tools, appending `media="print" onload="this.media='all'"` directly to the stylesheet `<link>` tag forces the browser to load it asynchronously, removing the render-blocking resource and improving First Contentful Paint (FCP).
**Action:** Use the async print-onload trick for external fonts (like Google Fonts) to boost FCP.
