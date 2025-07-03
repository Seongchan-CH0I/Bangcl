'use client';

import { useState } from 'react';
import { LoginForm } from '../../_entities/model/types';
import { useLogin } from '../../_entities/api/queries';
import styles from './LoginPageView.module.css';

export default function LoginPageView({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const loginMutation = useLogin();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLoginSuccess();
  }

  return (
    <div className={styles.loginRoot}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <button type="button" className={styles.closeButton} onClick={onLoginSuccess}>
          &times;
        </button>
        <h1 className={styles.loginTitle}>Sign in to name</h1>
        <p className={styles.loginDesc}>Lorem Ipsum is simply</p>
        <label className={styles.inputLabel}>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className={styles.inputField}
          />
        </label>
        <label className={styles.inputLabel}>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your Password"
            className={`${styles.inputField} ${styles.inputFieldPassword}`}
          />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            Rememebr me
          </label>
          <a href="#" style={{ color: '#4d4d4d', fontSize: 12 }}>Forgot Password ?</a>
        </div>
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
        <div style={{ textAlign: 'center', color: '#b5b5b5', margin: '16px 0' }}>or continue with</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button type="button" className={`${styles.snsButton} ${styles.snsFacebook}`}>F</button>
          <button type="button" className={`${styles.snsButton} ${styles.snsApple}`}>A</button>
          <button type="button" className={`${styles.snsButton} ${styles.snsGoogle}`}>G</button>
        </div>
        <div style={{ marginTop: 24, textAlign: 'center', color: '#000' }}>
          If you don't have an account register<br />
          <a href="#" style={{ color: '#0c21c1', fontWeight: 500 }}>You can Register here !</a>
        </div>
      </form>
    </div>
  );
}
