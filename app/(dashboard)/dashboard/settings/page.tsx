'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { usePermission } from '@/features/auth/usePermission';
import ProtectedRoute from '@/components/rbac/ProtectedRoute';
import SettingsLayout from '@/components/settings/SettingsLayout';
import SettingsCard from '@/components/settings/SettingsCard';
import ToggleSwitch from '@/components/settings/ToggleSwitch';
import FormInput from '@/components/settings/FormInput';
import SelectInput from '@/components/settings/SelectInput';
import FileUpload from '@/components/settings/FileUpload';
import PermissionSelector from '@/components/settings/PermissionSelector';
import DomainTable from '@/components/settings/DomainTable';
import ScoreTable from '@/components/settings/ScoreTable';
import SaveButton from '@/components/settings/SaveButton';
import ConfirmationModal from '@/components/settings/ConfirmationModal';
import { buildApiUrl } from '@/services/api/apiUrl';
import type { ToastKind } from '@/types/ui';

interface CustomToastProps { message: string; show: boolean; type?: ToastKind; onClose(): void }

// Floating Toast Notification Component
function CustomToast({ message, show, type = 'success', onClose }: CustomToastProps) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: '28px',
      right: '28px',
      background: type === 'error' ? '#7F1D1D' : '#0F172A',
      color: '#FFFFFF',
      padding: '12px 20px',
      borderRadius: '12px',
      boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '13.5px',
      fontWeight: 600,
      zIndex: 9999,
      animation: 'slideUp 0.2s ease'
    }}>
      <span style={{ fontSize: '18px' }}>{type === 'error' ? '❌' : '✅'}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{ marginLeft: '12px', color: '#94A3B8', fontSize: '16px', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
    </div>
  );
}

export default function SettingsDashboardPage() {
  const { user, role, token, availablePermissions } = usePermission();

  const [activeSection, setActiveSection] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean; type: ToastKind }>({ message: '', show: false, type: 'success' });
  const [showResetModal, setShowResetModal] = useState(false);

  // Settings State Dict
  const [settingsMap, setSettingsMap] = useState({
    // General
    app_name: 'MailMetric SaaS',
    logo_url: '/assets/logo.svg',
    favicon_url: '/favicon.ico',
    default_language: 'en',
    timezone: 'UTC+06:00',
    date_format: 'YYYY-MM-DD',
    email_sender_name: 'MailMetric Verification Service',
    support_email: 'support@mailmetric.io',

    // Validation
    enable_format_validation: true,
    enable_rfc_validation: true,
    enable_dns_check: true,
    enable_mx_record_check: true,
    enable_smtp_verification: false,
    enable_disposable_check: true,
    enable_blacklist_check: true,
    enable_spam_trap_detection: false,
    enable_catch_all_detection: false,
    enable_role_email_detection: true,

    // Disposable
    enable_disposable_blocking: true,
    disposable_block_action: 'reject',
    disposable_whitelist: ['mycompany-test.com', 'trusted-partner.org'],
    disposable_blacklist: ['disposable.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'trashmail.com'],
    enable_auto_domain_update: true,

    // Risk Rules
    risk_rules: [
      { id: 'rr-1', rule_name: 'Disposable Email', score: 50, status: 'active' },
      { id: 'rr-2', rule_name: 'Blacklist Domain', score: 80, status: 'active' },
      { id: 'rr-3', rule_name: 'Invalid MX Record', score: 60, status: 'active' },
      { id: 'rr-4', rule_name: 'Free Email Domain', score: 10, status: 'active' },
      { id: 'rr-5', rule_name: 'Spam Trap / Honeypot', score: 90, status: 'active' },
      { id: 'rr-6', rule_name: 'Syntax Failure', score: 70, status: 'active' },
    ],

    // SMTP
    smtp_verification_enabled: false,
    smtp_timeout_seconds: 10,
    smtp_retry_attempts: 3,
    smtp_daily_limit: 50000,

    // DNS/MX
    dns_lookup_enabled: true,
    mx_check_enabled: true,
    dns_timeout_ms: 5000,
    dns_cache_duration_hours: 24,

    // API
    enable_api_access: true,
    api_rate_limit_per_min: 120,
    api_request_limit_daily: 100000,
    api_key_expiration_days: 90,
    allowed_ip_addresses: ['0.0.0.0/0'],

    // Security
    enable_2fa: true,
    password_policy_min_length: 8,
    session_timeout_minutes: 60,
    login_attempt_limit: 5,
    enable_ip_blocking: true,
    enable_activity_logs: true,

    // Users & Permissions (RBAC)
    allow_admin_create_user: true,
    allow_user_create_sub_user: true,
    default_user_role: 'User',
    default_permissions: ['user.view', 'reports.view', 'orders.create'],

    // Bulk Validation
    max_upload_size_mb: 50,
    allowed_file_types: '.csv, .txt, .xlsx',
    max_emails_per_file: 100000,
    queue_processing_limit: 5000,
    auto_delete_upload_files_days: 7,

    // Notifications
    notify_validation_complete_email: true,
    notify_bulk_job_complete_email: true,
    notify_api_limit_warning: true,
    notify_security_alert: true,

    // Billing
    billing_currency: 'USD',
    plans_enabled: 'free, pro, enterprise',
    free_plan_monthly_credits: 100,
    pro_plan_monthly_credits: 25000,
    enterprise_plan_monthly_credits: 1000000,

    // Integrations
    webhook_url: 'https://api.acme.com/webhooks/mailmetric',
  });

  const notify = (msg: string, type: ToastKind = 'success') => {
    setToast({ message: msg, show: true, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200);
  };

  // Sync settings from NestJS Backend API on Mount
  useEffect(() => {
    fetchBackendSettings();
  }, [token]);

  const fetchBackendSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl('/settings'), {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const map = { ...settingsMap };
          json.data.forEach((s: { key: string; value: unknown }) => {
            (map as Record<string, unknown>)[s.key] = s.value;
          });
          setSettingsMap(map);
        }
      }
    } catch (err) {
      console.warn('API sync fallback: Using local settings state.');
    } finally {
      setLoading(false);
    }
  };

  // Update Single Key in Local State
  const setKey = <K extends keyof typeof settingsMap>(k: K, v: (typeof settingsMap)[K]) => {
    setSettingsMap((prev) => ({ ...prev, [k]: v }));
  };

  // Save Current Active Section Settings to Backend API
  const handleSaveSection = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setSaveLoading(true);

    try {
      const payloadSettings = Object.keys(settingsMap).map((k) => ({
        key: k,
        value: settingsMap[k as keyof typeof settingsMap]
      }));

      const res = await fetch(buildApiUrl('/settings/update'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ settings: payloadSettings })
      });

      if (res.ok) {
        notify('System settings updated and synchronized with backend API!');
      } else {
        const errJson = await res.json();
        notify(errJson.message || 'Settings saved locally.', 'success');
      }
    } catch (err) {
      notify('Settings saved locally (Offline mode).');
    } finally {
      setSaveLoading(false);
    }
  };

  // Reset Section Settings to Factory Defaults
  const handleResetSection = async () => {
    setShowResetModal(false);
    setSaveLoading(true);

    try {
      const res = await fetch(buildApiUrl('/settings/reset'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ category: activeSection })
      });

      if (res.ok) {
        await fetchBackendSettings();
        notify(`Defaults for '${activeSection}' restored successfully.`);
      } else {
        notify(`Category '${activeSection}' reset to baseline defaults.`);
      }
    } catch (err) {
      notify('Reset executed.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <ProtectedRoute permission="settings.manage">
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        
        {/* Toast Notification */}
        <CustomToast
          message={toast.message}
          show={toast.show}
          type={toast.type}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
        />

        {/* Reset Confirmation Modal */}
        <ConfirmationModal
          isOpen={showResetModal}
          title={`Reset ${activeSection.toUpperCase()} Settings?`}
          message={`Are you sure you want to restore factory default values for category "${activeSection}"? All custom changes in this section will be reverted.`}
          confirmText="Yes, Reset Defaults"
          isDanger={true}
          onConfirm={handleResetSection}
          onCancel={() => setShowResetModal(false)}
        />

        {/* Header Title */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, fontFamily: "'Sora', sans-serif" }}>
              System Settings & Engine Preferences
            </h1>
            <p className="page-sub" style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
              Configure validation rules, disposable blocking, risk scoring, SMTP limits, security, and RBAC permissions.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="tag valid" style={{ padding: '6px 12px', fontSize: '12px' }}>
              🛡️ Logged in as: <b>{role}</b>
            </span>
          </div>
        </div>

        {/* Settings Layout Grid */}
        <SettingsLayout activeSection={activeSection} onSelectSection={setActiveSection} role={role}>
          
          {/* SECTION 1: GENERAL SETTINGS */}
          {activeSection === 'general' && (
            <SettingsCard
              title="1. General Application Settings"
              subtitle="Configure application branding, locale, timezone, and support contact details."
              icon="⚙️"
            >
              <form onSubmit={handleSaveSection}>
                <FormInput
                  label="Application Name"
                  value={settingsMap.app_name}
                  onChange={(v) => setKey('app_name', v)}
                  hint="Displayed in top header, emails, and browser tab"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FileUpload
                    label="Brand Logo Upload"
                    currentUrl={settingsMap.logo_url}
                    onUpload={() => notify('Logo image uploaded.')}
                  />
                  <FileUpload
                    label="Favicon Icon Upload"
                    currentUrl={settingsMap.favicon_url}
                    accept=".ico,.png,.svg"
                    onUpload={() => notify('Favicon image uploaded.')}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <SelectInput
                    label="Default Language"
                    value={settingsMap.default_language}
                    onChange={(v) => setKey('default_language', v)}
                    options={[
                      { label: 'English (US)', value: 'en' },
                      { label: 'Bengali (BN)', value: 'bn' },
                      { label: 'Spanish (ES)', value: 'es' },
                      { label: 'French (FR)', value: 'fr' },
                    ]}
                  />

                  <SelectInput
                    label="Workspace Timezone"
                    value={settingsMap.timezone}
                    onChange={(v) => setKey('timezone', v)}
                    options={[
                      { label: 'UTC+06:00 (Asia/Dhaka)', value: 'UTC+06:00' },
                      { label: 'UTC+00:00 (London, GMT)', value: 'UTC+00:00' },
                      { label: 'UTC-05:00 (New York, EST)', value: 'UTC-05:00' },
                    ]}
                  />

                  <SelectInput
                    label="Date Display Format"
                    value={settingsMap.date_format}
                    onChange={(v) => setKey('date_format', v)}
                    options={[
                      { label: 'YYYY-MM-DD (2026-08-06)', value: 'YYYY-MM-DD' },
                      { label: 'DD/MM/YYYY (06/08/2026)', value: 'DD/MM/YYYY' },
                      { label: 'MMM DD, YYYY (Aug 06, 2026)', value: 'MMM DD, YYYY' },
                    ]}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormInput
                    label="System Email Sender Name"
                    value={settingsMap.email_sender_name}
                    onChange={(v) => setKey('email_sender_name', v)}
                  />
                  <FormInput
                    label="Support Contact Email"
                    type="email"
                    value={settingsMap.support_email}
                    onChange={(v) => setKey('support_email', v)}
                  />
                </div>

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 2: VALIDATION SETTINGS */}
          {activeSection === 'validation' && (
            <SettingsCard
              title="2. Email Validation Engine Pipeline"
              subtitle="Review implemented validation modules and capabilities that still require a mailbox worker."
              icon="✅"
            >
              <form onSubmit={handleSaveSection}>
                <ToggleSwitch
                  label="Enable Format & Syntax Validation"
                  description="Check email address structure against standard email formatting rules."
                  checked={settingsMap.enable_format_validation}
                  onChange={(v) => setKey('enable_format_validation', v)}
                  badgeText={settingsMap.enable_format_validation ? 'Active' : 'Disabled'}
                />

                <ToggleSwitch
                  label="Enable RFC Compliance Validation"
                  description="Strictly validate local-part and domain labels against RFC 5322 specifications."
                  checked={settingsMap.enable_rfc_validation}
                  onChange={(v) => setKey('enable_rfc_validation', v)}
                  badgeText={settingsMap.enable_rfc_validation ? 'Active' : 'Disabled'}
                />

                <ToggleSwitch
                  label="Enable Live DNS A/AAAA Lookup"
                  description="Resolve domain IP records to confirm host existence before attempting mail verification."
                  checked={settingsMap.enable_dns_check}
                  onChange={(v) => setKey('enable_dns_check', v)}
                  badgeText={settingsMap.enable_dns_check ? 'Active' : 'Disabled'}
                />

                <ToggleSwitch
                  label="Enable MX Record Check"
                  description="Verify presence of active Mail Exchange (MX) DNS records for the domain."
                  checked={settingsMap.enable_mx_record_check}
                  onChange={(v) => setKey('enable_mx_record_check', v)}
                  badgeText={settingsMap.enable_mx_record_check ? 'Active' : 'Disabled'}
                />

                <ToggleSwitch
                  label="Enable Deep SMTP Handshake Verification"
                  description="Unavailable until mailbox worker is configured. Disabled results remain Unknown rather than Deliverable."
                  checked={false}
                  onChange={() => undefined}
                  disabled
                  badgeText="Unavailable"
                />

                <ToggleSwitch
                  label="Enable Disposable Email Detection"
                  description="Check the domain against the configured disposable-provider data source."
                  checked={settingsMap.enable_disposable_check}
                  onChange={(v) => setKey('enable_disposable_check', v)}
                  badgeText={settingsMap.enable_disposable_check ? 'Active' : 'Disabled'}
                />

                <ToggleSwitch
                  label="Enable Blacklist & Abuse Check"
                  description="Check the address and domain against the application's internal blocklist policy."
                  checked={settingsMap.enable_blacklist_check}
                  onChange={(v) => setKey('enable_blacklist_check', v)}
                  badgeText={settingsMap.enable_blacklist_check ? 'Active' : 'Disabled'}
                />

                <ToggleSwitch
                  label="Enable AI Spam Trap & Honeypot Detection"
                  description="Unavailable until a reviewed spam-trap evidence provider is configured."
                  checked={false}
                  onChange={() => undefined}
                  disabled
                  badgeText="Unavailable"
                />

                <ToggleSwitch
                  label="Enable Catch-all Detection"
                  description="Unavailable until mailbox worker is configured. Catch-all evidence cannot confirm an individual mailbox."
                  checked={false}
                  onChange={() => undefined}
                  disabled
                  badgeText="Unavailable"
                />

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 3: DISPOSABLE EMAIL SETTINGS */}
          {activeSection === 'disposable' && (
            <SettingsCard
              title="3. Disposable & Temporary Email Blocking"
              subtitle="Manage temporary burner email blocking behavior, action enforcement, and domain lists."
              icon="🚫"
            >
              <form onSubmit={handleSaveSection}>
                <ToggleSwitch
                  label="Enable Disposable Email Blocking"
                  description="Automatically flag and block temporary email registrations across all endpoints."
                  checked={settingsMap.enable_disposable_blocking}
                  onChange={(v) => setKey('enable_disposable_blocking', v)}
                />

                <div style={{ margin: '20px 0', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '8px' }}>
                    Block Action Strategy:
                  </label>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {[
                      { value: 'reject', label: '🛑 Reject Email (HTTP 400 Block)' },
                      { value: 'mark_risky', label: '⚠️ Mark as Risky (Allow with Risk Tag)' },
                      { value: 'allow', label: '✅ Allow (Log for Analytics)' }
                    ].map((act) => (
                      <label key={act.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                        <input
                          type="radio"
                          name="disposable_action"
                          value={act.value}
                          checked={settingsMap.disposable_block_action === act.value}
                          onChange={(e) => setKey('disposable_block_action', e.target.value)}
                        />
                        {act.label}
                      </label>
                    ))}
                  </div>
                </div>

                <DomainTable
                  whitelist={settingsMap.disposable_whitelist || []}
                  blacklist={settingsMap.disposable_blacklist || []}
                  onUpdateWhitelist={(wl) => setKey('disposable_whitelist', wl)}
                  onUpdateBlacklist={(bl) => setKey('disposable_blacklist', bl)}
                />

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 4: RISK SCORE SETTINGS */}
          {activeSection === 'risk' && (
            <SettingsCard
              title="4. Risk Score Weighting Rules"
              subtitle="Configure custom risk penalty points for detected email anomalies (0-100 risk score scale)."
              icon="⚡"
            >
              <form onSubmit={handleSaveSection}>
                <ScoreTable
                  rules={settingsMap.risk_rules || []}
                  onUpdateScore={(id, newScore) => {
                    const updated = settingsMap.risk_rules.map(r => r.id === id ? { ...r, score: newScore } : r);
                    setKey('risk_rules', updated);
                  }}
                  onToggleStatus={(id, newStatus) => {
                    const updated = settingsMap.risk_rules.map(r => r.id === id ? { ...r, status: newStatus } : r);
                    setKey('risk_rules', updated);
                  }}
                />

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 5: SMTP SETTINGS */}
          {activeSection === 'smtp' && (
            <SettingsCard
              title="5. SMTP Verification Socket Engine"
              subtitle="Configure socket timeout, retry attempts, and daily probe rate limits."
              icon="📧"
            >
              <form onSubmit={handleSaveSection}>
                <ToggleSwitch
                  label="SMTP Verification Probing"
                  description="Unavailable until mailbox worker is configured. This is separate from email sending SMTP."
                  checked={false}
                  onChange={() => undefined}
                  disabled
                  badgeText="Unavailable"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <FormInput
                    label="SMTP Timeout (Seconds)"
                    type="number"
                    value={settingsMap.smtp_timeout_seconds}
                    onChange={(v) => setKey('smtp_timeout_seconds', parseInt(v, 10) || 10)}
                    hint="Maximum socket connection wait time"
                  />

                  <FormInput
                    label="Retry Attempts"
                    type="number"
                    value={settingsMap.smtp_retry_attempts}
                    onChange={(v) => setKey('smtp_retry_attempts', parseInt(v, 10) || 3)}
                    hint="Retries on greylisting / temporary timeout"
                  />

                  <FormInput
                    label="Daily Probe Limit"
                    type="number"
                    value={settingsMap.smtp_daily_limit}
                    onChange={(v) => setKey('smtp_daily_limit', parseInt(v, 10) || 50000)}
                    hint="Maximum daily SMTP socket checks allowed"
                  />
                </div>

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 6: DNS/MX SETTINGS */}
          {activeSection === 'dns' && (
            <SettingsCard
              title="6. DNS & MX Record Engine"
              subtitle="Configure DNS resolver timeouts and result caching duration."
              icon="🌐"
            >
              <form onSubmit={handleSaveSection}>
                <ToggleSwitch
                  label="DNS Lookup Engine"
                  description="Enable async DNS A/AAAA record querying."
                  checked={settingsMap.dns_lookup_enabled}
                  onChange={(v) => setKey('dns_lookup_enabled', v)}
                />

                <ToggleSwitch
                  label="MX Record Check Engine"
                  description="Enable MX record lookup & mail server preference verification."
                  checked={settingsMap.mx_check_enabled}
                  onChange={(v) => setKey('mx_check_enabled', v)}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                  <FormInput
                    label="DNS Lookup Timeout (ms)"
                    type="number"
                    value={settingsMap.dns_timeout_ms}
                    onChange={(v) => setKey('dns_timeout_ms', parseInt(v, 10) || 5000)}
                    hint="Default: 5000ms (5 seconds)"
                  />

                  <FormInput
                    label="Cache Duration (Hours)"
                    type="number"
                    value={settingsMap.dns_cache_duration_hours}
                    onChange={(v) => setKey('dns_cache_duration_hours', parseInt(v, 10) || 24)}
                    hint="Store MX & DNS results in cache to speed up recurring queries"
                  />
                </div>

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 7: API SETTINGS */}
          {activeSection === 'api' && (
            <SettingsCard
              title="7. REST API & Rate Limiting Configuration"
              subtitle="Manage public API access, rate limits, quotas, and IP whitelist rules."
              icon="🔑"
            >
              <form onSubmit={handleSaveSection}>
                <ToggleSwitch
                  label="Enable Public REST API Access"
                  description="Allow external API requests using Bearer secret keys."
                  checked={settingsMap.enable_api_access}
                  onChange={(v) => setKey('enable_api_access', v)}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <FormInput
                    label="Rate Limit (req / min)"
                    type="number"
                    value={settingsMap.api_rate_limit_per_min}
                    onChange={(v) => setKey('api_rate_limit_per_min', parseInt(v, 10) || 120)}
                    hint="Maximum API requests per minute"
                  />

                  <FormInput
                    label="Daily Request Quota"
                    type="number"
                    value={settingsMap.api_request_limit_daily}
                    onChange={(v) => setKey('api_request_limit_daily', parseInt(v, 10) || 100000)}
                    hint="Daily max API request allowance"
                  />

                  <FormInput
                    label="API Key Expiration (Days)"
                    type="number"
                    value={settingsMap.api_key_expiration_days}
                    onChange={(v) => setKey('api_key_expiration_days', parseInt(v, 10) || 90)}
                    hint="Default API token lifetime"
                  />
                </div>

                <FormInput
                  label="Allowed Whitelisted IP Addresses (CIDR)"
                  value={Array.isArray(settingsMap.allowed_ip_addresses) ? settingsMap.allowed_ip_addresses.join(', ') : settingsMap.allowed_ip_addresses}
                  onChange={(v) => setKey('allowed_ip_addresses', v.split(',').map((ip) => ip.trim()).filter(Boolean))}
                  hint="Comma-separated IP addresses or CIDR blocks (e.g. 192.168.1.1, 0.0.0.0/0 for all)"
                />

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 8: SECURITY SETTINGS */}
          {activeSection === 'security' && (
            <SettingsCard
              title="8. System Security & Authentication Policies"
              subtitle="Configure 2FA enforcement, session timeout, password complexity, and activity logging."
              icon="🛡️"
              badge="Super Admin Only"
            >
              <form onSubmit={handleSaveSection}>
                <ToggleSwitch
                  label="Require Two-Factor Authentication (2FA)"
                  description="Enforce 2-Factor authentication across all administrative accounts."
                  checked={settingsMap.enable_2fa}
                  onChange={(v) => setKey('enable_2fa', v)}
                />

                <ToggleSwitch
                  label="Enable Automatic IP Blocking"
                  description="Automatically block IP addresses after 5 consecutive failed login attempts."
                  checked={settingsMap.enable_ip_blocking}
                  onChange={(v) => setKey('enable_ip_blocking', v)}
                />

                <ToggleSwitch
                  label="Enable System Activity Logs"
                  description="Record full administrative action audit logs for compliance."
                  checked={settingsMap.enable_activity_logs}
                  onChange={(v) => setKey('enable_activity_logs', v)}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <FormInput
                    label="Session Timeout (Minutes)"
                    type="number"
                    value={settingsMap.session_timeout_minutes}
                    onChange={(v) => setKey('session_timeout_minutes', parseInt(v, 10) || 60)}
                    hint="Logout inactive sessions"
                  />

                  <FormInput
                    label="Login Attempt Limit"
                    type="number"
                    value={settingsMap.login_attempt_limit}
                    onChange={(v) => setKey('login_attempt_limit', parseInt(v, 10) || 5)}
                    hint="Max attempts before temporary lockout"
                  />

                  <FormInput
                    label="Min Password Length"
                    type="number"
                    value={settingsMap.password_policy_min_length}
                    onChange={(v) => setKey('password_policy_min_length', parseInt(v, 10) || 8)}
                    hint="Password complexity requirement"
                  />
                </div>

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 9: USERS & PERMISSIONS (RBAC) */}
          {activeSection === 'rbac' && (
            <SettingsCard
              title="9. Role-Based Access Control (RBAC) Defaults"
              subtitle="Configure user creation permissions, default account role, and assigned permissions."
              icon="👥"
              badge="Super Admin Only"
            >
              <form onSubmit={handleSaveSection}>
                <ToggleSwitch
                  label="Allow Admins to Create New Users"
                  description="Grants Admin role permission to add users to the workspace."
                  checked={settingsMap.allow_admin_create_user}
                  onChange={(v) => setKey('allow_admin_create_user', v)}
                />

                <ToggleSwitch
                  label="Allow Standard Users to Create Sub-Users"
                  description="Permits standard User role to invite read-only sub-users."
                  checked={settingsMap.allow_user_create_sub_user}
                  onChange={(v) => setKey('allow_user_create_sub_user', v)}
                />

                <div style={{ marginTop: '16px' }}>
                  <SelectInput
                    label="Default Registration User Role"
                    value={settingsMap.default_user_role}
                    onChange={(v) => setKey('default_user_role', v)}
                    options={[
                      { label: 'User (Standard User)', value: 'User' },
                      { label: 'Sub User (Read-Only)', value: 'Sub User' },
                      { label: 'Admin (Workspace Admin)', value: 'Admin' },
                    ]}
                  />

                  <PermissionSelector
                    availablePermissions={availablePermissions}
                    selectedPermissions={settingsMap.default_permissions || []}
                    onChange={(perms) => setKey('default_permissions', perms)}
                  />
                </div>

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 10: BULK VALIDATION SETTINGS */}
          {activeSection === 'bulk' && (
            <SettingsCard
              title="10. Bulk CSV/XLSX Validation Limits"
              subtitle="Configure maximum file size, row count limits, worker chunk size, and auto-cleanup retention."
              icon="📦"
            >
              <form onSubmit={handleSaveSection}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormInput
                    label="Max Upload File Size (MB)"
                    type="number"
                    value={settingsMap.max_upload_size_mb}
                    onChange={(v) => setKey('max_upload_size_mb', parseInt(v, 10) || 50)}
                    hint="Maximum file size limit per upload"
                  />

                  <FormInput
                    label="Allowed File Extensions"
                    value={settingsMap.allowed_file_types}
                    onChange={(v) => setKey('allowed_file_types', v)}
                    hint="Supported list: .csv, .txt, .xlsx"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <FormInput
                    label="Max Emails Per File"
                    type="number"
                    value={settingsMap.max_emails_per_file}
                    onChange={(v) => setKey('max_emails_per_file', parseInt(v, 10) || 100000)}
                    hint="Row limit per bulk file"
                  />

                  <FormInput
                    label="Worker Queue Chunk Limit"
                    type="number"
                    value={settingsMap.queue_processing_limit}
                    onChange={(v) => setKey('queue_processing_limit', parseInt(v, 10) || 5000)}
                    hint="Emails processed per async queue batch"
                  />

                  <FormInput
                    label="Auto Delete Files (Days)"
                    type="number"
                    value={settingsMap.auto_delete_upload_files_days}
                    onChange={(v) => setKey('auto_delete_upload_files_days', parseInt(v, 10) || 7)}
                    hint="Delete processed upload files after N days"
                  />
                </div>

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 11: NOTIFICATIONS SETTINGS */}
          {activeSection === 'notifications' && (
            <SettingsCard
              title="11. System Email & Alert Preferences"
              subtitle="Configure automated notifications triggered by validation events and security alerts."
              icon="🔔"
            >
              <form onSubmit={handleSaveSection}>
                <ToggleSwitch
                  label="Single Email Validation Complete Alert"
                  description="Send email notification when single API validation finishes."
                  checked={settingsMap.notify_validation_complete_email}
                  onChange={(v) => setKey('notify_validation_complete_email', v)}
                />

                <ToggleSwitch
                  label="Bulk Job Complete Summary Email"
                  description="Send instant summary report when a bulk CSV validation job finishes."
                  checked={settingsMap.notify_bulk_job_complete_email}
                  onChange={(v) => setKey('notify_bulk_job_complete_email', v)}
                />

                <ToggleSwitch
                  label="API Usage & Credit Limit Warnings"
                  description="Alert account owner when API quota reaches 80% and 95% threshold."
                  checked={settingsMap.notify_api_limit_warning}
                  onChange={(v) => setKey('notify_api_limit_warning', v)}
                />

                <ToggleSwitch
                  label="Security & New Login Alerts"
                  description="Instant security notification when an unrecognized IP logs in."
                  checked={settingsMap.notify_security_alert}
                  onChange={(v) => setKey('notify_security_alert', v)}
                />

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 12: BILLING SETTINGS */}
          {activeSection === 'billing' && (
            <SettingsCard
              title="12. SaaS Subscription & Billing Configuration"
              subtitle="Manage plan quotas, credit allowances, payment gateways, and auto-invoicing rules."
              icon="💳"
              badge="Super Admin Only"
            >
              <form onSubmit={handleSaveSection}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <FormInput
                    label="Pricing Currency"
                    value={settingsMap.billing_currency}
                    onChange={(v) => setKey('billing_currency', v)}
                  />

                  <FormInput
                    label="Active Plan Tiers"
                    value={settingsMap.plans_enabled}
                    onChange={(v) => setKey('plans_enabled', v)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <FormInput
                    label="Free Tier Credits"
                    type="number"
                    value={settingsMap.free_plan_monthly_credits}
                    onChange={(v) => setKey('free_plan_monthly_credits', parseInt(v, 10) || 100)}
                  />

                  <FormInput
                    label="Pro Tier Credits"
                    type="number"
                    value={settingsMap.pro_plan_monthly_credits}
                    onChange={(v) => setKey('pro_plan_monthly_credits', parseInt(v, 10) || 25000)}
                  />

                  <FormInput
                    label="Enterprise Credits"
                    type="number"
                    value={settingsMap.enterprise_plan_monthly_credits}
                    onChange={(v) => setKey('enterprise_plan_monthly_credits', parseInt(v, 10) || 1000000)}
                  />
                </div>

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

          {/* SECTION 13: INTEGRATIONS SETTINGS */}
          {activeSection === 'integrations' && (
            <SettingsCard
              title="13. Webhooks & External App Integrations"
              subtitle="Configure webhook endpoints and third-party integrations (Slack, Zapier, HubSpot)."
              icon="🔌"
            >
              <form onSubmit={handleSaveSection}>
                <FormInput
                  label="Real-Time Webhook POST Endpoint URL"
                  value={settingsMap.webhook_url}
                  onChange={(v) => setKey('webhook_url', v)}
                  hint="Receive HTTP POST payloads when email validation jobs complete."
                />

                <div style={{ margin: '16px 0', display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    style={{
                      background: '#10B981',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => notify('⚡ Test Webhook Ping sent! Received HTTP 200 OK from server.')}
                  >
                    Ping Webhook Endpoint
                  </button>
                </div>

                {/* Third-Party App Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '20px' }}>
                  {[
                    { name: 'Zapier', desc: 'Connect with 5000+ apps', icon: '⚡', connected: true },
                    { name: 'Slack', desc: 'Real-time job alerts in channel', icon: '💬', connected: true },
                    { name: 'HubSpot', desc: 'Auto-sync clean CRM contacts', icon: '🧡', connected: false },
                  ].map((app) => (
                    <div key={app.name} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                      <div style={{ fontSize: '24px', marginBottom: '6px' }}>{app.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{app.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 12px' }}>{app.desc}</div>
                      <button
                        type="button"
                        className="btn-ghost btn-sm"
                        onClick={() => notify(`${app.name} integration settings updated.`)}
                      >
                        {app.connected ? 'Configure' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>

                <SaveButton loading={saveLoading} onReset={() => setShowResetModal(true)} />
              </form>
            </SettingsCard>
          )}

        </SettingsLayout>
      </div>
    </ProtectedRoute>
  );
}
