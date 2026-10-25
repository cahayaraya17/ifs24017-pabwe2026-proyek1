/** Panel status (loading, kosong, atau error) yang dipakai ulang di banyak halaman. */
export default function StatePanel({ variant = '', children }) {
  const className = variant ? `state-panel ${variant}` : 'state-panel';
  return <div className={className}>{children}</div>;
}
