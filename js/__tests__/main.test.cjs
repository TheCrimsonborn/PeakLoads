const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { setupMockDOM, teardownMockDOM } = require('./dom-mock.cjs');

describe('main.js DOM tests', () => {

    beforeEach(() => {
        setupMockDOM();
    });

    afterEach(() => {
        teardownMockDOM();
    });

    test('updateUnitDisplays initializes to kg and updates on unit button click', async () => {
        // Since main.js is an ES module, we can use dynamic import() in CommonJS
        // We append a timestamp to ensure fresh execution context
        await import('../main.js?t=' + Date.now());

        // Dispatch DOMContentLoaded to trigger main.js initialization
        global.document.dispatchEvent({ type: 'DOMContentLoaded' });

        const unitDisplays = global.document.querySelectorAll('.unit-display');

        // Verify we actually found the elements
        assert.ok(unitDisplays.length > 0, "Should find .unit-display elements");

        // Check initial state, updateUnitDisplays should be called in Initialization setting it to 'kg'
        // NOSONAR - for...of on NodeLists is acceptable in test files where zero-allocation is not required
        for (const display of unitDisplays) {
            assert.strictEqual(display.textContent, 'kg', `Expected textContent to be 'kg', but got '${display.textContent}'`);
        }

        // Find the lb button
        const lbBtn = global.document.getElementById('btn-lb');
        assert.ok(lbBtn, "Should find #btn-lb element");

        // Click 'lb' button
        lbBtn.click();

        // Verify aria-pressed states updated
        assert.strictEqual(lbBtn.getAttribute('aria-pressed'), 'true', "lbBtn should have aria-pressed=true after clicking");
        assert.strictEqual(global.document.getElementById('btn-kg').getAttribute('aria-pressed'), 'false', "kgBtn should have aria-pressed=false after clicking lbBtn");

        // Check if unit displays updated to 'lb'
        // NOSONAR - for...of on NodeLists is acceptable in test files where zero-allocation is not required
        for (const display of unitDisplays) {
            assert.strictEqual(display.textContent, 'lb', `Expected textContent to be 'lb', but got '${display.textContent}'`);
        }

        // Find the kg button
        const kgBtn = global.document.getElementById('btn-kg');
        assert.ok(kgBtn, "Should find #btn-kg element");

        // Click 'kg' button
        kgBtn.click();

        // Verify aria-pressed states updated again
        assert.strictEqual(kgBtn.getAttribute('aria-pressed'), 'true', "kgBtn should have aria-pressed=true after clicking");
        assert.strictEqual(lbBtn.getAttribute('aria-pressed'), 'false', "lbBtn should have aria-pressed=false after clicking kgBtn");

        // Check if unit displays updated back to 'kg'
        // NOSONAR - for...of on NodeLists is acceptable in test files where zero-allocation is not required
        for (const display of unitDisplays) {
            assert.strictEqual(display.textContent, 'kg', `Expected textContent to be 'kg', but got '${display.textContent}'`);
        }
    });

    test('SafeStorage.checkAvailability sets _isAvailable to false when localStorage is blocked', async () => {
        const originalLocalStorage = global.localStorage;

        try {
            // Mock localStorage setItem to throw
            global.localStorage = {
                setItem: () => { throw new Error('Storage blocked'); },
                getItem: () => null,
                removeItem: () => {}
            };

            const module = await import('../main.js?t=' + Date.now());
            const SafeStorage = module.SafeStorage;

            // Reset internal state for test
            SafeStorage._isAvailable = null;

            const isAvailable = SafeStorage.checkAvailability();

            assert.strictEqual(isAvailable, false, "Expected checkAvailability() to return false");
            assert.strictEqual(SafeStorage._isAvailable, false, "Expected internal _isAvailable state to be false");
        } finally {
            global.localStorage = originalLocalStorage;
        }
    });

    test('SafeStorage.setItem silently falls back to _memoryFallback when localStorage.setItem throws', async () => {
        const originalLocalStorage = global.localStorage;

        try {
            // Mock localStorage setItem to throw only on specific key, to pass checkAvailability
            global.localStorage = {
                setItem: (key, value) => {
                    if (key === '__test__') return; // Allow checkAvailability to succeed
                    throw new Error('QuotaExceededError');
                },
                getItem: () => null,
                removeItem: () => {}
            };

            const module = await import('../main.js?t=' + Date.now());
            const SafeStorage = module.SafeStorage;

            // Reset internal state for test
            SafeStorage._isAvailable = null;
            SafeStorage._memoryFallback = {};

            const isAvailable = SafeStorage.checkAvailability();
            assert.strictEqual(isAvailable, true, "Expected checkAvailability() to return true");

            // Attempt to set item
            const testKey = 'test_key';
            const testValue = 'test_value';
            SafeStorage.setItem(testKey, testValue);

            // Verify fallback
            assert.strictEqual(SafeStorage._memoryFallback[testKey], testValue, "Expected value to be saved in _memoryFallback");
        } finally {
            global.localStorage = originalLocalStorage;
        }
    });
});
