import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo_decarbotech.png";

export default function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { pathname } = useLocation();
  const isRSE = pathname.startsWith("/rse");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMobileMenu(false);

  const anchor = (section: string, page = "/") =>
    pathname === page ? `#${section}` : `${page}#${section}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[72px]">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="DecarboTech" className="h-14" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <a href={anchor("a-propos", "/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            À propos
          </a>
          <a href={anchor("produits", "/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Solutions
          </a>
          <Link to="/rse"
            className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${isRSE ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}>
            ESGScan
            {!isRSE && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Gratuit</span>
            )}
          </Link>
          <a href="#contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Contact
          </a>
          <a href={isRSE ? "#diagnostic" : "/rse#diagnostic"}
            className="px-4 py-2 rounded-md border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
            Diagnostic ESG
          </a>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden text-foreground" onClick={() => setMobileMenu(o => !o)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenu
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden bg-card border-t border-border px-5 pb-5 space-y-1">
          <a href={anchor("a-propos", "/")} onClick={close}
            className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">
            À propos
          </a>
          <a href={anchor("produits", "/")} onClick={close}
            className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">
            Solutions
          </a>
          <Link to="/rse" onClick={close}
            className="flex items-center gap-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
            ESGScan
            {!isRSE && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Gratuit</span>}
          </Link>
          <a href="#contact" onClick={close}
            className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">
            Contact
          </a>
          <a href={isRSE ? "#diagnostic" : "/rse#diagnostic"} onClick={close}
            className="block py-3 text-sm font-semibold text-primary">
            Diagnostic ESG
          </a>
        </div>
      )}
    </nav>
  );
}
