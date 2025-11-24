"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HeroImage = {
  _id: string;
  url: string;
  caption?: string;
  isHero?: boolean;
};

export default function Hero() {
  const [hero, setHero] = useState<HeroImage | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        // 🚨 ONLY CHANGE #1: point to /api/hero
        const res = await fetch("/api/hero");

        if (!res.ok) {
          console.error("Failed to load hero image");
          return;
        }

        // 🚨 ONLY CHANGE #2: this returns ONE image, not an array
        const data: HeroImage = await res.json();
        setHero(data);
      } catch (err) {
        console.error("Failed to load hero image:", err);
      }
    };

    fetchHero();
  }, []);

  return (
    <section className="hero-banner full-width" aria-label="Hero banner">
      {hero && (
        <div className="hero-banner__image-wrapper">
          <Image
            src={hero.url}
            alt={hero.caption || "Hero banner"}
            width={1920}
            height={600}
            className="hero-banner__image"
            priority
          />
        </div>
      )}
    </section>
  );
}
