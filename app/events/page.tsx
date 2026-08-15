"use client";

import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsGrid from "@/components/events/EventsGrid";
import RsvpModal, { EventItem } from "@/components/events/RsvpModal";
import eventsService from "@/services/events";

export default function PitchEventsPage() {
  const [activeType, setActiveType] = useState("All Events");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rsvpedIds, setRsvpedIds] = useState<{ [key: string]: boolean }>({});
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsService.getEvents();
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        setEvents([
          {
            id: "event-1",
            title: "Global Demo Day Q3 2026",
            date: "AUG 28",
            time: "16:00 UTC",
            location: "Virtual + Dubai Studio",
            type: "Pitch Event",
            speakers: "12 Portfolio Startups & 200+ VCs",
            desc: "Watch 12 high-growth startups pitch live to tier-1 venture capital partners and angel syndicates.",
            status: "RSVP Open",
          },
          {
            id: "event-2",
            title: "DeepTech Founder Office Hours with TimeValley Partners",
            date: "SEP 04",
            time: "14:00 UTC",
            location: "Riyadh Tech Hub",
            type: "Workshop",
            speakers: "Dr. Wael & Aisha Al-Mansoor",
            desc: "1-on-1 pitch teardowns, term sheet reviews, and technical architecture feedback for early-stage teams.",
            status: "Limited Seats",
          },
        ]);
      }
    } catch (err) {
      console.warn("Using default events fallback", err);
    }
  };

  const handleOpenRsvp = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleConfirmRsvp = async (eventId: string, email?: string) => {
    setRsvpedIds((prev) => ({ ...prev, [eventId]: true }));
    if (email) {
      try {
        await eventsService.rsvpEvent(eventId, email);
      } catch (err) {
        console.warn("RSVP recorded locally", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF0E9] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-8">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs />

        {/* Hero Section & Type Filters */}
        <EventsHeroSection
          activeType={activeType}
          onSelectType={setActiveType}
        />

        {/* Events Grid */}
        <EventsGrid
          events={events}
          activeType={activeType}
          onOpenRsvpModal={handleOpenRsvp}
          rsvpedIds={rsvpedIds}
        />
      </div>

      {/* RSVP Pass Ticket Modal */}
      <RsvpModal
        isOpen={isModalOpen}
        event={selectedEvent}
        onClose={() => setIsModalOpen(false)}
        onConfirmRsvp={(id) => handleConfirmRsvp(id)}
      />
    </div>
  );
}
