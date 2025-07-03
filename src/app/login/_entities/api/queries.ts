import { useMutation } from 'react-query';
import { api } from './axios';
import { LoginForm, LoginResponse } from '../model/types';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginForm>(
    async (form: LoginForm) => {
      const { data } = await api.post<LoginResponse>('/login', form);
      return data;
    }
  );
} 