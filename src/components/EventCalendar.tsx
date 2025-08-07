"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

type EventType = {
  _id: string;
  title: string;
  date: string;
  location: string;
};

export default function EventCalendar({ events }: { events: EventType[] }) {
  const calendarEvents = events.map((event) => ({
    title: `${event.title} (${event.location})`,
    date: event.date,
    id: event._id,
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
      height="auto"
    />
  );
}
