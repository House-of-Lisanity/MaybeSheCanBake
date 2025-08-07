"use client";

import { useEffect, useState } from "react";
import Card from "../components/Card";
import CardSlider from "../components/CardSlider";

type ReviewType = {
  _id: string;
  name: string;
  content: string;
  date?: string;
};

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section id="reviews">
      <h2>What People Are Saying</h2>
      {loading && <p>Loading reviews...</p>}

      {!loading && reviews.length > 0 && (
        <CardSlider>
          {reviews.map((r) => (
            <Card
              key={r._id}
              content={
                <figure className="review-content">
                  <blockquote>{r.content}</blockquote>
                  <figcaption>
                    {r.name}
                    {r.date && (
                      <span className="review-date">
                        {" "}
                        – {new Date(r.date).toLocaleDateString()}
                      </span>
                    )}
                  </figcaption>
                </figure>
              }
            />
          ))}
        </CardSlider>
      )}
    </section>
  );
}
