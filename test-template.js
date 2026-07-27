const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html>
<body>
  <span class="unit-display">kg</span>
  <template id="tpl">
    <span class="unit-display">kg</span>
  </template>
</body>
`);
const document = dom.window.document;
const els = document.querySelectorAll('.unit-display');
console.log(els.length); // Should be 1
