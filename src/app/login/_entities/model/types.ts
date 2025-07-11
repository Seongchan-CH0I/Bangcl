// 로그인 폼 타입
export interface LoginForm {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  username: string;
}

// 회원가입 폼 타입
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

// 유저 타입
export interface User {
  id: number;
  username: string;
  email: string;
} 