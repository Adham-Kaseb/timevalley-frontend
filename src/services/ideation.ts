import apiClient from "@/lib/axios";

export interface VentureIdea {
  id?: string;
  title: string;
  sector: string;
  icpTarget: string;
  problemStatement: string;
  tamEstimate: string;
  pitchScore?: number;
}

export interface MarketCalculation {
  id?: string;
  title: string;
  tamAmount: string;
  samAmount: string;
  somAmount: string;
  defensibilityScore?: number;
}

export const ideationService = {
  async saveIdea(data: VentureIdea) {
    const res = await apiClient.post("/ideation/ideas", data);
    return res.data;
  },

  async getUserIdeas() {
    const res = await apiClient.get("/ideation/ideas");
    return res.data;
  },

  async saveMarketCalculation(data: MarketCalculation) {
    const res = await apiClient.post("/ideation/market-calculations", data);
    return res.data;
  },

  async getUserCalculations() {
    const res = await apiClient.get("/ideation/market-calculations");
    return res.data;
  },
};

export default ideationService;
