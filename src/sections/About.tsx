// maybeshecanbake/src/sections/About.tsx
"use client";

import { useEffect, useState } from "react";
import CardSlider from "@/components/CardSlider";
import Card from "@/components/Card";

type AboutSection = {
  _id: string;
  sectionKey: string;
  title: string;
  subtitle?: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  isVisible: boolean;
  sortOrder?: number;
};

const MAX_PREVIEW_LENGTH = 350;

export default function AboutSectionCarousel() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1) Fetch about sections
        const aboutRes = await fetch("/api/about");
        if (!aboutRes.ok) {
          throw new Error(`Failed to fetch about sections: ${aboutRes.status}`);
        }

        const aboutData: AboutSection[] = await aboutRes.json();

        // Only keep visible + non-empty sections
        const filtered = aboutData.filter(
          (sec) => sec.isVisible && sec.body && sec.body.trim() !== ""
        );

        // 2) Fetch the headshot image
        // 2) Fetch the headshot image
        let headshot: { url: string; caption?: string } | null = null;
        try {
          // ✅ matches your route: src/app/api/gallery/headshot/route.ts
          const imgRes = await fetch("/api/gallery/headshot");
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            headshot = {
              url: imgData.url,
              caption: imgData.caption,
            };
          }
        } catch (imgErr) {
          console.error("Failed to load headshot image:", imgErr);
        }

        // 3) Attach the headshot ONLY to the "baker" section
        const finalSections = filtered.map((sec) => {
          if (
            sec.sectionKey === "baker" &&
            headshot &&
            (!sec.imageUrl || sec.imageUrl.trim() === "")
          ) {
            return {
              ...sec,
              imageUrl: headshot.url,
              imageAlt: sec.imageAlt || headshot.caption || sec.title,
            };
          }

          // All other sections are untouched
          return sec;
        });

        setSections(finalSections);
      } catch (err) {
        console.error("Failed to load about sections:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchAll();
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getPreviewText = (body: string, expanded: boolean): string => {
    if (expanded || body.length <= MAX_PREVIEW_LENGTH) {
      return body;
    }
    return body.slice(0, MAX_PREVIEW_LENGTH).trimEnd() + "...";
  };

  return (
    <section id="about">
      <h2>About</h2>

      {loading && <p>Loading...</p>}

      {!loading && sections.length === 0 && (
        <p>No About content is available right now. Please check back later.</p>
      )}

      {!loading && sections.length > 0 && (
        <CardSlider forceCarousel singleItem>
          {sections.map((section) => {
            const isExpanded = section._id === expandedId;
            const previewText = getPreviewText(section.body, isExpanded);
            const shouldShowButton = section.body.length > MAX_PREVIEW_LENGTH;

            return (
              <Card
                key={section._id}
                image={section.imageUrl}
                title={section.title}
                content={
                  <>
                    {section.subtitle && <h3>{section.subtitle}</h3>}

                    <p>
                      {previewText}

                      {shouldShowButton && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // just in case the card becomes clickable
                            toggleExpanded(section._id);
                          }}
                        >
                          {isExpanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </p>
                  </>
                }
              />
            );
          })}
        </CardSlider>
      )}
    </section>
  );
}
