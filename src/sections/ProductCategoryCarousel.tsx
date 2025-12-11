// src/sections/ProductCategoryCarousel.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardSlider from "@/components/CardSlider";
import Card from "@/components/Card";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";

type ProductCategory = ProductType["category"];

interface CategoryCard {
  categoryId: string;
  slug: string;
  title: string;
  imageUrl?: string;
}

/**
 * Safely extract category info (id, slug, title) from a product's category field.
 * Handles both populated Category objects and string ObjectIds.
 */
function getCategoryInfo(category: ProductCategory): CategoryCard {
  // Default generic category card
  const defaultCard: CategoryCard = {
    categoryId: "generic",
    slug: "All",
    title: "Featured Treats",
    imageUrl: undefined,
  };

  if (!category) {
    return defaultCard;
  }

  if (typeof category === "object") {
    const cat = category as CategoryType & { _id?: string };

    const categoryId = cat._id ?? cat.slug ?? cat.name ?? "generic";
    const title = cat.name ?? "Featured Treats";
    const slug = cat.slug ?? cat.name ?? "All";

    return {
      categoryId,
      slug,
      title,
      imageUrl: undefined,
    };
  }

  // If it's a string (likely ObjectId), we cannot infer slug/name here;
  // treat it as an opaque category id but still route to "All".
  return {
    categoryId: category,
    slug: "All",
    title: "Featured Treats",
    imageUrl: undefined,
  };
}

export default function ProductSlider() {
  const [categoryCards, setCategoryCards] = useState<CategoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch("/api/products?featured=true");
        if (!res.ok) {
          throw new Error(`Failed to fetch featured products: ${res.status}`);
        }
        const data: ProductType[] = await res.json();

        // Group featured products by category and build one card per category.
        const map = new Map<string, CategoryCard>();

        for (const product of data) {
          const baseInfo = getCategoryInfo(product.category);

          // If we already created a card for this category, skip (we only need one).
          if (map.has(baseInfo.categoryId)) {
            continue;
          }

          // Use the product's image as the category card image.
          const card: CategoryCard = {
            ...baseInfo,
            imageUrl: product.imageUrl,
          };

          map.set(baseInfo.categoryId, card);
        }

        setCategoryCards(Array.from(map.values()));
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section id="products">
      <h2>Featured Treats</h2>

      {loading && <p>Loading featured treats...</p>}

      {!loading && categoryCards.length === 0 && (
        <p>
          No featured treats are currently available. Please check back soon!
        </p>
      )}

      {!loading && categoryCards.length > 0 && (
        <>
          <CardSlider forceCarousel forceArrows>
            {categoryCards.map((card) => (
              <Card
                key={card.categoryId}
                title={card.title}
                content=""
                image={card.imageUrl}
                onClick={() => {
                  router.push(
                    `/products?category=${encodeURIComponent(card.slug)}`
                  );
                }}
              />
            ))}
          </CardSlider>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button onClick={() => router.push("/products?category=All")}>
              View All Products
            </button>
          </div>
        </>
      )}
    </section>
  );
}
