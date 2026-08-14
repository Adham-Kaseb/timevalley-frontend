"use client";

import React, { useState } from "react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsGrid from "@/components/events/EventsGrid";
import RsvpModal, { EventItem } from "@/components/events/RsvpModal";

export default function PitchEventsPage() {
  const [activeType, setActiveType] = useState("All Events");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rsvpedIds, setRsvpedIds] = useState<{ [key: string]: boolean }>({});

  const events: EventItem[] = [
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
    {
      id: "event-3",
      title: "AI & Autonomous Agents Engineering Masterclass",
      date: "SEP 12",
      time: "18:00 UTC",
      location: "Cairo AI Studio",
      type: "Masterclass",
      speakers: "Fatima Al-Hassan & Omar Al-Farsi",
      desc: "Deep-dive into multi-agent LLM orchestration, vector databases, and production RAG pipeline architecture.",
      status: "RSVP Open",
    },
    {
      id: "event-4",
      title: "Pre-Seed SAFE & Cap Table Structuring Roundtable",
      date: "SEP 19",
      time: "15:00 UTC",
      location: "London Hub + Zoom",
      type: "Legal Clinic",
      speakers: "Layla Al-Kaabi & Legal Counsel",
      desc: "Master post-money SAFE math, option pool sizing, and founder vesting schedules to avoid cap table debt.",
      status: "Registration Open",
    },
    {
      id: "event-5",
      title: "MENA Enterprise SaaS Go-To-Market Summit",
      date: "OCT 02",
      time: "11:00 UTC",
      location: "Abu Dhabi Hub",
      type: "Summit",
      speakers: "Venture Partners & SaaS Founders",
      desc: "Strategies for closing enterprise B2B pilots across Gulf corporations and government innovation labs.",
      status: "Upcoming",
    },
    {
      id: "event-6",
      title: "TimeValley Alumni Founder Dinner & Deal Night",
      date: "OCT 15",
      time: "19:00 UTC",
      location: "DIFC Dubai",
      type: "Networking",
      speakers: "TimeValley Cohort Alumni",
      desc: "Exclusive gathering for cohort graduates, angel syndicates, and corporate venture partners.",
      status: "Invite Only",
    },
  ];

  const handleOpenRsvp = (event: EventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleConfirmRsvp = (eventId: string) => {
    setRsvpedIds((prev) => ({ ...prev, [eventId]: true }));
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
        onConfirmRsvp={handleConfirmRsvp}
      />
    </div>
  );
}
