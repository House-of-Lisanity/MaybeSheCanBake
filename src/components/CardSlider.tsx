"use client";

import Carousel from "react-multi-carousel";
import CarouselType from "react-multi-carousel/lib/types";
import "react-multi-carousel/lib/styles.css";
import { ReactNode, useRef } from "react";
import SliderArrow from "./SliderArrow";

type Props = {
  children: ReactNode;
};

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

export default function CardSlider({ children }: Props) {
  const carouselRef = useRef<CarouselType | null>(null);

  const handlePrev = () => {
    carouselRef.current?.previous(1);
  };

  const handleNext = () => {
    carouselRef.current?.next(1);
  };

  return (
    <div className="slider-outer">
      <button className="slider-btn left" onClick={handlePrev}>
        <SliderArrow direction="left" />
      </button>
      <div className="slider-wrapper">
        <Carousel
          ref={carouselRef}
          responsive={responsive}
          infinite
          arrows={false}
          itemClass="carousel-item"
          containerClass="carousel-container"
          autoPlay={false}
        >
          {children}
        </Carousel>
      </div>
      <button className="slider-btn right" onClick={handleNext}>
        <SliderArrow direction="right" />
      </button>
    </div>
  );
}
