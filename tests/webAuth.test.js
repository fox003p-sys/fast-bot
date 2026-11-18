import { test, describe } from 'node:test';
import assert from 'node:assert';

import {
  VKSERFING_BASE_URL,
  WEB_AUTH_MODES,
  getWebAuthUrl,
  extractUrlToken,
  resolveWebAuthResult,
} from '../src/utils/webAuth.js';

describe('WebView auth URLs', () => {
  test('auth URLs must not point to missing /login or /register pages (they return 404)', () => {
    const url = getWebAuthUrl('login');
    assert.ok(!url.includes('/login'), `must not use /login: ${url}`);
    assert.ok(!url.includes('/register'), `must not use /register: ${url}`);
  });

  test('login mode opens the main page with the embedded auth form', () => {
    assert.strictEqual(getWebAuthUrl('login'), `${VKSERFING_BASE_URL}/`);
  });

  test('register mode falls back to the main page', () => {
    assert.strictEqual(getWebAuthUrl('register'), `${VKSERFING_BASE_URL}/`);
  });

  test('unknown mode falls back to the main page', () => {
    assert.strictEqual(getWebAuthUrl('unknown'), `${VKSERFING_BASE_URL}/`);
  });

  test('mode map only uses paths that exist on the site', () => {
    for (const value of Object.values(WEB_AUTH_MODES)) {
      assert.ok(value === '/' || !value.startsWith('/'), value);
    }
  });
});

describe('extractUrlToken', () => {
  test('extracts token from query string', () => {
    assert.strictEqual(
      extractUrlToken('https://vkserfing.com/dashboard?token=abc123'),
      'abc123'
    );
  });

  test('returns null when token is absent', () => {
    assert.strictEqual(extractUrlToken('https://vkserfing.com/dashboard'), null);
  });

  test('returns null for malformed URL', () => {
    assert.strictEqual(extractUrlToken('not-a-url'), null);
  });
});

describe('resolveWebAuthResult', () => {
  const start = 'https://vkserfing.com/';

  test('login page itself is NOT a successful auth (old bug: instant fake login)', () => {
    assert.deepStrictEqual(resolveWebAuthResult(start, start), {
      success: false,
      token: null,
    });
  });

  test('404 page is NOT a successful auth', () => {
    assert.deepStrictEqual(
      resolveWebAuthResult(start, 'https://vkserfing.com/oops-page-not-found'),
      { success: false, token: null },
    );
  });

  test('navigation to dashboard means successful auth', () => {
    assert.deepStrictEqual(
      resolveWebAuthResult(start, 'https://vkserfing.com/dashboard'),
      { success: true, token: null },
    );
  });

  test('navigation to profile subpage means successful auth', () => {
    assert.deepStrictEqual(
      resolveWebAuthResult(start, 'https://vkserfing.com/profile/edit'),
      { success: true, token: null },
    );
  });

  test('token in query wins regardless of path', () => {
    assert.deepStrictEqual(
      resolveWebAuthResult(start, 'https://vkserfing.com/?token=t-42'),
      { success: true, token: 't-42' },
    );
  });

  test('other-host navigation is not treated as success', () => {
    assert.deepStrictEqual(
      resolveWebAuthResult(start, 'https://example.com/dashboard'),
      { success: false, token: null },
    );
  });
});
