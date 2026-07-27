const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><body>
<template id="t"><span class="unit-display"></span></template>
<span class="unit-display"></span>
</body>`);
const document = dom.window.document;
console.log(document.querySelectorAll('.unit-display').length);
