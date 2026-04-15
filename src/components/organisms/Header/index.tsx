"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/atoms/Button";
import style from "./Header.module.scss";

export default function Header() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/wines", label: "Wines" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  function isActive(href: string): boolean {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <header className={style.header}>
      <div className="container">
        <div className={style.headerContent}>
          <Link href="/" className={style.logo}>
            <img
              src="/photos/Logo Only.webp"
              alt="Iberieli Logo"
              className={style.logoImage}
            />
            <span className={style.logoText}>Iberieli</span>
          </Link>

          <nav className={style.navigation}>
            <ul className={style.navList}>
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${style.navLink} ${isActive(item.href) ? style.active : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={style.mobileMenu}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu"
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? "Close" : "Menu"}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`${style.sidebar} ${isSidebarOpen ? style.sidebarOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className={style.sidebarHeader}>
          <Link href="/" className={style.sidebarLogo} onClick={closeSidebar}>
            <img
              src="/photos/Logo Only.webp"
              alt="Iberieli Logo"
              className={style.sidebarLogoImage}
            />
            <span className={style.sidebarLogoText}>Iberieli</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
            className={style.closeButton}
          >
            ✕
          </Button>
        </div>

        <nav className={style.sidebarNav}>
          <ul className={style.sidebarNavList}>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${style.sidebarNavLink} ${isActive(item.href) ? style.sidebarNavLinkActive : ""}`}
                  onClick={closeSidebar}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </header>
  );
}
