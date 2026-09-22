const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const config = JSON.parse(fs.readFileSync(path.join(root, 'context7.json')));
assert(config.rules.every((rule) => rule.length <= 255));
for (const match of readme.matchAll(/\]\(([^)]+)\)/g)) {
  const link = match[1].split('#')[0];
  if (link && !/^(https?:|mailto:)/.test(link)) {
    assert(fs.existsSync(path.join(root, link)), link);
  }
}
const source = fs.readFileSync(path.join(root, 'server/services/firebase-auth.ts'), 'utf8');
const routes = fs.readFileSync(path.join(root, 'server/routes/index.ts'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
assert(readme.includes(manifest.engines.node));
assert(readme.includes('Strapi 4'));
assert(readme.includes('Strapi 5'));
for (const field of ['name', 'phone', 'photoUrl']) assert(source.includes(`userAttributes.${field}`));
assert(source.includes("provider: 'firebase'"));
assert(source.includes('username: identifier'));
assert(source.includes('verifyIdToken(token)'));
assert(source.includes('user?.blocked === true || firebaseUser.disabled'));
assert(routes.includes("path: '/firebase/login'"));
assert(routes.includes("method: 'POST'"));
assert.equal(config.branch, 'prod');

assert(readme.includes('without checking the usual registration or email-confirmation'));
assert(readme.includes('does not request a revocation check'));
assert(source.includes('confirmed: true'));
console.log('README/source authentication boundary checks PASS (not integration testing)');
