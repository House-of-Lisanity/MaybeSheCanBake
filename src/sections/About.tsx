"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type AboutType = {
  _id: string;
  content: string;
};

export default function About() {
  const [bio, setBio] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        setBio(data);
      } catch (err) {
        console.error("Failed to load about content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, []);

  const getPreview = (html: string) => {
    const tempEl = document.createElement("div");
    tempEl.innerHTML = html;
    const text = tempEl.textContent || tempEl.innerText || "";
    return text.slice(0, 250) + "...";
  };

  return (
    <section id="about">
      <h2>About Me</h2>
      {loading && <p>Loading bio...</p>}

      {!loading && bio && (
        <div className="about-preview">
          <div className="about-card">
            <Image
              src="/logo.jpg" // replace later with Cloudinary or actual image
              alt="Photo of the owner"
              width={250}
              height={250}
              className="about-photo"
            />
            <div className="about-content">
              {showFull ? (
                <div dangerouslySetInnerHTML={{ __html: bio.content }} />
              ) : (
                <p>{getPreview(bio.content)}</p>
              )}
              <button onClick={() => setShowFull(!showFull)}>
                {showFull ? "Show Less" : "Read More"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
