import apiClient from "@/lib/axios";

export interface RecruitingTeamItem {
  id: string;
  name: string;
  sector: string;
  founderName: string;
  description: string;
  openRoles: string[];
  equitySplit: string;
  status: string;
}

export const teamsService = {
  async getTeams(sector?: string): Promise<RecruitingTeamItem[]> {
    try {
      const res = await apiClient.get("/teams", { params: { sector } });
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch teams from backend, using fallback data", err);
      return [];
    }
  },

  async createTeam(data: {
    name: string;
    sector: string;
    founderName: string;
    description: string;
    openRoles: string[];
    equitySplit: string;
  }) {
    const res = await apiClient.post("/teams", data);
    return res.data;
  },

  async applyToTeam(teamId: string, data: { appliedRole: string; coverNote?: string }) {
    const res = await apiClient.post(`/teams/${teamId}/apply`, data);
    return res.data;
  },
};

export default teamsService;
