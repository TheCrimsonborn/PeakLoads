/**
 * peakloads Calculator Logic
 */

const KG_TO_LB = 2.2046226218;

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
    "1_10": 100, "1_9.5": 98, "1_9": 96, "1_8.5": 94, "1_8": 92, "1_7.5": 91, "1_7": 89, "1_6.5": 88,
    "2_10": 96, "2_9.5": 94, "2_9": 92, "2_8.5": 91, "2_8": 89, "2_7.5": 88, "2_7": 86, "2_6.5": 85,
    "3_10": 92, "3_9.5": 91, "3_9": 89, "3_8.5": 88, "3_8": 86, "3_7.5": 85, "3_7": 84, "3_6.5": 82,
    "4_10": 89, "4_9.5": 88, "4_9": 86, "4_8.5": 85, "4_8": 84, "4_7.5": 82, "4_7": 81, "4_6.5": 80,
    "5_10": 86, "5_9.5": 85, "5_9": 84, "5_8.5": 82, "5_8": 81, "5_7.5": 80, "5_7": 79, "5_6.5": 77,
    "6_10": 84, "6_9.5": 82, "6_9": 81, "6_8.5": 80, "6_8": 79, "6_7.5": 77, "6_7": 76, "6_6.5": 75,
    "7_10": 81, "7_9.5": 80, "7_9": 79, "7_8.5": 77, "7_8": 76, "7_7.5": 75, "7_7": 74, "7_6.5": 72,
    "8_10": 79, "8_9.5": 77, "8_9": 76, "8_8.5": 75, "8_8": 74, "8_7.5": 72, "8_7": 71, "8_6.5": 69,
    "9_10": 76, "9_9.5": 75, "9_9": 74, "9_8.5": 72, "9_8": 71, "9_7.5": 69, "9_7": 68, "9_6.5": 67,
    "10_10": 74, "10_9.5": 72, "10_9": 71, "10_8.5": 69, "10_8": 68, "10_7.5": 67, "10_7": 65, "10_6.5": 64
};

const Calculator = {
    // Unit Conversion
    toKg: (value, unit) => (unit === 'kg' ? value : value / KG_TO_LB),
    fromKg: (valueKg, unit) => (unit === 'kg' ? valueKg : valueKg * KG_TO_LB),

    // Rounding logic based on unit (2.5kg or 5lb steps)
    roundWeight: (weight, unit) => {
        if (unit === 'kg') {
            return Math.round(weight / 2.5) * 2.5;
        } else {
            return Math.round(weight / 5) * 5; // Typically 5lb jumps in plates
        }
    },

    // 1RM Formulas (Expects input in current unit, returns in current unit)
    calculate1RM: (weight, reps, formula = 'epley') => {
        weight = Number.parseFloat(weight);
        reps = Number.parseInt(reps);

        if (!weight || weight <= 0 || !reps || reps <= 0) return 0;
        if (reps === 1) return weight;

        let oneRM = 0;
        switch (formula) {
            case 'brzycki':
                if (reps >= 37) return 0;
                oneRM = weight * (36 / (37 - reps));
                break;
            case 'lombardi':
                oneRM = weight * Math.pow(reps, 0.1);
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
    calculateAdvanced1RM: (weight, reps, rpe, sleepHours = 7, stressLevel = 5) => {
        weight = Number.parseFloat(weight);
        reps = Number.parseInt(reps, 10);
        rpe = Number.parseFloat(rpe);
        sleepHours = Number.parseFloat(sleepHours);
        stressLevel = Number.parseFloat(stressLevel);

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
            const key = reps + "_" + rpe;
            percentage = RTS_MATRIX[key];
        }

        if (!percentage) {
            // Layer 2: Asymptotic Decay (Fallback)
            const rir = 10 - rpe;
            const effectiveReps = reps + rir;
            percentage = 15.7 + (84.3 * Math.exp(-0.0346 * effectiveReps));
        }

        const raw1RM = weight / (percentage / 100);

        // Layer 3: Autoregulation (Readiness)
        const sleepMod = 1 + ((sleepHours - 7) * 0.015);
        const stressMod = 1 + ((5 - stressLevel) * 0.02);
        
        const finalDailyE1RM = raw1RM * sleepMod * stressMod;

        return Math.round(finalDailyE1RM * 10) / 10;
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

        const table = [];
        for (let pct = min; pct <= max; pct += increment) {
            const rawWeight = baseWeight * (pct / 100);
            const weight = Calculator.roundWeight(rawWeight, unit);
            table.push({ percent: pct, weight: weight });
        }
        return table;
    },

    // Warm-Up Planner (Top set in current unit)
    generateWarmUp: (topSet, template, unit) => {
        topSet = Number.parseFloat(topSet);
        if (!topSet) return [];

        const selectedTemplate = WARMUP_TEMPLATES[template] || WARMUP_TEMPLATES.classic;

        // NOSONAR - Returning mapped arrays inline is acceptable for returning a small finite subset.
        return selectedTemplate.map(stepConf => {
            const rawWeight = topSet * (stepConf.percent / 100);
            return {
                percent: stepConf.percent,
                weight: Calculator.roundWeight(rawWeight, unit),
                reps: stepConf.reps
            };
        });
    },

    // Advanced Warm Up Generator
    generateAdvancedWarmUp: (liftType, mainWeight, mainReps, cuesObj, purposesObj, unit) => {
        mainWeight = Number.parseFloat(mainWeight);
        mainReps = Number.parseInt(mainReps);
        if (!mainWeight || mainWeight <= 0 || !mainReps || mainReps <= 0) return [];

        const result = new Array(ADV_WARMUP_SETS.length);
        for (let index = 0; index < ADV_WARMUP_SETS.length; index++) {
            const set = ADV_WARMUP_SETS[index];
            let weightLabel;
            let percentLabel;

            if (set.percent === 0) {
                weightLabel = unit === 'kg' ? 20 : 45; // Standard bar
                percentLabel = "-";
            } else {
                let setWeight = mainWeight * (set.percent / 100);
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
        reps = Number.parseInt(reps);
        rir = Number.parseFloat(rir);
        targetReps = Number.parseInt(targetReps);
        targetRIR = Number.parseFloat(targetRIR);

        if (!weight || weight <= 0 || !reps || reps <= 0 || rir < 0 || targetReps <= 0 || targetRIR < 0) {
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
