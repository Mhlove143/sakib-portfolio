import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Briefcase,
  Building,
  Calendar,
  MapPin,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Download,
  FileText,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ResumeModal } from "@/components/ResumeModal";
import { usePortfolio } from "@/context/PortfolioContext";

export function ExperiencePage() {
  const { experiences, personalInfo } = usePortfolio();
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 text-primary-foreground sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="animate-float-soft absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
          <div className="animate-float-slow absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Briefcase className="h-4 w-4 text-accent" />
                Track Record & Leadership
              </div>
              <h1 className="mt-4 font-sora text-4xl font-extrabold tracking-tight sm:text-6xl">
                Work <span className="text-accent">Experience</span>
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                Leading engineering teams, architecting bespoke Shopify storefronts, and delivering
                enterprise software systems with quantifiable business outcomes.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <button
                onClick={() => setResumeOpen(true)}
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-xl shadow-accent/30 hover:bg-accent/90"
              >
                <Download className="h-4 w-4" />
                <span>Download Resume (CV)</span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14 py-14 sm:py-20 overflow-hidden">
        <div className="space-y-8 sm:space-y-12 w-full min-w-0 max-w-full">
          {experiences.map((exp, idx) => (
            <Reveal key={exp.id} delay={idx * 100}>
              <div
                className={`w-full min-w-0 max-w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-5 sm:p-10 shadow-sm transition-all duration-300 ${exp.cardClass}`}
              >
                <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-start">
                  <div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 font-sora text-xs font-bold uppercase tracking-wider ${
                        exp.badgeColor === "emerald"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : exp.badgeColor === "sky"
                            ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                            : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {exp.badge}
                    </span>

                    <h2 className="mt-3 font-sora text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {exp.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5 text-foreground font-semibold">
                        <Building className="h-3.5 w-3.5 text-accent" />
                        {exp.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-primary/10 px-4 py-1.5 font-sora text-xs font-bold text-primary">
                    {exp.type}
                  </span>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {exp.roleSummary}
                </p>

                {/* Key Responsibilities & Highlights */}
                <div className="mt-6">
                  <h3 className="font-sora text-xs font-bold uppercase tracking-wider text-accent">
                    Key Responsibilities & Deliverables
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {exp.highlights.map((item, hIdx) => (
                      <li
                        key={hIdx}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantifiable Achievements */}
                <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <h4 className="flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-accent">
                    <Trophy className="h-4 w-4" />
                    Key Milestones & Impact
                  </h4>
                  <ul className="mt-2.5 space-y-1.5">
                    {exp.achievements.map((ach, aIdx) => (
                      <li
                        key={aIdx}
                        className="flex items-center gap-2 text-xs font-semibold text-foreground/90"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="mt-6 border-t border-border/60 pt-5">
                  <span className="font-sora text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Technologies & Methodologies:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {exp.techs.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-border/80 bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <section className="mt-24">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border/80 bg-section-alt p-8 sm:p-12 lg:flex-row">
              <div>
                <h3 className="font-sora text-2xl font-black text-foreground">
                  Ready to add leadership & technical speed to your team?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Available for immediate start in senior engineering and agency leadership roles.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setResumeOpen(true)}
                  className="btn-shine inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-sora text-xs font-bold uppercase tracking-wider text-foreground hover:border-accent"
                >
                  <FileText className="h-4 w-4 text-accent" />
                  <span>View CV</span>
                </button>
                <Link
                  to="/contact"
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                >
                  <span>Contact {personalInfo.name ? personalInfo.name.split(" ")[0] : "Me"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      <Footer />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
