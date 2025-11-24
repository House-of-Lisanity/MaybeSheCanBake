"use client";
import { useState } from "react"; // ✅ ADDED
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import EventModal from "./admin/EventModal"; // ✅ ADDED
import { EventType } from "@/types/event"; // ✅ ADDED

type Props = {
  events: EventType[];
};

export default function EventCalendar({ events: initialEvents }: Props) {
  const isAdmin = true; // 🔧 TEMPORARY toggle — replace later with real check

  const [events, setEvents] = useState(initialEvents); // ✅ ADDED
  const [showModal, setShowModal] = useState(false); // ✅ ADDED
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null); // ✅ ADDED

  const calendarEvents = events.map((event) => ({
    title: `${event.title} (${event.location})`,
    date: event.date,
    id: event._id,
  }));

  const openModal = (event: EventType | null = null) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const refreshEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        height="auto"
      />

      {/* ✅ ADMIN Add Event Button */}
      {isAdmin && (
        <button onClick={() => openModal(null)} className="add-event-btn">
          + Add Event
        </button>
      )}

      {/* ✅ Event Modal */}
      {showModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowModal(false)}
          onSave={refreshEvents}
        />
      )}
    </div>
  );
}
