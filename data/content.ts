type ContentIcon = 'bolt' | 'shield' | 'gauge' | 'upload' | 'export' | 'sheet' | 'trap' | 'code' | 'users';
interface Feature { icon: ContentIcon; title: string; desc: string; featured?: boolean }
interface Step { icon: ContentIcon; title: string; desc: string }
interface Statistic { value: string; label: string }
interface Plan { name: string; monthly: number; yearly: number; desc: string; features: string[]; cta: string; variant: string; popular?: boolean }

export const features: Feature[] = [
  { icon: 'bolt',   title: 'Real-time verification', desc: 'Format, domain, and live MX checks the moment an address is entered.', featured: true },
  { icon: 'shield', title: 'Disposable detection',   desc: 'Block temporary and throwaway inboxes before they reach your list.' },
  { icon: 'gauge',  title: 'AI quality score',       desc: 'Every address gets a 0–100 score, so you know exactly what is safe to send.' },
  { icon: 'upload', title: 'Bulk list cleaning',     desc: 'Upload a CSV or Excel file and clean thousands of emails in seconds.' },
  { icon: 'sheet',  title: 'Google Sheet sync',      desc: 'Validate a connected sheet and sync the clean results back automatically.' },
  { icon: 'trap',   title: 'Spam-trap shield',       desc: 'Flag known traps and blacklisted domains to protect your deliverability.' },
  { icon: 'code',   title: 'Developer API',          desc: 'One REST endpoint, JSON in and out, with usage-based rate limits.' },
  { icon: 'users',  title: 'Team roles & logs',      desc: 'Invite your team as Admin, Manager, or Viewer with full activity logs.' },
];

export const steps: Step[] = [
  { icon: 'upload', title: 'Add your emails',     desc: 'Check one address, upload a CSV or Excel file, or connect a Google Sheet.' },
  { icon: 'bolt',   title: 'AI runs 200+ checks', desc: 'Format, domain, MX, disposable, spam-traps and reputation — all in real time.' },
  { icon: 'gauge',  title: 'Get scored results',  desc: 'Each address returns a status and a 0–100 quality score you can trust.' },
  { icon: 'export', title: 'Export or sync',      desc: 'Download the clean list or auto-sync valid emails back to your sheet or CRM.' },
];

export const stats: Statistic[] = [
  { value: '2.4M+',  label: 'Emails validated' },
  { value: '99.2%',  label: 'Accuracy rate' },
  { value: '8,000+', label: 'Senders trust us' },
  { value: '142ms',  label: 'Avg. response' },
];

export const plans: Plan[] = [
  { name: 'Free', monthly: 0, yearly: 0, desc: 'For trying MailMetric on a small list.',
    features: ['100 validations / month', 'Single email checker', 'Basic quality score', 'Community support'],
    cta: 'Start free', variant: 'ghost' },
  { name: 'Starter', monthly: 29, yearly: 24, desc: 'For growing teams cleaning lists weekly.',
    features: ['10,000 validations / month', 'Bulk + Google Sheet sync', 'API access & webhooks', 'Email support'],
    cta: 'Choose Starter', variant: 'ghost' },
  { name: 'Business', monthly: 99, yearly: 82, desc: 'For scale, teams and compliance.', popular: true,
    features: ['100,000 validations / month', 'Full AI insights suite', 'Team roles & activity logs', 'Priority support & SLA'],
    cta: 'Choose Business', variant: 'white' },
];

export const faqs: Array<readonly [string, string]> = [
  ['How does MailMetric verify an email?',
   'We run layered checks — syntax, domain and live MX records, disposable-domain matching, and blacklist and spam-trap lookups — then combine them into a 0–100 AI quality score, all in real time.'],
  ['Will checking emails hurt my sender reputation?',
   'No. Validation runs on our infrastructure and never sends mail from your domain, so your reputation stays untouched while you clean the list.'],
  ['What can I upload for bulk cleaning?',
   'CSV, Excel (.xlsx / .xls), or a connected Google Sheet. Map the email column once and MailMetric validates every row, then lets you export or sync the clean results.'],
  ['Is there an API for developers?',
   'Yes. A single REST endpoint takes an email and returns JSON with the status, quality score, and each individual check. Usage-based rate limits scale with your plan.'],
  ['How accurate is the validation?',
   'MailMetric reaches around 99% accuracy on deliverable addresses by pairing real-time DNS/MX checks with AI scoring — so you cut bounces without losing real contacts.'],
  ['Can I add my team?',
   'Invite teammates as Admin, Manager, or Viewer, share one credit pool, and track every action in the activity log.'],
];
