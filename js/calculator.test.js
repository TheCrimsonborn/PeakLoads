import assert from 'assert';
import Calculator from './calculator.js';

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
        // 100 * Math.pow(5, 0.1) = 100 * 1.1746... = 117.4618... rounded to 117.5
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
