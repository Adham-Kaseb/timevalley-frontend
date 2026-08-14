export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | string;
  phone?: string;
  bio?: string;
  avatar?: string;
  studentId?: string;
  hasDiplomaAccess?: boolean;
  hasPurchasedDiploma?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
