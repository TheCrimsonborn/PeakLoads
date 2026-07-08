import assert from 'assert';

// Custom Node.js mocks for DOM structures as per project testing conventions
let domContentLoadedCb;
const mockElements = {};

const createMockElement = (id) => ({
    id,
    value: '',
    classList: {
        contains: () => false,
        add: () => {},
        remove: () => {},
        toggle: () => {}
    },
    addEventListener: () => {},
    click: () => {}
});

global.document = {
    addEventListener: (event, cb) => {
        if (event === 'DOMContentLoaded') {
            domContentLoadedCb = cb;
        }
    },
    querySelectorAll: (selector) => {
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
        throw new Error('Simulated localStorage.getItem error (e.g. security block)');
    },
    setItem: (key, value) => {
        // Allow checkAvailability to pass by not throwing on __test__
    },
    removeItem: (key) => {
        // Allow checkAvailability to pass by not throwing on __test__
    }
};

global.globalThis.alert = (msg) => {};

global.globalThis.location = {
    hash: '#section-1rm',
    pathname: '/'
};

global.globalThis.addEventListener = () => {};

// Import main to get SafeStorage
import('../js/main.js').then((module) => {
    try {
        const SafeStorage = module.SafeStorage;

        // Setup _memoryFallback
        const testKey = 'test_fallback_key';
        const expectedValue = 'fallback_value_123';
        SafeStorage._memoryFallback[testKey] = expectedValue;

        // Call getItem which should throw internally and return from fallback
        const result = SafeStorage.getItem(testKey);

        assert.strictEqual(result, expectedValue, 'SafeStorage.getItem should return _memoryFallback value when localStorage.getItem throws');

        // Also test that if checkAvailability throws (e.g. storage is completely blocked), we return fallback
        // Reset checkAvailability cache
        SafeStorage._isAvailable = null;
        global.localStorage.setItem = () => { throw new Error('Simulated blocked storage on checkAvailability'); };

        const result2 = SafeStorage.getItem(testKey);
        assert.strictEqual(result2, expectedValue, 'SafeStorage.getItem should return _memoryFallback value when checkAvailability fails');

        console.log('✅ Test passed: SafeStorage error path successfully tested.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}).catch(err => {
    console.error(err);
    process.exit(1);
});
