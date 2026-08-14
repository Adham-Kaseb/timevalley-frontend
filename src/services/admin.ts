import apiClient from '@/lib/axios';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  permissions: string[];
  enrollments?: Array<{ courseId: string; status: string }>;
}

export interface AdminModulePayload {
  moduleNumber: string;
  title: string;
  badgeTitle: string;
  description: string;
  orderIndex?: number;
}

export interface AdminLessonPayload {
  moduleId: string;
  lessonNumber: number;
  title: string;
  desc: string;
  duration: string;
  videoUrl?: string;
  materials?: any[];
  orderIndex?: number;
}

export const adminService = {
  /**
   * Fetch all users & sub-admins for Admin Access Management
   */
  async listUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get<AdminUser[]>('/users/admin/list');
    return response.data;
  },

  /**
   * Update sub-admin role and module permissions
   */
  async updateUserPermissions(userId: string, role: string, permissionKeys: string[]) {
    const response = await apiClient.patch('/users/admin/permissions', {
      userId,
      role,
      permissionKeys,
    });
    return response.data;
  },

  /**
   * Diploma Builder - Create Module
   */
  async createModule(payload: AdminModulePayload) {
    const response = await apiClient.post('/courses/admin/modules', payload);
    return response.data;
  },

  /**
   * Diploma Builder - Update Module
   */
  async updateModule(id: string, payload: Partial<AdminModulePayload>) {
    const response = await apiClient.patch(`/courses/admin/modules/${id}`, payload);
    return response.data;
  },

  /**
   * Diploma Builder - Delete Module
   */
  async deleteModule(id: string) {
    const response = await apiClient.delete(`/courses/admin/modules/${id}`);
    return response.data;
  },

  /**
   * Diploma Builder - Create Lesson
   */
  async createLesson(payload: AdminLessonPayload) {
    const response = await apiClient.post('/courses/admin/lessons', payload);
    return response.data;
  },

  /**
   * Diploma Builder - Update Lesson
   */
  async updateLesson(id: string, payload: Partial<AdminLessonPayload>) {
    const response = await apiClient.patch(`/courses/admin/lessons/${id}`, payload);
    return response.data;
  },

  /**
   * Diploma Builder - Delete Lesson
   */
  async deleteLesson(id: string) {
    const response = await apiClient.delete(`/courses/admin/lessons/${id}`);
    return response.data;
  },

  // --- USER & STUDENT MANAGEMENT METHODS ---

  /**
   * Create a new student or admin user
   */
  async createUser(payload: { name: string; email: string; password: string; phone?: string; role?: string; autoEnrollDiploma?: boolean }) {
    const response = await apiClient.post('/users/admin/create-user', payload);
    return response.data;
  },

  /**
   * Toggle student diploma enrollment status (ACTIVE / INACTIVE)
   */
  async toggleEnrollment(userId: string, status: string, courseId = 'venture-architect-diploma') {
    const response = await apiClient.post('/users/admin/toggle-enrollment', {
      userId,
      courseId,
      status,
    });
    return response.data;
  },

  /**
   * Unlock or revoke a specific diploma module for a student
   */
  async unlockModule(userId: string, moduleId: string, unlock: boolean, notes?: string) {
    const response = await apiClient.post('/users/admin/unlock-module', {
      userId,
      moduleId,
      unlock,
      notes,
    });
    return response.data;
  },

  /**
   * Send custom diploma assignment or playbook content to a student
   */
  async assignContent(payload: { userId: string; title: string; description: string; attachmentUrl?: string; dueDate?: string }) {
    const response = await apiClient.post('/users/admin/assign-content', payload);
    return response.data;
  },

  /**
   * Fetch full student profile with enrollments, unlocked modules, custom tasks, and progress
   */
  async getStudentDetail(studentId: string) {
    const response = await apiClient.get(`/users/admin/student-detail/${studentId}`);
    return response.data;
  },
};

export default adminService;
