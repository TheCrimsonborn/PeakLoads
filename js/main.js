import Calculator from './calculator.js';
import I18n from './i18n.js';

export const SafeStorage = {
    _memoryFallback: {},
    _lastWritten: {}, // ⚡ Bolt: Primitive write-through cache to intercept redundant disk I/O
    _isAvailable: null,

    checkAvailability() {
        if (this._isAvailable !== null) return this._isAvailable;
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            this._isAvailable = true;
        } catch (e) { // NOSONAR - Exception is expected when storage is blocked; we fallback to in-memory flag.
            this._isAvailable = false;
        }
        return this._isAvailable;
    },

    getItem(key) {
        if (this.checkAvailability()) {
            try {
                return localStorage.getItem(key);
            } catch (e) { // NOSONAR - Exception is expected when storage is blocked; we fallback to in-memory state.
                return this._memoryFallback[key] || null;
            }
        }
        return this._memoryFallback[key] || null;
    },

    setItem(key, value) {
        if (this._lastWritten[key] === value) return;
        this._lastWritten[key] = value;

        if (this.checkAvailability()) {
            try {
                localStorage.setItem(key, value);
                return;
            } catch (e) { // NOSONAR - Exception is expected on QuotaExceededError or denial; silent fallback to memory.
                // Silently fallback to memory on QuotaExceededError or sudden denial
            }
        }
        this._memoryFallback[key] = value;
    }
};

let analyticsLoaded = false;

document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentUnit = 'kg'; // 'kg' or 'lb'

    // DOM Elements
    const cachedStateInputs = [];
    const stateInputsById = {};
    const inputsAndSelects = document.querySelectorAll('input, select');
    // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
    for (let i = 0; i < inputsAndSelects.length; i++) {
        const el = inputsAndSelects[i];
        if (el.id) {
            cachedStateInputs.push(el);
            stateInputsById[el.id] = el;
        }
    }
    // Using static NodeList over live HTMLCollection to avoid redundant DOM writes
    // on ephemeral elements that are immediately destroyed and re-rendered.
    const staticUnitDisplays = document.querySelectorAll('.unit-display');
    const unitBtns = document.querySelectorAll('.unit-btn');
    const langSelect = document.getElementById('lang-select');
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.tool-section');

    // 1RM Elements
    const weight1rmInput = document.getElementById('weight-1rm');
    const reps1rmInput = document.getElementById('reps-1rm');
    const formulaSelect = document.getElementById('formula-1rm');
    const btnCalc1rm = document.getElementById('btn-calc-1rm');
    const result1rmCard = document.getElementById('result-1rm');
    const val1rm = document.getElementById('val-1rm');

    // Advanced 1RM Elements
    const weightAdv1rmInput = document.getElementById('weight-adv-1rm');
    const repsAdv1rmInput = document.getElementById('reps-adv-1rm');
    const rpeAdv1rmInput = document.getElementById('rpe-adv-1rm');
    const btnCalcAdv1rm = document.getElementById('btn-calc-adv-1rm');
    const resultAdv1rmCard = document.getElementById('result-adv-1rm');
    const valAdv1rm = document.getElementById('val-adv-1rm');

    // Percentage Elements
    const baseWeightPctInput = document.getElementById('base-weight-pct');
    const incrementPctInput = document.getElementById('increment-pct');
    const rangeMinPctInput = document.getElementById('range-min-pct');
    const rangeMaxPctInput = document.getElementById('range-max-pct');
    const btnGenPct = document.getElementById('btn-gen-pct');
    const resultPctCard = document.getElementById('result-pct');
    const tableBodyPct = document.getElementById('table-body-pct');

    // Warm-Up Elements
    const topSetWarmupInput = document.getElementById('top-set-warmup');
    const templateSelect = document.getElementById('template-warmup');
    const btnGenWarmup = document.getElementById('btn-gen-warmup');
    const resultWarmupCard = document.getElementById('result-warmup');
    const tableBodyWarmup = document.getElementById('table-body-warmup');

    // Advanced Warm-Up Elements
    const advLiftSelect = document.getElementById('adv-lift-select');
    const advWeightInput = document.getElementById('adv-weight-input');
    const advRepsInput = document.getElementById('adv-reps-input');
    const btnGenAdvWarmup = document.getElementById('btn-gen-adv-warmup');
    const resultAdvWarmupCard = document.getElementById('result-adv-warmup');
    const tableBodyAdvWarmup = document.getElementById('table-body-adv-warmup');

    // RIR Elements
    const weightRirInput = document.getElementById('weight-rir');
    const repsRirInput = document.getElementById('reps-rir');
    const rirRirInput = document.getElementById('rir-rir');
    const targetRepsRirInput = document.getElementById('target-reps-rir');
    const targetRirRirInput = document.getElementById('target-rir-rir');
    const btnCalcRir = document.getElementById('btn-calc-rir');
    const resultRirCard = document.getElementById('result-rir');
    const valRir1rm = document.getElementById('val-rir-1rm');
    const valRirNext = document.getElementById('val-rir-next');

    const weightInputs = [
        weight1rmInput,
        weightAdv1rmInput,
        baseWeightPctInput,
        topSetWarmupInput,
        advWeightInput,
        weightRirInput
    ];

    // Programmatic SEO Routes Map
    const seoRoutes = {
        '/squat-1rm-calculator': 'section-1rm',
        '/advanced-1rm-estimator': 'section-adv-1rm',
        '/bench-press-warm-up-planner': 'section-adv-warmup',
        '/rpe-rir-translator': 'section-rir'
    };

    function injectAnalytics() {
        if (analyticsLoaded) return;
        analyticsLoaded = true;

        // Google Analytics
        const gtagScript = document.createElement('script');
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-5PSBEY8S83';
        gtagScript.defer = true;
        document.head.appendChild(gtagScript);

        const gtagConfig = document.createElement('script');
        gtagConfig.textContent = `
            globalThis.dataLayer = globalThis.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5PSBEY8S83');
        `;
        document.head.appendChild(gtagConfig);

        // Ahrefs
        const ahrefsScript = document.createElement('script');
        ahrefsScript.src = 'https://analytics.ahrefs.com/analytics.js';
        ahrefsScript.defer = true;
        ahrefsScript.setAttribute('data-key', 'WsQGuqWO4T3Lhnt3EDPMkQ');
        document.head.appendChild(ahrefsScript);
    }

    // Navigation (Hash Routing)
    function activateSection(targetId) {
        if (!targetId) targetId = 'section-1rm'; // Default

        // Update Nav
        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i];
            btn.classList.remove('active');
            if (btn.getAttribute('href') === `#${targetId}`) {
                btn.classList.add('active');
                // Defer scroll to avoid forced reflow
                requestAnimationFrame(() => {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                });
            }
        }

        // Show Section
        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let i = 0; i < sections.length; i++) {
            const sec = sections[i];
            sec.classList.remove('active');
            if (sec.id === targetId) {
                sec.classList.add('active');
            }
        }
    }

    // --- Initialization ---
    loadState();
    updateUnitDisplays();

    // Auto-save state on user input
    let saveStateTimeout;
    const debouncedSaveState = () => {
        clearTimeout(saveStateTimeout);
        saveStateTimeout = setTimeout(saveState, 300);
    };
    document.addEventListener('input', debouncedSaveState);
    document.addEventListener('change', debouncedSaveState);

    // --- Event Listeners ---

    // Zero-allocation: Pre-allocate constants and objects outside hot event paths
    const ALLOWED_KEYS = {
        'Backspace': true, 'Tab': true, 'Delete': true, 'ArrowLeft': true, 'ArrowRight': true, 
        'ArrowUp': true, 'ArrowDown': true, 'Home': true, 'End': true, 'Enter': true, 'Escape': true
    };
    const VALID_NUMBER_CHAR = /^[0-9.]$/;
    const SYNTHETIC_INPUT_EVENT = new Event('input', { bubbles: true });

    // Global input restriction: only numbers and dots allowed. Comma is converted to dot.
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') {
            if (ALLOWED_KEYS[e.key] || e.ctrlKey || e.metaKey || e.altKey) return;

            const isDot = e.key === '.';
            const isComma = e.key === ',';

            if (isDot || isComma) {
                // Prevent starting with a dot. Since inputs are converted to text, selectionStart works perfectly.
                if (e.target.selectionStart === 0) {
                    e.preventDefault();
                    return;
                }

                if (isComma) {
                    e.preventDefault();
                    document.execCommand('insertText', false, '.');
                    return;
                }
            }

            if (!VALID_NUMBER_CHAR.test(e.key)) {
                e.preventDefault();
            }
        }
    });

    // Convert number inputs to text for exact cursor position control without browser quirks
    const numberInputs = document.querySelectorAll('input[type="number"]');
    // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
    for (let i = 0; i < numberInputs.length; i++) {
        numberInputs[i].type = 'text';
        numberInputs[i].inputMode = 'decimal';
    }

    // Completely disable pasting in input fields
    document.addEventListener('paste', (e) => {
        if (e.target.tagName === 'INPUT') {
            e.preventDefault();
        }
    });

    rpeAdv1rmInput.addEventListener('input', () => {
        if (Number.parseFloat(rpeAdv1rmInput.value) > 10) {
            rpeAdv1rmInput.value = '10';
        }
    });

    // Unit Toggle
    // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
    for (let i = 0; i < unitBtns.length; i++) {
        const btn = unitBtns[i];
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            const newUnit = btn.id === 'btn-kg' ? 'kg' : 'lb';

            // Convert inputs
            convertAllInputs(currentUnit, newUnit);

            // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
            for (let j = 0; j < unitBtns.length; j++) {
                unitBtns[j].classList.remove('active');
                unitBtns[j].setAttribute('aria-pressed', 'false');
            }
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentUnit = newUnit;
            updateUnitDisplays();
            saveState();

            // Recalculate any open results
            recalculateOpenResults();
        });
    }

    // Language Switch
    langSelect.addEventListener('change', (e) => {
        I18n.setLanguage(e.target.value);
        if (!resultAdvWarmupCard.classList.contains('hidden')) {
            btnGenAdvWarmup.click(); // Rerender advanced cues
        }
    });

    // Handle clicks on nav links
    // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
    for (let i = 0; i < navBtns.length; i++) {
        const btn = navBtns[i];
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jumpy scrolling
            globalThis.location.hash = btn.getAttribute('href'); // Let hashchange event handle the UI update
        });
    }

    // Handle hash changes (back/forward buttons, direct links)
    globalThis.addEventListener('hashchange', () => {
        const hash = globalThis.location.hash.substring(1);
        activateSection(hash || 'section-1rm');
        saveState();
    });

    const currentPath = globalThis.location.pathname;

    // Initial load: Check if there's an SEO path or a hash in the URL
    if (seoRoutes[currentPath]) {
        activateSection(seoRoutes[currentPath]);
    } else if (globalThis.location.hash) {
        activateSection(globalThis.location.hash.substring(1));
    } else {
        activateSection('section-1rm');
    }

    const calcBtns = [btnCalc1rm, btnCalcAdv1rm, btnGenPct, btnGenWarmup, btnGenAdvWarmup, btnCalcRir];
    // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
    for (let i = 0; i < calcBtns.length; i++) {
        calcBtns[i].addEventListener('click', (e) => {
            if (e.isTrusted) injectAnalytics();
        });
    }

    // 1RM Calculator
    btnCalc1rm.addEventListener('click', () => {
        const weight = weight1rmInput.value;
        const reps = reps1rmInput.value;
        const formula = formulaSelect.value;

        if (weight && reps) {
            val1rm.textContent = Calculator.calculate1RM(weight, reps, formula);
            result1rmCard.classList.remove('hidden');
        }
    });

    // Advanced 1RM Calculator
    btnCalcAdv1rm.addEventListener('click', () => {
        const weight = weightAdv1rmInput.value;
        const reps = repsAdv1rmInput.value;
        const rpe = rpeAdv1rmInput.value;

        if (weight && reps && rpe) {
            const result = Calculator.calculateAdvanced1RM(weight, reps, rpe);
            valAdv1rm.textContent = result;
            resultAdv1rmCard.classList.remove('hidden');
        }
    });

    // Percentage Chart
    btnGenPct.addEventListener('click', () => {
        const base = Number.parseFloat(baseWeightPctInput.value);
        const inc = Number.parseFloat(incrementPctInput.value);
        const min = Number.parseFloat(rangeMinPctInput.value);
        const max = Number.parseFloat(rangeMaxPctInput.value);

        if (base && inc && min && max) {
            const data = Calculator.generatePercentageTable(base, inc, min, max, currentUnit);
            renderPercentageTable(data);
            resultPctCard.classList.remove('hidden');
        }
    });

    // Warm-Up Planner
    btnGenWarmup.addEventListener('click', () => {
        const topSet = Number.parseFloat(topSetWarmupInput.value);
        const template = templateSelect.value;

        if (topSet) {
            const data = Calculator.generateWarmUp(topSet, template, currentUnit);
            renderWarmupTable(data);
            resultWarmupCard.classList.remove('hidden');
        }
    });

    // Advanced Warm-Up Planner
    btnGenAdvWarmup.addEventListener('click', () => {
        const liftType = advLiftSelect.value;
        const weight = Number.parseFloat(advWeightInput.value);
        const reps = Number.parseInt(advRepsInput.value, 10);

        if (weight && reps) {
            const cuesObj = I18n.getAdvCues()[liftType];
            const purposesObj = I18n.getAdvPurposes();
            const data = Calculator.generateAdvancedWarmUp(liftType, weight, reps, cuesObj, purposesObj, currentUnit);
            renderAdvWarmupTable(data);
            resultAdvWarmupCard.classList.remove('hidden');
        }
    });

    // RIR Translator
    btnCalcRir.addEventListener('click', () => {
        const weight = Number.parseFloat(weightRirInput.value);
        const reps = Number.parseInt(repsRirInput.value, 10);
        const rir = Number.parseFloat(rirRirInput.value) || 0;
        const tReps = Number.parseInt(targetRepsRirInput.value, 10) || 1;
        const tRir = Number.parseFloat(targetRirRirInput.value) || 0;

        if (weight && reps) {
            const result = Calculator.calculateRIR(weight, reps, rir, tReps, tRir, currentUnit);
            valRir1rm.textContent = result.est1RM;
            valRirNext.textContent = result.nextWeight;
            resultRirCard.classList.remove('hidden');
        }
    });

    // --- Helper Functions ---

    function saveState() {
        const state = {
            unit: currentUnit,
            language: langSelect.value,
            hash: globalThis.location.hash || '#section-1rm',
            inputs: {}
        };

        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let i = 0; i < cachedStateInputs.length; i++) {
            const el = cachedStateInputs[i];
            state.inputs[el.id] = el.value;
        }

        SafeStorage.setItem('peakloads_state', JSON.stringify(state));
    }

    function loadState() {
        const saved = SafeStorage.getItem('peakloads_state');
        if (saved) {
            try {
                const state = JSON.parse(saved);

                restoreLanguageState(state);
                restoreUnitState(state);
                restoreInputValues(state);
                restoreRoutingState(state, seoRoutes);
                triggerSavedCalculations();

            } catch (e) {
                console.error("Failed to restore state", e);
                SafeStorage.setItem('peakloads_state', ''); // removeItem equivalent, uses empty string so if (saved) falsy handles it
                globalThis.alert("Failed to restore previous session state. Your session has been reset.");
            }
        }
    }

    function restoreLanguageState(state) {
        if (state.language) {
            langSelect.value = state.language;
            I18n.setLanguage(state.language);
        }
    }

    function restoreUnitState(state) {
        if (state.unit) {
            currentUnit = state.unit;
            // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
            for (let i = 0; i < unitBtns.length; i++) {
                const btn = unitBtns[i];
                const isActive = btn.id === `btn-${currentUnit}`;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            }
        }
    }

    function restoreInputValues(state) {
        if (state.inputs) {
            // NOSONAR - Zero-allocation requires avoiding Object.keys() array generation
            for (const id in state.inputs) {
                if (Object.prototype.hasOwnProperty.call(state.inputs, id)) {
                    const el = stateInputsById[id];
                    if (el) el.value = state.inputs[id];
                }
            }
        }
    }

    function restoreRoutingState(state, seoRoutes) {
        // Prioritize explicit SEO URL over saved local state hash
        if (seoRoutes[globalThis.location.pathname]) {
            activateSection(seoRoutes[globalThis.location.pathname]);
        } else if (state.hash) {
            if (!globalThis.location.hash || globalThis.location.hash !== state.hash) {
                globalThis.location.hash = state.hash;
            }
            activateSection(state.hash.substring(1));
        }
    }

    function triggerSavedCalculations() {
        // Trigger calculations to restore UI tables silently safely
        setTimeout(() => {
            if (weight1rmInput.value && reps1rmInput.value) btnCalc1rm.click();
            if (weightAdv1rmInput.value && repsAdv1rmInput.value && rpeAdv1rmInput.value) btnCalcAdv1rm.click();
            if (baseWeightPctInput.value) btnGenPct.click();
            if (topSetWarmupInput.value) btnGenWarmup.click();
            if (advWeightInput.value && advRepsInput.value) btnGenAdvWarmup.click();
            if (weightRirInput.value && repsRirInput.value) btnCalcRir.click();
        }, 50);
    }

    function updateUnitDisplays() {
        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let i = 0; i < staticUnitDisplays.length; i++) {
            staticUnitDisplays[i].textContent = currentUnit;
        }
    }

    function convertAllInputs(oldUnit, newUnit) {
        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let i = 0; i < weightInputs.length; i++) {
            const input = weightInputs[i];
            if (input.value) {
                const kgValue = Calculator.toKg(Number.parseFloat(input.value), oldUnit);
                const newValue = Calculator.fromKg(kgValue, newUnit);
                // Depending on the unit, step precision changes
                const step = newUnit === 'kg' ? 0.5 : 1;
                input.step = step;
                input.value = (Math.round(newValue / step) * step).toFixed(newUnit === 'kg' ? 1 : 0);
            }
        }
    }

    function recalculateOpenResults() {
        if (!result1rmCard.classList.contains('hidden')) btnCalc1rm.click();
        if (!resultAdv1rmCard.classList.contains('hidden')) btnCalcAdv1rm.click();
        if (!resultPctCard.classList.contains('hidden')) btnGenPct.click();
        if (!resultWarmupCard.classList.contains('hidden')) btnGenWarmup.click();
        if (!resultAdvWarmupCard.classList.contains('hidden')) btnGenAdvWarmup.click();
        if (!resultRirCard.classList.contains('hidden')) btnCalcRir.click();
    }

    function createWeightCell(weight, includeUnit = true) {
        const tdWeight = document.createElement('td');
        tdWeight.textContent = `${weight} `;
        if (includeUnit) {
            const spanUnit = document.createElement('span');
            spanUnit.className = 'unit-display';
            spanUnit.textContent = currentUnit;
            tdWeight.appendChild(spanUnit);
        }
        return tdWeight;
    }

    function createTextCell(text, styles = null) {
        const td = document.createElement('td');
        td.textContent = text;
        if (styles) {
            Object.assign(td.style, styles);
        }
        return td;
    }

    function renderTableData(tbody, data, columns) {
        const fragment = document.createDocumentFragment();
        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const tr = document.createElement('tr');
            // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
            for (let j = 0; j < columns.length; j++) {
                tr.appendChild(columns[j](row));
            }
            fragment.appendChild(tr);
        }
        tbody.replaceChildren(fragment);
    }

    // ⚡ Bolt: Hoist column definitions to avoid memory reallocation and GC overhead on each render
    const PCT_TABLE_COLUMNS = [
        row => createTextCell(`${row.percent}%`),
        row => createWeightCell(row.weight)
    ];

    function renderPercentageTable(data) {
        renderTableData(tableBodyPct, data, PCT_TABLE_COLUMNS);
    }

    const WARMUP_TABLE_COLUMNS = [
        row => createTextCell(`${row.percent}%`),
        row => createWeightCell(row.weight),
        row => createTextCell(row.reps)
    ];

    function renderWarmupTable(data) {
        renderTableData(tableBodyWarmup, data, WARMUP_TABLE_COLUMNS);
    }

    const ADV_WARMUP_TABLE_COLUMNS = [
        row => createTextCell(row.stage),
        row => createTextCell(row.purposeStr),
        row => createTextCell(row.percent === '-' ? '-' : `${row.percent}%`),
        row => createWeightCell(row.weight, row.percent !== '-'),
        row => createTextCell(row.reps),
        row => createTextCell(row.notes, { fontSize: '0.9em', opacity: '0.8' })
    ];

    function renderAdvWarmupTable(data) {
        renderTableData(tableBodyAdvWarmup, data, ADV_WARMUP_TABLE_COLUMNS);
    }

    // Set current year in footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        globalThis.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => console.error("SW registration failed:", err));
        });
    }
});
