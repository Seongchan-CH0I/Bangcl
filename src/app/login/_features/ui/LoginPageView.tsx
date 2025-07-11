'use client';

import { useState } from 'react';
import { LoginForm, RegisterForm } from '../../_entities/model/types';
import { useLogin, useRegister } from '../../_entities/api/queries';
import styles from './LoginPageView.module.css';
import { useUserStore } from '../../_entities/model/user-store';

export default function LoginPageView({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
  });

  const { setUsername, setUserId } = useUserStore();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    const formSetter = isRegistering ? setRegisterForm : setLoginForm;
    formSetter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isRegistering) {
      registerMutation.mutate(registerForm, {
        onSuccess: () => {
          alert('회원가입이 완료되었습니다. 로그인해주세요.');
          setIsRegistering(false);
        },
        onError: (error) => {
          alert(`회원가입 실패: ${error.message}`);
        },
      });
    } else {
      loginMutation.mutate(loginForm, {
        onSuccess: (data) => {
          setUsername(data.username);
          onLoginSuccess();
        },
        onError: (error) => {
          alert(`로그인 실패: ${error.message}`);
        },
      });
    }
  }

  return (
    <div className={styles.loginRoot}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <button type="button" className={styles.closeButton} onClick={onLoginSuccess}>
          &times;
        </button>
        <h1 className={styles.loginTitle}>{isRegistering ? 'Create Account' : 'Sign in to name'}</h1>
        <p className={styles.loginDesc}>Lorem Ipsum is simply</p>
        
        {isRegistering && (
          <label className={styles.inputLabel}>
            Username
            <input
              type="text"
              name="username"
              value={registerForm.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={styles.inputField}
            />
          </label>
        )}

        <label className={styles.inputLabel}>
          Email
          <input
            type="email"
            name="email"
            value={isRegistering ? registerForm.email : loginForm.email}
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
            value={isRegistering ? registerForm.password : loginForm.password}
            onChange={handleChange}
            placeholder="Enter your Password"
            className={`${styles.inputField} ${styles.inputFieldPassword}`}
          />
        </label>

        

        <button type="submit" className={styles.loginButton}>
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <div className={styles.toggleFormText}>
          {isRegistering ? 'Already have an account?' : "If you don't have an account register"}<br />
          <a href="#" className={styles.toggleFormLink} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login here !' : 'You can Register here !'}
          </a>
        </div>
      </form>
    </div>
  );
}
