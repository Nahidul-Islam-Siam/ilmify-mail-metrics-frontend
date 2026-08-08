import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPasswordInputType,
  togglePasswordVisibility,
} from './passwordVisibility';

test('password visibility toggles between hidden and visible input types', () => {
  const visible = togglePasswordVisibility(false);
  assert.equal(visible, true);
  assert.equal(getPasswordInputType(visible), 'text');

  const hidden = togglePasswordVisibility(visible);
  assert.equal(hidden, false);
  assert.equal(getPasswordInputType(hidden), 'password');
});
