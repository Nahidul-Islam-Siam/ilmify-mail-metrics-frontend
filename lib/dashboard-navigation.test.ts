import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getUserNavigation,
  SUPER_ADMIN_NAVIGATION,
  USER_NAVIGATION,
} from './dashboard-navigation';

describe('management demo navigation', () => {
  it('keeps incomplete user features hidden', () => {
    assert.deepEqual(getUserNavigation('User').map(({ href }) => href), [
      '/dashboard',
      '/dashboard/validation/single',
      '/dashboard/validation/bulk',
      '/dashboard/valid-emails',
    ]);
  });

  it('restores the working Super Admin area only for Super Admins', () => {
    assert.ok(
      getUserNavigation('Super Admin').some(
        ({ href }) => href === '/super-admin',
      ),
    );
    assert.ok(
      !getUserNavigation('User').some(({ href }) => href === '/super-admin'),
    );
  });

  it('shows Settings only to users who can manage settings', () => {
    assert.ok(
      getUserNavigation('Admin', ['settings.manage']).some(
        ({ href }) => href === '/dashboard/settings',
      ),
    );
    assert.ok(
      !getUserNavigation('User', []).some(
        ({ href }) => href === '/dashboard/settings',
      ),
    );
  });

  it('keeps management links in the Super Admin navigation', () => {
    assert.ok(SUPER_ADMIN_NAVIGATION.some(({ href }) => href === '/dashboard/users'));
    assert.ok(!USER_NAVIGATION.some(({ href }) => href === '/dashboard/users'));
  });
});
