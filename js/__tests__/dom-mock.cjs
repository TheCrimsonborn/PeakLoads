class MockClassList {
    constructor() { this.classes = new Set(); }
    add(cls) { this.classes.add(cls); }
    remove(cls) { this.classes.delete(cls); }
    contains(cls) { return this.classes.has(cls); }
    toggle(cls, force) {
        if (force !== undefined) {
            if (force) this.add(cls);
            else this.remove(cls);
        } else {
            if (this.contains(cls)) this.remove(cls);
            else this.add(cls);
        }
    }
}

class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName.toUpperCase();
        this.id = '';
        this.className = '';
        this.classList = new MockClassList();
        this.textContent = '';
        this.value = '';
        this.style = {};
        this.children = [];
        this._listeners = {};
        this.attributes = {};
        this.dataset = {};
    }
    appendChild(child) {
        this.children.push(child);
    }
    replaceChildren(fragment) {
        if (fragment && fragment.children) {
            this.children = [...fragment.children];
        } else {
            this.children = [];
        }
    }
    addEventListener(event, cb) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(cb);
    }
    dispatchEvent(event) {
        if (this._listeners[event.type]) {
            // NOSONAR - Array forEach is acceptable in test mocks and doesn't affect production zero-allocation
            this._listeners[event.type].forEach(cb => cb(event));
        }
    }
    click() {
        this.dispatchEvent({ type: 'click' });
    }
    setAttribute(key, val) {
        this.attributes[key] = val;
        if (key.startsWith('data-')) {
            const dataKey = key.substring(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            this.dataset[dataKey] = val;
        }
    }
    getAttribute(key) {
        return this.attributes[key];
    }
    scrollIntoView() {}
}

class MockDocument extends MockElement {
    constructor() {
        super('document');
        this.elements = [];
        this.documentElement = new MockElement('html');
    }

    createElement(tagName) {
        return new MockElement(tagName);
    }

    createDocumentFragment() {
        return new MockElement('fragment');
    }

    getElementById(id) {
        let el = this.elements.find(e => e.id === id);
        if (!el) {
            // Dynamically create elements on the fly to avoid hardcoding IDs
            let tagName = 'div';
            if (id.includes('select')) tagName = 'select';
            else if (id.includes('input') || id.includes('weight') || id.includes('reps') || id.includes('increment') || id.includes('min') || id.includes('max') || id.includes('top-set') || id === 'rir-rir') tagName = 'input';
            else if (id.includes('btn')) tagName = 'button';

            el = this.createElement(tagName);
            el.id = id;

            // Add specific classes based on ID to simulate the real DOM
            if (id === 'btn-kg' || id === 'btn-lb') {
                el.classList.add('unit-btn');
            } else if (id === 'section-1rm' || id === 'section-adv-warmup' || id === 'section-rir') {
                el.classList.add('tool-section');
            }

            this.elements.push(el);
        }
        return el;
    }

    querySelectorAll(selector) {
        if (selector === 'input, select') {
            // NOSONAR - Array filter is acceptable in test mocks and doesn't affect production zero-allocation
            return this.elements.filter(el => el.tagName === 'INPUT' || el.tagName === 'SELECT');
        } else if (selector.startsWith('.')) {
            const cls = selector.substring(1);
            // NOSONAR - Array filter is acceptable in test mocks and doesn't affect production zero-allocation
            return this.elements.filter(el => el.classList.contains(cls));
        } else if (selector.startsWith('#')) {
            const id = selector.substring(1);
            const el = this.getElementById(id);
            return el ? [el] : [];
        } else if (selector.startsWith('[') && selector.endsWith(']')) {
            const attr = selector.slice(1, -1);
            return this.elements.filter(el => {
                if (attr.startsWith('data-')) {
                    const dataKey = attr.substring(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    return el.dataset && el.dataset[dataKey] !== undefined;
                }
                return el.attributes[attr] !== undefined;
            });
        } else if (selector === '.tool-section.active') {
            return this.elements.filter(el => el.classList.contains('tool-section') && el.classList.contains('active'));
        }
        return [];
    }

    querySelector(selector) {
        const results = this.querySelectorAll(selector);
        return results.length > 0 ? results[0] : null;
    }
}

function setupMockDOM() {
    const doc = new MockDocument();

    // Simulate nav buttons
    const nav1 = doc.createElement('a'); nav1.classList.add('nav-btn'); nav1.setAttribute('href', '#section-1rm');
    const nav2 = doc.createElement('a'); nav2.classList.add('nav-btn'); nav2.setAttribute('href', '#section-adv-warmup');
    doc.elements.push(nav1, nav2);

    // Simulate unit displays
    const unitDisplay1 = doc.createElement('span'); unitDisplay1.classList.add('unit-display');
    const unitDisplay2 = doc.createElement('span'); unitDisplay2.classList.add('unit-display');
    doc.elements.push(unitDisplay1, unitDisplay2);

    // Pre-populate inputs so querySelectorAll('input, select') finds them
    const inputsToPrePopulate = [
        'lang-select', 'weight-1rm', 'reps-1rm', 'formula-1rm',
        'base-weight-pct', 'increment-pct', 'range-min-pct', 'range-max-pct',
        'top-set-warmup', 'template-warmup',
        'adv-lift-select', 'adv-weight-input', 'adv-reps-input',
        'weight-rir', 'reps-rir', 'rir-rir', 'target-reps-rir', 'target-rir-rir'
    ];
    // NOSONAR - Array forEach is acceptable in test mocks and doesn't affect production zero-allocation
    inputsToPrePopulate.forEach(id => doc.getElementById(id));

    // Pre-populate buttons that are queried by class later
    doc.getElementById('btn-kg');
    doc.getElementById('btn-lb');
    doc.getElementById('section-1rm');
    doc.getElementById('section-adv-warmup');
    doc.getElementById('section-rir');


    global.document = doc;
    global.window = {
        location: { hash: '', pathname: '/' },
        addEventListener: doc.addEventListener.bind(doc),
        Event: class { constructor(type) { this.type = type; } }
    };
    global._originalGlobalThis = global.globalThis;
    global.globalThis = global.window;
    global.localStorage = {
        getItem: () => null,
        setItem: () => {}
    };
    global.requestAnimationFrame = (cb) => cb();
    if (typeof global.navigator === 'undefined') {
        global.navigator = {};
    }
}

function teardownMockDOM() {
    delete global.document;
    delete global.window;
    if (global._originalGlobalThis) {
        global.globalThis = global._originalGlobalThis;
        delete global._originalGlobalThis;
    }
    delete global.localStorage;
    delete global.requestAnimationFrame;
}

module.exports = {
    setupMockDOM,
    teardownMockDOM
};
