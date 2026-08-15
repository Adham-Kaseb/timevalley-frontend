import apiClient from "@/lib/axios";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  speakers: string;
  desc: string;
  status: string;
}

export const eventsService = {
  async getEvents(type?: string): Promise<EventItem[]> {
    try {
      const res = await apiClient.get("/events", { params: { type } });
      return res.data;
    } catch (err) {
      console.warn("Failed to fetch events from backend", err);
      return [];
    }
  },

  async rsvpEvent(eventId: string, userEmail: string) {
    const res = await apiClient.post(`/events/${eventId}/rsvp`, { userEmail });
    return res.data;
  },

  async getMyRsvps() {
    const res = await apiClient.get("/events/my-rsvps");
    return res.data;
  },
};

export default eventsService;
