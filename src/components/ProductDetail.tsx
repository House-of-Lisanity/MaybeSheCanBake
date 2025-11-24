"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/NavBar";
// import ProductModal from "@/components/admin/ProductModal";
import { ProductType } from "@/types/product";
import { buildCloudinaryUrl } from "@/lib/cloudinaryUrl";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<ProductType | null>(null);
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_MODE === "true";
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data: ProductType = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };

    void fetchProduct();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/products/${id}`);
      const data: ProductType = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Failed to refresh product:", err);
    }
  };

  const handleDelete = async () => {
    if (!product?._id) return;
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/products");
      } else {
        console.error("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  if (!product) {
    return (
      <section className="product-detail">
        <Navbar alwaysScrolled />
        <div className="product-detail__loading">
          <p>Loading product…</p>
        </div>
      </section>
    );
  }

  const baseImageUrl = product.imageUrl ?? "/placeholder.png";

  // Art-directed Cloudinary variants; if not Cloudinary, helper just returns original
  const desktopImageUrl = buildCloudinaryUrl(baseImageUrl, 1200, 800);
  const tabletImageUrl = buildCloudinaryUrl(baseImageUrl, 900, 700);
  const mobileImageUrl = buildCloudinaryUrl(baseImageUrl, 600, 500);

  return (
    <section className="product-detail">
      <Navbar alwaysScrolled />

      <div className="product-detail__inner">
        <article className="product-detail__card">
          {/* IMAGE ON TOP */}
          <div className="product-detail__image-wrapper">
            <picture>
              <source media="(min-width: 1024px)" srcSet={desktopImageUrl} />
              <source media="(min-width: 600px)" srcSet={tabletImageUrl} />
              <img
                src={mobileImageUrl}
                alt={product.name}
                className="product-detail__image"
              />
            </picture>
          </div>

          {/* TEXT CONTENT */}
          <header className="product-detail__header">
            <h1 className="product-detail__title">{product.name}</h1>
            {product.price && (
              <p className="product-detail__price">
                <span>Price</span>
                <strong>{product.price}</strong>
              </p>
            )}
          </header>

          {product.description && (
            <p className="product-detail__description">{product.description}</p>
          )}

          {Array.isArray(product.highlights) &&
            product.highlights.length > 0 && (
              <section className="product-detail__section">
                <h3 className="product-detail__section-title">Highlights</h3>
                <ul className="product-detail__list">
                  {product.highlights.map((tag, idx) => (
                    <li key={idx}>{tag}</li>
                  ))}
                </ul>
              </section>
            )}

          {Array.isArray(product.ingredients) &&
            product.ingredients.length > 0 && (
              <section className="product-detail__section">
                <h3 className="product-detail__section-title">Ingredients</h3>
                <ul className="product-detail__list">
                  {product.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </section>
            )}

          <hr className="product-detail__divider" />

          <nav className="product-detail__nav">
            <Link href="/products">← Return to Products</Link>
            <span className="product-detail__nav-divider">|</span>
            <Link href="/">Return to Home</Link>
          </nav>

          {isAdmin && (
            <div className="product-detail__admin-actions">
              <button
                type="button"
                className="product-detail__admin-button"
                onClick={() => setShowModal(true)}
              >
                Edit Product
              </button>
              <button
                type="button"
                className="product-detail__admin-button product-detail__admin-button--danger"
                onClick={handleDelete}
              >
                Delete Product
              </button>
            </div>
          )}
        </article>
      </div>

      {/* {isAdmin && showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
          onSaved={refetch}
        />
      )} */}
    </section>
  );
}
