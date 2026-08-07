export default function SectionHead({ chip, title, sub, children }) {
  return (
    <div className="f-head">
      <span className="chip"><span className="dot"></span> {chip}</span>
      <h2 className="f-title">{title}</h2>
      <p className="f-sub">{sub}</p>
      {children}
    </div>
  );
}
