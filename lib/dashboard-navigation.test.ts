import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getUserNavigation,
  SUPER_ADMIN_NAVIGATION,
  USER_NAVIGATION,
} from './dashboard-navigation';

describe('management demo navigation', () => {
  it('exposes every shared design preview in the user workspace', () => {
    assert.deepEqual(getUserNavigation('User').map(({ href }) => href), [
      '/dashboard',
      '/dashboard/validation/single',
      '/dashboard/validation/bulk',
      '/dashboard/validation/sheet',
      '/dashboard/valid-emails',
      '/dashboard/history',
      '/dashboard/verify',
      '/dashboard/team',
      '/dashboard/subscription',
      '/dashboard/invoices',
      '/dashboard/invoice',
      '/dashboard/api',
      '/dashboard/integrations',
      '/dashboard/ai',
    ]);
  });

  it('shows management design previews only to Admin and Super Admin', () => {
    const managementPaths = [
      '/dashboard/admin',
      '/dashboard/users',
      '/dashboard/disposable',
      '/dashboard/disposable/providers',
      '/dashboard/disposable/import',
      '/dashboard/analytics',
    ];

    for (const path of managementPaths) {
      assert.ok(getUserNavigation('Admin').some(({ href }) => href === path));
      assert.ok(
        getUserNavigation('Super Admin').some(({ href }) => href === path),
      );
      assert.ok(!getUserNavigation('User').some(({ href }) => href === path));
    }
  });

  it('marks incomplete designs as previews', () => {
    const previews = getUserNavigation('Super Admin').filter(
      ({ preview }) => preview,
    );

    assert.ok(previews.length > 0);
    assert.ok(previews.some(({ href }) => href === '/dashboard/ai'));
    assert.ok(previews.some(({ href }) => href === '/dashboard/admin'));
    assert.ok(
      !previews.some(({ href }) => href === '/dashboard/validation/single'),
    );
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
