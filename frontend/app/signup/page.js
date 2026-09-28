'use client';

// ------------------------------------------------------------
// Signup page — name, email, password (+ optional phone).
// ------------------------------------------------------------

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/auth.module.css';

export default function SignupPage() {
  const { signup, user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) {
    router.push('/');
    return null;
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.name.trim().length < 3) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setBusy(true);
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });
      router.push('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`container section ${styles.wrap}`}>
      <form className={styles.card} onSubmit={onSubmit}>
        <h1>Create account</h1>
        <p className={styles.sub}>Faster checkout and order updates</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label>Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Ayesha Khan"
            autoComplete="name"
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </div>

        <div className="field">
          <label>Phone (optional)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="0300 1234567"
            autoComplete="tel"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Creating account…' : 'Sign Up'}
        </button>

        <p className={styles.switch}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
