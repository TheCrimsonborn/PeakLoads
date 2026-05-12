## 2023-10-25 - Calculator A11y & Form Polish
**Learning:** Single Page Application (SPA) calculators often fail to notify screen readers when a new result is calculated because the DOM updates without a page refresh. Number inputs without `min` values also allow illogical negative values (e.g., negative weights or reps).
**Action:** Always add `aria-live="polite"` to dynamic result containers so screen readers automatically announce results upon calculation. Add `min="0"` to physical measurement inputs, and ensure all inputs (especially selects and range bound inputs) have accessible labels.
