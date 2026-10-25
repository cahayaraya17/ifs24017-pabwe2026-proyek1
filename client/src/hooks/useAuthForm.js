import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from '../constants';
import { authenticate } from '../services/authService';
import { isManager } from '../utils/roles';
import { validateAuthForm } from '../utils/validators';

export function useAuthForm({ mode, onAuthChange }) {
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('student');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = mode === 'register';

  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function chooseDemo(role) {
    setSelectedRole(role);
    setValues((current) => ({ ...current, email: DEMO_ACCOUNTS[role], password: DEMO_PASSWORD }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    const validationError = validateAuthForm(values, isRegister);
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    try {
      const user = await authenticate(mode, values);
      onAuthChange(user);
      navigate(location.state?.from || (isManager(user) ? '/dashboard' : '/'));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return { values, setField, selectedRole, chooseDemo, error, busy, isRegister, submit };
}
