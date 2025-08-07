"use client";

import { useEffect, useState } from "react";
import EventList from "@/components/EventList";
import EventCalendar from "@/components/EventCalendar";

type EventType = {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
};

export default function Calendar() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section id="calendar">
      <h2>Upcoming Events</h2>
      <div className="view-toggle">
        <button
          onClick={() => setViewMode("list")}
          disabled={viewMode === "list"}
        >
          List View
        </button>
        <button
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
            <EventList events={events} />
          ) : (
            <EventCalendar events={events} />
          )}
        </div>
      )}
    </section>
  );
}
