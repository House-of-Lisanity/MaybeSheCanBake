// src/components/CardSlider.tsx
"use client";

import Carousel from "react-multi-carousel";
import type CarouselType from "react-multi-carousel/lib/types";
import "react-multi-carousel/lib/styles.css";
import { ReactNode, useRef, Children } from "react";
import SliderArrow from "./SliderArrow";

type CardSliderProps = {
  children: ReactNode;
  /** When true, always use carousel mode, even with 1–2 items */
  forceCarousel?: boolean;
  /** When true, also show arrows even if there are only 2 items */
  forceArrows?: boolean;
  /** When true, always show exactly ONE card at a time on all breakpoints */
  singleItem?: boolean;
};

const responsive = {
  // 3 cards on desktop
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  // 2 on tablet
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  // 1 on mobile
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const responsiveTwoItems = {
  // 2 cards on desktop
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
  // 2 on tablet
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  // 1 on mobile
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const responsiveSingle = {
  // Always 1 card, all breakpoints
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 1 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

export default function CardSlider({
  children,
  forceCarousel,
  forceArrows,
  singleItem,
}: CardSliderProps) {
  const carouselRef = useRef<CarouselType | null>(null);

  const handlePrev = () => {
    carouselRef.current?.previous(1);
  };

  const handleNext = () => {
    carouselRef.current?.next(1);
  };

  // Turn children into an array so we can count them
  const childArray = Children.toArray(children);

  // If singleItem is true, always show exactly one card at a time.
  // Otherwise, use the existing responsive behavior.
  const responsiveConfig = singleItem
    ? responsiveSingle
    : forceCarousel && childArray.length <= 2
    ? responsiveTwoItems
    : responsive;

  // Show arrows:
  // - In single-item mode: show if there is more than 1 card.
  // - Otherwise: original behavior (3+ items, or 2+ when forceArrows is true).
  const showArrows = singleItem
    ? childArray.length > 1
    : forceArrows
    ? childArray.length > 1
    : childArray.length >= 3;

  // SIMPLE MODE: 1–2 cards → centered flex row, no carousel logic
  // Only when we're NOT forcing carousel and NOT in single-item mode.
  if (!forceCarousel && !singleItem && childArray.length <= 2) {
    return (
      <div className="slider-outer">
        <div className="slider-simple">{childArray}</div>
      </div>
    );
  }

  // CAROUSEL MODE
  return (
    <div className="slider-outer">
      {showArrows && (
        <button className="slider-btn left" onClick={handlePrev}>
          <SliderArrow direction="left" />
        </button>
      )}

      <div className="slider-wrapper">
        <Carousel
          ref={carouselRef}
          responsive={responsiveConfig}
          arrows={false} // use ONLY our custom external arrows
          itemClass="carousel-item"
          containerClass="carousel-container"
          autoPlay={false}
          infinite
        >
          {children}
        </Carousel>
      </div>

      {showArrows && (
        <button className="slider-btn right" onClick={handleNext}>
          <SliderArrow direction="right" />
        </button>
      )}
    </div>
  );
}
