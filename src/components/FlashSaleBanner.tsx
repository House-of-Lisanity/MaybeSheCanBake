// src/components/FlashSaleBanner.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import { FlashSaleType } from "@/types/flashSale";

interface FlashSaleBannerProps {
  onOpenModal: (flashSale: FlashSaleType) => void;
}

export default function FlashSaleBanner({ onOpenModal }: FlashSaleBannerProps) {
  const [flashSale, setFlashSale] = useState<FlashSaleType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveFlashSale = async () => {
      try {
        const res = await fetch("/api/flash-sales");
        if (!res.ok) {
          throw new Error("Failed to fetch flash sale");
        }
        const data: FlashSaleType[] = await res.json();
        
        if (data.length > 0) {
          setFlashSale(data[0]);
        }
      } catch (error) {
        console.error("Error fetching flash sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveFlashSale();
  }, []);

  if (loading) {
    return null;
  }

  if (!flashSale) {
    return null;
  }

  const handleExpire = () => {
    setFlashSale(null);
  };

  return (
    <section className="flash-sale-banner full-width">
      <div className="flash-sale-banner__inner">
        {flashSale.bannerImageUrl && (
          <div className="flash-sale-banner__image-wrapper">
            <Image
              src={flashSale.bannerImageUrl}
              alt={flashSale.title}
              fill
              className="flash-sale-banner__image"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}

        <div className="flash-sale-banner__content">
          <h2 className="flash-sale-banner__title">{flashSale.title}</h2>
          
          {flashSale.bannerText && (
            <p className="flash-sale-banner__text">{flashSale.bannerText}</p>
          )}

          <div className="flash-sale-banner__countdown">
            <CountdownTimer
              endDate={flashSale.endDate}
              onExpire={handleExpire}
            />
          </div>

          {flashSale.products && flashSale.products.length > 0 && (
            <div className="flash-sale-banner__products">
              {flashSale.products.map((product) => (
                <div key={product.name} className="flash-sale-banner__product">
                  {product.imageUrl && (
                    <div className="flash-sale-banner__product-image">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={120}
                        height={120}
                      />
                    </div>
                  )}
                  <div className="flash-sale-banner__product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <span className="flash-sale-banner__product-price">
                      ${product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="flash-sale-banner__cta"
            onClick={() => onOpenModal(flashSale)}
          >
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
}
