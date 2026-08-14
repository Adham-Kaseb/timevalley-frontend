import apiClient from '@/lib/axios';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactService = {
  /**
   * Submit contact form inquiry to backend & dispatch notification email
   * POST /contact
   */
  async submitContact(payload: ContactPayload): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>('/contact', payload);
    return response.data;
  },
};

export default contactService;
