interface MapLinksProps {
  address: string;
  label?: string;
}

export default function MapLinks({ address, label }: MapLinksProps) {
  const encodedAddress = encodeURIComponent(address);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodedAddress}`;

  const linkLabel = label ?? "View on Maps";

  return (
    <div className="map-links">
      <span className="map-links-label">{linkLabel}</span>
      <div className="map-links-buttons">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="map-link-btn"
        >
          Google Maps
        </a>
        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="map-link-btn"
        >
          Apple Maps
        </a>
      </div>
    </div>
  );
}
