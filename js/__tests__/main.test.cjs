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
        for (const display of unitDisplays) {
            assert.strictEqual(display.textContent, 'kg', `Expected textContent to be 'kg', but got '${display.textContent}'`);
        }

        // Find the lb button
        const lbBtn = global.document.getElementById('btn-lb');
        assert.ok(lbBtn, "Should find #btn-lb element");

        // Click 'lb' button
        lbBtn.click();

        // Check if unit displays updated to 'lb'
        for (const display of unitDisplays) {
            assert.strictEqual(display.textContent, 'lb', `Expected textContent to be 'lb', but got '${display.textContent}'`);
        }

        // Find the kg button
        const kgBtn = global.document.getElementById('btn-kg');
        assert.ok(kgBtn, "Should find #btn-kg element");

        // Click 'kg' button
        kgBtn.click();

        // Check if unit displays updated back to 'kg'
        for (const display of unitDisplays) {
            assert.strictEqual(display.textContent, 'kg', `Expected textContent to be 'kg', but got '${display.textContent}'`);
        }
    });
});
