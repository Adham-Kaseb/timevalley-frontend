import apiClient from "@/lib/axios";

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  format: string;
  fileUrl: string;
  desc: string;
  downloadsCount: number;
}

export const resourcesService = {
  async getResources(category?: string, search?: string): Promise<ResourceItem[]> {
    try {
      const res = await apiClient.get("/resources", { params: { category, search } });
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch resources from backend", err);
      return [];
    }
  },

  async downloadResource(resourceId: string, userId?: string) {
    const res = await apiClient.post(`/resources/${resourceId}/download`, { userId });
    return res.data;
  },
};

export default resourcesService;
