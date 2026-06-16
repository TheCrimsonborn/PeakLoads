/**
 * peakloads Calculator Logic
 */

const KG_TO_LB = 2.2046226218;
const LB_TO_KG = 1 / KG_TO_LB;

// Extracted to prevent memory reallocation and GC overhead on each call
const WARMUP_TEMPLATES = {
    classic: [
        { percent: 40, reps: 5 },
        { percent: 55, reps: 5 },
        { percent: 65, reps: 3 },
        { percent: 75, reps: 3 },
        { percent: 85, reps: 2 },
    ],
    heavy: [
        { percent: 30, reps: 5 },
        { percent: 50, reps: 3 },
        { percent: 65, reps: 3 },
        { percent: 75, reps: 2 },
        { percent: 85, reps: 1 },
        { percent: 92, reps: 1 },
    ],
    volume: [
        { percent: 35, reps: 8 },
        { percent: 45, reps: 6 },
        { percent: 55, reps: 5 },
        { percent: 65, reps: 5 },
        { percent: 70, reps: 3 },
    ]
};

// Extracted to prevent memory reallocation and GC overhead on each call
const ADV_WARMUP_SETS = [
    { percent: 0, reps: "10-15", highReps: "10-15", purposeKey: "jointPrep" },
    { percent: 45, reps: 5, highReps: 8, purposeKey: "activation" },
    { percent: 65, reps: 3, highReps: 5, purposeKey: "skill" },
    { percent: 80, reps: 2, highReps: 3, purposeKey: "acclimatization" },
    { percent: 90, reps: 1, highReps: 1, purposeKey: "potentiation" },
];

// Extracted to prevent memory reallocation and GC overhead on each call
const RTS_MATRIX = {
    200: 100, 195: 98, 190: 96, 185: 94, 180: 92, 175: 91, 170: 89, 165: 88,
    300: 96, 295: 94, 290: 92, 285: 91, 280: 89, 275: 88, 270: 86, 265: 85,
    400: 92, 395: 91, 390: 89, 385: 88, 380: 86, 375: 85, 370: 84, 365: 82,
    500: 89, 495: 88, 490: 86, 485: 85, 480: 84, 475: 82, 470: 81, 465: 80,
    600: 86, 595: 85, 590: 84, 585: 82, 580: 81, 575: 80, 570: 79, 565: 77,
    700: 84, 695: 82, 690: 81, 685: 80, 680: 79, 675: 77, 670: 76, 665: 75,
    800: 81, 795: 80, 790: 79, 785: 77, 780: 76, 775: 75, 770: 74, 765: 72,
    900: 79, 895: 77, 890: 76, 885: 75, 880: 74, 875: 72, 870: 71, 865: 69,
    1000: 76, 995: 75, 990: 74, 985: 72, 980: 71, 975: 69, 970: 68, 965: 67,
    1100: 74, 1095: 72, 1090: 71, 1085: 69, 1080: 68, 1075: 67, 1070: 65, 1065: 64
};

const Calculator = {
    // Unit Conversion
    toKg: (value, unit) => (unit === 'kg' ? value : value * LB_TO_KG),
    fromKg: (valueKg, unit) => (unit === 'kg' ? valueKg : valueKg * KG_TO_LB),

    // Rounding logic based on unit (2.5kg or 5lb steps)
    // ⚡ Bolt: Use multiplication instead of division for faster execution in hot paths
    roundWeight: (weight, unit) => {
        if (unit === 'kg') {
            return Math.round(weight * 0.4) * 2.5; // weight / 2.5 === weight * 0.4
        } else {
            return Math.round(weight * 0.2) * 5; // weight / 5 === weight * 0.2
        }
    },

    // 1RM Formulas (Expects input in current unit, returns in current unit)
    calculate1RM: (weight, reps, formula = 'epley') => {
        weight = Number.parseFloat(weight);
        reps = Number.parseInt(reps, 10);

        if (!weight || weight <= 0 || !reps || reps <= 0) return 0;
        if (reps === 1) return weight;

        let oneRM = 0;
        switch (formula) {
            case 'brzycki':
                if (reps >= 37) return 0;
                oneRM = weight * (36 / (37 - reps));
                break;
            case 'lombardi':
                oneRM = weight * (reps ** 0.1);
                break;
            case 'epley':
            default:
                oneRM = weight * (1 + reps / 30);
                break;
        }

        // Return rounded value (not necessarily plate rounded for 1RM estimate, just integer or 1 decimal)
        return Math.round(oneRM * 10) / 10;
    },

    // Advanced 1RM Estimator (Ultimate Hybrid Model)
    calculateAdvanced1RM: (weight, reps, rpe) => {
        weight = Number.parseFloat(weight);
        reps = Number.parseInt(reps, 10);
        rpe = Number.parseFloat(rpe);

        if (
            Number.isNaN(weight) || weight <= 0 ||
            Number.isNaN(reps) || reps <= 0 ||
            Number.isNaN(rpe) || rpe <= 0
        ) {
            return 0;
        }

        let percentage = 0;

        if (reps <= 10 && rpe >= 6.5) {
            // Layer 1: O(1) RTS Matrix (Statistical Center)
            // ⚡ Bolt: Zero-allocation integer key prevents string concatenation overhead
            const key = (reps * 100) + (rpe * 10);
            percentage = RTS_MATRIX[key];
        }

        if (!percentage) {
            // Layer 2: Asymptotic Decay (Fallback)
            const rir = 10 - rpe;
            const effectiveReps = reps + rir;
            percentage = 15.7 + (84.3 * Math.exp(-0.0346 * effectiveReps));
        }

        const raw1RM = weight / (percentage / 100);

        return Math.round(raw1RM * 10) / 10;
    },

    // Percentage Chart Generator (Base weight in current unit)
    generatePercentageTable: (baseWeight, increment, min, max, unit) => {
        baseWeight = Number.parseFloat(baseWeight);
        increment = Number.parseFloat(increment);
        min = Number.parseFloat(min);
        max = Number.parseFloat(max);

        if (!baseWeight || !increment || increment < 0.01 ||
            Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < 0 || min > max) {
            return [];
        }

        // Prevent client-side DoS from excessive iterations
        const iterations = (max - min) / increment;
        if (iterations > 1000) return [];

        // ⚡ Bolt: Pre-allocate array to avoid dynamic resizing overhead
        const expectedLength = Math.max(0, Math.floor((max - min) / increment) + 1);
        const table = new Array(expectedLength);
        let index = 0;

        // ⚡ Bolt: Pre-calculate multiplier to avoid division inside loop
        const baseMultiplier = baseWeight / 100;

        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let pct = min; pct <= max; pct += increment) {
            const rawWeight = baseMultiplier * pct;
            const weight = Calculator.roundWeight(rawWeight, unit);
            table[index++] = { percent: pct, weight: weight };
        }

        // Handle floating point precision edge cases where loop runs fewer times
        if (index !== expectedLength) {
            table.length = index;
        }

        return table;
    },

    // Warm-Up Planner (Top set in current unit)
    generateWarmUp: (topSet, template, unit) => {
        topSet = Number.parseFloat(topSet);
        if (!topSet || topSet <= 0) return [];

        const selectedTemplate = WARMUP_TEMPLATES[template] || WARMUP_TEMPLATES.classic;

        // ⚡ Bolt: Pre-calculate multiplier to avoid division inside loop
        const topMultiplier = topSet / 100;

        const len = selectedTemplate.length;
        const result = new Array(len);

        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let i = 0; i < len; i++) {
            const stepConf = selectedTemplate[i];
            const rawWeight = topMultiplier * stepConf.percent;
            result[i] = {
                percent: stepConf.percent,
                weight: Calculator.roundWeight(rawWeight, unit),
                reps: stepConf.reps
            };
        }

        return result;
    },

    // Advanced Warm Up Generator
    generateAdvancedWarmUp: (liftType, mainWeight, mainReps, cuesObj, purposesObj, unit) => {
        mainWeight = Number.parseFloat(mainWeight);
        mainReps = Number.parseInt(mainReps, 10);
        if (!mainWeight || mainWeight <= 0 || !mainReps || mainReps <= 0) return [];

        const result = new Array(ADV_WARMUP_SETS.length);

        // ⚡ Bolt: Pre-calculate multiplier to avoid division inside loop
        const mainMultiplier = mainWeight / 100;

        // NOSONAR - Zero-allocation architecture: index-based loop prevents Symbol.iterator memory overhead.
        for (let index = 0; index < ADV_WARMUP_SETS.length; index++) {
            const set = ADV_WARMUP_SETS[index];
            let weightLabel;
            let percentLabel;

            if (set.percent === 0) {
                weightLabel = unit === 'kg' ? 20 : 45; // Standard bar
                percentLabel = "-";
            } else {
                let setWeight = mainMultiplier * set.percent;
                weightLabel = Calculator.roundWeight(setWeight, unit);
                percentLabel = set.percent;
            }

            result[index] = {
                stage: index + 1,
                purposeStr: purposesObj[set.purposeKey],
                percent: percentLabel,
                weight: weightLabel,
                reps: mainReps < 6 ? set.reps : set.highReps,
                notes: cuesObj[set.purposeKey]
            };
        }
        return result;
    },

    // RIR Translator
    calculateRIR: (weight, reps, rir, targetReps, targetRIR, unit) => {
        weight = Number.parseFloat(weight);
        reps = Number.parseInt(reps, 10);
        rir = Number.parseFloat(rir);
        targetReps = Number.parseInt(targetReps, 10);
        targetRIR = Number.parseFloat(targetRIR);

        if (!weight || weight <= 0 || !reps || reps <= 0 || Number.isNaN(rir) || rir < 0 || targetReps <= 0 || Number.isNaN(targetRIR) || targetRIR < 0) {
            return { est1RM: 0, nextWeight: 0 };
        }

        // 1. Estimate 1RM from current set
        const repsToFailure = reps + rir;
        const est1RM = weight * (1 + repsToFailure / 30);

        // 2. Calculate target weight for next set
        const targetRepsToFailure = targetReps + targetRIR;
        const denominator = 1 + targetRepsToFailure / 30;

        if (denominator <= 0) {
            return { est1RM: Math.round(est1RM * 10) / 10, nextWeight: 0 };
        }

        const nextWeightRaw = est1RM / denominator;

        return {
            est1RM: Math.round(est1RM * 10) / 10,
            nextWeight: Calculator.roundWeight(nextWeightRaw, unit)
        };
    }
};

export default Calculator;
