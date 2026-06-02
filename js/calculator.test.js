import assert from 'node:assert/strict';
import Calculator from './calculator.js';

console.log("Running Calculator.calculateRIR tests...");

// 1. Happy Paths
console.log("- It calculates est1RM and nextWeight correctly (kg)");
// weight=100, reps=5, rir=1 -> failure at 6 reps -> 100 * (1 + 6/30) = 120
// targetReps=3, targetRIR=1 -> failure at 4 reps -> 1 + 4/30 = 34/30
// nextWeight = 120 / (34/30) = 105.882... -> roundWeight(105.882, 'kg') -> 105
assert.deepEqual(
    Calculator.calculateRIR(100, 5, 1, 3, 1, 'kg'),
    { est1RM: 120, nextWeight: 105 }
);

console.log("- It calculates est1RM and nextWeight correctly (lb)");
// 120 * (1 + 6/30) = 144
// nextWeight = 144 / (34/30) = 127.058... -> roundWeight(127.058, 'lb') -> 125
assert.deepEqual(
    Calculator.calculateRIR(120, 5, 1, 3, 1, 'lb'),
    { est1RM: 144, nextWeight: 125 }
);

// 2. Parsing string inputs
console.log("- It handles string inputs by parsing them to numbers");
assert.deepEqual(
    Calculator.calculateRIR("100", "5", "1", "3", "1", 'kg'),
    { est1RM: 120, nextWeight: 105 }
);

// 3. Invalid inputs
console.log("- It handles missing, zero, or negative inputs");
const invalidCases = [
    [0, 5, 1, 3, 1, 'kg'],       // zero weight
    [-100, 5, 1, 3, 1, 'kg'],    // negative weight
    [100, 0, 1, 3, 1, 'kg'],     // zero reps
    [100, -5, 1, 3, 1, 'kg'],    // negative reps
    [100, 5, -1, 3, 1, 'kg'],    // negative rir
    [100, 5, 1, 0, 1, 'kg'],     // zero target reps
    [100, 5, 1, -3, 1, 'kg'],    // negative target reps
    [100, 5, 1, 3, -1, 'kg'],    // negative target rir
    [undefined, 5, 1, 3, 1, 'kg'], // undefined weight
    [null, 5, 1, 3, 1, 'kg'],    // null weight
    [NaN, 5, 1, 3, 1, 'kg'],     // NaN weight
    ["invalid", 5, 1, 3, 1, 'kg'] // non-numeric string
];

invalidCases.forEach(args => {
    assert.deepEqual(
        Calculator.calculateRIR(...args),
        { est1RM: 0, nextWeight: 0 }
    );
});

console.log("All tests passed! 🎉");
