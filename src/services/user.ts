import apiClient from '@/lib/axios';
import { User } from '@/types';

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  code: string;
  credentialUrl?: string;
}

export const userService = {
  /**
   * Update user profile information
   * PATCH /users/profile
   */
  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    const response = await apiClient.patch<User>('/users/profile', dto);
    return response.data;
  },

  /**
   * Upload user avatar profile picture
   * PATCH /users/profile or POST /users/avatar
   */
  async uploadAvatar(avatar: string): Promise<User> {
    try {
      const response = await apiClient.patch<User>('/users/profile', { avatar });
      return response.data;
    } catch (e) {
      const response = await apiClient.post<User>('/users/avatar', { avatar });
      return response.data;
    }
  },

  /**
   * Update user password
   * PATCH /users/change-password
   */
  async changePassword(dto: ChangePasswordDto): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>('/users/change-password', dto);
    return response.data;
  },

  /**
   * Fetch user certificates
   * GET /users/certificates
   */
  async getCertificates(): Promise<Certificate[]> {
    const response = await apiClient.get<Certificate[]>('/users/certificates');
    return response.data;
  },
};

export default userService;
