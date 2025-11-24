// maybeshecanbake/src/sections/About.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

export default function AboutSectionBasic() {
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        if (!res.ok) {
          throw new Error(`Failed to fetch about sections: ${res.status}`);
        }

        const data: AboutSection[] = await res.json();

        // Find the "About the Baker" section by sectionKey,
        // fall back to the first visible section if needed.
        const bakerSection =
          data.find(
            (sec) =>
              sec.sectionKey === "baker" &&
              sec.body &&
              sec.body.trim() !== "" &&
              sec.isVisible
          ) ||
          data.find(
            (sec) => sec.body && sec.body.trim() !== "" && sec.isVisible
          ) ||
          null;

        setAbout(bakerSection);
      } catch (err) {
        console.error("Failed to load about section:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  // Short preview of the body text when not expanded
  const getPreviewText = (body: string): string => {
    const maxLength = 350; // adjust to "a few lines"
    if (expanded || body.length <= maxLength) {
      return body;
    }
    return body.slice(0, maxLength).trimEnd() + "...";
  };

  return (
    <section id="about">
      <h2>About the Baker</h2>

      {loading && <p>Loading...</p>}

      {!loading && !about && (
        <p>No About content is available right now. Please check back later.</p>
      )}

      {!loading && about && (
        <article className="about-basic">
          {about.imageUrl && (
            <div className="about-basic__image-wrapper">
              <Image
                src={about.imageUrl}
                alt={about.imageAlt || about.title || "About the baker"}
                width={400}
                height={400}
                className="about-basic__image"
              />
            </div>
          )}

          <div className="about-basic__text">
            {/* Optional: if you want a subheading inside the section */}
            {about.subtitle && <h3>{about.subtitle}</h3>}

            <p>{getPreviewText(about.body)}</p>

            {about.body.length > 220 && (
              <button type="button" onClick={toggleExpanded}>
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        </article>
      )}
    </section>
  );
}

// // maybeshecanbake/src/sections/About.tsx
// "use client";

// import { useEffect, useState } from "react";
// import CardSlider from "@/components/CardSlider";
// import Card from "@/components/Card";

// type AboutSection = {
//   _id: string;
//   sectionKey: string;
//   title: string;
//   subtitle?: string;
//   body: string;
//   imageUrl?: string;
//   imageAlt?: string;
//   isVisible: boolean;
//   sortOrder?: number;
// };

// export default function AboutSectionCarousel() {
//   const [sections, setSections] = useState<AboutSection[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSections = async () => {
//       try {
//         const res = await fetch("/api/about");
//         if (!res.ok) {
//           throw new Error(`Failed to fetch about sections: ${res.status}`);
//         }

//         const data: AboutSection[] = await res.json();

//         // Extra safety: drop any entries with missing/empty body
//         const filtered = data.filter(
//           (sec) => sec.body && sec.body.trim() !== ""
//         );

//         setSections(filtered);
//       } catch (err) {
//         console.error("Failed to load about sections:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSections();
//   }, []);

//   return (
//     <section id="about">
//       <h2>About Me</h2>

//       {loading && <p>Loading...</p>}

//       {!loading && sections.length === 0 && <p>No About content available.</p>}

//       {!loading && sections.length > 0 && (
//         <CardSlider>
//           {sections.map((section) => (
//             <Card
//               key={section._id}
//               title={section.title}
//               content={section.body}
//               image={section.imageUrl}
//               onClick={undefined} // no click action needed for About
//             />
//           ))}
//         </CardSlider>
//       )}
//     </section>
//   );
// }
