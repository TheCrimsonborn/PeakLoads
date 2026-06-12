# PeakLoads

## Project Overview
PeakLoads is a zero-dependency, high-performance Vanilla JS Single Page Application (SPA) meticulously tailored for powerlifting. Built from the ground up for speed, precision, and resilience, it provides strength athletes with advanced programming tools without the bloat of modern JavaScript frameworks.

## Core Features
PeakLoads provides a suite of advanced calculators strictly adhering to **International Powerlifting Federation (IPF) standards** and enforcing strict physiological input caps to guarantee accurate, real-world programming:
- **1RM Estimators:** Standard approximations using the Epley, Brzycki, or Lombardi formulas.
- **Advanced RPE/RIR Estimations:** Utilizes an ultimate hybrid model combining O(1) RTS Matrix lookups and asymptotic decay to calculate precise 1RMs with Rate of Perceived Exertion (RPE) data.
- **Bench Press Warm-up Planner:** Auto-build progressive warm-up sets, potentiation sets, and skill acclimation sets based on precise percentages.
- **RIR Translator:** Converts last-set data into recommended working weights based on Reps In Reserve (RIR).

## Architectural Philosophy (Zero-Allocation)
This project rigorously adheres to a **Zero-Allocation** architecture to maximize V8 engine performance. Hot paths are optimized to avoid Garbage Collection (GC) pauses by strictly prohibiting:
- Regular expressions
- Temporary array allocations (e.g., `.split()`, `.map()`, `.filter()`)
- High-overhead proxies (e.g., `DOMStringMap` via `dataset`)

Instead, the codebase prefers primitive index-based `for` loops, strict equality checks (`===`), pre-allocated arrays, deterministic mathematical key generation for matrix lookups, and direct native DOM APIs like `getAttribute('data-*')`.

## Security & Resilience
The application utilizes a `SafeStorage` adapter to handle local state persistence. This adapter incorporates a robust in-memory fallback mechanism to gracefully prevent `SecurityError` DOM aborts when `localStorage` is blocked by strict browser privacy settings or quota limits. Furthermore, strict numeric input validations employ a primitive, native string-manipulation approach and direct conditional clamping, ensuring safe mathematical boundaries without unnecessary memory overhead.

## Privacy Architecture
PeakLoads implements an **Engagement-Based Tracking** (Implicit Consent) model. Analytics scripts (such as Google Analytics and Ahrefs) are never statically loaded on the initial page view. Instead, they are dynamically injected into the DOM only after a user executes their first active, trusted interaction (e.g., executing a calculation). This ensures absolute privacy compliance and maintains zero-allocation performance on initial load.

## DevOps, Linux & Cloud Deployment
PeakLoads utilizes modern web operations to deliver a lightning-fast experience:
- **Local Development:** The app requires zero build steps—simply open `index.html`.
- **Docker Integration & Nginx:** The project includes custom Docker and `nginx.conf` configurations ensuring stringent security headers (CSP, HSTS, X-Frame-Options) and proper compression.
- **Cloud Deployment:** Seamlessly deployed, the cloud configuration (`vercel.json`, `_redirects`) includes programmatic SEO rewrite rules to map multiple semantic URLs to the SPA client-side routing model flawlessly.

## AI & GEO Integration
Embracing the era of Generative Engine Optimization (GEO) and AI crawler context, the repository integrates `llms.txt` and `llms-full.txt` standards. These files expose strict architectural philosophies and project capabilities directly to LLMs, ensuring accurate context and representation in AI-generated summaries and autonomous developer workflows.
