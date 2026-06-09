import assert from 'assert';

let domContentLoadedCb;
const mockElements = {};

const createMockElement = (id) => ({
    id,
    value: '',
    textContent: '',
    classList: {
        classes: new Set(),
        contains: function(cls) { return this.classes.has(cls); },
        add: function(cls) { this.classes.add(cls); },
        remove: function(cls) { this.classes.delete(cls); },
        toggle: function(cls, force) {
            if (force === undefined) {
                if (this.classes.has(cls)) this.classes.delete(cls);
                else this.classes.add(cls);
            } else if (force) {
                this.classes.add(cls);
            } else {
                this.classes.delete(cls);
            }
        }
    },
    addEventListener: (event, cb) => {
        if (!mockElements[id].listeners) mockElements[id].listeners = {};
        mockElements[id].listeners[event] = cb;
    },
    click: () => {
        if (mockElements[id] && mockElements[id].listeners && mockElements[id].listeners['click']) {
            mockElements[id].listeners['click']();
        }
    },
    style: {}
});

global.document = {
    addEventListener: (event, cb) => {
        if (event === 'DOMContentLoaded') {
            domContentLoadedCb = cb;
        } else if (event === 'input' || event === 'change') {
            // ignore
        }
    },
    querySelectorAll: (selector) => {
        if (selector === 'input, select') {
            return [
                global.document.getElementById('weight-1rm'),
                global.document.getElementById('reps-1rm'),
                global.document.getElementById('formula-1rm'),
                global.document.getElementById('btn-kg'),
                global.document.getElementById('btn-lb'),
            ];
        }
        if (selector === '.unit-btn') {
            const kg = global.document.getElementById('btn-kg');
            const lb = global.document.getElementById('btn-lb');
            kg.id = 'btn-kg';
            lb.id = 'btn-lb';
            return [kg, lb];
        }
        if (selector === '.unit-display') {
            return [
                global.document.getElementById('unit-display-1')
            ];
        }
        if (selector === '.nav-btn' || selector === '.tool-section') {
            return [];
        }
        return [];
    },
    getElementById: (id) => {
        if (!mockElements[id]) {
            mockElements[id] = createMockElement(id);
        }
        return mockElements[id];
    },
    createElement: () => ({
        className: '',
        textContent: '',
        appendChild: () => {},
        style: {}
    }),
    createDocumentFragment: () => ({
        appendChild: () => {}
    })
};

global.localStorage = {
    getItem: (key) => {
        if (key === 'peakloads_state') {
            return null; // Return null so we don't hit the seoRoutes error during init
        }
        return null;
    },
    setItem: () => {},
    removeItem: () => {}
};

global.globalThis.alert = () => {};
global.globalThis.location = {
    hash: '#section-1rm',
    pathname: '/'
};
global.globalThis.addEventListener = () => {};
global.requestAnimationFrame = (cb) => cb();

Object.defineProperty(global, 'navigator', {
  value: {},
  writable: true
});

import('../js/main.js').then(() => {
    if (domContentLoadedCb) {
        domContentLoadedCb();
    }

    try {
        // Test 1: 1RM Calculation
        const weightInput = global.document.getElementById('weight-1rm');
        const repsInput = global.document.getElementById('reps-1rm');
        const formulaSelect = global.document.getElementById('formula-1rm');
        const btnCalc1rm = global.document.getElementById('btn-calc-1rm');
        const result1rmCard = global.document.getElementById('result-1rm');
        const val1rm = global.document.getElementById('val-1rm');

        result1rmCard.classList.add('hidden');
        weightInput.value = '100';
        repsInput.value = '5';
        formulaSelect.value = 'epley';

        btnCalc1rm.click();

        assert.strictEqual(result1rmCard.classList.contains('hidden'), false, 'Result card should not be hidden');
        assert.ok(val1rm.textContent === '116.7' || val1rm.textContent === 116.7 || val1rm.textContent === '117', `val1rm should be ~116.7, got ${val1rm.textContent}`);

        // Test 2: Unit Toggle (kg to lb)
        const btnLb = global.document.getElementById('btn-lb');
        const btnKg = global.document.getElementById('btn-kg');
        btnKg.classList.add('active'); // currently active

        btnLb.click(); // Switch to lb

        assert.strictEqual(btnLb.classList.contains('active'), true, 'lb button should be active');
        assert.strictEqual(btnKg.classList.contains('active'), false, 'kg button should not be active');
        // Because of step precision for 'lb', calculation should be rounded to integer
        assert.strictEqual(weightInput.value, '220', 'Weight should be converted to lb (100kg -> ~220lb)');

        console.log('✅ Test passed: main.js UI interactions and logic successfully tested.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}).catch(err => {
    console.error(err);
    process.exit(1);
});
