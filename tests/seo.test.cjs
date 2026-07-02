const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const main = fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8');
const nginx = fs.readFileSync(path.join(root, 'nginx.conf'), 'utf8');
const redirects = fs.readFileSync(path.join(root, '_redirects'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const privacy = fs.readFileSync(path.join(root, 'privacy.html'), 'utf8');
const terms = fs.readFileSync(path.join(root, 'terms.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));

test('the primary SEO surface targets the warm-up planner intent', () => {
    assert.match(html, /<title>Warm-Up Planner for Squat, Bench Press &amp; Deadlift \| PeakLoads<\/title>/);
    assert.match(html, /<meta name="description"[\s\S]*?squat, bench press and deadlift/i);
    assert.match(html, /<h1[^>]*>Warm-Up Planner for Squat, Bench Press &amp; Deadlift<\/h1>/);
    assert.match(html, /id="section-adv-warmup" class="tool-section active"/);
});

test('the page keeps one canonical H1 and avoids unsupported SEO markup', () => {
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(html, /<meta name="keywords"/i);
    assert.doesNotMatch(html, /"@type": "FAQPage"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/peakloads\.com\/">/);
});

test('warm-up planner is the application default without changing protocols', () => {
    assert.match(main, /activateSection\('section-adv-warmup'\)/);
    assert.doesNotMatch(main, /seoRoutes/);
    assert.equal(manifest.start_url, '/');
});

test('only the app root and legal pages are canonical sitemap URLs', () => {
    const urls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), match => match[1]);
    assert.deepEqual(urls, [
        'https://peakloads.com/',
        'https://peakloads.com/privacy',
        'https://peakloads.com/terms'
    ]);
    assert.match(privacy, /<link rel="canonical" href="https:\/\/peakloads\.com\/privacy">/);
    assert.match(terms, /<link rel="canonical" href="https:\/\/peakloads\.com\/terms">/);
});

test('retired tool paths permanently redirect to the app root', () => {
    for (const pathName of [
        'squat-1rm-calculator',
        'advanced-1rm-estimator',
        'bench-press-warm-up-planner',
        'squat-warm-up-planner',
        'deadlift-warm-up-planner',
        'rpe-rir-translator'
    ]) {
        assert.match(nginx, new RegExp(pathName));
        assert.match(redirects, new RegExp(`/${pathName} / 301!`));
    }
    assert.match(nginx, /return 301 https:\/\/peakloads\.com\//);
});
