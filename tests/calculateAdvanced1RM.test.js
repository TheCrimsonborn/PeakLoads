import test from 'node:test';
import assert from 'node:assert';
import Calculator from '../js/calculator.js';

test('Calculator - calculateAdvanced1RM', async (t) => {
    await t.test('handles invalid inputs', () => {
        assert.strictEqual(Calculator.calculateAdvanced1RM(0, 5, 9), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(100, 0, 9), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(100, 5, 0), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(-100, 5, 9), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(100, -5, 9), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(100, 5, -9), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(NaN, 5, 9), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(100, NaN, 9), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(100, 5, NaN), 0);
        assert.strictEqual(Calculator.calculateAdvanced1RM(null, undefined, ''), 0);
    });

    await t.test('calculates Layer 1 (RTS Matrix) correctly', () => {
        // weight=100, reps=5, rpe=9 -> key=590. RTS_MATRIX[590] = 84.
        // 100 / 0.84 = 119.04... rounded to 119
        assert.strictEqual(Calculator.calculateAdvanced1RM(100, 5, 9), 119);
    });

    await t.test('calculates Layer 2 (Asymptotic Decay) correctly', () => {
        // weight=100, reps=12, rpe=8.
        // rir = 2, effectiveReps = 14
        // percentage = 15.7 + 84.3 * Math.exp(-0.0346 * 14) = 67.63...
        // 100 / 0.6763... = 147.8... rounded to 147.9
        assert.strictEqual(Calculator.calculateAdvanced1RM(100, 12, 8), 147.9);
    });

    await t.test('parses string inputs correctly', () => {
        assert.strictEqual(Calculator.calculateAdvanced1RM("100", "5", "9"), 119);
        assert.strictEqual(Calculator.calculateAdvanced1RM("100", "12", "8"), 147.9);
    });
});
