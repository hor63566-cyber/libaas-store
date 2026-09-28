'use client';

// ------------------------------------------------------------
// Login page — email + password, errors shown inline.
// ------------------------------------------------------------

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/auth.module.css';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Already logged in — nothing to do here
  if (user) {
    router.push('/');
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setBusy(true);
    try {
      await login({ email: email.trim(), password });
      router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`container section ${styles.wrap}`}>
      <form className={styles.card} onSubmit={onSubmit}>
        <h1>Welcome back</h1>
        <p className={styles.sub}>Log in to your Libaas account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Logging in…' : 'Log In'}
        </button>

        <p className={styles.switch}>
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
