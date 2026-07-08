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

let localStorageRemovedItem = null;
let safeStorageItemSet = null;

let currentTest = 'loadState'; // used to toggle localStorage mock behavior

global.localStorage = {
    getItem: (key) => {
        if (currentTest === 'loadState' && key === 'peakloads_state') {
            // Return malformed JSON to trigger parse failure in loadState()
            return '{ "corrupt_data": ';
        } else if (currentTest === 'safeStorage') {
            throw new Error('Simulated localStorage.getItem error (e.g. security block)');
        }
        return null;
    },
    setItem: (key, value) => {
        if (currentTest === 'loadState' && key === 'peakloads_state' && value === '') {
            safeStorageItemSet = key;
        }
        if (currentTest === 'safeStorageFailCheck') {
            throw new Error('Simulated blocked storage on checkAvailability');
        }
    },
    removeItem: (key) => {
        if (currentTest === 'loadState') {
            localStorageRemovedItem = key;
        }
        if (currentTest === 'safeStorageRemoveItem') {
            throw new Error('Simulated localStorage.removeItem error');
        }
    }
};

let alertCalledWith = null;
global.globalThis.alert = (msg) => {
    alertCalledWith = msg;
};

// Required for UI bindings and routing within the try block (even though we fail before reaching it)
global.globalThis.location = {
    hash: '#section-1rm',
    pathname: '/'
};

global.globalThis.addEventListener = () => {};

let consoleErrorCalled = false;
const originalConsoleError = console.error;
console.error = (...args) => {
    if (args[0] === 'Failed to restore state') {
        consoleErrorCalled = true;
    }
};

// Import main to attach listener
import('../js/main.js').then((module) => {
    // -----------------------------------------------------
    // Test 1: loadState error path
    // -----------------------------------------------------
    currentTest = 'loadState';

    // Trigger DOMContentLoaded which calls loadState()
    if (domContentLoadedCb) {
        domContentLoadedCb();
    }

    try {
        assert.strictEqual(consoleErrorCalled, true, 'console.error should be called with "Failed to restore state"');
            // Check that safe storage removeItem was called
            assert.strictEqual(localStorageRemovedItem, 'peakloads_state', 'SafeStorage.removeItem should be called with "peakloads_state"');
        assert.strictEqual(alertCalledWith, 'Failed to restore previous session state. Your session has been reset.', 'alert should be called with the error message');
        console.log('✅ Test passed: loadState error path successfully tested.');

        // -----------------------------------------------------
        // Test 2: SafeStorage.getItem error paths
        // -----------------------------------------------------
        currentTest = 'safeStorage';
        const SafeStorage = module.SafeStorage;

        // Setup _memoryFallback
        const testKey = 'test_fallback_key';
        const expectedValue = 'fallback_value_123';
        SafeStorage._memoryFallback[testKey] = expectedValue;

        // Call getItem which should throw internally and return from fallback
        const result = SafeStorage.getItem(testKey);
        assert.strictEqual(result, expectedValue, 'SafeStorage.getItem should return _memoryFallback value when localStorage.getItem throws');

        // Also test that if checkAvailability throws (e.g. storage is completely blocked), we return fallback
        currentTest = 'safeStorageFailCheck';
        // Reset checkAvailability cache
        SafeStorage._isAvailable = null;

        const result2 = SafeStorage.getItem(testKey);
        assert.strictEqual(result2, expectedValue, 'SafeStorage.getItem should return _memoryFallback value when checkAvailability fails');

        console.log('✅ Test passed: SafeStorage error path successfully tested.');

            // -----------------------------------------------------
            // Test 3: SafeStorage.removeItem error paths
            // -----------------------------------------------------
            currentTest = 'safeStorageRemoveItem';

            // Setup _memoryFallback and _lastWritten
            SafeStorage._memoryFallback[testKey] = expectedValue;
            SafeStorage._lastWritten[testKey] = expectedValue;

            // Set availability to true to reach localStorage.removeItem
            SafeStorage._isAvailable = true;

            assert.doesNotThrow(() => {
                SafeStorage.removeItem(testKey);
            }, 'SafeStorage.removeItem should swallow localStorage.removeItem exceptions');

            assert.strictEqual(SafeStorage._memoryFallback[testKey], undefined, '_memoryFallback should be deleted');
            assert.strictEqual(SafeStorage._lastWritten[testKey], undefined, '_lastWritten should be deleted');
            console.log('✅ Test passed: SafeStorage.removeItem error path successfully tested.');

        console.error = originalConsoleError;
        process.exit(0);
    } catch (err) {
        console.error = originalConsoleError;
        console.error(err);
        process.exit(1);
    }
}).catch(err => {
    console.error = originalConsoleError;
    console.error(err);
    process.exit(1);
});
