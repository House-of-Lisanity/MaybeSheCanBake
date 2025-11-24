"use client";

import { useEffect, useState } from "react";
import EventList from "@/components/EventList";
import EventCalendar from "@/components/EventCalendar";
import { EventType } from "@/types/event";
import EventDetailsModal from "@/components/events/EventDetailsModal";

export default function Calendar() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data: EventType[] = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchEvents();
  }, []);

  const handleSelectEvent = (event: EventType) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section id="calendar">
      <h2>Upcoming Events</h2>
      <div className="view-toggle">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          disabled={viewMode === "list"}
        >
          List View
        </button>
        <button
          type="button"
          onClick={() => setViewMode("calendar")}
          disabled={viewMode === "calendar"}
        >
          Calendar View
        </button>
      </div>

      {loading && <p>Loading events...</p>}
      {!loading && events.length === 0 && <p>No events scheduled right now.</p>}

      {!loading && events.length > 0 && (
        <div className="event-view">
          {viewMode === "list" ? (
            <EventList events={events} onSelect={handleSelectEvent} />
          ) : (
            <EventCalendar events={events} />
          )}
        </div>
      )}

      {/* 🔽 Event details modal (pop-up sale / event info) */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
