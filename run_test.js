const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// See if we can find the rendering functions
console.log(mainJs.includes('td2.lastElementChild.textContent = currentUnit;'));
