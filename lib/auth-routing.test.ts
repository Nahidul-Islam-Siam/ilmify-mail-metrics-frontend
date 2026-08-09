import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getDefaultDashboard, normalizeRole } from './auth-routing';

describe('dashboard role routing', () => {
  it('normalizes every supported backend role', () => {
    assert.equal(normalizeRole('superadmin'), 'Super Admin');
    assert.equal(normalizeRole('admin'), 'Admin');
    assert.equal(normalizeRole('client'), 'User');
    assert.equal(normalizeRole('user'), 'User');
    assert.equal(normalizeRole('sub_user'), 'Sub User');
    assert.equal(normalizeRole('unknown'), null);
  });

  it('sends every role to the management demo dashboard', () => {
    assert.equal(getDefaultDashboard('Super Admin'), '/dashboard');
    assert.equal(getDefaultDashboard('Admin'), '/dashboard');
    assert.equal(getDefaultDashboard('User'), '/dashboard');
    assert.equal(getDefaultDashboard('Sub User'), '/dashboard');
  });
});
