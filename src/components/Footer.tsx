import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  FileText,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ResumeModal } from "@/components/ResumeModal";
import { navLinks } from "@/data/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";

export function Footer() {
  const { personalInfo } = usePortfolio();
  const [resumeOpen, setResumeOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="relative w-full border-t border-border/80 bg-card py-16 text-foreground">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-14">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {/* Column 1 & 2: Brand Info */}
            <div className="lg:col-span-2">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 font-sora text-2xl font-black tracking-tight text-foreground"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-base font-black text-primary-foreground shadow-md shadow-accent/25">
                  S
                </span>
                <span>
                  Sakib<span className="text-accent">.</span>dev
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {personalInfo.title} and Full-Stack Developer specializing in Django, Python, React.js, and high-performance e-commerce architecture.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setResumeOpen(true)}
                  className="btn-shine inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-bold text-foreground shadow-sm hover:border-accent hover:text-accent"
                >
                  <FileText className="h-3.5 w-3.5 text-accent" />
                  <span>Download Resume (CV)</span>
                </button>

                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 hover:border-accent hover:text-foreground"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-4 w-4" />
                </a>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 hover:border-accent hover:text-foreground"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Column 3: Site Navigation */}
            <div>
              <p className="font-sora text-xs font-bold uppercase tracking-wider text-accent">
                Navigation
              </p>
              <ul className="mt-4 space-y-2.5 text-xs font-medium">
                {navLinks.slice(0, 5).map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Pages & Resources */}
            <div>
              <p className="font-sora text-xs font-bold uppercase tracking-wider text-accent">
                Explore
              </p>
              <ul className="mt-4 space-y-2.5 text-xs font-medium">
                <li>
                  <Link
                    to="/projects"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Featured Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/education"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Education & Languages
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experience"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Work & Leadership
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setResumeOpen(true)}
                    className="text-muted-foreground text-left transition-colors hover:text-accent"
                  >
                    Interactive Resume
                  </button>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contact & Inquiry
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Direct Contact Info */}
            <div>
              <p className="font-sora text-xs font-bold uppercase tracking-wider text-accent">
                Direct Contact
              </p>
              <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <span>{personalInfo.location}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="transition-colors hover:text-accent"
                  >
                    {personalInfo.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="break-all transition-colors hover:text-accent"
                  >
                    {personalInfo.email}
                  </a>
                </li>
                <li className="pt-1">
                  <a
                    href={personalInfo.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-accent hover:underline"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 sm:flex-row text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
              <span className="text-border">·</span>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-semibold text-muted-foreground hover:bg-muted hover:text-accent transition-colors"
                title="Manage portfolio content & CV"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span>Admin CMS Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-accent font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Crafted with Clean Architecture & Modern Motion
              </span>
              <button
                onClick={scrollToTop}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-accent hover:text-foreground"
                aria-label="Scroll back to top"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
