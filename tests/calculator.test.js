import assert from 'assert';
import Calculator from '../js/calculator.js';

function runTests() {
    console.log('Running tests for calculate1RM...');
    let passed = 0;
    let failed = 0;

    const assertTest = (name, testFn) => {
        try {
            testFn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (error) {
            console.error(`❌ ${name}`);
            console.error(error);
            failed++;
        }
    };

    // Edge Cases
    assertTest('Edge: 0 weight should return 0', () => {
        assert.strictEqual(Calculator.calculate1RM(0, 5), 0);
    });

    assertTest('Edge: negative weight should return 0', () => {
        assert.strictEqual(Calculator.calculate1RM(-10, 5), 0);
    });

    assertTest('Edge: 0 reps should return 0', () => {
        assert.strictEqual(Calculator.calculate1RM(100, 0), 0);
    });

    assertTest('Edge: negative reps should return 0', () => {
        assert.strictEqual(Calculator.calculate1RM(100, -5), 0);
    });

    assertTest('Edge: falsy inputs should return 0', () => {
        assert.strictEqual(Calculator.calculate1RM(null, undefined), 0);
        assert.strictEqual(Calculator.calculate1RM('', ''), 0);
    });

    assertTest('Edge: 1 rep should return exactly the weight', () => {
        assert.strictEqual(Calculator.calculate1RM(100, 1), 100);
        assert.strictEqual(Calculator.calculate1RM(135.5, 1), 135.5);
    });

    assertTest('Edge: Brzycki formula with reps >= 37 returns 0', () => {
        assert.strictEqual(Calculator.calculate1RM(100, 37, 'brzycki'), 0);
        assert.strictEqual(Calculator.calculate1RM(100, 40, 'brzycki'), 0);
    });

    // Formulas
    assertTest('Formula: Epley (default) calculates correctly', () => {
        // 100 * (1 + 5/30) = 116.666... rounded to 116.7
        assert.strictEqual(Calculator.calculate1RM(100, 5), 116.7);
        assert.strictEqual(Calculator.calculate1RM(100, 5, 'epley'), 116.7);
    });

    assertTest('Formula: Brzycki calculates correctly', () => {
        // 100 * (36 / (37 - 5)) = 100 * (36 / 32) = 112.5
        assert.strictEqual(Calculator.calculate1RM(100, 5, 'brzycki'), 112.5);
    });

    assertTest('Formula: Lombardi calculates correctly', () => {
        // 100 * (5 ** 0.1) = 100 * 1.1746... = 117.4618... rounded to 117.5
        assert.strictEqual(Calculator.calculate1RM(100, 5, 'lombardi'), 117.5);
    });

    assertTest('Inputs as strings are parsed correctly', () => {
        assert.strictEqual(Calculator.calculate1RM('100', '5', 'epley'), 116.7);
    });

    console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
import test from 'node:test';
test('Calculator - Unit Conversion', async (t) => {
    await t.test('toKg', () => {
        assert.strictEqual(Calculator.toKg(100, 'kg'), 100);
        assert.strictEqual(Math.round(Calculator.toKg(220.46226218, 'lb')), 100);
    });

    await t.test('fromKg', () => {
        assert.strictEqual(Calculator.fromKg(100, 'kg'), 100);
        assert.strictEqual(Math.round(Calculator.fromKg(100, 'lb')), 220);
    });
});

test('Calculator - roundWeight', async (t) => {
    await t.test('rounds to 2.5kg for kg', () => {
        assert.strictEqual(Calculator.roundWeight(101, 'kg'), 100);
        assert.strictEqual(Calculator.roundWeight(101.5, 'kg'), 102.5);
        assert.strictEqual(Calculator.roundWeight(104, 'kg'), 105);
    });

    await t.test('rounds to 5lb for lb', () => {
        assert.strictEqual(Calculator.roundWeight(202, 'lb'), 200);
        assert.strictEqual(Calculator.roundWeight(203, 'lb'), 205);
        assert.strictEqual(Calculator.roundWeight(206, 'lb'), 205);
        assert.strictEqual(Calculator.roundWeight(208, 'lb'), 210);
    });
});

test('Calculator - calculate1RM', async (t) => {
    await t.test('handles invalid inputs', () => {
        assert.strictEqual(Calculator.calculate1RM(0, 5), 0);
        assert.strictEqual(Calculator.calculate1RM(100, 0), 0);
        assert.strictEqual(Calculator.calculate1RM(-100, 5), 0);
        assert.strictEqual(Calculator.calculate1RM(100, -5), 0);
    });

    await t.test('returns weight for 1 rep', () => {
        assert.strictEqual(Calculator.calculate1RM(100, 1), 100);
    });

    await t.test('calculates Epley (default)', () => {
        assert.strictEqual(Calculator.calculate1RM(100, 5, 'epley'), 116.7);
        assert.strictEqual(Calculator.calculate1RM(100, 5), 116.7);
    });

    await t.test('calculates Brzycki', () => {
        assert.strictEqual(Calculator.calculate1RM(100, 5, 'brzycki'), 112.5);
    });

    await t.test('Brzycki caps at 37 reps', () => {
        assert.strictEqual(Calculator.calculate1RM(100, 37, 'brzycki'), 0);
    });

    await t.test('calculates Lombardi', () => {
        assert.strictEqual(Calculator.calculate1RM(100, 5, 'lombardi'), 117.5); // 100 * 5^0.1 = 117.46
    });
});

test('Calculator - generatePercentageTable', async (t) => {
    await t.test('handles invalid inputs', () => {
        assert.deepStrictEqual(Calculator.generatePercentageTable(0, 5, 50, 100, 'kg'), []);
        assert.deepStrictEqual(Calculator.generatePercentageTable(100, 0, 50, 100, 'kg'), []);
        assert.deepStrictEqual(Calculator.generatePercentageTable(100, 5, 100, 50, 'kg'), []);
        assert.deepStrictEqual(Calculator.generatePercentageTable(100, 5, -10, 100, 'kg'), []);
        assert.deepStrictEqual(Calculator.generatePercentageTable(100, 5, 0, -10, 'kg'), []);
        assert.deepStrictEqual(Calculator.generatePercentageTable(100, 5, NaN, 100, 'kg'), []);
        assert.deepStrictEqual(Calculator.generatePercentageTable(100, 5, 0, NaN, 'kg'), []);
    });

    await t.test('prevents infinite loops', () => {
        assert.deepStrictEqual(Calculator.generatePercentageTable(100, 0.009, 0, 100, 'kg'), []); // < 0.01 limit
        assert.strictEqual(Calculator.generatePercentageTable(100, 0.01, 0, 0.1, 'kg').length, 11); // exactly 0.01 increment allowed
        assert.deepStrictEqual(Calculator.generatePercentageTable(100, 0.099, 0, 100, 'kg'), []); // > 1000 iterations limit exactly
        assert.strictEqual(Calculator.generatePercentageTable(100, 0.1, 0, 100, 'kg').length, 1001); // exactly 1000 iterations allowed
    });

    await t.test('generates valid table for kg', () => {
        const table = Calculator.generatePercentageTable(100, 5, 90, 100, 'kg');
        assert.deepStrictEqual(table, [
            { percent: 90, weight: 90 },
            { percent: 95, weight: 95 },
            { percent: 100, weight: 100 }
        ]);
    });

    await t.test('generates valid table for lb', () => {
        const table = Calculator.generatePercentageTable(200, 10, 80, 100, 'lb');
        assert.deepStrictEqual(table, [
            { percent: 80, weight: 160 },
            { percent: 90, weight: 180 },
            { percent: 100, weight: 200 }
        ]);
    });
});

test('Calculator - generateWarmUp', async (t) => {
    await t.test('handles invalid input', () => {
        assert.deepStrictEqual(Calculator.generateWarmUp(0, 'classic', 'kg'), []);
    });

    await t.test('generates classic template by default', () => {
        const expected = [
            { percent: 40, weight: 40, reps: 5 },
            { percent: 55, weight: 55, reps: 5 },
            { percent: 65, weight: 65, reps: 3 },
            { percent: 75, weight: 75, reps: 3 },
            { percent: 85, weight: 85, reps: 2 },
        ];
        assert.deepStrictEqual(Calculator.generateWarmUp(100, 'unknown_template', 'kg'), expected);
    });

    await t.test('generates heavy template', () => {
        const expected = [
            { percent: 30, weight: 60, reps: 5 },
            { percent: 50, weight: 100, reps: 3 },
            { percent: 65, weight: 130, reps: 3 },
            { percent: 75, weight: 150, reps: 2 },
            { percent: 85, weight: 170, reps: 1 },
            { percent: 92, weight: 185, reps: 1 },
        ];
        assert.deepStrictEqual(Calculator.generateWarmUp(200, 'heavy', 'kg'), expected);
    });
});

test('Calculator - generateAdvancedWarmUp', async (t) => {
    const cuesObj = {
        jointPrep: "Mobility",
        activation: "Activate",
        skill: "Technique",
        acclimatization: "Acclimate",
        potentiation: "Potentiate"
    };
    const purposesObj = {
        jointPrep: "Joint Prep",
        activation: "Activation",
        skill: "Skill",
        acclimatization: "Acclimatization",
        potentiation: "Potentiation"
    };

    await t.test('handles invalid input', () => {
        assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('squat', 0, 5, cuesObj, purposesObj, 'kg'), []);
        assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('squat', 100, 0, cuesObj, purposesObj, 'kg'), []);
    });

    await t.test('generates plan using standard reps for low mainReps (< 6)', () => {
        const plan = Calculator.generateAdvancedWarmUp('squat', 100, 5, cuesObj, purposesObj, 'kg');
        assert.strictEqual(plan.length, 5);
        assert.strictEqual(plan[0].percent, "-");
        assert.strictEqual(plan[0].weight, 20); // Empty bar in kg
        assert.strictEqual(plan[0].reps, "10-15");

        assert.strictEqual(plan[1].percent, 45);
        assert.strictEqual(plan[1].weight, 45);
        assert.strictEqual(plan[1].reps, 5);
        assert.strictEqual(plan[1].purposeStr, "Activation");
        assert.strictEqual(plan[1].notes, "Activate");
    });

    await t.test('generates plan using high reps for mainReps (>= 6)', () => {
        const plan = Calculator.generateAdvancedWarmUp('squat', 100, 8, cuesObj, purposesObj, 'lb');
        assert.strictEqual(plan[0].weight, 45); // Empty bar in lb
        assert.strictEqual(plan[0].reps, "10-15");

        assert.strictEqual(plan[1].percent, 45);
        assert.strictEqual(plan[1].weight, 45);
        assert.strictEqual(plan[1].reps, 8); // highReps
    });
});

test('Calculator - calculateRIR', async (t) => {
    await t.test('handles invalid inputs', () => {
        assert.deepStrictEqual(Calculator.calculateRIR({ weight: 0, reps: 5, rir: 2, targetReps: 5, targetRIR: 2, unit: 'kg' }), { est1RM: 0, nextWeight: 0 });
        assert.deepStrictEqual(Calculator.calculateRIR({ weight: 100, reps: 0, rir: 2, targetReps: 5, targetRIR: 2, unit: 'kg' }), { est1RM: 0, nextWeight: 0 });
        assert.deepStrictEqual(Calculator.calculateRIR({ weight: 100, reps: 5, rir: -1, targetReps: 5, targetRIR: 2, unit: 'kg' }), { est1RM: 0, nextWeight: 0 });
        assert.deepStrictEqual(Calculator.calculateRIR({ weight: 100, reps: 5, rir: 2, targetReps: 0, targetRIR: 2, unit: 'kg' }), { est1RM: 0, nextWeight: 0 });
        assert.deepStrictEqual(Calculator.calculateRIR({ weight: 100, reps: 5, rir: 2, targetReps: 5, targetRIR: -1, unit: 'kg' }), { est1RM: 0, nextWeight: 0 });
    });

    await t.test('calculates correct next weight and est1RM', () => {
        // current: 100kg x 5 reps @ 2 RIR -> Reps to failure = 7
        // est1RM = 100 * (1 + 7/30) = 123.3
        // target: 8 reps @ 1 RIR -> Target reps to failure = 9
        // denominator = 1 + 9/30 = 1.3
        // nextWeightRaw = 123.333 / 1.3 = 94.87 -> round to 95

        const result = Calculator.calculateRIR({ weight: 100, reps: 5, rir: 2, targetReps: 8, targetRIR: 1, unit: 'kg' });
        assert.strictEqual(result.est1RM, 123.3);
        assert.strictEqual(result.nextWeight, 95);
    });
});
console.log("Running Calculator.calculateRIR tests...");
console.log("- It calculates est1RM and nextWeight correctly (kg)");
// weight=100, reps=5, rir=1 -> failure at 6 reps -> 100 * (1 + 6/30) = 120
// targetReps=3, targetRIR=1 -> failure at 4 reps -> 1 + 4/30 = 34/30
// nextWeight = 120 / (34/30) = 105.882... -> roundWeight(105.882, 'kg') -> 105
assert.deepEqual(
    Calculator.calculateRIR({ weight: 100, reps: 5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' }),
    { est1RM: 120, nextWeight: 105 }
);

console.log("- It calculates est1RM and nextWeight correctly (lb)");
// 120 * (1 + 6/30) = 144
// nextWeight = 144 / (34/30) = 127.058... -> roundWeight(127.058, 'lb') -> 125
assert.deepEqual(
    Calculator.calculateRIR({ weight: 120, reps: 5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'lb' }),
    { est1RM: 144, nextWeight: 125 }
);

// 2. Parsing string inputs
console.log("- It handles string inputs by parsing them to numbers");
assert.deepEqual(
    Calculator.calculateRIR({ weight: "100", reps: "5", rir: "1", targetReps: "3", targetRIR: "1", unit: 'kg' }),
    { est1RM: 120, nextWeight: 105 }
);

// 3. Invalid inputs
console.log("- It handles missing, zero, or negative inputs");
const invalidCases = [
    { weight: 0, reps: 5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' },       // zero weight
    { weight: -100, reps: 5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' },    // negative weight
    { weight: 100, reps: 0, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' },     // zero reps
    { weight: 100, reps: -5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' },    // negative reps
    { weight: 100, reps: 5, rir: -1, targetReps: 3, targetRIR: 1, unit: 'kg' },    // negative rir
    { weight: 100, reps: 5, rir: 1, targetReps: 0, targetRIR: 1, unit: 'kg' },     // zero target reps
    { weight: 100, reps: 5, rir: 1, targetReps: -3, targetRIR: 1, unit: 'kg' },    // negative target reps
    { weight: 100, reps: 5, rir: 1, targetReps: 3, targetRIR: -1, unit: 'kg' },    // negative target rir
    { weight: undefined, reps: 5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' }, // undefined weight
    { weight: null, reps: 5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' },    // null weight
    { weight: NaN, reps: 5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' },     // NaN weight
    { weight: "invalid", reps: 5, rir: 1, targetReps: 3, targetRIR: 1, unit: 'kg' } // non-numeric string
];

// NOSONAR - Array forEach is acceptable in unit tests arrays to run test cases concisely
invalidCases.forEach(args => {
    assert.deepEqual(
        Calculator.calculateRIR(args),
        { est1RM: 0, nextWeight: 0 }
    );
});

console.log("All tests passed! 🎉");
