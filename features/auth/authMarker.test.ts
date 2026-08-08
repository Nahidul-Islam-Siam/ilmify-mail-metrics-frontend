import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  AUTH_MARKER_COOKIE,
  authMarkerCookie,
  clearAuthMarkerCookie,
  hasAuthMarker,
} from './authMarker';

describe('middleware authentication marker', () => {
  it('accepts only the explicit authenticated marker value', () => {
    assert.equal(AUTH_MARKER_COOKIE, 'mm_authenticated');
    assert.equal(hasAuthMarker('1'), true);
    assert.equal(hasAuthMarker(undefined), false);
    assert.equal(hasAuthMarker('0'), false);
  });

  it('creates and clears a same-site route marker cookie', () => {
    assert.equal(
      authMarkerCookie(false),
      'mm_authenticated=1; Path=/; Max-Age=2592000; SameSite=Lax',
    );
    assert.equal(
      clearAuthMarkerCookie(false),
      'mm_authenticated=; Path=/; Max-Age=0; SameSite=Lax',
    );
  });
});
