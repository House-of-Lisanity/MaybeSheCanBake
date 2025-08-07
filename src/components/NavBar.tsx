import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavbarProps = {
  alwaysScrolled?: boolean;
};

export default function Navbar({ alwaysScrolled = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(alwaysScrolled);

  useEffect(() => {
    if (alwaysScrolled) return; // Don't attach scroll listener
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysScrolled]);

  return (
    <header className={`navbar full-width ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <div className="logo-container">
          <Link href="/">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={120}
              height={120}
              className="logo"
            />
          </Link>
        </div>

        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/products">Products</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="nav-icons">
          <i className="fa fa-search" />
          <i className="fa fa-user" />
          <i className="fa fa-shopping-basket" />
        </div>
      </div>
    </header>
  );
}
