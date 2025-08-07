"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { ProductType } from "@/types/product";
import Navbar from "@/components/NavBar";

export default function ProductCatalog() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filtered, setFiltered] = useState<ProductType[]>([]);
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        setFiltered(data); // show all by default
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (category === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === category));
    }
  }, [category, products]);

  const categories = ["All", "Cookies", "Dessert Bars", "Muffins", "Cakes"];

  return (
    <section className="product-catalog">
      <Navbar alwaysScrolled />
      <h1>Our Products</h1>

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
        {filtered.map((product) => (
          <Card
            key={product._id}
            image={product.imageUrl}
            title={product.name}
            content={`${product.description?.slice(0, 60)}...`}
            meta={product.price}
            href={`/products/${product._id}`}
          />
        ))}
      </div>
    </section>
  );
}
