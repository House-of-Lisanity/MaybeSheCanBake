// src/sections/ProductCatalog.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Navbar from "@/components/NavBar";
// import ProductModal from "@/components/admin/ProductModal";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";

type ProductWithCategory = ProductType & {
  // category can be either a populated object or a string id/name
  category?: string | CategoryType;
};

export default function ProductCatalog() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [filtered, setFiltered] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [category, setCategory] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);

  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_MODE === "true";

  const searchParams = useSearchParams();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data: ProductWithCategory[] = await res.json();
      setProducts(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data: CategoryType[] = await res.json();
      const names = data.map((c) => c.name);
      setCategories(["All", ...names]);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Read category from URL query (?category=Cookies)
  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (fromUrl) {
      setCategory(decodeURIComponent(fromUrl));
    }
  }, [searchParams]);

  // Apply filtering when category or products change
  useEffect(() => {
    if (category === "All") {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((p) => {
          const catField = p.category;

          if (!catField) return false;

          // If populated product.category is an object
          if (typeof catField === "object" && "name" in catField) {
            return catField.name === category;
          }

          // Fallback: if category was stored as a plain string
          if (typeof catField === "string") {
            return catField === category;
          }

          return false;
        })
      );
    }
  }, [category, products]);

  return (
    <section className="product-catalog">
      <Navbar alwaysScrolled />
      <h1>Our Products</h1>

      {isAdmin && (
        <div style={{ margin: "0.75rem 0" }}>
          <button onClick={() => setShowModal(true)}>+ Add Product</button>
        </div>
      )}

      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cat === category ? "active" : ""}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        <p>
          Please note: Each flavor has a minimum order of 6 pieces. You cannot
          mix flavors within a batch; increases must be in half dozen increments
          per flavor. At this time, we are not offering shipping. Orders are for
          pick-up only.
        </p>
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <Card
            key={product._id}
            image={product.imageUrl}
            title={product.name}
            content={`${product.description?.slice(0, 60) || ""}...`}
            meta={product.price}
            href={`/products/${product._id}`}
          />
        ))}
      </div>

      {/* {isAdmin && showModal && (
        <ProductModal
          product={null}
          onClose={() => setShowModal(false)}
          onSaved={fetchProducts}
        />
      )} */}
    </section>
  );
}
