import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEMO_EMAILS, DEMO_PASSWORD } from '../constants/demoAccounts';
import { MANAGER_ROLES, ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';
import { signIn } from '../services/authService';
import { validateAuthForm } from '../utils/validators';

const INITIAL_VALUES = { name: '', email: '', password: '' };

/** Mengelola state, validasi, dan pengiriman form login/registrasi. */
export function useAuthForm({ mode, onAuthChange }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [selectedRole, setSelectedRole] = useState(ROLES.STUDENT);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = mode === 'register';

  /** Membuat handler onChange untuk satu field form. */
  const bindField = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  function chooseDemoAccount(role) {
    setSelectedRole(role);
    setValues((current) => ({ ...current, email: DEMO_EMAILS[role], password: DEMO_PASSWORD }));
  }

  function getRedirectPath(user) {
    if (location.state?.from) return location.state.from;
    return MANAGER_ROLES.includes(user.role) ? ROUTES.DASHBOARD : ROUTES.HOME;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const validationError = validateAuthForm(values, isRegister);
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);

    try {
      const user = await signIn(mode, values);
      onAuthChange(user);
      navigate(getRedirectPath(user));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return {
    isRegister,
    values,
    selectedRole,
    error,
    busy,
    bindField,
    chooseDemoAccount,
    handleSubmit,
  };
}
