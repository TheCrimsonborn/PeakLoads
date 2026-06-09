const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { setupMockDOM, teardownMockDOM } = require('./dom-mock.cjs');

describe('I18n module tests', () => {

    beforeEach(() => {
        setupMockDOM();

        // Add elements to test dataset updating
        const el1 = document.createElement('h1');
        el1.setAttribute('data-i18n', 'title_1rm');
        const el2 = document.createElement('p');
        el2.setAttribute('data-i18n', 'nav_warmup');
        document.elements.push(el1, el2);
    });

    afterEach(() => {
        teardownMockDOM();
    });

    test('setLanguage updates document lang, currentLang and triggers updateDOM', async () => {
        const I18n = (await import('../i18n.js?t=' + Date.now())).default;

        // Before
        assert.strictEqual(I18n.currentLang, 'en');
        assert.strictEqual(document.documentElement.lang, undefined); // Initial mock DOM state without it being explicitly set yet, or we'd expect 'en'

        // Trigger
        I18n.setLanguage('tr');

        // After
        assert.strictEqual(I18n.currentLang, 'tr');
        assert.strictEqual(document.documentElement.lang, 'tr');
    });

    test('setLanguage ignores unknown languages', async () => {
        const I18n = (await import('../i18n.js?t=' + Date.now())).default;

        // Trigger
        I18n.setLanguage('xx');

        // After
        assert.strictEqual(I18n.currentLang, 'en'); // should remain default
    });

    test('updateDOM modifies textContent of data-i18n elements', async () => {
        const I18n = (await import('../i18n.js?t=' + Date.now())).default;

        // Start by getting references to the injected elements
        const els = document.querySelectorAll('[data-i18n]');
        assert.strictEqual(els.length, 2);

        // Set to English manually and update
        I18n.currentLang = 'en';
        I18n.updateDOM();

        assert.strictEqual(els[0].textContent, '1RM Estimator');
        assert.strictEqual(els[1].textContent, 'Warm-Up');

        I18n.setLanguage('tr');
        assert.strictEqual(els[0].textContent, '1RM Hesaplayıcı');
        assert.strictEqual(els[1].textContent, 'Isınma Planı');
    });

    test('getAdvCues and getAdvPurposes return correct dictionaries based on language', async () => {
        const I18n = (await import('../i18n.js?t=' + Date.now())).default;

        I18n.currentLang = 'tr';
        const trCues = I18n.getAdvCues();
        const trPurposes = I18n.getAdvPurposes();

        assert.strictEqual(trCues.bench.skill, 'Barı sıkı kavra');
        assert.strictEqual(trPurposes.activation, 'Aktivasyon');

        I18n.currentLang = 'ru';
        const ruCues = I18n.getAdvCues();
        const ruPurposes = I18n.getAdvPurposes();

        assert.strictEqual(ruCues.bench.skill, 'Сжимай гриф');
        assert.strictEqual(ruPurposes.activation, 'Активация');

        // Fallback to EN for unknown lang or 'en'
        I18n.currentLang = 'xx';
        const enCues = I18n.getAdvCues();
        const enPurposes = I18n.getAdvPurposes();

        assert.strictEqual(enCues.bench.skill, 'Squeeze bar hard');
        assert.strictEqual(enPurposes.activation, 'Activation');
    });
});
