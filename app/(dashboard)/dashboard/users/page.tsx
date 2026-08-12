'use client';

import { useState, useEffect, type FormEvent } from 'react';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';
import PermissionGuard from '@/components/rbac/PermissionGuard';
import { usePermission } from '@/features/auth/usePermission';
import { buildApiUrl } from '@/services/api/apiUrl';
import type { PermissionDefinition, PermissionName, RbacUser, UserRole } from '@/features/auth/types';

interface ManagedUser extends RbacUser { createdAt: string }

export default function UserManagementPage() {
  const { user: currentUser, role: currentRole, token, hasPermission, getAllowedRolesToCreate, availablePermissions } = usePermission();

  const [users, setUsers] = useState<ManagedUser[]>([
    {
      id: 'usr-super-admin-1',
      name: 'Alex Rivera',
      email: 'superadmin@mailmetric.io',
      role: 'Super Admin',
      role_id: 'role-super-admin',
      permissions: ['user.create', 'user.view', 'user.edit', 'user.delete', 'admin.create', 'admin.manage', 'settings.manage', 'reports.view', 'orders.create', 'orders.view', 'orders.edit'],
      createdAt: '2026-08-01'
    },
    {
      id: 'usr-admin-1',
      name: 'Sarah Chen',
      email: 'sarah@acme.com',
      role: 'Admin',
      role_id: 'role-admin',
      permissions: ['user.create', 'user.view', 'user.edit', 'user.delete', 'admin.create', 'settings.manage', 'reports.view', 'orders.create', 'orders.view', 'orders.edit'],
      createdAt: '2026-08-02'
    },
    {
      id: 'usr-user-1',
      name: 'Marcus Lee',
      email: 'marcus@acme.com',
      role: 'User',
      role_id: 'role-user',
      permissions: ['user.create', 'user.view', 'reports.view', 'orders.create', 'orders.view'],
      createdAt: '2026-08-03'
    },
    {
      id: 'usr-sub-1',
      name: 'Priya Nair',
      email: 'priya@acme.com',
      role: 'Sub User',
      role_id: 'role-sub-user',
      permissions: ['user.view', 'orders.view'],
      createdAt: '2026-08-04'
    }
  ]);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  // Create Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole | ''>('');
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionName[]>([]);

  const allowedRoles = getAllowedRolesToCreate();

  useEffect(() => {
    if (allowedRoles.length > 0 && !formRole) {
      setFormRole(allowedRoles[0]);
    }
  }, [allowedRoles]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Group permissions by module
  const groupedPermissions = availablePermissions.reduce<Record<string, PermissionDefinition[]>>((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});

  const handlePermissionToggle = (permName: PermissionName) => {
    if (selectedPermissions.includes(permName)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permName));
    } else {
      setSelectedPermissions([...selectedPermissions, permName]);
    }
  };

  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    // Validate permission ownership
    if (currentRole !== 'Super Admin') {
      const myPermSet = new Set(currentUser?.permissions || []);
      const unowned = selectedPermissions.filter(p => !myPermSet.has(p));
      if (unowned.length > 0) {
        setApiError(`Security Violation: You cannot assign permissions you do not own: [${unowned.join(', ')}]`);
        return;
      }
    }

    try {
      const res = await fetch(buildApiUrl('/users'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword || 'Password123!',
          role_id: formRole,
          permissions: selectedPermissions
        })
      });

      const data = await res.json();
      if (res.ok) {
        setUsers([data.user, ...users]);
        setShowCreateModal(false);
        resetForm();
        showToast('✓ User account created successfully!');
      } else {
        // Handle backend security rejection
        setApiError(data.message || 'Failed to create user account.');
      }
    } catch (err) {
      // Fallback local simulation if backend API is offline
      const newUser = {
        id: `usr-${Math.random().toString(36).substr(2, 6)}`,
        name: formName,
        email: formEmail,
        role: formRole || 'Sub User',
        role_id: `role-${formRole.toLowerCase().replace(' ', '-')}`,
        permissions: selectedPermissions,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([newUser, ...users]);
      setShowCreateModal(false);
      resetForm();
      showToast('✓ User created (Simulated Local RBAC State)');
    }
  };

  const handleEditUser = (userToEdit: ManagedUser) => {
    setSelectedUser(userToEdit);
    setFormName(userToEdit.name);
    setFormEmail(userToEdit.email);
    setFormRole(userToEdit.role);
    setSelectedPermissions(userToEdit.permissions || []);
    setShowEditModal(true);
  };

  const handleUpdateUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? {
      ...u,
      name: formName,
      email: formEmail,
      role: formRole || selectedUser.role,
      permissions: selectedPermissions
    } : u));
    setShowEditModal(false);
    resetForm();
    showToast(`✓ Updated permissions for ${formName}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
      showToast('✓ User deleted successfully.');
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole(allowedRoles[0] || 'Sub User');
    setSelectedPermissions([]);
    setApiError(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'Super Admin':
        return { bg: '#FEF2F2', color: '#EF4444', border: '#FCA5A5' };
      case 'Admin':
        return { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' };
      case 'User':
        return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      default:
        return { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
    }
  };

  return (
    <ProtectedRoute permission="user.view">
      <div style={{ maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Toast Alert */}
        {toastMessage && (
          <div style={{
            position: 'fixed', top: '20px', right: '20px', background: '#10B981', color: '#fff',
            padding: '12px 20px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 700,
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)', zIndex: 200
          }}>
            {toastMessage}
          </div>
        )}

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#101828', margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif" }}>
              User Management
            </h1>
            <p style={{ fontSize: '13.5px', color: '#667085', margin: 0 }}>
              Manage system users, assign role hierarchies, and configure custom permissions.
            </p>
          </div>

          <PermissionGuard permission="user.create">
            <button
              onClick={() => { resetForm(); setShowCreateModal(true); }}
              style={{
                padding: '10px 20px', background: '#7C3AED', color: '#fff', border: 'none',
                borderRadius: '12px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              + Create User
            </button>
          </PermissionGuard>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EAECF0', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="#98A2B3" strokeWidth="2" width="16" height="16" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name or email..."
              style={{
                width: '100%', padding: '8px 12px 8px 36px', background: '#F8FAFC', border: '1px solid #E4E7EC',
                borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600 }}>Filter Role:</span>
            {['All', 'Super Admin', 'Admin', 'User', 'Sub User'].map(roleName => (
              <button
                key={roleName}
                onClick={() => setRoleFilter(roleName)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  border: roleFilter === roleName ? 'none' : '1px solid #E4E7EC',
                  background: roleFilter === roleName ? '#7C3AED' : '#FFFFFF',
                  color: roleFilter === roleName ? '#FFFFFF' : '#475467',
                  cursor: 'pointer'
                }}
              >
                {roleName}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECF0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EAECF0', textAlign: 'left', fontSize: '11.5px', color: '#98A2B3', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>User</th>
                  <th style={{ padding: '12px 14px' }}>Role</th>
                  <th style={{ padding: '12px 14px' }}>Effective Permissions</th>
                  <th style={{ padding: '12px 14px' }}>Created</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const bStyle = getRoleBadge(u.role);
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                      
                      {/* User Cell */}
                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', background: '#F3E8FF', color: '#7C3AED',
                            fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#101828' }}>{u.name}</div>
                            <div style={{ fontSize: '12px', color: '#98A2B3' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: '16px 14px' }}>
                        <span style={{
                          background: bStyle.bg, color: bStyle.color, border: `1px solid ${bStyle.border}`,
                          fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px'
                        }}>
                          {u.role}
                        </span>
                      </td>

                      {/* Permissions Chips */}
                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '340px' }}>
                          {u.permissions && u.permissions.slice(0, 3).map((p, i) => (
                            <span key={i} style={{ background: '#F1F5F9', color: '#475569', fontSize: '10.5px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                              {p}
                            </span>
                          ))}
                          {u.permissions && u.permissions.length > 3 && (
                            <span style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: '10.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                              +{u.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created */}
                      <td style={{ padding: '16px 14px', fontSize: '12.5px', color: '#98A2B3' }}>
                        {u.createdAt}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          
                          <button
                            onClick={() => { setSelectedUser(u); setShowDetailsModal(true); }}
                            style={{ padding: '6px 12px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#344054', cursor: 'pointer' }}
                          >
                            View
                          </button>

                          <PermissionGuard permission="user.edit">
                            <button
                              onClick={() => handleEditUser(u)}
                              style={{ padding: '6px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}
                            >
                              Edit / Perms
                            </button>
                          </PermissionGuard>

                          <PermissionGuard permission="user.delete">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              style={{ padding: '6px 12px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#EF4444', cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </PermissionGuard>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CREATE USER MODAL */}
        {/* ========================================================================= */}
        {showCreateModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150
          }}>
            <div style={{
              background: '#FFFFFF', borderRadius: '20px', width: '560px', maxHeight: '90vh', overflowY: 'auto',
              padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #EAECF0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#101828', margin: 0, fontFamily: "'Sora', sans-serif" }}>Create New Account</h3>
                  <p style={{ fontSize: '12px', color: '#667085', margin: '2px 0 0 0' }}>Assign role hierarchy & custom permission set.</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#98A2B3', cursor: 'pointer' }}>✕</button>
              </div>

              {apiError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '12px', fontSize: '12.5px', color: '#EF4444', fontWeight: 600, marginBottom: '16px' }}>
                  ⚠️ {apiError}
                </div>
              )}

              <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sarah Chen"
                    required
                    style={{ width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="sarah@acme.com"
                    required
                    style={{ width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Password</label>
                  <input
                    type="password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Role Selection Logic (Filtered by Hierarchy) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054' }}>Role Assignment</label>
                    <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700 }}>Creator: {currentRole}</span>
                  </div>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    required
                    style={{ width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13.5px', color: '#101828', outline: 'none', boxSizing: 'border-box' }}
                  >
                    {allowedRoles.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {roleOption}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grouped Permission Selection Checkboxes */}
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '8px' }}>
                    Select Permissions (Grouped by Module)
                  </label>
                  <p style={{ fontSize: '11.5px', color: '#98A2B3', margin: '0 0 12px 0' }}>
                    Rule: You can only assign permissions that exist in your own permission set.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '220px', overflowY: 'auto', border: '1px solid #E4E7EC', borderRadius: '12px', padding: '14px', background: '#F8FAFC' }}>
                    {Object.keys(groupedPermissions).map((moduleName) => (
                      <div key={moduleName}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: '6px' }}>
                          {moduleName}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {groupedPermissions[moduleName].map((perm) => {
                            const isOwnedByCreator = currentRole === 'Super Admin' || currentUser?.permissions?.includes(perm.name);
                            return (
                              <label
                                key={perm.id}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px',
                                  color: isOwnedByCreator ? '#344054' : '#98A2B3',
                                  cursor: isOwnedByCreator ? 'pointer' : 'not-allowed'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  disabled={!isOwnedByCreator}
                                  checked={selectedPermissions.includes(perm.name)}
                                  onChange={() => handlePermissionToggle(perm.name)}
                                />
                                <span style={{ fontWeight: selectedPermissions.includes(perm.name) ? 700 : 400 }}>
                                  {perm.label} ({perm.name})
                                </span>
                                {!isOwnedByCreator && (
                                  <span style={{ fontSize: '9.5px', color: '#EF4444', background: '#FEF2F2', padding: '1px 4px', borderRadius: '4px' }}>Unowned</span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{ flex: 1, padding: '10px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#344054', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '10px', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Create User Account
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EDIT USER & CUSTOM PERMISSIONS MODAL */}
        {/* ========================================================================= */}
        {showEditModal && selectedUser && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150
          }}>
            <div style={{
              background: '#FFFFFF', borderRadius: '20px', width: '540px', maxHeight: '90vh', overflowY: 'auto',
              padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #EAECF0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#101828', margin: 0, fontFamily: "'Sora', sans-serif" }}>
                  Edit User & Custom Permissions
                </h3>
                <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#98A2B3', cursor: 'pointer' }}>✕</button>
              </div>

              <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '6px' }}>Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    style={{ width: '100%', padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13.5px', color: '#101828', outline: 'none', boxSizing: 'border-box' }}
                  >
                    {allowedRoles.map(roleOption => (
                      <option key={roleOption} value={roleOption}>{roleOption}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#344054', display: 'block', marginBottom: '8px' }}>
                    Custom Permission Overrides
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #E4E7EC', borderRadius: '12px', padding: '14px', background: '#F8FAFC' }}>
                    {Object.keys(groupedPermissions).map((moduleName) => (
                      <div key={moduleName}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', marginBottom: '6px' }}>
                          {moduleName}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {groupedPermissions[moduleName].map((perm) => (
                            <label key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#344054', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(perm.name)}
                                onChange={() => handlePermissionToggle(perm.name)}
                              />
                              <span>{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    style={{ flex: 1, padding: '10px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#344054', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: '10px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* USER DETAILS MODAL */}
        {/* ========================================================================= */}
        {showDetailsModal && selectedUser && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150
          }}>
            <div style={{
              background: '#FFFFFF', borderRadius: '20px', width: '480px', padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid #EAECF0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#101828', margin: 0, fontFamily: "'Sora', sans-serif" }}>User Profile & Permissions</h3>
                <button onClick={() => setShowDetailsModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#98A2B3', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F2F4F7' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#F3E8FF', color: '#7C3AED', fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedUser.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#101828' }}>{selectedUser.name}</div>
                  <div style={{ fontSize: '12.5px', color: '#98A2B3' }}>{selectedUser.email}</div>
                  <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', display: 'inline-block', marginTop: '4px' }}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#344054', marginBottom: '8px' }}>Active Effective Permissions ({selectedUser.permissions?.length || 0}):</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedUser.permissions?.map((p, idx) => (
                    <span key={idx} style={{ background: '#ECFDF5', color: '#10B981', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                style={{ width: '100%', padding: '10px', background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#344054', cursor: 'pointer', marginTop: '24px' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
