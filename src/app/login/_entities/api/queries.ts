import { useMutation } from '@tanstack/react-query';
import { api } from './axios';
import { LoginForm, LoginResponse, RegisterForm, User } from '../model/types';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginForm>({
    mutationFn: async (form: LoginForm) => {
      const { email, password } = form;
      const { data } = await api.post<LoginResponse>('/login', { email, password });
      return data;
    },
  });
}

export function useRegister() {
  return useMutation<User, Error, RegisterForm>({
    mutationFn: async (form: RegisterForm) => {
      const { data } = await api.post<User>('/users', form);
      return data;
    },
  });
} 