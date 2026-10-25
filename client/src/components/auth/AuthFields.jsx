import { LockKeyhole, Mail, UserRound } from 'lucide-react';

function Field({ label, icon: Icon, ...inputProps }) {
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

export default function AuthFields({ values, onChange, isRegister }) {
  return (
    <>
      {isRegister && (
        <Field
          label="Nama lengkap"
          icon={UserRound}
          id="name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Nama kamu"
        />
      )}
      <Field
        label="Email kampus"
        icon={Mail}
        id="username"
        name="username"
        autoComplete="username"
        required
        type="text" inputMode="email" autoCapitalize="none" autoCorrect="off"
        value={values.email}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="nama@kampus.ac.id"
      />
      <Field
        label="Password"
        icon={LockKeyhole}
        id="password"
        name="password"
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        required
        minLength={8}
        type="password"
        value={values.password}
        onChange={(e) => onChange('password', e.target.value)}
        placeholder="Minimal 8 karakter"
      />
    </>
  );
}

