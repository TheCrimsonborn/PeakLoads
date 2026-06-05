import Calculator from './js/calculator.js';

console.log("RPE 6.49:", Calculator.calculateAdvanced1RM(100, 5, 6.49, 7, 5));
console.log("RPE 8 string:", Calculator.calculateAdvanced1RM(100, 5, "8", 7, 5));
console.log("Invalid Sleep:", Calculator.calculateAdvanced1RM(100, 5, 8, "foo", 5));
console.log("Invalid Stress:", Calculator.calculateAdvanced1RM(100, 5, 8, 7, "bar"));
console.log("Sleep 100:", Calculator.calculateAdvanced1RM(100, 5, 8, 100, 5));
console.log("Sleep -5:", Calculator.calculateAdvanced1RM(100, 5, 8, -5, 5));
console.log("Stress 100:", Calculator.calculateAdvanced1RM(100, 5, 8, 7, 100));
console.log("Stress -5:", Calculator.calculateAdvanced1RM(100, 5, 8, 7, -5));
