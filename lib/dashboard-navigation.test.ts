import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SUPER_ADMIN_NAVIGATION, USER_NAVIGATION } from './dashboard-navigation';

describe('separated dashboard navigation', () => {
  it('gives both dashboards an explicit cross-dashboard link', () => {
    assert.ok(USER_NAVIGATION.some(({ href }) => href === '/super-admin'));
    assert.ok(SUPER_ADMIN_NAVIGATION.some(({ href }) => href === '/dashboard'));
  });

  it('keeps management links in the Super Admin navigation', () => {
    assert.ok(SUPER_ADMIN_NAVIGATION.some(({ href }) => href === '/dashboard/users'));
    assert.ok(!USER_NAVIGATION.some(({ href }) => href === '/dashboard/users'));
  });
});
