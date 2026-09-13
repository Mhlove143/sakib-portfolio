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
  Home,
  User,
  Layers,
  Code2,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Send,
} from "lucide-react";
import { ResumeModal } from "@/components/ResumeModal";
import { navLinks } from "@/data/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { useTheme } from "@/context/ThemeContext";

const navIcons: Record<string, typeof Home> = {
  "/": Home,
  "/about": User,
  "/services": Layers,
  "/skills": Code2,
  "/projects": FolderGit2,
  "/experience": Briefcase,
  "/education": GraduationCap,
  "/contact": Send,
};

export function Navbar() {
  const { personalInfo } = usePortfolio();
  const { theme, setTheme, themes } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [drawerThemePickerOpen, setDrawerThemePickerOpen] = useState(false);

  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  const location = useLocation();
  const currentPath = location.pathname;

  // Close mobile drawer and theme dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setThemeDropdownOpen(false);
    setDrawerThemePickerOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPath]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle outside click to close desktop theme dropdown
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

  // Close dropdown or mobile drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setThemeDropdownOpen(false);
        setMobileMenuOpen(false);
        setDrawerThemePickerOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-2xl transition-all duration-300">
        <nav className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
          {/* Brand Logo with Live Status Dot */}
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3 font-sora text-base font-extrabold tracking-tight text-foreground transition-transform duration-300 hover:scale-[1.02]"
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
            <div className="flex flex-col text-left min-w-0">
              <span className="font-sora text-sm font-extrabold tracking-tight text-foreground leading-tight sm:text-base truncate">
                {personalInfo.name || "Sakib Sardar"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-accent uppercase leading-none truncate max-w-[160px] xs:max-w-[200px] sm:max-w-[240px]">
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

          {/* Action CTAs for Desktop: Theme (Moon Dropdown), Admin (Icon), Resume (Icon), WhatsApp (Icon), Hire Me */}
          <div className="hidden shrink-0 items-center gap-1.5 sm:gap-2 lg:flex">
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

            {/* Admin CMS Button */}
            <Link
              to="/admin"
              className="btn-shine flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground shadow-sm transition-all hover:border-accent hover:text-accent hover:scale-105 active:scale-95"
              title="Admin CMS Dashboard"
              aria-label="Admin CMS Dashboard"
            >
              <ShieldCheck className="h-4 w-4 text-accent" />
            </Link>

            {/* Resume Button */}
            <button
              onClick={() => setResumeOpen(true)}
              className="btn-shine flex h-9 w-9 items-center justify-center rounded-full border border-border/90 bg-card text-foreground shadow-sm transition-all hover:border-accent hover:text-accent hover:scale-105 active:scale-95"
              title="View & Download Resume / CV"
              aria-label="View & Download Resume / CV"
            >
              <FileText className="h-4 w-4 text-accent" />
            </button>

            {/* WhatsApp Direct */}
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

            {/* Hire Me CTA */}
            <Link
              to="/contact"
              className="btn-shine group inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 active:scale-95 sm:px-4 sm:py-2"
            >
              <span>Hire Me</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile 3-Line Menu Button (Visible ONLY on mobile, keeping header clean & un-cut) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="btn-shine flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-card text-foreground shadow-sm transition-all hover:border-accent hover:text-accent active:scale-95 lg:hidden"
            aria-label="Open Navigation Menu"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Mobile Left-Side Slide-out Drawer Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Left-Side Slide-out Drawer Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[310px] sm:w-[350px] max-w-[86vw] flex-col border-r border-border/80 bg-card text-card-foreground shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border/70 p-4">
          <div className="flex items-center gap-2.5 min-w-0">
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
            <div className="flex flex-col text-left min-w-0">
              <span className="font-sora text-sm font-extrabold tracking-tight text-foreground leading-tight truncate">
                {personalInfo.name || "Sakib Sardar"}
              </span>
              <span className="text-[9px] font-bold tracking-wider text-accent uppercase leading-none truncate max-w-[160px]">
                {personalInfo.brandSubtitle || "Full-Stack & Shopify Lead"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/40 text-foreground transition-colors hover:bg-muted active:scale-95"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top Quick Actions Area: Theme, Admin, CV, Message */}
        <div className="border-b border-border/70 bg-muted/20 p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
            <span>Quick Actions</span>
            <span className="text-accent font-bold">
              {themes.find((t) => t.id === theme)?.name}
            </span>
          </div>

          {/* 4 Action Buttons: Only Logos/Icons and Links (Names Hidden) */}
          <div className="grid grid-cols-4 gap-2">
            {/* Theme */}
            <button
              type="button"
              onClick={() => setDrawerThemePickerOpen((prev) => !prev)}
              className={`flex h-11 items-center justify-center rounded-2xl border transition-all active:scale-95 ${
                drawerThemePickerOpen
                  ? "border-accent bg-accent/20 text-accent shadow-sm"
                  : "border-border/80 bg-card text-foreground hover:border-accent hover:text-accent shadow-sm"
              }`}
              title="Theme Colors"
              aria-label="Theme Colors"
            >
              <Moon className="h-5 w-5 text-accent" />
            </button>

            {/* Admin */}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 items-center justify-center rounded-2xl border border-border/80 bg-card text-foreground transition-all hover:border-accent hover:text-accent active:scale-95 shadow-sm"
              title="Admin CMS Dashboard"
              aria-label="Admin CMS Dashboard"
            >
              <ShieldCheck className="h-5 w-5 text-accent" />
            </Link>

            {/* CV */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setResumeOpen(true);
              }}
              className="flex h-11 items-center justify-center rounded-2xl border border-border/80 bg-card text-foreground transition-all hover:border-accent hover:text-accent active:scale-95 shadow-sm"
              title="Download Resume / CV"
              aria-label="Download Resume / CV"
            >
              <FileText className="h-5 w-5 text-accent" />
            </button>

            {/* Message */}
            <a
              href={personalInfo.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 items-center justify-center rounded-2xl border border-border/80 bg-card text-foreground transition-all hover:border-emerald-500 hover:text-emerald-500 active:scale-95 shadow-sm"
              title="Direct WhatsApp Message"
              aria-label="Direct WhatsApp Message"
            >
              <MessageSquare className="h-5 w-5 text-emerald-500" />
            </a>
          </div>

          {/* Expandable Theme Palette inside top action area */}
          {drawerThemePickerOpen && (
            <div className="rounded-2xl border border-border/80 bg-card p-2.5 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <div className="flex items-center gap-1.5">
                  <Palette className="h-3 w-3 text-accent" />
                  <span>Choose Theme</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {themes.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        setDrawerThemePickerOpen(false);
                      }}
                      className={`flex items-center gap-2 rounded-xl p-2 text-left text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm font-bold"
                          : "border border-border/70 bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div
                        className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: t.previewPrimary }}
                      />
                      <span className="truncate text-[11px]">{t.name}</span>
                      {isSelected && <Check className="h-3 w-3 ml-auto text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* All Navigation Links ("all meno") */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-2 pb-1.5">
            <span className="font-sora text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Navigation Menu
            </span>
          </div>

          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? currentPath === "/"
                : currentPath === link.href || currentPath.startsWith(`${link.href}/`);

            const IconComponent = navIcons[link.href] || Home;

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 font-sora text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-bold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-[0.98]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      isActive ? "bg-white/20 text-white" : "bg-muted/80 text-foreground"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </span>
                  <span>{link.label}</span>
                </div>
                {isActive ? (
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Drawer Bottom Action */}
        <div className="border-t border-border/70 bg-card p-4 space-y-2">
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-shine flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-sora text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-accent/25 transition-all hover:opacity-90 active:scale-95"
          >
            <span>Hire Me / Let's Connect</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 px-1">
            <a href={`tel:${personalInfo.phone}`} className="hover:text-accent truncate">
              {personalInfo.phone}
            </a>
            <span className="text-border">·</span>
            <a href={`mailto:${personalInfo.email}`} className="hover:text-accent truncate">
              Email Me
            </a>
          </div>
        </div>
      </aside>

      {/* Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
