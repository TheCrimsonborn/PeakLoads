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
