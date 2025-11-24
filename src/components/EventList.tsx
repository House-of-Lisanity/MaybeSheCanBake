import { EventType } from "@/types/event";

type Props = {
  events: EventType[];
  isAdmin?: boolean;
  onEdit?: (event: EventType) => void;
  onSelect?: (event: EventType) => void; // 🔽 NEW: called when a customer clicks an event
};

export default function EventList({
  events,
  isAdmin = false,
  onEdit,
  onSelect,
}: Props) {
  const handleItemClick = (event: EventType) => {
    if (!isAdmin && onSelect) {
      onSelect(event);
    }
  };

  const handleEditClick = (event: EventType, e: React.MouseEvent) => {
    // Prevent triggering onSelect when clicking the Edit button
    e.stopPropagation();
    if (onEdit) {
      onEdit(event);
    }
  };

  return (
    <ul className="event-list">
      {events.map((event) => (
        <li
          key={event._id}
          className={
            !isAdmin && onSelect
              ? "event-list-item clickable"
              : "event-list-item"
          }
          onClick={
            !isAdmin && onSelect ? () => handleItemClick(event) : undefined
          }
        >
          <strong>{event.title}</strong> –{" "}
          {new Date(event.date).toLocaleDateString()} <br />
          <em>{event.location}</em>
          {event.description && <p>{event.description}</p>}
          {/* ✅ ADMIN Edit Button (does not trigger onSelect) */}
          {isAdmin && onEdit && (
            <button
              type="button"
              onClick={(e) => handleEditClick(event, e)}
              className="edit-event-btn"
            >
              Edit
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
