// src/components/ProductModal.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductType, ProductCategory } from "@/types/product";
import ImageUploader from "@/components/admin/ImageUploader";

type ProductModalProps = {
  product: ProductType | null; // null for add new
  onClose: () => void;
  onSaved: () => void;
};

export default function ProductModal({
  product,
  onClose,
  onSaved,
}: ProductModalProps) {
  const isEditing = Boolean(product?._id);

  // Form state: blank for new, prefilled for edit
  const [formData, setFormData] = useState<Partial<ProductType>>({
    name: "",
    category: ProductCategory.Cookies,
    price: "",
    description: "",
    highlights: [],
    ingredients: [],
    imageUrl: "",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    } else {
      setFormData({
        name: "",
        category: ProductCategory.Cookies,
        price: "",
        description: "",
        highlights: [],
        ingredients: [],
        imageUrl: "",
        isAvailable: true,
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Comma-separated arrays for highlights/ingredients
  const handleArrayChange = (
    name: "highlights" | "ingredients",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ONLY perform API calls using fetch
    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing
      ? `/api/products/${formData._id}`
      : "/api/products";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);
    if (!res.ok) {
      alert("Error saving product.");
      return;
    }
    onSaved();
    onClose();
  };

  const handleDelete = async () => {
    if (!formData._id) return;
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    const res = await fetch(`/api/products/${formData._id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (!res.ok) {
      alert("Error deleting product.");
      return;
    }
    onSaved();
    onClose();
  };

  const categoryOptions = Object.values(ProductCategory).filter(
    (c) => c !== ProductCategory.All
  );

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
          <select
            name="category"
            value={formData.category || ProductCategory.Cookies}
            onChange={handleChange}
            required
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="Price"
          />
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Description"
          />
          <textarea
            name="highlights"
            value={(formData.highlights || []).join(", ")}
            onChange={(e) => handleArrayChange("highlights", e.target.value)}
            placeholder="Highlights (comma-separated)"
          />
          <textarea
            name="ingredients"
            value={(formData.ingredients || []).join(", ")}
            onChange={(e) => handleArrayChange("ingredients", e.target.value)}
            placeholder="Ingredients (comma-separated)"
          />
          <ImageUploader
            imageUrl={formData.imageUrl}
            onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
          />
          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={Boolean(formData.isAvailable)}
              onChange={handleChange}
            />
            Available
          </label>
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {isEditing ? "Update Product" : "Create Product"}
            </button>
            {isEditing && (
              <button type="button" onClick={handleDelete} disabled={loading}>
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
