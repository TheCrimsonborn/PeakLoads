import Calculator from './calculator.js';
import I18n from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentUnit = 'kg'; // 'kg' or 'lb'

    // DOM Elements
    const cachedStateInputs = [];
    const stateInputsById = {};
    const inputsAndSelects = document.querySelectorAll('input, select');
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

    // Unit Toggle
    for (let i = 0; i < unitBtns.length; i++) {
        const btn = unitBtns[i];
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            const newUnit = btn.id === 'btn-kg' ? 'kg' : 'lb';

            // Convert inputs
            convertAllInputs(currentUnit, newUnit);

            for (let j = 0; j < unitBtns.length; j++) {
                unitBtns[j].classList.remove('active');
            }
            btn.classList.add('active');
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

    // Navigation (Hash Routing)
    function activateSection(targetId) {
        if (!targetId) targetId = 'section-1rm'; // Default

        // Update Nav
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
        for (let i = 0; i < sections.length; i++) {
            const sec = sections[i];
            sec.classList.remove('active');
            if (sec.id === targetId) {
                sec.classList.add('active');
            }
        }
    }

    // Handle clicks on nav links
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

    // Programmatic SEO Routes Map
    const seoRoutes = {
        '/squat-1rm-calculator': 'section-1rm',
        '/advanced-1rm-estimator': 'section-adv-1rm',
        '/bench-press-warm-up-planner': 'section-adv-warmup',
        '/rpe-rir-translator': 'section-rir'
    };

    const currentPath = globalThis.location.pathname;

    // Initial load: Check if there's an SEO path or a hash in the URL
    if (seoRoutes[currentPath]) {
        activateSection(seoRoutes[currentPath]);
    } else if (globalThis.location.hash) {
        activateSection(globalThis.location.hash.substring(1));
    } else {
        activateSection('section-1rm');
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
        const reps = Number.parseInt(advRepsInput.value);

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
        const reps = Number.parseInt(repsRirInput.value);
        const rir = Number.parseFloat(rirRirInput.value) || 0;
        const tReps = Number.parseInt(targetRepsRirInput.value) || 1;
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

        for (let i = 0; i < cachedStateInputs.length; i++) {
            const el = cachedStateInputs[i];
            state.inputs[el.id] = el.value;
        }

        localStorage.setItem('peakloads_state', JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem('peakloads_state');
        if (saved) {
            try {
                const state = JSON.parse(saved);

                if (state.language) {
                    langSelect.value = state.language;
                    I18n.setLanguage(state.language);
                }

                if (state.unit) {
                    currentUnit = state.unit;
                    for (let i = 0; i < unitBtns.length; i++) {
                        const btn = unitBtns[i];
                        btn.classList.toggle('active', btn.id === `btn-${currentUnit}`);
                    }
                }

                if (state.inputs) {
                    // NOSONAR - Zero-allocation requires avoiding Object.keys() array generation
                    for (const id in state.inputs) {
                        if (Object.prototype.hasOwnProperty.call(state.inputs, id)) {
                            const el = stateInputsById[id];
                            if (el) el.value = state.inputs[id];
                        }
                    }
                }

                // Prioritize explicit SEO URL over saved local state hash
                if (seoRoutes[globalThis.location.pathname]) {
                    activateSection(seoRoutes[globalThis.location.pathname]);
                } else if (state.hash) {
                    if (!globalThis.location.hash || globalThis.location.hash !== state.hash) {
                        globalThis.location.hash = state.hash;
                    }
                    activateSection(state.hash.substring(1));
                }

                // Trigger calculations to restore UI tables silently safely
                setTimeout(() => {
                    if (weight1rmInput.value && reps1rmInput.value) btnCalc1rm.click();
                    if (weightAdv1rmInput.value && repsAdv1rmInput.value && rpeAdv1rmInput.value) btnCalcAdv1rm.click();
                    if (baseWeightPctInput.value) btnGenPct.click();
                    if (topSetWarmupInput.value) btnGenWarmup.click();
                    if (advWeightInput.value && advRepsInput.value) btnGenAdvWarmup.click();
                    if (weightRirInput.value && repsRirInput.value) btnCalcRir.click();
                }, 50);

            } catch (e) {
                console.error("Failed to restore state", e);
                localStorage.removeItem('peakloads_state');
                globalThis.alert("Failed to restore previous session state. Your session has been reset.");
            }
        }
    }

    function updateUnitDisplays() {
        for (let i = 0; i < staticUnitDisplays.length; i++) {
            staticUnitDisplays[i].textContent = currentUnit;
        }
    }

    function convertAllInputs(oldUnit, newUnit) {
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
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const tr = document.createElement('tr');
            for (let j = 0; j < columns.length; j++) {
                tr.appendChild(columns[j](row));
            }
            fragment.appendChild(tr);
        }
        tbody.replaceChildren(fragment);
    }

    function renderPercentageTable(data) {
        renderTableData(tableBodyPct, data, [
            row => createTextCell(`${row.percent}%`),
            row => createWeightCell(row.weight)
        ]);
    }

    function renderWarmupTable(data) {
        renderTableData(tableBodyWarmup, data, [
            row => createTextCell(`${row.percent}%`),
            row => createWeightCell(row.weight),
            row => createTextCell(row.reps)
        ]);
    }

    function renderAdvWarmupTable(data) {
        renderTableData(tableBodyAdvWarmup, data, [
            row => createTextCell(row.stage),
            row => createTextCell(row.purposeStr),
            row => createTextCell(row.percent === '-' ? '-' : `${row.percent}%`),
            row => createWeightCell(row.weight, row.percent !== '-'),
            row => createTextCell(row.reps),
            row => createTextCell(row.notes, { fontSize: '0.9em', opacity: '0.8' })
        ]);
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
