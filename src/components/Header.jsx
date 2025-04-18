import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import favicon from "../assets/poke-x-favicon.svg";
import "./Header.css";

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="app-header" role="banner">
      <Link to="/" className="logo-link" aria-label="Homepage">
        <img src={favicon} alt="Poké-X Logo" className="logo-icon" />
      </Link>

      <button
        className="mobile-menu-toggle"
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
      >
        ☰
      </button>

      <nav
        className={`nav-menu ${menuOpen ? "open" : ""}`}
        role="navigation"
        id="main-navigation"
        aria-label="Main navigation"
      >
        <Link to="/" onClick={() => setMenuOpen(false)} className={location.pathname === "/" ? "active" : ""}>Collection</Link>
        <Link to="/game" onClick={() => setMenuOpen(false)} className={location.pathname === "/game" ? "active" : ""}>Game</Link>
        <Link to="/stats" onClick={() => setMenuOpen(false)} className={location.pathname === "/stats" ? "active" : ""}>Stats</Link>
      </nav>
    </header>
  );
}
