import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo_decarbotech.png";
import logoCarboscan from "@/assets/logo_carboscan.png";
import logoHydroscan from "@/assets/logo_hydroscan.png";
import logoWastescan from "@/assets/logo_wastescan.svg";

const SOLUTIONS = [
  {
    name: "Bilan Carbone",
    app: "CarbonScan",
    logo: logoCarboscan,
    desc: "Mesurez et réduisez votre empreinte carbone avec CarbonScan : bilan GES automatisé (Scope 1-2-3), reporting CSRD et plan de réduction personnalisé.",
    url: "https://carbonscan.io",
    color: "text-emerald-600",
  },
  {
    name: "Empreinte Eau",
    app: "HydroScan",
    logo: logoHydroscan,
    desc: "Pilotez votre consommation d'eau avec HydroScan : monitoring en temps réel, détection de fuites et conformité réglementaire multi-sites.",
    url: "https://hydroscan.io",
    color: "text-blue-600",
  },
  {
    name: "Gestion des Déchets",
    app: "WasteScan",
    logo: logoWastescan,
    desc: "Maîtrisez vos déchets avec WasteScan : cartographie des flux, conformité réglementaire et transition vers l'économie circulaire.",
    url: "https://wastescan.io",
    color: "text-purple-500",
    comingSoon: true,
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [mobileSolutions, setMobileSolutions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { pathname } = useLocation();
  const isRSE = pathname.startsWith("/rse");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => { setMobileMenu(false); setMobileSolutions(false); };

  const anchor = (section: string, page = "/") =>
    pathname === page ? `#${section}` : `${page}#${section}`;

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowSolutions(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowSolutions(false), 200);
  };

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

          {/* Solutions dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href={anchor("produits", "/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium inline-flex items-center gap-1"
            >
              Solutions
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showSolutions ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>

            {showSolutions && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                <div className="w-[420px] bg-card border border-border rounded-xl shadow-xl p-4 space-y-1">
                  {SOLUTIONS.map((s) => (
                    <a
                      key={s.app}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group"
                    >
                      <img src={s.logo} alt={s.app} className="w-9 h-9 mt-0.5 object-contain flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{s.name}</span>
                          <span className={`text-[11px] font-medium ${s.color}`}>via {s.app}</span>
                          {s.comingSoon && (
                            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-muted text-muted-foreground">Bientôt</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </a>
                  ))}
                  <div className="border-t border-border mt-2 pt-2">
                    <a
                      href={anchor("produits", "/")}
                      className="block text-center text-xs font-semibold text-primary hover:underline py-1"
                    >
                      Voir toutes nos solutions →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <a href="#contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            Contact
          </a>
          <Link to="/rse"
            className="px-4 py-2 rounded-md border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all inline-flex items-center gap-1.5">
            Diagnostic ESG
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Gratuit</span>
          </Link>
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

          {/* Mobile Solutions accordion */}
          <button
            onClick={() => setMobileSolutions(o => !o)}
            className="w-full flex items-center justify-between py-3 text-sm text-muted-foreground hover:text-foreground font-medium"
          >
            Solutions
            <svg className={`w-4 h-4 transition-transform ${mobileSolutions ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileSolutions && (
            <div className="pl-3 space-y-2 pb-2">
              {SOLUTIONS.map((s) => (
                <a
                  key={s.app}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/60"
                >
                  <img src={s.logo} alt={s.app} className="w-7 h-7 object-contain flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-foreground">{s.name}</span>
                    <span className={`ml-2 text-[11px] ${s.color}`}>via {s.app}</span>
                    {s.comingSoon && <span className="ml-1 text-[9px] font-bold text-muted-foreground">(Bientôt)</span>}
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          <a href="#contact" onClick={close}
            className="block py-3 text-sm text-muted-foreground hover:text-foreground font-medium">
            Contact
          </a>
          <Link to="/rse" onClick={close}
            className="flex items-center gap-2 py-3 text-sm font-semibold text-primary">
            Diagnostic ESG
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Gratuit</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
