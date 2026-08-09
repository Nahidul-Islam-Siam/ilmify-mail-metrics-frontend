import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SUPER_ADMIN_NAVIGATION, USER_NAVIGATION } from './dashboard-navigation';

describe('management demo navigation', () => {
  it('shows only dashboard, single validation, and bulk validation', () => {
    assert.deepEqual(USER_NAVIGATION.map(({ href }) => href), [
      '/dashboard',
      '/dashboard/validation/single',
      '/dashboard/validation/bulk',
    ]);
  });

  it('keeps management links in the Super Admin navigation', () => {
    assert.ok(SUPER_ADMIN_NAVIGATION.some(({ href }) => href === '/dashboard/users'));
    assert.ok(!USER_NAVIGATION.some(({ href }) => href === '/dashboard/users'));
  });
});
