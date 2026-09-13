import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle2,
  Server,
  ShoppingBag,
  Zap,
  Globe,
  Award,
  Terminal,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ResumeModal } from "@/components/ResumeModal";
import portraitAsset from "@/assets/sakib-portrait.png.asset.json";
import { usePortfolio } from "@/context/PortfolioContext";

const principles = [
  {
    title: "Clean Architecture First",
    description:
      "Writing modular, self-documenting code with clear separation of concerns between business logic, data models, and presentation.",
    icon: Terminal,
  },
  {
    title: "Performance & Sub-Second Speeds",
    description:
      "Never treating speed as an afterthought. Designing lightweight asset pipelines, optimizing SQL queries, and hitting 90+ Core Web Vitals.",
    icon: Zap,
  },
  {
    title: "Commercial & Business Focus",
    description:
      "Bridging the gap between software engineering and direct business revenue — reducing bounce rates, boosting Shopify conversions, and automating workflows.",
    icon: Award,
  },
  {
    title: "Resilient Security & Trust",
    description:
      "Implementing strict role-based access control (RBAC), sanitized SQL queries via ORMs, secure API authentications, and reliable payment handling.",
    icon: ShieldCheck,
  },
];

export function AboutPage() {
  const { personalInfo, keyMetrics } = usePortfolio();
  const [resumeOpen, setResumeOpen] = useState(false);
  const activePhoto =
    personalInfo.customProfilePhotoDataUri || personalInfo.avatarUrl || portraitAsset.url;

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <Navbar />

      {/* Hero Intro */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 text-primary-foreground sm:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-35">
          <div className="grid-lines absolute inset-0 opacity-55" />
          <div className="animate-float-soft absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
          <div className="animate-float-slow absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Engineering Profile
                </div>
                <h1 className="mt-4 font-sora text-4xl font-extrabold tracking-tight sm:text-6xl">
                  Meet <span className="text-accent">{personalInfo.name}</span>
                </h1>
                <p className="mt-4 font-sora text-lg font-bold text-accent">
                  {personalInfo.title}
                </p>
                <p className="mt-4 text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
                  {personalInfo.extendedBio}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setResumeOpen(true)}
                    className="btn-shine inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-xl shadow-accent/30 hover:bg-accent/90"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Full Resume (CV)</span>
                  </button>

                  <Link
                    to="/contact"
                    className="btn-shine inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3.5 font-sora text-xs font-semibold text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/20"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="flex justify-center lg:col-span-5">
              <Reveal delay={120}>
                <div className="group relative">
                  <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-accent via-teal-400 to-primary opacity-60 blur-xl transition-all duration-700 group-hover:opacity-90 group-hover:blur-2xl" />
                  <div className="relative overflow-hidden rounded-[2.2rem] border-4 border-primary-foreground/30 bg-primary/20 shadow-2xl backdrop-blur-sm">
                    <img
                      src={activePhoto}
                      alt={personalInfo.name}
                      className="h-80 w-72 object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[26rem] sm:w-[22rem]"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="w-full border-b border-border/80 bg-card py-10">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {keyMetrics.map((metric, i) => (
              <Reveal key={metric.label} delay={i * 70}>
                <div className="text-center sm:text-left">
                  <div className="flex items-baseline justify-center gap-1 sm:justify-start">
                    <span className="font-sora text-3xl font-extrabold text-foreground sm:text-4xl">
                      {metric.value}
                    </span>
                    <span className="font-sora text-xs font-bold uppercase tracking-wider text-accent">
                      {metric.suffix}
                    </span>
                  </div>
                  <p className="mt-1 font-sora text-sm font-bold text-foreground">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.subtext}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Engineering Principles */}
      <section className="w-full py-20 sm:py-28">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
          <Reveal className="max-w-2xl">
            <span className="font-sora text-xs font-bold uppercase tracking-widest text-accent">
              Core Principles
            </span>
            <h2 className="mt-2 font-sora text-3xl font-extrabold tracking-tight sm:text-4xl">
              How I Engineer Software
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Every system I architect balances technical precision, commercial outcomes, and
              long-term codebase maintainability.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((pr, idx) => {
              const Icon = pr.icon;
              return (
                <Reveal key={pr.title} delay={idx * 80}>
                  <div className="flex h-full flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg card-glow-emerald">
                    <div>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-sora text-lg font-bold text-foreground">{pr.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {pr.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Next Steps CTA */}
      <section className="w-full border-t border-border/80 bg-section-alt py-16">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-6 px-5 sm:px-8 lg:flex-row lg:px-14">
          <div>
            <h3 className="font-sora text-2xl font-black text-foreground">
              Interested in my journey and work?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore my technical services, career timeline, or discuss a project.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/experience"
              className="btn-shine inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 font-sora text-xs font-bold uppercase tracking-wider text-foreground hover:border-accent"
            >
              <span>View Experience</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/contact"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              <span>Hire Me</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
