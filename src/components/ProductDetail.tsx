"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/types/product";
import Navbar from "@/components/NavBar";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <section className="product-detail">
      <Navbar alwaysScrolled />

      <div className="detail-wrapper">
        <div className="image-column">
          <Image
            src={product.imageUrl ?? "/placeholder.png"}
            alt={product.name}
            width={600}
            height={600}
            className="product-image"
            priority
          />
        </div>

        <div className="info-column">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          <p className="price">
            <strong>Price:</strong> {product.price}
          </p>

          {Array.isArray(product.highlights) &&
            product.highlights.length > 0 && (
              <div className="product-section">
                <h3>Highlights</h3>
                <ul>
                  {product.highlights.map((tag, idx) => (
                    <li key={idx}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}

          {Array.isArray(product.ingredients) &&
            product.ingredients.length > 0 && (
              <div className="product-section">
                <h3>Ingredients</h3>
                <ul>
                  {product.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}

          <nav className="product-nav">
            <Link href="/products">← Return to Products</Link>
            <span className="divider">|</span>
            <Link href="/">Return to Home</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
