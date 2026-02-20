/**
 * PeakLoad Calculator Logic
 */

const KG_TO_LB = 2.2046226218;

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
        weight = parseFloat(weight);
        reps = parseInt(reps);

        if (!weight || !reps) return 0;
        if (reps === 1) return weight;

        let oneRM = 0;
        switch (formula) {
            case 'brzycki':
                oneRM = weight * (36 / (37 - reps));
                break;
            case 'lombardi':
                oneRM = weight * Math.pow(reps, 0.10);
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
        baseWeight = parseFloat(baseWeight);
        increment = parseFloat(increment);
        min = parseFloat(min);
        max = parseFloat(max);

        if (!baseWeight) return [];

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
        topSet = parseFloat(topSet);
        if (!topSet) return [];

        const sets = [];
        const templates = {
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

        const selectedTemplate = templates[template] || templates.classic;

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
        mainWeight = parseFloat(mainWeight);
        mainReps = parseInt(mainReps);
        if (!mainWeight || !mainReps) return [];

        let sets = [];
        if (mainReps < 6) {
            sets = [
                { percent: 0, reps: "10-15", purposeKey: "jointPrep" },
                { percent: 45, reps: 5, purposeKey: "activation" },
                { percent: 65, reps: 3, purposeKey: "skill" },
                { percent: 80, reps: 2, purposeKey: "acclimatization" },
                { percent: 90, reps: 1, purposeKey: "potentiation" },
            ];
        } else {
            sets = [
                { percent: 0, reps: "10-15", purposeKey: "jointPrep" },
                { percent: 45, reps: 8, purposeKey: "activation" },
                { percent: 65, reps: 5, purposeKey: "skill" },
                { percent: 80, reps: 3, purposeKey: "acclimatization" },
                { percent: 90, reps: 1, purposeKey: "potentiation" },
            ];
        }

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
        weight = parseFloat(weight);
        reps = parseInt(reps);
        rir = parseFloat(rir);
        targetReps = parseInt(targetReps);
        targetRIR = parseFloat(targetRIR);

        if (!weight || !reps) return { est1RM: 0, nextWeight: 0 };

        // 1. Estimate 1RM from current set
        const repsToFailure = reps + rir;
        const est1RM = weight * (1 + repsToFailure / 30);

        // 2. Calculate target weight for next set
        const targetRepsToFailure = targetReps + targetRIR;
        const nextWeightRaw = est1RM / (1 + targetRepsToFailure / 30);

        return {
            est1RM: Math.round(est1RM * 10) / 10,
            nextWeight: Calculator.roundWeight(nextWeightRaw, unit)
        };
    }
};

// Expose to global scope
window.Calculator = Calculator;
