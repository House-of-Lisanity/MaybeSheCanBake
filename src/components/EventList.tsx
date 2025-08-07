type EventType = {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
};

export default function EventList({ events }: { events: EventType[] }) {
  return (
    <ul className="event-list">
      {events.map((event) => (
        <li key={event._id}>
          <strong>{event.title}</strong> –{" "}
          {new Date(event.date).toLocaleDateString()} <br />
          <em>{event.location}</em>
          {event.description && <p>{event.description}</p>}
        </li>
      ))}
    </ul>
  );
}
