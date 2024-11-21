import axios, { AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import getAPIUrl from './env';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Profile {
  id: string;
  name: string | null;
  username: string;
}

export interface Tokens {
  accessToken: string;
}

export interface LoginResponse {
  status?: number;
  profile: Profile;
  tokens: Tokens;
}

export const api = axios.create({
  baseURL: getAPIUrl(),
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AxiosResponse> => {
  try {
    const response = await api.post<LoginResponse>('/v1/auth/login', credentials);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response;
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};
