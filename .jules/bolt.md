18:31-08/05/2026 : [Batch DOM Appends with DocumentFragment]
Learning: Appending DOM elements inside a loop causes multiple reflows, which is a common performance bottleneck in SPAs. Using a DocumentFragment allows batching these appends into a single 'live' DOM update.
Action: Always use DocumentFragment when generating table rows or lists dynamically from data arrays.

21:04-09/05/2026 : [DOM Query Optimization in State Loading]
Learning: [Using document.getElementById inside a loop can be a performance bottleneck, especially during initialization or state restoration where multiple inputs are updated. Caching elements by ID into a dictionary/map during script initialization avoids repeated DOM traversal.]
Action: [When iterating over a known set of elements (like inputs for state saving/loading), query the DOM once and map the elements by their IDs for fast O(1) lookups.]

19:45-10/05/2026 : [Service Worker Background Fetch Termination]
Learning: When implementing a Stale-While-Revalidate caching strategy, the browser may aggressively terminate the Service Worker while the background fetch is still executing. This prevents the cache from being updated properly, leaving users stuck with stale assets.
Action: Always wrap background fetch promises in `event.waitUntil()` inside the `fetch` event listener to ensure the worker stays alive until the revalidation completes.
