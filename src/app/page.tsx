"use client";

import { siteConfig } from "@/lib/siteConfig";
import Hero from "@/sections/Hero";
import Calendar from "@/sections/Calendar";
import ProductSlider from "@/sections/ProductCategoryCarousel";
import Gallery from "@/sections/Gallery";
import About from "@/sections/About";
// import Reviews from "@/sections/Reviews";
import Contact from "@/sections/Contact";
import Navbar from "@/components/NavBar";

export default function Home() {
  return (
    <>
      <main>
        <Navbar />
        <Hero />
        {siteConfig.sections.map((section) => {
          if (section.id === "hero") return null; // Hero is already rendered
          if (section.id === "calendar") return <Calendar key={section.id} />;
          if (section.id === "products")
            return <ProductSlider key={section.id} />;
          if (section.id === "gallery") return <Gallery key={section.id} />;
          if (section.id === "about") return <About key={section.id} />;
          // if (section.id === "reviews") return <Reviews key={section.id} />;
          if (section.id === "contact") return <Contact key={section.id} />;
          return (
            <section id={section.id} key={section.id}>
              <h2>{section.label}</h2>
            </section>
          );
        })}
      </main>
    </>
  );
}
