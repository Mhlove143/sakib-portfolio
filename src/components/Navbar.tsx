import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  FileText,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Moon,
  Check,
  Palette,
} from "lucide-react";
import { ResumeModal } from "@/components/ResumeModal";
import { navLinks } from "@/data/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useTheme } from "@/context/ThemeContext";

export function Navbar() {
  const { personalInfo } = usePortfolio();
  const { theme, setTheme, themes } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  const location = useLocation();
  const currentPath = location.pathname;

  // Close mobile drawer and theme dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setThemeDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPath]);

  // Handle outside click to close theme dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node) &&
        themeButtonRef.current &&
        !themeButtonRef.current.contains(event.target as Node)
      ) {
        setThemeDropdownOpen(false);
      }
    }
    if (themeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [themeDropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setThemeDropdownOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-2xl transition-all duration-300">
        <nav className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          {/* Brand Logo with Live Status Dot */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 sm:gap-3 font-sora text-base font-extrabold tracking-tight text-foreground transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white font-black text-sm shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/20">
              {personalInfo.brandLogoUrl ? (
                <img
                  src={personalInfo.brandLogoUrl}
                  alt={personalInfo.name || "Brand Logo"}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{personalInfo.brandInitials || "SS"}</span>
              )}
              {personalInfo.brandOnlineStatus !== false && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sora text-sm font-extrabold tracking-tight text-foreground leading-tight sm:text-base">
                {personalInfo.name || "Sakib Sardar"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase leading-none truncate max-w-[170px] sm:max-w-[240px]">
                {personalInfo.brandSubtitle || "Full-Stack & Shopify Lead"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Bar: Direct links to each separate page */}
          <ul className="hidden items-center gap-1 rounded-full border border-border/80 bg-muted/40 p-1.5 backdrop-blur-md lg:flex xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? currentPath === "/"
                  : currentPath === link.href || currentPath.startsWith(`${link.href}/`);

              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`rounded-full px-2.5 py-1.5 font-sora text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 xl:px-3.5 xl:py-2 xl:text-xs ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-bold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Action CTAs: Theme (Moon Dropdown), Admin (Icon), Resume (Icon), WhatsApp (Icon), Hire Me */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Theme Dropdown Toggle Button (Moon Icon) */}
            <div className="relative">
              <button
                ref={themeButtonRef}
                onClick={() => setThemeDropdownOpen((prev) => !prev)}
                className={`btn-shine flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95 ${
                  themeDropdownOpen
                    ? "border-accent bg-accent/15 text-accent shadow-sm"
                    : "border-border/80 bg-card text-foreground hover:border-accent hover:text-accent shadow-sm"
                }`}
                title="Theme Colors (Click to change theme)"
                aria-label="Theme Colors (Click to change theme)"
                aria-expanded={themeDropdownOpen}
              >
                <Moon className="h-4 w-4 text-accent" />
              </button>

              {/* Theme Dropdown Menu */}
              {themeDropdownOpen && (
                <div
                  ref={themeDropdownRef}
                  className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/90 bg-card/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50"
                >
                  <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Palette className="h-3.5 w-3.5 text-accent" />
                      <span>Theme Colors</span>
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      4 Themes
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-1">
                    {themes.map((t) => {
                      const isSelected = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            setThemeDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all ${
                            isSelected
                              ? "bg-primary/15 text-foreground ring-1 ring-primary/40 font-semibold"
                              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Two-tone color dot preview */}
                            <div
                              className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 shadow-inner overflow-hidden"
                              style={{ backgroundColor: t.previewBg }}
                            >
                              <span
                                className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border border-white/30"
                                style={{ backgroundColor: t.previewPrimary }}
                              />
                            </div>

                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-foreground truncate">
                                {t.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {t.description}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="h-4 w-4 shrink-0 text-accent ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Admin CMS Button (Icon only to save navigation space) */}
            <Link
              to="/admin"
              className="btn-shine flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground shadow-sm transition-all hover:border-accent hover:text-accent hover:scale-105 active:scale-95"
              title="Admin CMS Dashboard"
              aria-label="Admin CMS Dashboard"
            >
              <ShieldCheck className="h-4 w-4 text-accent" />
            </Link>

            {/* Resume Button (Icon only to save navigation space) */}
            <button
              onClick={() => setResumeOpen(true)}
              className="btn-shine flex h-9 w-9 items-center justify-center rounded-full border border-border/90 bg-card text-foreground shadow-sm transition-all hover:border-accent hover:text-accent hover:scale-105 active:scale-95"
              title="View & Download Resume / CV"
              aria-label="View & Download Resume / CV"
            >
              <FileText className="h-4 w-4 text-accent" />
            </button>

            {/* WhatsApp Direct (Icon only to save navigation space) */}
            <a
              href={personalInfo.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-shine flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-sm transition-all hover:border-emerald-500/60 hover:text-emerald-500 hover:scale-105 active:scale-95"
              title="Direct WhatsApp Chat"
              aria-label="Direct WhatsApp Chat"
            >
              <MessageSquare className="h-4 w-4 text-emerald-500" />
            </a>

            {/* Hire Me CTA (links directly to /contact) */}
            <Link
              to="/contact"
              className="btn-shine group inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 active:scale-95 sm:px-4 sm:py-2"
            >
              <span>Hire Me</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 text-foreground transition-colors hover:bg-muted lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-border/80 bg-background/95 px-5 py-5 backdrop-blur-2xl lg:hidden animate-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? currentPath === "/"
                    : currentPath === link.href || currentPath.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 font-sora text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <CheckCircle2 className="h-4 w-4 text-accent" />}
                  </Link>
                );
              })}

              {/* Theme Color Selector inside Mobile Drawer */}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 mt-2">
                <div className="mb-2 flex items-center justify-between text-xs font-bold text-foreground">
                  <div className="flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-accent" />
                    <span>Theme Colors</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent">
                    {themes.find((t) => t.id === theme)?.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {themes.map((t) => {
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex items-center gap-2 rounded-xl p-2 text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-sm font-bold"
                            : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div
                          className="h-3 w-3 shrink-0 rounded-full border border-white/20"
                          style={{ backgroundColor: t.previewPrimary }}
                        />
                        <span className="truncate text-[11px]">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border/70 pt-3 flex flex-col gap-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 py-2.5 font-sora text-xs font-bold uppercase tracking-wider text-accent"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin CMS Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setResumeOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 font-sora text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  <FileText className="h-4 w-4 text-accent" />
                  <span>Download Curriculum Vitae (PDF)</span>
                </button>
                <a
                  href={personalInfo.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 font-sora text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  <MessageSquare className="h-4 w-4 text-accent" />
                  <span>Direct WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
