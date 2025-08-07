"use client";

import { useEffect, useState } from "react";
import CardSlider from "@/components/CardSlider";
import Card from "@/components/Card";
import { CategoryType } from "@/types/category";
import { useRouter } from "next/navigation";

export default function ProductSlider() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/categories`);

        const data = await res.json();
        console.log("Fetched categories:", data); // ADD THIS
        setCategories(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section id="products">
      <h2>Featured Treats</h2>
      {loading && <p>Loading products...</p>}
      <CardSlider>
        {categories.map((category) => (
          <Card
            key={category._id}
            title={category.name}
            content={category.description}
            image={category.imageUrl}
            onClick={() =>
              router.push(
                `/products?category=${encodeURIComponent(category.name)}`
              )
            }
          />
        ))}
      </CardSlider>
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button
          className="view-all-button"
          onClick={() => router.push("/products?category=All")}
        >
          View All Products
        </button>
      </div>
    </section>
  );
}
