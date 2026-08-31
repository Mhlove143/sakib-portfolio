import { Link } from "react-router-dom";
import { useState } from "react";
import {
  GraduationCap,
  Languages,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  CheckCircle2,
  Download,
  Share2,
  FileText,
  ArrowRight,
  Sparkles,
  Globe,
  MessageSquare,
  Check,
  Building,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ResumeModal } from "@/components/ResumeModal";
import { usePortfolio } from "@/context/PortfolioContext";

export function EducationPage() {
  const { educationList, certifications, languages, personalInfo } = usePortfolio();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <Navbar />

      {/* Page Header */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 text-primary-foreground sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="animate-float-soft absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
          <div className="animate-float-slow absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  <GraduationCap className="h-4 w-4 text-accent" />
                  Academic Excellence & Language Skills
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="mt-4 font-sora text-4xl font-extrabold tracking-tight sm:text-6xl">
                  Education & <span className="text-accent">Languages</span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-4 text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                  A comprehensive record of formal Computer Science & Engineering qualifications,
                  honors with distinction (CGPA 3.85 / 4.00), professional software certifications,
                  and multilingual communication capabilities.
                </p>
              </Reveal>
            </div>

            {/* Resume & Share Quick Toolbar */}
            <Reveal delay={240}>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setResumeOpen(true)}
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-xl shadow-accent/30 hover:bg-accent/90"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Full Resume</span>
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-3.5 font-sora text-xs font-semibold text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/20"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      <span>Share Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14 py-14 sm:py-20 overflow-hidden">
        {/* Academic Journey Grid */}
        <section className="w-full min-w-0 max-w-full overflow-hidden">
          <Reveal>
            <div className="flex items-center gap-2 text-accent font-sora text-xs font-bold uppercase tracking-widest">
              <BookOpen className="h-4 w-4" />
              Academic Degrees
            </div>
            <h2 className="mt-2 font-sora text-3xl font-extrabold tracking-tight sm:text-4xl">
              Formal Computing Education
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Systematic Computer Science curriculum combining rigorous mathematical foundations,
              algorithm design, distributed systems, and hands-on software development.
            </p>
          </Reveal>

          <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8 w-full min-w-0 max-w-full">
            {educationList.map((edu, idx) => (
              <Reveal key={edu.degree} delay={idx * 100}>
                <div
                  className={`w-full min-w-0 max-w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-5 sm:p-9 shadow-sm transition-all duration-300 ${
                    edu.statusType === "distinction"
                      ? "card-glow-emerald border-emerald-500/30"
                      : edu.statusType === "active"
                        ? "card-glow-sky border-sky-500/30"
                        : "card-glow-purple"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-start">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`rounded-full px-3 py-1 font-sora text-xs font-bold uppercase tracking-wider ${
                            edu.statusType === "distinction"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : edu.statusType === "active"
                                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                                : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          {edu.status}
                        </span>

                        {edu.cgpa && (
                          <span className="rounded-full bg-accent/15 px-3 py-1 font-sora text-xs font-bold text-accent">
                            CGPA: {edu.cgpa}
                          </span>
                        )}
                      </div>

                      <h3 className="font-sora text-2xl font-bold tracking-tight text-foreground">
                        {edu.degree}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-foreground font-semibold">
                          <Building className="h-3.5 w-3.5 text-accent" />
                          {edu.institution}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-accent" />
                          {edu.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-accent" />
                          {edu.period}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-sora text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Academic Status
                      </span>
                      <p className="font-sora text-sm font-bold text-foreground">
                        {edu.detail && (!edu.cgpa || edu.detail.includes(edu.cgpa))
                          ? edu.detail
                          : edu.cgpa
                            ? `CGPA ${edu.cgpa} · ${edu.status || "Graduated"}`
                            : edu.detail || edu.status || "Completed"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {edu.description}
                  </p>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* Key Coursework */}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                      <h4 className="flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-accent">
                        <BookOpen className="h-3.5 w-3.5" />
                        Key Technical Coursework
                      </h4>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {edu.coursework.map((course, cIdx) => (
                          <li
                            key={cIdx}
                            className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                            <span>{course}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Academic Honors & Achievements */}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 p-5">
                      <h4 className="flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-accent">
                        <Award className="h-3.5 w-3.5" />
                        Honors & Project Highlights
                      </h4>
                      <ul className="mt-3 space-y-2.5">
                        {edu.highlights.map((highlight, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Professional Certifications */}
        <section className="mt-24">
          <Reveal>
            <div className="flex items-center gap-2 text-accent font-sora text-xs font-bold uppercase tracking-widest">
              <Award className="h-4 w-4" />
              Credentials & Accreditations
            </div>
            <h2 className="mt-2 font-sora text-3xl font-extrabold tracking-tight sm:text-4xl">
              Professional Certifications
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Verified certifications endorsing specialized skills across Django software
              engineering, Shopify Liquid development, and web performance.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert, idx) => (
              <Reveal key={cert.title} delay={idx * 80}>
                <div className="flex h-full flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg card-glow-emerald">
                  <div>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Award className="h-5 w-5" />
                    </div>
                    <span className="font-sora text-[11px] font-bold text-muted-foreground">
                      Issued {cert.date}
                    </span>
                    <h3 className="mt-1 font-sora text-base font-bold text-foreground">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-xs text-accent font-semibold">{cert.issuer}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Multilingual Proficiency Matrix */}
        <section className="mt-24">
          <Reveal>
            <div className="flex items-center gap-2 text-accent font-sora text-xs font-bold uppercase tracking-widest">
              <Languages className="h-4 w-4" />
              Linguistic Competencies
            </div>
            <h2 className="mt-2 font-sora text-3xl font-extrabold tracking-tight sm:text-4xl">
              Languages & Global Communication
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Proven proficiency conducting technical meetings, sprint reviews, and architectural
              scoping with international teams and founders.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {languages.map((lang, idx) => (
              <Reveal key={lang.name} delay={idx * 100}>
                <div className="flex h-full flex-col justify-between rounded-3xl border border-border/80 bg-card p-7 shadow-sm transition-all duration-300 card-glow-sky">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Globe className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-sora text-xl font-bold text-foreground">
                            {lang.name}
                          </h3>
                          <span className="text-xs font-semibold text-accent">
                            {lang.proficiency}
                          </span>
                        </div>
                      </div>
                      <span className="font-sora text-lg font-black text-foreground">
                        {lang.scorePercent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                        style={{ width: `${lang.scorePercent}%` }}
                      />
                    </div>

                    {/* Breakdown Chips */}
                    <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-border/70 bg-muted/20 p-3 text-center">
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Reading
                        </span>
                        <p className="font-sora text-xs font-bold text-foreground mt-0.5">
                          {lang.reading}
                        </p>
                      </div>
                      <div className="border-x border-border/60">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Writing
                        </span>
                        <p className="font-sora text-xs font-bold text-foreground mt-0.5">
                          {lang.writing}
                        </p>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Speaking
                        </span>
                        <p className="font-sora text-xs font-bold text-foreground mt-0.5">
                          {lang.speaking}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-border/60 pt-4">
                      <span className="font-sora text-[11px] font-bold uppercase tracking-wider text-foreground">
                        Professional Application:
                      </span>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {lang.useCase}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Next Steps CTA */}
        <section className="mt-24">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border/80 bg-section-alt p-8 text-center sm:p-12 lg:flex-row lg:text-left">
              <div>
                <span className="font-sora text-xs font-bold uppercase tracking-widest text-accent">
                  Ready to collaborate?
                </span>
                <h3 className="mt-2 font-sora text-2xl font-black text-foreground sm:text-3xl">
                  Let's discuss your next technical initiative
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Available for full-time engineering roles, technical leadership, and contract
                  builds.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setResumeOpen(true)}
                  className="btn-shine inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-foreground shadow-sm hover:border-accent hover:text-accent"
                >
                  <FileText className="h-4 w-4 text-accent" />
                  <span>View Resume</span>
                </button>

                <Link
                  to="/contact"
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
                >
                  <span>Start a Conversation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      <Footer />

      {/* Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
