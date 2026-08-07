import type { ReactNode } from 'react';

interface SectionHeadProps {
  chip: string;
  title: string;
  sub: string;
  children?: ReactNode;
}

export default function SectionHead({ chip, title, sub, children }: SectionHeadProps) {
  return (
    <div className="f-head">
      <span className="chip"><span className="dot"></span> {chip}</span>
      <h2 className="f-title">{title}</h2>
      <p className="f-sub">{sub}</p>
      {children}
    </div>
  );
}
