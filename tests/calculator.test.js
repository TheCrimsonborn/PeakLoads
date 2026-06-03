import assert from 'assert';
import Calculator from '../js/calculator.js';

let testsPassed = 0;
let testsFailed = 0;

function runTest(name, testFn) {
    try {
        testFn();
        console.log(`✅ ${name}`);
        testsPassed++;
    } catch (e) {
        console.error(`❌ ${name}`);
        console.error(e);
        testsFailed++;
    }
}

// Test generateAdvancedWarmUp

runTest('generateAdvancedWarmUp - low reps (reps < 6), unit kg', () => {
    const cuesObj = { jointPrep: 'J', activation: 'A', skill: 'S', acclimatization: 'C', potentiation: 'P' };
    const purposesObj = { jointPrep: 'P_J', activation: 'P_A', skill: 'P_S', acclimatization: 'P_C', potentiation: 'P_P' };

    const result = Calculator.generateAdvancedWarmUp('Squat', 100, 5, cuesObj, purposesObj, 'kg');

    assert.strictEqual(result.length, 5);
    // 0%
    assert.deepStrictEqual(result[0], { stage: 1, purposeStr: 'P_J', percent: '-', weight: 20, reps: '10-15', notes: 'J' });
    // 45%
    assert.deepStrictEqual(result[1], { stage: 2, purposeStr: 'P_A', percent: 45, weight: 45, reps: 5, notes: 'A' });
    // 65%
    assert.deepStrictEqual(result[2], { stage: 3, purposeStr: 'P_S', percent: 65, weight: 65, reps: 3, notes: 'S' });
    // 80%
    assert.deepStrictEqual(result[3], { stage: 4, purposeStr: 'P_C', percent: 80, weight: 80, reps: 2, notes: 'C' });
    // 90%
    assert.deepStrictEqual(result[4], { stage: 5, purposeStr: 'P_P', percent: 90, weight: 90, reps: 1, notes: 'P' });
});

runTest('generateAdvancedWarmUp - high reps (reps >= 6), unit lb', () => {
    const cuesObj = { jointPrep: 'J', activation: 'A', skill: 'S', acclimatization: 'C', potentiation: 'P' };
    const purposesObj = { jointPrep: 'P_J', activation: 'P_A', skill: 'P_S', acclimatization: 'P_C', potentiation: 'P_P' };

    const result = Calculator.generateAdvancedWarmUp('Deadlift', 200, 8, cuesObj, purposesObj, 'lb');

    assert.strictEqual(result.length, 5);
    // 0%
    assert.deepStrictEqual(result[0], { stage: 1, purposeStr: 'P_J', percent: '-', weight: 45, reps: '10-15', notes: 'J' });
    // 45% -> 200 * 0.45 = 90
    assert.deepStrictEqual(result[1], { stage: 2, purposeStr: 'P_A', percent: 45, weight: 90, reps: 8, notes: 'A' });
    // 65% -> 200 * 0.65 = 130
    assert.deepStrictEqual(result[2], { stage: 3, purposeStr: 'P_S', percent: 65, weight: 130, reps: 5, notes: 'S' });
    // 80% -> 200 * 0.80 = 160
    assert.deepStrictEqual(result[3], { stage: 4, purposeStr: 'P_C', percent: 80, weight: 160, reps: 3, notes: 'C' });
    // 90% -> 200 * 0.90 = 180
    assert.deepStrictEqual(result[4], { stage: 5, purposeStr: 'P_P', percent: 90, weight: 180, reps: 1, notes: 'P' });
});

runTest('generateAdvancedWarmUp - invalid inputs', () => {
    const cuesObj = { jointPrep: 'J', activation: 'A', skill: 'S', acclimatization: 'C', potentiation: 'P' };
    const purposesObj = { jointPrep: 'P_J', activation: 'P_A', skill: 'P_S', acclimatization: 'P_C', potentiation: 'P_P' };

    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', 0, 5, cuesObj, purposesObj, 'kg'), []);
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', 100, 0, cuesObj, purposesObj, 'kg'), []);
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', NaN, NaN, cuesObj, purposesObj, 'kg'), []);
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', null, undefined, cuesObj, purposesObj, 'kg'), []);
});

console.log(`\nTests completed: ${testsPassed} passed, ${testsFailed} failed.`);
if (testsFailed > 0) process.exit(1);
import assert from 'node:assert/strict';
import Calculator from '../js/calculator.js';

// Helper for running tests and tracking results
let passed = 0;
let failed = 0;

function runTest(name, fn) {
    try {
        fn();
        console.log(`✅ PASS: ${name}`);
        passed++;
    } catch (error) {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   ${error.message}`);
        failed++;
    }
}

console.log('--- Testing Calculator.generatePercentageTable ---');

// 1. Basic Functionality
runTest('Should generate a standard percentage table in kg', () => {
    // 100kg base weight, 5% increment, from 50% to 100%, in kg
    const result = Calculator.generatePercentageTable(100, 5, 50, 100, 'kg');
    assert.equal(result.length, 11);

    // 50% of 100kg = 50kg
    assert.deepEqual(result[0], { percent: 50, weight: 50 });
    // 55% of 100kg = 55kg
    assert.deepEqual(result[1], { percent: 55, weight: 55 });
    // 100% of 100kg = 100kg
    assert.deepEqual(result[10], { percent: 100, weight: 100 });
});

runTest('Should generate a standard percentage table in lb', () => {
    // 200lb base weight, 10% increment, from 70% to 100%, in lb
    const result = Calculator.generatePercentageTable(200, 10, 70, 100, 'lb');
    assert.equal(result.length, 4);

    // 70% of 200lb = 140lb
    assert.deepEqual(result[0], { percent: 70, weight: 140 });
    // 100% of 200lb = 200lb
    assert.deepEqual(result[3], { percent: 100, weight: 200 });
});

// 2. Rounding Logic Verification
runTest('Should properly round to nearest 2.5 in kg', () => {
    // 105kg base weight, 5% increment, from 80% to 85%
    // 80% of 105 = 84 => 85
    // 85% of 105 = 89.25 => 90
    const result = Calculator.generatePercentageTable(105, 5, 80, 85, 'kg');

    assert.equal(result[0].weight, 85);
    assert.equal(result[1].weight, 90);
});

runTest('Should properly round to nearest 5 in lb', () => {
    // 225lb base weight, 5% increment, from 80% to 85%
    // 80% of 225 = 180 => 180
    // 85% of 225 = 191.25 => 190
    const result = Calculator.generatePercentageTable(225, 5, 80, 85, 'lb');

    assert.equal(result[0].weight, 180);
    assert.equal(result[1].weight, 190);
});

// 3. String Parsing
runTest('Should handle string inputs correctly', () => {
    const result = Calculator.generatePercentageTable("100", "5", "50", "100", 'kg');
    assert.equal(result.length, 11);
    assert.deepEqual(result[0], { percent: 50, weight: 50 });
});

// 4. Edge Cases & Error Conditions
runTest('Should return empty array for missing/invalid baseWeight', () => {
    assert.deepEqual(Calculator.generatePercentageTable(0, 5, 50, 100, 'kg'), []);
    assert.deepEqual(Calculator.generatePercentageTable(null, 5, 50, 100, 'kg'), []);
    assert.deepEqual(Calculator.generatePercentageTable(undefined, 5, 50, 100, 'kg'), []);
    assert.deepEqual(Calculator.generatePercentageTable("invalid", 5, 50, 100, 'kg'), []);
});

runTest('Should return empty array for missing/invalid increment', () => {
    assert.deepEqual(Calculator.generatePercentageTable(100, 0, 50, 100, 'kg'), []);
    assert.deepEqual(Calculator.generatePercentageTable(100, -5, 50, 100, 'kg'), []);
    assert.deepEqual(Calculator.generatePercentageTable(100, null, 50, 100, 'kg'), []);
});

runTest('Should return empty array when increment is less than 0.01', () => {
    assert.deepEqual(Calculator.generatePercentageTable(100, 0.005, 50, 100, 'kg'), []);
});

runTest('Should return empty array when min is greater than max', () => {
    assert.deepEqual(Calculator.generatePercentageTable(100, 5, 100, 50, 'kg'), []);
});

runTest('Should prevent client-side DoS from excessive iterations (>1000)', () => {
    // 100 - 0 = 100 / 0.05 = 2000 iterations (fails check)
    const result = Calculator.generatePercentageTable(100, 0.05, 0, 100, 'kg');
    assert.deepEqual(result, []);

    // 100 - 0 = 100 / 0.1 = 1000 iterations (passes check)
    const result2 = Calculator.generatePercentageTable(100, 0.1, 0, 100, 'kg');
    assert.equal(result2.length, 1001); // min to max inclusive
});

runTest('Should handle min and max being the same', () => {
    const result = Calculator.generatePercentageTable(100, 5, 100, 100, 'kg');
    assert.equal(result.length, 1);
    assert.deepEqual(result[0], { percent: 100, weight: 100 });
});

// Print Summary
console.log('\n--- Test Summary ---');
console.log(`Total:  ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
