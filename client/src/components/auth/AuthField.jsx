/** Input berlabel dengan ikon di dalam kolom; atribut input lain diteruskan apa adanya. */
export default function AuthField({ label, icon: Icon, ...inputProps }) {
  return (
    <label>
      {label}
      <div className="input-with-icon">
        <Icon size={17} />
        <input {...inputProps} />
      </div>
    </label>
  );
}
