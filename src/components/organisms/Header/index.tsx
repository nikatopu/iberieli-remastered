"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/atoms/Button";
import style from "./Header.module.scss";

export default function Header() {
  const pathname = usePathname();

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
            <Button variant="outline" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
