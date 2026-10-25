export default function StatePanel({ children, variant }) {
  const className = variant === 'error' ? 'state-panel error-state' : 'state-panel';
  return <div className={className}>{children}</div>;
}
