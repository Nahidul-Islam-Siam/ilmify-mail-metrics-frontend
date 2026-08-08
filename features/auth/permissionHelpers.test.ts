import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  canUserCreateRole,
  getCreatableRoles,
  hasPermissionForUser,
} from './permissionHelpers';
import type { RbacUser } from '@/features/auth/types';

function user(role: RbacUser['role'], permissions: string[] = []): RbacUser {
  return {
    id: role,
    name: role,
    email: `${role.replaceAll(' ', '.')}@example.com`,
    role,
    role_id: role.toLowerCase().replaceAll(' ', '_'),
    permissions,
  };
}

describe('permission helpers', () => {
  it('allows Super Admin globally and otherwise requires an assigned permission', () => {
    assert.equal(hasPermissionForUser(user('Super Admin'), 'user.delete'), true);
    assert.equal(hasPermissionForUser(user('Admin', ['user.view']), 'user.view'), true);
    assert.equal(hasPermissionForUser(user('Admin'), 'user.view'), false);
    assert.equal(hasPermissionForUser(null, 'user.view'), false);
  });

  it('allows users to create only lower-ranked supported roles', () => {
    assert.equal(canUserCreateRole(user('Admin'), 'User'), true);
    assert.equal(canUserCreateRole(user('Admin'), 'Super Admin'), false);
    assert.equal(canUserCreateRole(user('Sub User'), 'User'), false);
    assert.equal(canUserCreateRole(null, 'Sub User'), false);
  });

  it('returns the exact creatable role set for every authenticated role', () => {
    assert.deepEqual(getCreatableRoles(user('Super Admin')), ['Admin', 'User', 'Sub User']);
    assert.deepEqual(getCreatableRoles(user('Admin')), ['User', 'Sub User']);
    assert.deepEqual(getCreatableRoles(user('User')), ['Sub User']);
    assert.deepEqual(getCreatableRoles(user('Sub User')), []);
    assert.deepEqual(getCreatableRoles(null), []);
  });
});
