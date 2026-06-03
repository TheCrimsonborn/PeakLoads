import assert from 'assert';
import Calculator from '../js/calculator.js';

function runTests() {
    console.log("Running tests for Calculator.generateWarmUp...");
    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        try {
            fn();
            console.log(`✅ PASS: ${name}`);
            passed++;
        } catch (e) {
            console.error(`❌ FAIL: ${name}`);
            console.error(e);
            failed++;
        }
    }

    test("handles invalid inputs gracefully", () => {
        assert.deepStrictEqual(Calculator.generateWarmUp(null, 'classic', 'kg'), []);
        assert.deepStrictEqual(Calculator.generateWarmUp(0, 'classic', 'kg'), []);
        assert.deepStrictEqual(Calculator.generateWarmUp("abc", 'classic', 'kg'), []);
    });

    test("falls back to classic template when invalid template is provided", () => {
        const expected = [
            { percent: 40, weight: 40, reps: 5 },
            { percent: 55, weight: 55, reps: 5 },
            { percent: 65, weight: 65, reps: 3 },
            { percent: 75, weight: 75, reps: 3 },
            { percent: 85, weight: 85, reps: 2 },
        ];
        assert.deepStrictEqual(Calculator.generateWarmUp(100, 'nonexistent', 'kg'), expected);
    });

    test("generates correct warm-up sets for kg (2.5kg rounding)", () => {
        const topSet = 100; // 100kg
        const expected = [
            { percent: 40, weight: 40, reps: 5 },
            { percent: 55, weight: 55, reps: 5 },
            { percent: 65, weight: 65, reps: 3 },
            { percent: 75, weight: 75, reps: 3 },
            { percent: 85, weight: 85, reps: 2 },
        ];
        assert.deepStrictEqual(Calculator.generateWarmUp(topSet, 'classic', 'kg'), expected);

        // Edge rounding test
        // topSet: 105, 55% of 105 = 57.75, round to nearest 2.5 is 57.5
        const topSet2 = 105;
        const expected2 = [
            { percent: 40, weight: 42.5, reps: 5 },
            { percent: 55, weight: 57.5, reps: 5 },
            { percent: 65, weight: 67.5, reps: 3 },
            { percent: 75, weight: 80, reps: 3 }, // 75% of 105 = 78.75 -> round to nearest 2.5 is 80 (since 78.75 is exactly halfway between 77.5 and 80, wait. 78.75/2.5 = 31.5 -> Math.round(31.5) = 32 -> 32*2.5 = 80)
            { percent: 85, weight: 90, reps: 2 }, // 85% of 105 = 89.25 -> 89.25/2.5 = 35.7 -> 36 * 2.5 = 90
        ];
        assert.deepStrictEqual(Calculator.generateWarmUp(topSet2, 'classic', 'kg'), expected2);
    });

    test("generates correct warm-up sets for lb (5lb rounding)", () => {
        const topSet = 225; // 225lb
        const expected = [
            { percent: 40, weight: 90, reps: 5 },  // 40% of 225 = 90 -> 90
            { percent: 55, weight: 125, reps: 5 }, // 55% of 225 = 123.75 -> 123.75/5 = 24.75 -> 25*5 = 125
            { percent: 65, weight: 145, reps: 3 }, // 65% of 225 = 146.25 -> 146.25/5 = 29.25 -> 29*5 = 145
            { percent: 75, weight: 170, reps: 3 }, // 75% of 225 = 168.75 -> 168.75/5 = 33.75 -> 34*5 = 170
            { percent: 85, weight: 190, reps: 2 }, // 85% of 225 = 191.25 -> 191.25/5 = 38.25 -> 38*5 = 190
        ];
        assert.deepStrictEqual(Calculator.generateWarmUp(topSet, 'classic', 'lb'), expected);
    });

    test("generates correct warm-up sets for heavy template", () => {
        const topSet = 100;
        const expected = [
            { percent: 30, weight: 30, reps: 5 },
            { percent: 50, weight: 50, reps: 3 },
            { percent: 65, weight: 65, reps: 3 },
            { percent: 75, weight: 75, reps: 2 },
            { percent: 85, weight: 85, reps: 1 },
            { percent: 92, weight: 92.5, reps: 1 }, // 92% of 100 = 92 -> 92/2.5 = 36.8 -> 37*2.5 = 92.5
        ];
        assert.deepStrictEqual(Calculator.generateWarmUp(topSet, 'heavy', 'kg'), expected);
    });

    test("generates correct warm-up sets for volume template", () => {
        const topSet = 100;
        const expected = [
            { percent: 35, weight: 35, reps: 8 },
            { percent: 45, weight: 45, reps: 6 },
            { percent: 55, weight: 55, reps: 5 },
            { percent: 65, weight: 65, reps: 5 },
            { percent: 70, weight: 70, reps: 3 },
        ];
        assert.deepStrictEqual(Calculator.generateWarmUp(topSet, 'volume', 'kg'), expected);
    });

    console.log(`\nTests complete: ${passed} passed, ${failed} failed.`);
    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
