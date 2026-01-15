// src/components/FlashSaleModal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { FlashSaleType, FlashSaleProduct } from "@/types/flashSale";

interface FlashSaleModalProps {
  flashSale: FlashSaleType;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryNotes: string;
  giftMessage: string;
  selectedProducts: Record<string, number>;
}

export default function FlashSaleModal({
  flashSale,
  isOpen,
  onClose,
}: FlashSaleModalProps) {
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryNotes: "",
    giftMessage: "",
    selectedProducts: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductQuantityChange = (productName: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: {
        ...prev.selectedProducts,
        [productName]: quantity,
      },
    }));
  };

  const calculateTotal = (): number => {
    let total = 0;
    flashSale.products.forEach((product) => {
      const quantity = formData.selectedProducts[product.name] || 0;
      total += product.price * quantity;
    });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const total = calculateTotal();

    if (total === 0) {
      setSubmitError("Please select at least one product.");
      setIsSubmitting(false);
      return;
    }

    const orderItems = flashSale.products
      .filter((product) => (formData.selectedProducts[product.name] || 0) > 0)
      .map((product) => ({
        productName: product.name,
        price: product.price,
        quantity: formData.selectedProducts[product.name],
        notes: product.description,
      }));

    const orderPayload = {
      type: "flash_sale",
      flashSaleId: flashSale._id,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      items: orderItems,
      subtotal: total,
      total,
      deliveryNotes: formData.deliveryNotes,
      giftMessage: formData.giftMessage,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit order");
      }

      setSubmitSuccess(true);
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        deliveryNotes: "",
        giftMessage: "",
        selectedProducts: {},
      });
    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAfterSuccess = () => {
    setSubmitSuccess(false);
    onClose();
  };

  if (submitSuccess) {
    return (
      <Modal 
        isOpen={isOpen} 
        onClose={handleCloseAfterSuccess} 
        title="Order Submitted!"
      >
        <div className="flash-sale-modal__success">
          <p>
            Thank you for your order! Heaven has received your request and will
            send you an invoice via email shortly.
          </p>
          <p>
            You will also receive a confirmation email with a copy of your order
            details.
          </p>
          <p className="flash-sale-modal__success-note">
            <strong>Please note:</strong> Your order is not confirmed until
            payment is received.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={flashSale.title}>
      <div className="flash-sale-modal">
        {flashSale.description && (
          <p className="flash-sale-modal__description">{flashSale.description}</p>
        )}

        <div className="flash-sale-modal__products">
          <h3>Select Your Products</h3>
          {flashSale.products.map((product: FlashSaleProduct) => (
            <div key={product.name} className="flash-sale-modal__product">
              {product.imageUrl && (
                <div className="flash-sale-modal__product-image">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={80}
                    height={80}
                  />
                </div>
              )}

              <div className="flash-sale-modal__product-info">
                <h4>{product.name}</h4>
                {product.description && <p>{product.description}</p>}
                {product.contents && product.contents.length > 0 && (
                  <ul className="flash-sale-modal__product-contents">
                    {product.contents.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
                <p className="flash-sale-modal__product-price">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div className="flash-sale-modal__product-quantity">
                <label htmlFor={`qty-${product.name}`}>Quantity:</label>
                <input
                  id={`qty-${product.name}`}
                  type="number"
                  min="0"
                  value={formData.selectedProducts[product.name] || 0}
                  onChange={(e) =>
                    handleProductQuantityChange(
                      product.name,
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flash-sale-modal__total">
          <strong>Total:</strong> ${calculateTotal().toFixed(2)}
        </div>

        <form onSubmit={handleSubmit} className="flash-sale-modal__form">
          <h3>Your Information</h3>

          <label>
            Name *
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Email *
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
            />
          </label>

          {flashSale.giftMessageEnabled && (
            <label>
              Gift Message (optional)
              <textarea
                name="giftMessage"
                rows={3}
                value={formData.giftMessage}
                onChange={handleInputChange}
                placeholder="Is this a gift? Add a message for the recipient..."
              />
            </label>
          )}

          <label>
            Special Instructions / Notes
            <textarea
              name="deliveryNotes"
              rows={3}
              value={formData.deliveryNotes}
              onChange={handleInputChange}
              placeholder="Any special requests or notes..."
            />
          </label>

          {flashSale.disclaimers && flashSale.disclaimers.length > 0 && (
            <div className="flash-sale-modal__disclaimers">
              <h4>Please Note:</h4>
              <ul>
                {flashSale.disclaimers.map((disclaimer, idx) => (
                  <li key={idx}>{disclaimer}</li>
                ))}
              </ul>
            </div>
          )}

          {submitError && (
            <div className="flash-sale-modal__error">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flash-sale-modal__submit"
          >
            {isSubmitting ? "Submitting..." : "Submit Order"}
          </button>
        </form>
      </div>
    </Modal>
  );
}
