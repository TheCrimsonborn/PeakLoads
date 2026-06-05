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

console.log('\n--- Testing Calculator.calculate1RM ---');

runTest('Should calculate 1RM using epley formula', () => {
    // 100kg, 5 reps -> 100 * (1 + 5/30) = 116.666...
    const result = Calculator.calculate1RM(100, 5, 'epley');
    assert.strictEqual(result, 116.7);
});

runTest('Should calculate 1RM using lombardi formula', () => {
    // 100kg, 5 reps -> 100 * 5^0.1 = 117.46...
    const result = Calculator.calculate1RM(100, 5, 'lombardi');
    assert.strictEqual(result, 117.5);
});

runTest('Should calculate 1RM using brzycki formula', () => {
    // 100kg, 5 reps -> 100 * (36 / (37 - 5)) = 112.5
    const result = Calculator.calculate1RM(100, 5, 'brzycki');
    assert.strictEqual(result, 112.5);
});

runTest('Should handle calculate1RM brzycki edge case (reps >= 37)', () => {
    // Reps >= 37 should return 0 for brzycki
    const result37 = Calculator.calculate1RM(100, 37, 'brzycki');
    assert.strictEqual(result37, 0);

    const result40 = Calculator.calculate1RM(100, 40, 'brzycki');
    assert.strictEqual(result40, 0);
});

runTest('Should return input weight if reps is 1', () => {
    const resultEpley = Calculator.calculate1RM(100, 1, 'epley');
    assert.strictEqual(resultEpley, 100);

    const resultBrzycki = Calculator.calculate1RM(100, 1, 'brzycki');
    assert.strictEqual(resultBrzycki, 100);
});

runTest('Should return 0 for invalid weight or reps', () => {
    assert.strictEqual(Calculator.calculate1RM(0, 5, 'epley'), 0);
    assert.strictEqual(Calculator.calculate1RM(100, 0, 'epley'), 0);
    assert.strictEqual(Calculator.calculate1RM(-100, 5, 'epley'), 0);
    assert.strictEqual(Calculator.calculate1RM(100, -5, 'epley'), 0);
    assert.strictEqual(Calculator.calculate1RM(null, 5, 'epley'), 0);
    assert.strictEqual(Calculator.calculate1RM(100, undefined, 'epley'), 0);
});

runTest('Should parse string inputs for weight and reps', () => {
    const result = Calculator.calculate1RM('100', '5', 'epley');
    assert.strictEqual(result, 116.7);
});

console.log('\n--- Testing Calculator.generatePercentageTable ---');

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
    // Boundary condition: exactly 1000 iterations (max=1000, min=0, inc=1) -> 1000 iterations (passes)
    const result1000 = Calculator.generatePercentageTable(100, 1, 0, 1000, 'kg');
    assert.equal(result1000.length, 1001);

    // Boundary condition: exactly 1001 iterations (max=1001, min=0, inc=1) -> 1001 iterations (fails)
    const result1001 = Calculator.generatePercentageTable(100, 1, 0, 1001, 'kg');
    assert.deepEqual(result1001, []);

    // 100 - 0 = 100 / 0.05 = 2000 iterations (fails check)
    const result = Calculator.generatePercentageTable(100, 0.05, 0, 100, 'kg');
    assert.deepEqual(result, []);
});

runTest('Should handle min and max being the same', () => {
    const result = Calculator.generatePercentageTable(100, 5, 100, 100, 'kg');
    assert.equal(result.length, 1);
    assert.deepEqual(result[0], { percent: 100, weight: 100 });
});


const cuesObj = { jointPrep: 'J', activation: 'A', skill: 'S', acclimatization: 'C', potentiation: 'P' };
const purposesObj = { jointPrep: 'P_J', activation: 'P_A', skill: 'P_S', acclimatization: 'P_C', potentiation: 'P_P' };

console.log('\n--- Testing Calculator.generateAdvancedWarmUp ---');

runTest('Should generate warm up with low reps (reps < 6), unit kg', () => {
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

runTest('Should generate warm up with high reps (reps >= 6), unit lb', () => {
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

runTest('Should handle string inputs for weight and reps', () => {
    const result = Calculator.generateAdvancedWarmUp('Squat', '100.5', '5', cuesObj, purposesObj, 'kg');

    assert.strictEqual(result.length, 5);
    // 45% -> 100.5 * 0.45 = 45.225 -> rounded to nearest 2.5 = 45
    assert.deepStrictEqual(result[1], { stage: 2, purposeStr: 'P_A', percent: 45, weight: 45, reps: 5, notes: 'A' });
});

runTest('Should handle missing keys in cuesObj and purposesObj gracefully', () => {
    const incompleteCues = { jointPrep: 'J' }; // Missing other keys
    const incompletePurposes = { activation: 'P_A' };

    const result = Calculator.generateAdvancedWarmUp('Squat', 100, 5, incompleteCues, incompletePurposes, 'kg');

    assert.strictEqual(result.length, 5);
    // 0% - missing activation purpose, has jointPrep cue
    assert.strictEqual(result[0].notes, 'J');
    assert.strictEqual(result[0].purposeStr, undefined);

    // 45% - missing activation cue, has activation purpose
    assert.strictEqual(result[1].notes, undefined);
    assert.strictEqual(result[1].purposeStr, 'P_A');
});

runTest('Should handle floating point weights in lb (rounding to nearest 5)', () => {
    // 225.5lb * 0.45 = 101.475 -> rounded to nearest 5 = 100
    const result = Calculator.generateAdvancedWarmUp('Squat', 225.5, 5, cuesObj, purposesObj, 'lb');
    assert.strictEqual(result[1].weight, 100);
});

runTest('Should return empty array for 0 weight or 0 reps', () => {
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', 0, 5, cuesObj, purposesObj, 'kg'), []);
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', 100, 0, cuesObj, purposesObj, 'kg'), []);
});

runTest('Should return empty array for negative weight or negative reps', () => {
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', -100, 5, cuesObj, purposesObj, 'kg'), []);
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', 100, -5, cuesObj, purposesObj, 'kg'), []);
});

runTest('Should return empty array for NaN or invalid string inputs', () => {
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', NaN, NaN, cuesObj, purposesObj, 'kg'), []);
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', 'abc', 'def', cuesObj, purposesObj, 'kg'), []);
});

runTest('Should return empty array for null or undefined mainWeight or mainReps', () => {
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', null, undefined, cuesObj, purposesObj, 'kg'), []);
    assert.deepStrictEqual(Calculator.generateAdvancedWarmUp('Squat', undefined, null, cuesObj, purposesObj, 'kg'), []);
});


// Print Summary
console.log('\n--- Test Summary ---');
console.log(`Total:  ${testsPassed + testsFailed}`);
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed > 0) {
    process.exit(1);
} else {

}

console.log("\n--- Testing Calculator.calculateAdvanced1RM ---");
const advTests = [
    { name: "Should calculate with optimal RTS matrix values", run: () => Calculator.calculateAdvanced1RM(100, 5, 8) === 123.5 },
    { name: "Should fallback to baseline values on NaN modifiers", run: () => Calculator.calculateAdvanced1RM(100, 5, 8, "foo", "bar") === 123.5 },
    { name: "Should clamp sleepHours and stressLevel", run: () => {
        const resultLowSleep = Calculator.calculateAdvanced1RM(100, 5, 8, -5, 5);
        const resultHighStress = Calculator.calculateAdvanced1RM(100, 5, 8, 7, 100);
        return resultLowSleep > 0 && resultHighStress > 0;
    }},
    { name: "Should handle string inputs implicitly", run: () => Calculator.calculateAdvanced1RM("100", "5", "8", "7", "5") === 123.5 }
];

let advPassed = 0;
for (const t of advTests) {
    if (t.run()) {
        console.log(`✅ ${t.name}`);
        advPassed++;
    } else {
        console.log(`❌ ${t.name}`);
    }
}
console.log(`\nAdvanced 1RM Passed: ${advPassed}/${advTests.length}`);
