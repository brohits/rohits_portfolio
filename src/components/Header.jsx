import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { site } from "../data/site";
import { ThemeToggle } from "./ThemeToggle";

function NavLinks({ onNavigate, mobile = false }) {
  return (
    <ul className="nav-list">
      {site.nav.map((item) => (
        <li key={item.to}>
          <Link to={item.to} onClick={onNavigate}>
            {item.label}
          </Link>
        </li>
      ))}
      {mobile && site.resume && (
        <li>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
          >
            Resume
          </a>
        </li>
      )}
      {mobile && (
        <li>
          <a href={`mailto:${site.email}`} onClick={onNavigate}>
            Get in touch
          </a>
        </li>
      )}
    </ul>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const close = () => {
      setMenuOpen(false);
      menuToggleRef.current?.focus();
    };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    menuToggleRef.current?.focus();
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            <span className="brand-name">{site.name}</span>
            <span className="brand-role">{site.role}</span>
          </Link>

          <nav className="nav nav--desktop" aria-label="Primary">
            <NavLinks />
          </nav>

          <div className="header-actions">
            {site.resume && (
              <a
                href={site.resume}
                className="header-resume"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            )}
            <a href={`mailto:${site.email}`} className="header-cta">
              Get in touch →
            </a>
            <ThemeToggle className="theme-toggle--header" />
            <button
              ref={menuToggleRef}
              type="button"
              className="nav-toggle"
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="nav-toggle-label">
                {menuOpen ? "Close" : "Menu"}
              </span>
              <span className="nav-toggle-icon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`nav-drawer${menuOpen ? " is-open" : ""}`}
        aria-hidden={menuOpen ? undefined : true}
        inert={!menuOpen || undefined}
      >
        <button
          type="button"
          className="nav-drawer-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        />
        <nav className="nav nav--mobile" aria-label="Primary" id="site-nav">
          <div className="nav-drawer-top">
            <span className="nav-drawer-title">Menu</span>
            <div className="nav-drawer-actions">
              <ThemeToggle className="theme-toggle--drawer" />
              <button
              type="button"
              className="nav-drawer-close"
              aria-label="Close menu"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span aria-hidden="true">×</span>
            </button>
            </div>
          </div>
          <NavLinks onNavigate={closeMenu} mobile />
        </nav>
      </div>
    </>
  );
}
