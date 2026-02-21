import Calculator from './calculator.js';
import I18n from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentUnit = 'kg'; // 'kg' or 'lb'

    // DOM Elements
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

    // --- Initialization ---
    loadState();
    updateUnitDisplays();

    // Auto-save state on user input
    document.addEventListener('input', saveState);
    document.addEventListener('change', saveState);

    // --- Event Listeners ---

    // Unit Toggle
    unitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('active')) return;

            const newUnit = btn.id === 'btn-kg' ? 'kg' : 'lb';

            // Convert inputs
            convertAllInputs(currentUnit, newUnit);

            unitBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentUnit = newUnit;
            updateUnitDisplays();
            saveState();

            // Recalculate any open results
            recalculateOpenResults();
        });
    });

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
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === `#${targetId}`) {
                btn.classList.add('active');
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });

        // Show Section
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === targetId) {
                sec.classList.add('active');
            }
        });
    }

    // Handle clicks on nav links
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jumpy scrolling
            const targetHash = btn.getAttribute('href');
            window.location.hash = targetHash; // Let hashchange event handle the UI update
        });
    });

    // Handle hash changes (back/forward buttons, direct links)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        activateSection(hash || 'section-1rm');
        saveState();
    });

    // Initial load: Check if there's a hash in the URL
    if (window.location.hash) {
        activateSection(window.location.hash.substring(1));
    } else {
        activateSection('section-1rm');
    }

    // 1RM Calculator
    btnCalc1rm.addEventListener('click', () => {
        const weight = weight1rmInput.value;
        const reps = reps1rmInput.value;
        const formula = formulaSelect.value;

        if (weight && reps) {
            const result = Calculator.calculate1RM(weight, reps, formula);
            val1rm.textContent = result;
            result1rmCard.classList.remove('hidden');
        }
    });

    // Percentage Chart
    btnGenPct.addEventListener('click', () => {
        const base = parseFloat(baseWeightPctInput.value);
        const inc = parseFloat(incrementPctInput.value);
        const min = parseFloat(rangeMinPctInput.value);
        const max = parseFloat(rangeMaxPctInput.value);

        if (base && inc && min && max) {
            const data = Calculator.generatePercentageTable(base, inc, min, max, currentUnit);
            renderPercentageTable(data);
            resultPctCard.classList.remove('hidden');
        }
    });

    // Warm-Up Planner
    btnGenWarmup.addEventListener('click', () => {
        const topSet = parseFloat(topSetWarmupInput.value);
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
        const weight = parseFloat(advWeightInput.value);
        const reps = parseInt(advRepsInput.value);

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
        const weight = parseFloat(weightRirInput.value);
        const reps = parseInt(repsRirInput.value);
        const rir = parseFloat(rirRirInput.value) || 0;
        const tReps = parseInt(targetRepsRirInput.value) || 1;
        const tRir = parseFloat(targetRirRirInput.value) || 0;

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
            hash: window.location.hash || '#section-1rm',
            inputs: {}
        };

        document.querySelectorAll('input, select').forEach(el => {
            if (el.id) state.inputs[el.id] = el.value;
        });

        localStorage.setItem('peakload_state', JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem('peakload_state');
        if (saved) {
            try {
                const state = JSON.parse(saved);

                if (state.language) {
                    langSelect.value = state.language;
                    I18n.setLanguage(state.language);
                }

                if (state.unit) {
                    currentUnit = state.unit;
                    unitBtns.forEach(btn => {
                        btn.classList.toggle('active', btn.id === `btn-${currentUnit}`);
                    });
                }

                if (state.inputs) {
                    Object.entries(state.inputs).forEach(([id, value]) => {
                        const el = document.getElementById(id);
                        if (el) el.value = value;
                    });
                }

                if (state.hash) {
                    if (!window.location.hash || window.location.hash !== state.hash) {
                        window.location.hash = state.hash;
                    }
                    activateSection(state.hash.substring(1));
                }

                // Trigger calculations to restore UI tables silently safely
                setTimeout(() => {
                    if (weight1rmInput.value && reps1rmInput.value) btnCalc1rm.click();
                    if (baseWeightPctInput.value) btnGenPct.click();
                    if (topSetWarmupInput.value) btnGenWarmup.click();
                    if (advWeightInput.value && advRepsInput.value) btnGenAdvWarmup.click();
                    if (weightRirInput.value && repsRirInput.value) btnCalcRir.click();
                }, 50);

            } catch (e) {
                console.error("Failed to restore state", e);
            }
        }
    }

    function updateUnitDisplays() {
        const displays = document.querySelectorAll('.unit-display');
        displays.forEach(el => el.textContent = currentUnit);
    }

    function convertAllInputs(oldUnit, newUnit) {
        const weightInputs = [
            weight1rmInput,
            baseWeightPctInput,
            topSetWarmupInput,
            advWeightInput,
            weightRirInput
        ];

        weightInputs.forEach(input => {
            if (input.value) {
                let kgValue = Calculator.toKg(parseFloat(input.value), oldUnit);
                let newValue = Calculator.fromKg(kgValue, newUnit);
                // Depending on the unit, step precision changes
                let step = newUnit === 'kg' ? 0.5 : 1;
                input.step = step;
                input.value = (Math.round(newValue / step) * step).toFixed(newUnit === 'kg' ? 1 : 0);
            }
        });
    }

    function recalculateOpenResults() {
        if (!result1rmCard.classList.contains('hidden')) btnCalc1rm.click();
        if (!resultPctCard.classList.contains('hidden')) btnGenPct.click();
        if (!resultWarmupCard.classList.contains('hidden')) btnGenWarmup.click();
        if (!resultAdvWarmupCard.classList.contains('hidden')) btnGenAdvWarmup.click();
        if (!resultRirCard.classList.contains('hidden')) btnCalcRir.click();
    }

    function renderPercentageTable(data) {
        tableBodyPct.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.percent}%</td>
                <td>${row.weight} <span class="unit-display">${currentUnit}</span></td>
            `;
            tableBodyPct.appendChild(tr);
        });
    }

    function renderWarmupTable(data) {
        tableBodyWarmup.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.percent}%</td>
                <td>${row.weight} <span class="unit-display">${currentUnit}</span></td>
                <td>${row.reps}</td>
            `;
            tableBodyWarmup.appendChild(tr);
        });
    }

    function renderAdvWarmupTable(data) {
        tableBodyAdvWarmup.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.stage}</td>
                <td>${row.purposeStr}</td>
                <td>${row.percent}${row.percent !== '-' ? '%' : ''}</td>
                <td>${row.weight} ${row.percent !== '-' ? `<span class="unit-display">${currentUnit}</span>` : ''}</td>
                <td>${row.reps}</td>
                <td style="font-size: 0.9em; opacity: 0.8">${row.notes}</td>
            `;
            tableBodyAdvWarmup.appendChild(tr);
        });
    }

    // Set current year in footer
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
});
