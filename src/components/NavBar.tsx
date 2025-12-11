import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavbarProps = {
  /**
   * When true, the navbar starts in the "scrolled" state and
   * does not attach a scroll listener. This is used on the
   * product catalog page so the navbar is always compact.
   */
  alwaysScrolled?: boolean;
};

type LogoImage = {
  _id: string;
  url: string;
  caption?: string;
  isLogo?: boolean;
};

export default function Navbar({ alwaysScrolled = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState<boolean>(alwaysScrolled);
  const [logo, setLogo] = useState<LogoImage | null>(null);

  // Handle scroll-based shrinking
  useEffect(() => {
    if (alwaysScrolled) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysScrolled]);

  // Fetch logo image from /api/logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch("/api/logo");

        if (!res.ok) {
          // If there's no logo yet, just fall back to the hardcoded one
          console.warn("No logo image found, falling back to default.");
          return;
        }

        const data: LogoImage = await res.json();
        setLogo(data);
      } catch (err) {
        console.error("Failed to load logo image:", err);
      }
    };

    void fetchLogo();
  }, []);

  const effectiveLogoUrl =
    logo?.url ??
    "https://res.cloudinary.com/houseoflisanity/image/upload/logo_qegmup.png";

  const effectiveLogoAlt =
    logo?.caption && logo.caption.trim().length > 0 ? logo.caption : "Logo";

  // Helper: on the home page, use in-page anchors; on the catalog,
  // point back to /#section so users go back to the homepage section.
  const sectionHref = (id: string): string => {
    return alwaysScrolled ? `/#${id}` : `#${id}`;
  };

  return (
    <header className={`navbar full-width ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="logo-container">
          <Link href={alwaysScrolled ? "/" : "#hero"}>
            <Image
              src={effectiveLogoUrl}
              alt={effectiveLogoAlt}
              width={120}
              height={120}
              className="logo"
            />
          </Link>
        </div>

        <nav className="nav-links">
          {/* IDs should match the section IDs in your homepage */}
          <Link href={sectionHref("hero")}>Home</Link>
          <Link href={sectionHref("about")}>About</Link>
          <Link href="/products">Products</Link>
          <Link href={sectionHref("gallery")}>Gallery</Link>
          <Link href={sectionHref("contact")}>Contact</Link>
        </nav>

        <div className="nav-icons">
          {/* <i className="fa fa-search" />
          <i className="fa fa-user" /> */}
          <i className="fa fa-shopping-basket" />
        </div>
      </div>
    </header>
  );
}
