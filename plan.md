1. **Explore codebase and identify a performance optimization:**
   - I have found that in `js/main.js`, `updateUnitDisplays()` updates `.textContent` unconditionally on DOM nodes. Based on our learnings, avoiding unnecessary DOM writes by adding a simple check (`if (node.textContent !== currentUnit) node.textContent = currentUnit;`) can avoid expensive JS-C++ boundary crossings when the text is already the same. This is highly aligned with Bolt's performance philosophy.

2. **Implement optimization in `js/main.js`:**
   - Modify `updateUnitDisplays()` to include conditional checks for `staticUnitDisplays[i].textContent !== currentUnit` and `templateUnitDisplays[i].textContent !== currentUnit` before setting `.textContent = currentUnit`.

3. **Verify tests:**
   - Run the test suite (`node --test tests/*.js js/__tests__/*.cjs`) to ensure everything still passes.

4. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**

5. **Submit a Pull Request with the changes:**
   - Create a PR with the required Bolt PR format.
