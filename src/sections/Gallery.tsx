"use client";

import { useEffect, useState } from "react";
import CardSlider from "@/components/CardSlider";
import Card from "@/components/Card";

type ImageType = {
  _id: string;
  url: string;
  caption?: string;
};

export default function Gallery() {
  const [gallery, setGallery] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setGallery(data);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section id="gallery">
      <h2>Gallery</h2>
      {loading && <p>Loading images...</p>}
      <CardSlider>
        {gallery.map((image) => (
          <Card key={image._id} image={image.url} title={image.caption} />
        ))}
      </CardSlider>
    </section>
  );
}
