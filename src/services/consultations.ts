import apiClient from "@/lib/axios";

export interface ConsultationCardItem {
  id: string;
  title: string;
  consultantName: string;
  consultantTitle: string;
  consultantAvatar?: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  bookingUrl?: string;
  tags?: string[];
  isPublished: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConsultationPayload {
  title: string;
  consultantName?: string;
  consultantTitle?: string;
  consultantAvatar?: string;
  category: string;
  description: string;
  duration: string;
  price?: number;
  currency?: string;
  bookingUrl?: string;
  tags?: string[];
  isPublished?: boolean;
  orderIndex?: number;
}

export interface BookConsultationPayload {
  consultationId?: string;
  consultationTitle?: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  notes?: string;
}

export const consultationsService = {
  async getPublicConsultations(category?: string): Promise<ConsultationCardItem[]> {
    try {
      const res = await apiClient.get("/consultations", { params: { category } });
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch consultations from backend, using fallbacks", err);
      return [
        {
          id: "card-1",
          title: "1-on-1 Venture Strategy & Thesis Alignment",
          consultantName: "Dr. Wael",
          consultantTitle: "Founder & Managing Partner",
          consultantAvatar: "/images/team/CEO.jpg",
          category: "Venture Strategy",
          description: "Comprehensive 60-minute strategic deep-dive on market positioning, business model viability, and unit economics validation for seed & series-A startups.",
          duration: "60 Mins",
          price: 250,
          currency: "USD",
          bookingUrl: "https://calendly.com",
          tags: ["Strategy", "Business Model", "Seed Gate"],
          isPublished: true,
          orderIndex: 1,
        },
        {
          id: "card-2",
          title: "Investor Pitch Deck Teardown & Valuation Review",
          consultantName: "Dr. Wael",
          consultantTitle: "Founder & Managing Partner",
          consultantAvatar: "/images/team/CEO.jpg",
          category: "Pitch Review",
          description: "Line-by-line teardown of your investor pitch deck, financial projections, TAM/SAM modeling, and valuation ask before presenting to top-tier VCs.",
          duration: "45 Mins",
          price: 200,
          currency: "USD",
          bookingUrl: "https://calendly.com",
          tags: ["Pitch Deck", "Valuation", "VC Pitch"],
          isPublished: true,
          orderIndex: 2,
        },
        {
          id: "card-3",
          title: "Product-Market Fit & MENA Expansion Blueprint",
          consultantName: "Dr. Wael",
          consultantTitle: "Founder & Managing Partner",
          consultantAvatar: "/images/team/CEO.jpg",
          category: "Venture Building",
          description: "Architecting your cross-border MENA expansion strategy (Saudi, UAE, Egypt), B2B enterprise sales pipelines, and regulatory compliance roadmap.",
          duration: "60 Mins",
          price: 300,
          currency: "USD",
          bookingUrl: "https://calendly.com",
          tags: ["Go-To-Market", "GCC Expansion", "Enterprise B2B"],
          isPublished: true,
          orderIndex: 3,
        },
        {
          id: "card-4",
          title: "Pre-Seed SAFE & Cap Table Equity Advisory",
          consultantName: "Dr. Wael",
          consultantTitle: "Founder & Managing Partner",
          consultantAvatar: "/images/team/CEO.jpg",
          category: "Growth & Funding",
          description: "Expert guidance on post-money SAFE structuring, co-founder equity splits, option pool allocation, and term sheet negotiation strategy.",
          duration: "45 Mins",
          price: 180,
          currency: "USD",
          bookingUrl: "https://calendly.com",
          tags: ["SAFE Terms", "Cap Table", "Fundraising"],
          isPublished: true,
          orderIndex: 4,
        },
      ];
    }
  },

  async getAllAdmin(): Promise<ConsultationCardItem[]> {
    try {
      const res = await apiClient.get("/consultations/admin/all");
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch admin consultations from backend", err);
      return [
        {
          id: "card-1",
          title: "1-on-1 Venture Strategy & Thesis Alignment",
          consultantName: "Dr. Wael",
          consultantTitle: "Founder & Managing Partner",
          consultantAvatar: "/images/team/CEO.jpg",
          category: "Venture Strategy",
          description: "Comprehensive 60-minute strategic deep-dive on market positioning, business model viability, and unit economics validation for seed & series-A startups.",
          duration: "60 Mins",
          price: 250,
          currency: "USD",
          bookingUrl: "https://calendly.com",
          tags: ["Strategy", "Business Model", "Seed Gate"],
          isPublished: true,
          orderIndex: 1,
        },
        {
          id: "card-2",
          title: "Investor Pitch Deck Teardown & Valuation Review",
          consultantName: "Dr. Wael",
          consultantTitle: "Founder & Managing Partner",
          consultantAvatar: "/images/team/CEO.jpg",
          category: "Pitch Review",
          description: "Line-by-line teardown of your investor pitch deck, financial projections, TAM/SAM modeling, and valuation ask before presenting to top-tier VCs.",
          duration: "45 Mins",
          price: 200,
          currency: "USD",
          bookingUrl: "https://calendly.com",
          tags: ["Pitch Deck", "Valuation", "VC Pitch"],
          isPublished: true,
          orderIndex: 2,
        },
      ];
    }
  },

  async createConsultation(payload: CreateConsultationPayload): Promise<ConsultationCardItem> {
    const res = await apiClient.post("/consultations/admin", payload);
    return res.data;
  },

  async updateConsultation(id: string, payload: Partial<CreateConsultationPayload>): Promise<ConsultationCardItem> {
    const res = await apiClient.patch(`/consultations/admin/${id}`, payload);
    return res.data;
  },

  async deleteConsultation(id: string): Promise<void> {
    await apiClient.delete(`/consultations/admin/${id}`);
  },

  async bookConsultation(payload: BookConsultationPayload) {
    const res = await apiClient.post("/consultations/book", payload);
    return res.data;
  },
};

export default consultationsService;
