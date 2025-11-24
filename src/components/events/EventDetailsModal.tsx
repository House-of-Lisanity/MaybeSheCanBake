"use client";

import Modal from "@/components/Modal";
import MapLinks from "@/components/MapLinks";
import { EventType } from "@/types/event";

interface EventDetailsModalProps {
  event: EventType;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
}: EventDetailsModalProps) {
  if (!event) {
    return null;
  }

  const {
    title,
    date,
    time,
    location,
    description,
    address,
    externalUrl,
    heroImageUrl,
  } = event;

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mapAddress = address ?? location;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="event-details-modal">
        {/* Hero image, if available */}
        {heroImageUrl && (
          <div className="event-details-hero">
            <img src={heroImageUrl} alt={`Hero for ${title}`} />
          </div>
        )}

        <div className="event-details-main">
          <div className="event-details-info">
            <p className="event-details-date-time">
              <strong>{formattedDate}</strong>
              {time && (
                <>
                  {" "}
                  · <span>{time}</span>
                </>
              )}
            </p>
            <p className="event-details-location">
              <strong>Location:</strong> {location}
            </p>

            {description && (
              <p className="event-details-description">{description}</p>
            )}
          </div>

          {/* Placeholder for products at this event */}
          <div className="event-details-products">
            <h4>Products at this pop-up</h4>
            <p>Product list coming soon.</p>
            {/* Later: render real products associated with this event */}
          </div>

          {/* External links */}
          <div className="event-details-links">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="event-details-external-link"
              >
                View event website
              </a>
            )}

            {mapAddress && (
              <MapLinks address={mapAddress} label="Find this event" />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
