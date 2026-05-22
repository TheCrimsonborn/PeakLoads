/**
 * peakloads Calculator Logic
 */

const KG_TO_LB = 2.2046226218;

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

const ADV_SETS_LOW_REPS = [
    { percent: 0, reps: "10-15", purposeKey: "jointPrep" },
    { percent: 45, reps: 5, purposeKey: "activation" },
    { percent: 65, reps: 3, purposeKey: "skill" },
    { percent: 80, reps: 2, purposeKey: "acclimatization" },
    { percent: 90, reps: 1, purposeKey: "potentiation" },
];

const ADV_SETS_HIGH_REPS = [
    { percent: 0, reps: "10-15", purposeKey: "jointPrep" },
    { percent: 45, reps: 8, purposeKey: "activation" },
    { percent: 65, reps: 5, purposeKey: "skill" },
    { percent: 80, reps: 3, purposeKey: "acclimatization" },
    { percent: 90, reps: 1, purposeKey: "potentiation" },
];

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

    // Percentage Chart Generator (Base weight in current unit)
    generatePercentageTable: (baseWeight, increment, min, max, unit) => {
        baseWeight = Number.parseFloat(baseWeight);
        increment = Number.parseFloat(increment);
        min = Number.parseFloat(min);
        max = Number.parseFloat(max);

        if (!baseWeight || !increment || increment < 0.01 || min > max) return [];

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

        const sets = [];
        const selectedTemplate = WARMUP_TEMPLATES[template] || WARMUP_TEMPLATES.classic;

        selectedTemplate.forEach(step => {
            const rawWeight = topSet * (step.percent / 100);
            sets.push({
                percent: step.percent,
                weight: Calculator.roundWeight(rawWeight, unit),
                reps: step.reps
            });
        });

        return sets;
    },

    // Advanced Warm Up Generator
    generateAdvancedWarmUp: (liftType, mainWeight, mainReps, cuesObj, purposesObj, unit) => {
        mainWeight = Number.parseFloat(mainWeight);
        mainReps = Number.parseInt(mainReps);
        if (!mainWeight || !mainReps) return [];

        const sets = mainReps < 6 ? ADV_SETS_LOW_REPS : ADV_SETS_HIGH_REPS;
        const plan = [];

        sets.forEach((set, index) => {
            let setWeight = mainWeight * (set.percent / 100);
            let weightLabel = Calculator.roundWeight(setWeight, unit);
            let percentLabel = set.percent;

            if (set.percent === 0) {
                weightLabel = unit === 'kg' ? 20 : 45; // Standard bar
                percentLabel = "-";
            }

            plan.push({
                stage: index + 1,
                purposeStr: purposesObj[set.purposeKey],
                percent: percentLabel,
                weight: weightLabel,
                reps: set.reps,
                notes: cuesObj[set.purposeKey]
            });
        });

        return plan;
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
