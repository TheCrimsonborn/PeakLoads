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
    querySelector: () => null,
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

global.localStorage = {
    getItem: (key) => {
        if (key === 'peakloads_state') {
            // Return malformed JSON to trigger parse failure in loadState()
            return '{ "corrupt_data": ';
        }
        return null;
    },
    setItem: (key, value) => {
        if (key === 'peakloads_state' && value === '') {
            safeStorageItemSet = key;
        }
    },
    removeItem: (key) => {
        localStorageRemovedItem = key;
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
import('../js/main.js').then(() => {
    // Trigger DOMContentLoaded which calls loadState()
    if (domContentLoadedCb) {
        domContentLoadedCb();
    }

    // Assert
    try {
        assert.strictEqual(consoleErrorCalled, true, 'console.error should be called with "Failed to restore state"');
        // Check that safe storage setItem was called to empty string
        assert.strictEqual(safeStorageItemSet, 'peakloads_state', 'SafeStorage.setItem should be called with "peakloads_state" and empty string');
        assert.strictEqual(alertCalledWith, 'Failed to restore previous session state. Your session has been reset.', 'alert should be called with the error message');
        console.log('✅ Test passed: loadState error path successfully tested.');
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
