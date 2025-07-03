// 로그인 폼 타입
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

// 로그인 응답 타입
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
} 