const P = { fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const paths = {
  bolt:   <path d="M13 3L5 13h6l-1 8 8-11h-6z" stroke="currentColor" {...P} />,
  shield: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" stroke="currentColor" {...P} />,
  gauge:  <><path d="M4 18a8 8 0 1116 0" stroke="currentColor" {...P} /><path d="M12 18l4-5" stroke="currentColor" {...P} /></>,
  upload: <><path d="M12 15V4M8 8l4-4 4 4" stroke="currentColor" {...P} /><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" {...P} /></>,
  export: <><path d="M12 4v11M8 11l4 4 4-4" stroke="currentColor" {...P} /><path d="M4 20h16" stroke="currentColor" {...P} /></>,
  sheet:  <><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" {...P} /><path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" {...P} /></>,
  trap:   <><circle cx="12" cy="12" r="8" stroke="currentColor" {...P} /><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" {...P} /></>,
  code:   <><path d="M9 8l-4 4 4 4M15 8l4 4-4 4" stroke="currentColor" {...P} /><path d="M13 5l-2 14" stroke="currentColor" {...P} /></>,
  users:  <><circle cx="9" cy="8" r="3" stroke="currentColor" {...P} /><path d="M3.5 19a5.5 5.5 0 0111 0" stroke="currentColor" {...P} /><path d="M16 6.5a3 3 0 010 5.8" stroke="currentColor" {...P} /></>,
  arrow:  <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  check:  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  plus:   <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  mail:   <><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></>,
  logo:   <><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" /></>,
};

export default function Icon({ name, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {paths[name]}
    </svg>
  );
}
