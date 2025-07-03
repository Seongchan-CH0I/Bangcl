import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.example.com', // 실제 API 주소로 변경 필요
  headers: {
    'Content-Type': 'application/json',
  },
}); 