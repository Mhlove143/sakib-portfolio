import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Layers,
  ShoppingBag,
  Server,
  Zap,
  CheckCircle2,
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Languages,
  TrendingUp,
  Award,
  Clock,
  Code2,
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  Cpu,
  ShieldCheck,
  Database,
  Layout,
  Terminal,
  ChevronRight,
  Filter,
  ArrowUpRight,
} from "lucide-react";

import portraitAsset from "@/assets/sakib-portrait.png.asset.json";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Typewriter } from "@/components/Typewriter";
import { ContactForm } from "@/components/ContactForm";
import { HeroContactCard } from "@/components/HeroContactCard";
import { ResumeModal } from "@/components/ResumeModal";
import { TechLogo } from "@/components/TechLogo";
import { CaseStudyModal } from "@/components/CaseStudyModal";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";
import { Project, Service } from "@/data/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";

const marqueeItems = [
  "Django (Python)",
  "React.js (Hooks & SPA)",
  "Shopify Liquid & Theme Kit",
  "Shopify App CLI & APIs",
  "Django REST Framework",
  "Tailwind CSS & Webflow Motion",
  "PostgreSQL & SQLite",
  "WordPress & WooCommerce",
  "Wix Studio & Velo",
  "Core Web Vitals & Speed Optimization",
];

const metricIcons = [Clock, Layers, ShoppingBag, Award];

export function HomePage() {
  const {
    personalInfo,
    keyMetrics,
    services,
    skillCategories,
    projects,
    experiences,
    educationList,
    certifications,
    languages,
  } = usePortfolio();

  const [resumeOpen, setResumeOpen] = useState(false);
  const [selectedCaseStudyProject, setSelectedCaseStudyProject] = useState<Project | null>(null);
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<Service | null>(null);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>("all");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>("all");
  const [selectedProjectCategory, setSelectedProjectCategory] = useState<string>("All");

  const activePhoto =
    personalInfo.customProfilePhotoDataUri || personalInfo.avatarUrl || portraitAsset.url;

  // Filter services if needed
  const filteredServices =
    selectedServiceFilter === "all"
      ? services
      : selectedServiceFilter === "fullstack"
        ? services.filter((s) => s.id === "fullstack-web" || s.id === "django-backend")
        : selectedServiceFilter === "shopify"
          ? services.filter((s) => s.id === "shopify-development" || s.id === "cms-development")
          : services.filter(
              (s) => s.id === "performance-optimization" || s.id === "team-leadership",
            );

  // Filter skills
  const filteredSkillCategories =
    selectedSkillCategory === "all"
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === selectedSkillCategory);

  // Filter projects
  const filteredProjects =
    selectedProjectCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedProjectCategory);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground scroll-smooth">
      <Navbar />

      {/* Case Study Modal Popup */}
      <CaseStudyModal
        project={selectedCaseStudyProject}
        isOpen={!!selectedCaseStudyProject}
        onClose={() => setSelectedCaseStudyProject(null)}
      />

      {/* Service Detail Modal Popup */}
      <ServiceDetailModal
        service={selectedServiceDetail}
        isOpen={!!selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
      />

      {/* =========================================================================
          HERO SECTION (Webflow-Style Polish, Animated Glowing Orbs, Direct Links)
      ========================================================================== */}
      <section
        id="hero"
        className="relative overflow-hidden bg-hero-gradient pt-12 pb-16 text-primary-foreground sm:pt-20 sm:pb-28"
      >
        {/* Ambient atmospheric glows and grid lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-35">
          <div className="grid-lines absolute inset-0 opacity-40" />
          <div className="animate-float-soft absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-accent/45 blur-3xl" />
          <div className="animate-float-slow absolute right-0 top-1/4 h-[32rem] w-[32rem] rounded-full bg-teal-400/25 blur-3xl" />
          <div className="animate-float-soft absolute -bottom-10 left-1/3 h-96 w-96 rounded-full bg-primary/45 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-12 xl:gap-16">
            {/* Left Column: Hero Content */}
            <div className="space-y-4 sm:space-y-6 lg:col-span-7">
              {/* Status Badge */}
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/70 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 shadow-lg backdrop-blur-md">
                  <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
                    <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="truncate max-w-[260px] sm:max-w-none">{personalInfo.availability}</span>
                </div>
              </Reveal>

              {/* Headline */}
              <Reveal delay={60}>
                <h1 className="font-sora text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] sm:leading-[1.08] drop-shadow-sm">
                  Hi, I'm <span className="text-emerald-400 font-black">{personalInfo.name}</span>
                </h1>
              </Reveal>

              {/* Dynamic Typewriter Roles */}
              <Reveal delay={120}>
                <div className="min-h-[2.2rem] sm:min-h-[2.6rem] font-sora text-lg sm:text-2xl lg:text-3xl font-extrabold text-emerald-300 flex items-center drop-shadow-sm">
                  <Typewriter words={personalInfo.roles} typingSpeed={75} pauseTime={2200} />
                </div>
              </Reveal>

              {/* Narrative Bio (Streamlined on mobile) */}
              <Reveal delay={180}>
                <p className="max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-white/90 line-clamp-3 sm:line-clamp-none">
                  {personalInfo.bio}
                </p>
              </Reveal>

              {/* Hero Feature Lines / Key Value Bullets (Top 2 on mobile, all 4 on sm+) */}
              <Reveal delay={220}>
                <div className="grid grid-cols-1 gap-2 sm:gap-2.5 pt-1 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white sm:text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 sm:h-4.5 sm:w-4.5" />
                    <span>Full-Stack Architecture (Django + React)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white sm:text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 sm:h-4.5 sm:w-4.5" />
                    <span>Bespoke Shopify Themes & Custom Apps</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-white sm:text-sm">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                    <span>Sub-Second Latency & Core Web Vitals (95+)</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-white sm:text-sm">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-400" />
                    <span>{personalInfo.title}</span>
                  </div>
                </div>
              </Reveal>

              {/* Action Buttons: Let's Build + Download Resume */}
              <Reveal delay={260}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                  <a
                    href="#contact"
                    className="btn-shine group flex items-center justify-center gap-2.5 rounded-full bg-emerald-500 px-6 py-3.5 sm:px-8 sm:py-4 font-sora text-xs font-bold uppercase tracking-wider text-slate-950 shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:bg-emerald-400 hover:shadow-2xl hover:shadow-emerald-400/50 active:scale-95 text-center"
                  >
                    <span>Let's Build Together</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </a>

                  <button
                    onClick={() => setResumeOpen(true)}
                    className="btn-shine flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3.5 sm:px-6 sm:py-4 font-sora text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-emerald-400 text-center"
                  >
                    <Download className="h-4 w-4 text-emerald-400" />
                    <span>Download Resume (CV)</span>
                  </button>
                </div>
              </Reveal>

              {/* Hero Social & Direct Channel Links Bar */}
              <Reveal delay={300}>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <span className="font-sora text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/70">
                    Connect:
                  </span>

                  {/* GitHub */}
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-shine inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-emerald-400"
                    title="View GitHub Profile"
                  >
                    <Github className="h-3.5 w-3.5 text-emerald-400" />
                    <span>GitHub</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-shine inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-emerald-400"
                    title="View LinkedIn Profile"
                  >
                    <Linkedin className="h-3.5 w-3.5 text-sky-300" />
                    <span>LinkedIn</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={personalInfo.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-shine inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-emerald-400"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Email Direct */}
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="btn-shine inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-emerald-400"
                    title="Send Email"
                  >
                    <Mail className="h-3.5 w-3.5 text-teal-300" />
                    <span>Email</span>
                  </a>

                  {/* Phone Direct */}
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="btn-shine inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-emerald-400"
                    title={`Call ${personalInfo.name}`}
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Call</span>
                  </a>
                </div>
              </Reveal>

              {/* Animated Quick-Contact Card (Dhaka, Bangladesh · Phone · Email) */}
              <Reveal delay={340}>
                <div className="pt-1 sm:pt-2">
                  <HeroContactCard />
                </div>
              </Reveal>
            </div>

            {/* Right Column: Hero Portrait with Reference Style Background Card Effect */}
            <div className="flex justify-center lg:col-span-5">
              <Reveal delay={150}>
                <div className="group relative w-full max-w-[19rem] sm:max-w-[27rem] lg:max-w-[29rem] px-2 sm:px-3 py-2 sm:py-3">
                  {/* Reference Image Background Card: Tilted rounded deep-emerald card */}
                  <div className="absolute inset-x-2 inset-y-1 rotate-[-3.5deg] rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-800/90 via-teal-900/90 to-slate-950 border-2 border-emerald-400/40 shadow-2xl shadow-emerald-950/80 transition-all duration-500 group-hover:rotate-[-5deg] group-hover:scale-[1.03]" />

                  {/* Ambient glowing atmosphere behind photo */}
                  <div className="absolute -inset-2 rounded-[2.4rem] sm:rounded-[2.8rem] bg-gradient-to-tr from-emerald-500/40 via-teal-400/30 to-primary/40 opacity-75 blur-2xl transition-all duration-700 group-hover:opacity-100 group-hover:blur-3xl" />

                  {/* Main Foreground Card with Photo */}
                  <div className="relative overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] border-2 border-emerald-400/40 bg-slate-950/60 shadow-2xl backdrop-blur-md transition-all duration-500 group-hover:scale-[1.02] group-hover:border-emerald-400/70">
                    <img
                      src={activePhoto}
                      alt={`${personalInfo.name} — ${personalInfo.title}`}
                      className="h-[20rem] sm:h-[30rem] lg:h-[33rem] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Floating Role Badge with Crisp, High-Contrast Typography */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 rounded-xl sm:rounded-2xl border border-emerald-400/50 bg-black/85 p-2.5 sm:p-3.5 shadow-2xl backdrop-blur-xl">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-sm">
                          <Briefcase className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-sora text-xs font-bold text-white">
                            {experiences[0]?.company || "ScaleUP Ads Agency"}
                          </p>
                          <p className="truncate text-[11px] sm:text-xs font-bold text-emerald-400">
                            {experiences[0]?.title || personalInfo.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Floating Experience Badge (Top Right) */}
                    <div className="animate-float-soft absolute top-3 sm:top-4 right-3 sm:right-4 rounded-lg sm:rounded-xl border border-emerald-400/50 bg-black/85 px-2.5 py-1 sm:px-3.5 sm:py-1.5 shadow-xl backdrop-blur-xl">
                      <p className="font-sora text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                        {keyMetrics[0] ? `${keyMetrics[0].value} ${keyMetrics[0].suffix} Pro Dev` : "2+ Years Pro Dev"}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MARQUEE STRIP (Smooth Webflow Ticker with Skill Logos)
      ========================================================================== */}
      <section className="relative z-10 w-full overflow-hidden border-y border-border/80 bg-section-alt py-3.5 sm:py-6">
        <div className="flex w-max items-center gap-4 sm:gap-6 animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/70 bg-card/80 px-3 py-1.5 sm:px-4.5 sm:py-2.5 font-sora text-xs sm:text-[13px] font-bold tracking-tight text-foreground shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-500/60 hover:bg-card hover:text-emerald-500 hover:shadow-md"
            >
              <TechLogo name={tech} className="h-4.5 w-4.5 sm:h-6 sm:w-6 shrink-0 shadow-sm" size={20} />
              <span>{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          KEY METRICS SECTION (4 Glowing Cards, Quantified Track Record)
      ========================================================================== */}
      <section id="metrics" className="relative py-12 sm:py-20">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <Reveal>
            <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-10 card-glow-emerald">
              <div className="mb-4 sm:mb-6 flex flex-col justify-between gap-2 border-b border-border/60 pb-3 sm:pb-5 sm:flex-row sm:items-center">
                <div>
                  <span className="font-sora text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
                    Proven Delivery Metrics
                  </span>
                  <h2 className="mt-0.5 sm:mt-1 font-sora text-xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Engineering Quantified
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 sm:px-4 sm:py-1.5 font-sora text-[11px] sm:text-xs font-bold text-primary w-fit">
                  2+ Years Track Record
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-4">
                {keyMetrics.map((metric, i) => {
                  const Icon = metricIcons[i] || Clock;
                  return (
                    <div
                      key={metric.label}
                      className="flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 p-3.5 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-muted/40"
                    >
                      <div className="mb-2 sm:mb-3 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-sora text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                            {metric.value}
                          </span>
                          <span className="font-sora text-[10px] sm:text-xs font-bold uppercase tracking-wider text-accent">
                            {metric.suffix}
                          </span>
                        </div>
                        <p className="mt-0.5 sm:mt-1 font-sora text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                          {metric.label}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{metric.subtext}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          ABOUT & ENGINEERING PHILOSOPHY SECTION (#about)
      ========================================================================== */}
      <section id="about" className="py-14 sm:py-24 bg-section-alt border-t border-border/80 overflow-hidden w-full">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <div className="grid w-full min-w-0 max-w-full gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Narrative */}
            <div className="space-y-4 sm:space-y-5 lg:col-span-6 min-w-0">
              <Reveal>
                <span className="font-sora text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
                  About {personalInfo.name}
                </span>
                <h2 className="mt-1 sm:mt-2 font-sora text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  Engineering Software That Drives Measurable Growth
                </h2>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
                  {personalInfo.extendedBio}
                </p>
                <p className="hidden sm:block text-sm leading-relaxed text-muted-foreground">
                  My approach fuses foundational Computer Science principles with agile commercial
                  urgency. Whether configuring scalable relational databases or fine-tuning Shopify
                  checkout flows, every deliverable is built for extreme reliability and speed.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
                  <Link
                    to="/about"
                    className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 sm:px-6 sm:py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                  >
                    <span>Read Full Story & Bio</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() => setResumeOpen(true)}
                    className="btn-shine inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 sm:px-5 sm:py-3 font-sora text-xs font-bold uppercase tracking-wider text-foreground hover:border-accent hover:text-accent"
                  >
                    <Download className="h-3.5 w-3.5 text-accent" />
                    <span>Download CV</span>
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Right Pillars Grid (Top 2 on mobile, all 4 on sm+) */}
            <div className="grid w-full min-w-0 max-w-full gap-3 sm:gap-4 sm:grid-cols-2 lg:col-span-6">
              <Reveal delay={60}>
                <div className="h-full w-full min-w-0 max-w-full rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm card-glow-emerald">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                    <Database className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="mt-3 sm:mt-4 font-sora text-sm sm:text-base font-bold text-foreground">
                    Architecture First
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-muted-foreground">
                    Designing normalized database schemas, clean Django REST APIs, and modular React
                    state trees that resist technical debt.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="h-full rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm card-glow-sky">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
                    <Zap className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="mt-3 sm:mt-4 font-sora text-sm sm:text-base font-bold text-foreground">
                    Sub-Second Performance
                  </h3>
                  <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-muted-foreground">
                    Optimizing critical rendering paths, tree-shaking assets, and tuning server
                    queries to achieve 90+ Lighthouse ratings.
                  </p>
                </div>
              </Reveal>

              <div className="hidden sm:block">
                <Reveal delay={180}>
                  <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-sm card-glow-purple">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-sora text-base font-bold text-foreground">
                      High-Converting Commerce
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Bespoke Shopify Liquid storefronts, Ajax drawers, seamless upsells, and custom
                      apps designed to elevate conversion rates.
                    </p>
                  </div>
                </Reveal>
              </div>

              <div className="hidden sm:block">
                <Reveal delay={240}>
                  <div className="h-full rounded-2xl border border-border/80 bg-card p-6 shadow-sm card-glow-amber">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-sora text-base font-bold text-foreground">
                      Team & Agile Leadership
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Guiding sprint roadmaps, reviewing pull requests, and standardizing Git
                      workflows for engineering teams.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SPECIALIZED SERVICES SECTION (#services — ALL 6 Services Restored!)
      ========================================================================== */}
      <section id="services" className="py-14 sm:py-28 border-t border-border/80 overflow-hidden w-full">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <span className="font-sora text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
                Core Offerings
              </span>
              <h2 className="mt-1 sm:mt-2 font-sora text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Specialized Services
              </h2>
              <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-base text-muted-foreground">
                Delivering complete end-to-end software solutions — from robust Python backends to
                high-speed storefronts and team management.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-accent"
              >
                <span>View Full Specifications</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          {/* Webflow Interactive Category Tabs */}
          <div className="mt-6 sm:mt-8 w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex w-full items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              {[
                { id: "all", label: "All Services (6)" },
                { id: "fullstack", label: "Web & Backend" },
                { id: "shopify", label: "Shopify & CMS" },
                { id: "team", label: "Speed & Leadership" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedServiceFilter(tab.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1 sm:px-4 sm:py-1.5 font-sora text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                    selectedServiceFilter === tab.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid (3 Featured Services for clean lightweight home layout) */}
          <div className="mt-8 sm:mt-10 grid w-full min-w-0 max-w-full gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.slice(0, 3).map((service, idx) => {
              const displayImage =
                service.imageUrl ||
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop";

              return (
                <Reveal key={service.id} delay={idx * 60}>
                  <div
                    className={`group flex h-full w-full min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl ${
                      service.color === "emerald"
                        ? "card-glow-emerald"
                        : service.color === "sky"
                          ? "card-glow-sky"
                          : service.color === "purple"
                            ? "card-glow-purple"
                            : "card-glow-amber"
                    }`}
                  >
                    {/* Service Image Banner with Floating Tagline Badge */}
                    <div
                      onClick={() => setSelectedServiceDetail(service)}
                      className="relative h-44 sm:h-52 w-full overflow-hidden bg-muted/40 cursor-pointer border-b border-border/70"
                    >
                      <img
                        src={displayImage}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                      <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10">
                        <span className="inline-flex items-center rounded-lg bg-black/80 backdrop-blur-md border border-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 font-sora text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                          {service.tagline}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-7 flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <h3
                          onClick={() => setSelectedServiceDetail(service)}
                          className="font-sora text-base sm:text-xl font-bold tracking-tight text-foreground hover:text-accent cursor-pointer transition-colors line-clamp-1"
                          title={service.title}
                        >
                          {service.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-3">
                          {service.description}
                        </p>

                        {/* Business Impact Box */}
                        {service.businessValue && (
                          <div className="mt-3 sm:mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span className="truncate">{service.businessValue}</span>
                          </div>
                        )}

                        {/* Key Deliverables (Top 1 on mobile, 2 on sm+) */}
                        <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-1.5 border-t border-border/60 pt-2.5 sm:pt-3">
                          <p className="font-sora text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                            Key Deliverables:
                          </p>
                          <ul className="space-y-1">
                            {service.deliverables.slice(0, 2).map((del, dIdx) => (
                              <li
                                key={dIdx}
                                className={`items-start gap-2 text-xs font-medium text-muted-foreground ${dIdx > 0 ? "hidden sm:flex" : "flex"}`}
                              >
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                                <span className="line-clamp-1">{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Technologies (Top 3 on mobile, 4+ on sm+) */}
                        <div className="mt-3 sm:mt-4 border-t border-border/60 pt-2.5 sm:pt-3">
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {service.technologies.slice(0, 3).map((t) => (
                              <div
                                key={t}
                                className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-foreground"
                              >
                                <TechLogo name={t} className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" size={14} />
                                <span>{t}</span>
                              </div>
                            ))}
                            {service.technologies.length > 3 && (
                              <span className="inline-flex items-center rounded-lg border border-border/70 bg-muted/40 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                                +{service.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-5 flex items-center justify-between gap-2 border-t border-border/60 pt-3 sm:pt-4">
                        <button
                          type="button"
                          onClick={() => setSelectedServiceDetail(service)}
                          className="group/btn inline-flex items-center gap-1 font-sora text-xs sm:text-[13px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                        >
                          <span>Scope & Arch</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </button>
                        <Link
                          to="/contact"
                          className="group inline-flex items-center gap-1 font-sora text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors"
                        >
                          <span>Inquire</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* View All Services Callout */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              to="/services"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 sm:px-7 sm:py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              <span>Explore All {services.length} Services in Detail</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TECHNICAL SKILLS MATRIX SECTION (#skills — Full Matrix Restored!)
      ========================================================================== */}
      <section id="skills" className="py-14 sm:py-28 bg-section-alt border-t border-border/80 overflow-hidden w-full">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <span className="font-sora text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
                Technical Toolset
              </span>
              <h2 className="mt-1 sm:mt-2 font-sora text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Skills & Proficiency Matrix
              </h2>
              <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-base text-muted-foreground">
                Battle-tested skills honed through 2+ years of production deployments, client
                storefronts, and enterprise web applications.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <Link
                to="/skills"
                className="group inline-flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-accent"
              >
                <span>Full Skills Matrix & Breakdown</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          {/* Webflow Skill Category Tabs */}
          <div className="mt-6 sm:mt-8 w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex w-full items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              <button
                onClick={() => setSelectedSkillCategory("all")}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1 sm:px-4 sm:py-1.5 font-sora text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                  selectedSkillCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                All Categories
              </button>
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSkillCategory(cat.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1 sm:px-4 sm:py-1.5 font-sora text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                    selectedSkillCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Grid (2 Core Categories shown on homepage for clean lightweight feel) */}
          <div className="mt-8 sm:mt-10 grid w-full min-w-0 max-w-full gap-6 sm:gap-8 md:grid-cols-2">
            {filteredSkillCategories.slice(0, 2).map((cat, catIdx) => (
              <Reveal key={cat.id} delay={catIdx * 80}>
                <div className="w-full min-w-0 max-w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-8 shadow-sm card-glow-emerald">
                  <div className="mb-4 sm:mb-6 flex items-center justify-between border-b border-border/70 pb-3 sm:pb-4">
                    <div>
                      <span className="font-sora text-[10px] sm:text-xs font-bold uppercase tracking-wider text-accent">
                        {cat.highlight}
                      </span>
                      <h3 className="font-sora text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 font-sora text-[10px] sm:text-xs font-bold text-primary">
                      {cat.skills.length} Competencies
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {cat.skills.map((skill) => {
                      const levelPercent =
                        skill.level === "Expert" ? 95 : skill.level === "Advanced" ? 85 : 75;

                      return (
                        <div
                          key={skill.name}
                          className="group rounded-xl border border-border/50 bg-muted/20 p-3 sm:p-3.5 transition-colors hover:bg-muted/40"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-sora text-xs sm:text-sm font-bold text-foreground">
                              {skill.name}
                            </span>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 font-sora text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                                  skill.level === "Expert"
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                    : skill.level === "Advanced"
                                      ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                                      : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                                }`}
                              >
                                {skill.level}
                              </span>
                              <span className="font-sora text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                                {skill.experience}
                              </span>
                            </div>
                          </div>

                          {/* Animated Progress Meter */}
                          <div className="mt-2 sm:mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                              style={{ width: `${levelPercent}%` }}
                            />
                          </div>

                          {/* Skill Description: visible on desktop, hidden on mobile for airy scannability */}
                          {skill.description && (
                            <p className="hidden sm:block mt-2 text-xs text-muted-foreground">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* View All Skills Callout */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              to="/skills"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 sm:px-7 sm:py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              <span>Explore Complete Technical Skills Directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED PROJECTS SECTION (#projects — All 6 Case Studies)
      ========================================================================== */}
      <section id="projects" className="py-14 sm:py-28 border-t border-border/80 overflow-hidden w-full">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <span className="font-sora text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
                Case Studies
              </span>
              <h2 className="mt-1 sm:mt-2 font-sora text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Featured Work & Applications
              </h2>
              <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-base text-muted-foreground">
                Real software platforms and commercial storefronts delivering tangible revenue and
                speed benchmarks.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-accent"
              >
                <span>Browse All Case Studies</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          {/* Webflow Project Category Tabs */}
          <div className="mt-6 sm:mt-8 w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex w-full items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar">
              {["All", "Full-Stack", "Shopify", "CMS", "SaaS"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedProjectCategory(cat)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1 sm:px-4 sm:py-1.5 font-sora text-[11px] sm:text-xs font-bold transition-all duration-200 ${
                    selectedProjectCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid (3 Featured Projects shown on homepage matching reference design) */}
          <div className="mt-8 sm:mt-10 grid w-full min-w-0 max-w-full gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.slice(0, 3).map((proj, idx) => {
              const displayImage =
                proj.imageUrl ||
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";

              return (
                <Reveal key={proj.id} delay={idx * 60}>
                  <div
                    className={`group flex h-full w-full min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl ${proj.cardGlow}`}
                  >
                    {/* Top Image Banner with Floating Category Badge (as in Reference) */}
                    <div
                      onClick={() => setSelectedCaseStudyProject(proj)}
                      className="relative h-44 sm:h-52 w-full overflow-hidden bg-muted/40 cursor-pointer border-b border-border/70"
                    >
                      <img
                        src={displayImage}
                        alt={proj.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                      {/* Floating Category Pill in Top-Left (Reference design) */}
                      <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10">
                        <span className="inline-flex items-center rounded-lg bg-black/80 backdrop-blur-md border border-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 font-sora text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                          {proj.badge || proj.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-7 flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        {/* Project Title */}
                        <h3
                          onClick={() => setSelectedCaseStudyProject(proj)}
                          className="font-sora text-base sm:text-xl font-bold tracking-tight text-foreground line-clamp-1 hover:text-accent cursor-pointer transition-colors"
                          title={proj.title}
                        >
                          {proj.title}
                        </h3>

                        {/* Description (2 lines on mobile, 3 on sm+) */}
                        <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-3">
                          {proj.description}
                        </p>

                        {/* Impact / Rating Box (Green/Emerald Pill as in Reference Image) */}
                        {proj.impact && (
                          <div className="mt-3 sm:mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span className="truncate">{proj.impact}</span>
                          </div>
                        )}

                        {/* Tech Stack Badges with logos and +N (Top 3 on mobile, 4+ on sm+) */}
                        <div className="mt-3 sm:mt-3.5 flex flex-wrap items-center gap-1 sm:gap-1.5">
                          {proj.tech.slice(0, 3).map((t) => (
                            <div
                              key={t}
                              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-foreground"
                            >
                              <TechLogo name={t} className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" size={14} />
                              <span>{t}</span>
                            </div>
                          ))}
                          {proj.tech.length > 3 && (
                            <span className="inline-flex items-center rounded-lg border border-border/70 bg-muted/40 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-muted-foreground">
                              +{proj.tech.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer Row matching Reference */}
                      <div className="mt-4 sm:mt-5 border-t border-border/60 pt-3 sm:pt-4 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCaseStudyProject(proj)}
                          className="group/btn inline-flex items-center gap-1 font-sora text-xs sm:text-[13px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                        >
                          <span>Case Details</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </button>

                        {/* Right Action Icons (GitHub & Live Link) */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                              title="View Source Code"
                              aria-label="View Source Code"
                            >
                              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                              title="Visit Live Preview"
                              aria-label="Visit Live Preview"
                            >
                              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* View All Projects Callout */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              to="/projects"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 sm:px-7 sm:py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              <span>Explore All {projects.length} Case Studies & Apps</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CAREER & LEADERSHIP TIMELINE (#experience — All 3 Roles)
      ========================================================================== */}
      <section id="experience" className="py-14 sm:py-28 bg-section-alt border-t border-border/80 overflow-hidden w-full">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <span className="font-sora text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
                Career History
              </span>
              <h2 className="mt-1 sm:mt-2 font-sora text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Experience & Leadership Timeline
              </h2>
              <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-base text-muted-foreground">
                2+ years progressing from frontend implementation to full-stack architecture and
                agency team leadership.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <Link
                to="/experience"
                className="group inline-flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-accent"
              >
                <span>Detailed Experience Timeline</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-8 sm:mt-12 w-full min-w-0 max-w-full space-y-6 sm:space-y-8">
            {experiences.slice(0, 2).map((exp, idx) => (
              <Reveal key={exp.id} delay={idx * 80}>
                <div
                  className={`w-full min-w-0 max-w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-5 sm:p-9 shadow-sm ${exp.cardClass}`}
                >
                  <div className="flex flex-col justify-between gap-2.5 sm:gap-3 border-b border-border/70 pb-4 sm:pb-5 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 font-sora text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                            exp.badgeColor === "emerald"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : exp.badgeColor === "sky"
                                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                                : "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          {exp.badge}
                        </span>
                        <span className="text-xs text-muted-foreground">({exp.type})</span>
                      </div>
                      <h3 className="mt-1.5 sm:mt-2 font-sora text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
                        {exp.title}
                      </h3>
                      <p className="text-xs font-semibold text-accent truncate">
                        {exp.company} · {exp.location}
                      </p>
                    </div>
                    <span className="w-fit shrink-0 rounded-full bg-primary/10 px-3 py-1 font-sora text-[11px] sm:text-xs font-bold text-primary">
                      {exp.period}
                    </span>
                  </div>

                  <p className="mt-3 sm:mt-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {exp.roleSummary}
                  </p>

                  <div className="mt-4 sm:mt-5 grid w-full min-w-0 max-w-full gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="min-w-0">
                      <p className="mb-2 font-sora text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground">
                        Responsibilities:
                      </p>
                      <ul className="space-y-1.5 sm:space-y-2 min-w-0">
                        {exp.highlights.map((h, i) => (
                          <li
                            key={i}
                            className={`items-start gap-2 text-xs text-muted-foreground min-w-0 ${i >= 2 ? "hidden sm:flex" : "flex"}`}
                          >
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                            <span className="break-words min-w-0">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="min-w-0">
                      <p className="mb-2 font-sora text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground">
                        Key Accomplishments:
                      </p>
                      <ul className="space-y-1.5 sm:space-y-2 min-w-0">
                        {exp.achievements.map((ach, i) => (
                          <li
                            key={i}
                            className={`items-start gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 min-w-0 ${i >= 2 ? "hidden sm:flex" : "flex"}`}
                          >
                            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            <span className="break-words min-w-0">{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 flex flex-wrap gap-1 sm:gap-1.5 border-t border-border/60 pt-3 sm:pt-4 min-w-0">
                    {exp.techs.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* View Full Experience Callout */}
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Link
              to="/experience"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 sm:px-7 sm:py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
            >
              <span>View Full Career & Leadership Timeline ({experiences.length} Roles)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EDUCATION & LANGUAGES SECTION (#education — ALL 3 DEGREES RESTORED!)
      ========================================================================== */}
      <section id="education" className="py-14 sm:py-28 border-t border-border/80 overflow-hidden w-full">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <div className="flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
            <Reveal>
              <span className="font-sora text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
                Academic & Linguistic Credentials
              </span>
              <h2 className="mt-1 sm:mt-2 font-sora text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Education, Certifications & Languages
              </h2>
              <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-base text-muted-foreground">
                Computer Science degrees, top 5% distinction diploma honors, industry
                certifications, and multilingual capability.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <Link
                to="/education"
                className="group inline-flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-accent"
              >
                <span>View Full Academic Matrix</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          {/* Academic Degrees (Top 2 Degrees shown on homepage) */}
          <div className="mt-8 sm:mt-12 w-full min-w-0 max-w-full space-y-4 sm:space-y-6">
            {educationList.slice(0, 2).map((edu, idx) => (
              <Reveal key={edu.degree} delay={idx * 70}>
                <div
                  className={`w-full min-w-0 max-w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-5 sm:p-8 shadow-sm ${
                    idx === 0
                      ? "card-glow-emerald"
                      : idx === 1
                        ? "card-glow-sky"
                        : "card-glow-purple"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-2.5 sm:gap-3 border-b border-border/70 pb-3 sm:pb-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                      <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 font-sora text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                              edu.statusType === "distinction"
                                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                : edu.statusType === "active"
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                            }`}
                          >
                            {edu.status}
                          </span>
                          {edu.cgpa && (
                            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-sora text-[10px] sm:text-[11px] font-bold text-accent">
                              {edu.cgpa}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 font-sora text-base sm:text-xl font-bold text-foreground truncate">
                          {edu.degree}
                        </h3>
                        <p className="text-xs font-semibold text-accent truncate">
                          {edu.institution} · {edu.location}
                        </p>
                      </div>
                    </div>

                    <span className="w-fit shrink-0 rounded-full bg-primary/10 px-3 py-0.5 sm:px-3.5 sm:py-1 font-sora text-[11px] sm:text-xs font-bold text-primary">
                      {edu.period}
                    </span>
                  </div>

                  <p className="mt-3 sm:mt-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {edu.description}
                  </p>

                  <div className="mt-3 sm:mt-4 grid w-full min-w-0 max-w-full gap-3 sm:gap-4 md:grid-cols-2">
                    <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 p-3 sm:p-4 min-w-0">
                      <span className="font-sora text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                        Key Coursework & Competencies:
                      </span>
                      <ul className="mt-2 space-y-1 min-w-0">
                        {edu.coursework.map((c, i) => (
                          <li
                            key={i}
                            className={`items-center gap-2 text-xs text-muted-foreground min-w-0 ${i >= 2 ? "hidden sm:flex" : "flex"}`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent" />
                            <span className="truncate">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/20 p-3 sm:p-4 min-w-0">
                      <span className="font-sora text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                        Academic Highlights:
                      </span>
                      <ul className="mt-2 space-y-1 min-w-0">
                        {edu.highlights.map((h, i) => (
                          <li
                            key={i}
                            className={`items-center gap-2 text-xs text-muted-foreground min-w-0 ${i >= 2 ? "hidden sm:flex" : "flex"}`}
                          >
                            <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
                            <span className="truncate">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Certifications & Languages Snapshot */}
          <div className="mt-8 sm:mt-12 grid w-full min-w-0 max-w-full gap-6 sm:gap-8 lg:grid-cols-12">
            {/* Certifications */}
            <div className="w-full min-w-0 max-w-full lg:col-span-6">
              <Reveal delay={100}>
                <div className="h-full w-full min-w-0 max-w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-8 shadow-sm card-glow-emerald">
                  <div className="flex items-center gap-2.5 sm:gap-3 border-b border-border/70 pb-3 sm:pb-4">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <Award className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="font-sora text-base sm:text-lg font-bold text-foreground">
                        Professional Certifications
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        Industry standards & verified credentials
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
                    {certifications.slice(0, 2).map((cert) => (
                      <div
                        key={cert.title}
                        className="rounded-xl border border-border/60 bg-muted/20 p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-sora text-xs sm:text-sm font-bold text-foreground">
                            {cert.title}
                          </h4>
                          <span className="text-[10px] sm:text-[11px] text-muted-foreground">{cert.date}</span>
                        </div>
                        <p className="text-xs font-semibold text-accent">{cert.issuer}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {cert.skills.map((s) => (
                            <span
                              key={s}
                              className="rounded bg-muted/60 px-2 py-0.5 text-[9px] sm:text-[10px] text-muted-foreground"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Languages Matrix */}
            <div className="w-full min-w-0 max-w-full lg:col-span-6">
              <Reveal delay={160}>
                <div className="h-full w-full min-w-0 max-w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-8 shadow-sm card-glow-sky">
                  <div className="flex items-center gap-2.5 sm:gap-3 border-b border-border/70 pb-3 sm:pb-4">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
                      <Languages className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="font-sora text-base sm:text-lg font-bold text-foreground">
                        Linguistic Capabilities
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        Global client communication & standup fluency
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 space-y-3.5 sm:space-y-5">
                    {languages.map((lang) => (
                      <div
                        key={lang.name}
                        className="rounded-xl border border-border/60 bg-muted/20 p-3 sm:p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sora text-xs sm:text-sm font-bold text-foreground">
                            {lang.name}
                          </span>
                          <span className="font-sora text-[11px] sm:text-xs font-bold text-accent">
                            {lang.proficiency}
                          </span>
                        </div>

                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${lang.scorePercent}%` }}
                          />
                        </div>

                        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground">
                          <span>Reading: {lang.reading}</span>
                          <span>Writing: {lang.writing}</span>
                          <span>Speaking: {lang.speaking}</span>
                        </div>
                        <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-muted-foreground italic">
                          {lang.useCase}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTACT & LET'S BUILD SECTION (#contact — Interactive Form & Direct Channels)
      ========================================================================== */}
      <section id="contact" className="py-14 sm:py-28 bg-hero-gradient text-primary-foreground overflow-hidden w-full">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Narrative */}
            <div className="space-y-4 sm:space-y-5 lg:col-span-5">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-3.5 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                  Available for High-Impact Projects
                </div>
                <h2 className="mt-1 sm:mt-2 font-sora text-2xl sm:text-5xl font-extrabold tracking-tight">
                  Let's Discuss Your Next Initiative
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-primary-foreground/85">
                  Have a challenging software roadmap or an e-commerce platform that needs to scale?
                  Send a message or reach out on WhatsApp directly.
                </p>

                <div className="space-y-2.5 sm:space-y-3 pt-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Mail className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-accent shrink-0" />
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="font-sora text-xs sm:text-sm font-bold text-primary-foreground hover:text-accent hover:underline truncate"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Phone className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-sky-400 shrink-0" />
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="font-sora text-xs sm:text-sm font-bold text-primary-foreground hover:text-accent hover:underline"
                    >
                      {personalInfo.phoneDisplay}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <MessageSquare className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-emerald-400 shrink-0" />
                    <a
                      href={personalInfo.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-sora text-xs sm:text-sm font-bold text-emerald-400 hover:underline"
                    >
                      Chat on WhatsApp (+880 1572 710013)
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => setResumeOpen(true)}
                    className="btn-shine inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-2.5 sm:px-5 sm:py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-foreground/20 hover:border-accent"
                  >
                    <Download className="h-4 w-4 text-accent" />
                    <span>Download Full Resume</span>
                  </button>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 font-sora text-xs font-bold uppercase tracking-wider text-accent hover:underline"
                  >
                    <span>Open Dedicated Contact Page</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <Reveal delay={100}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Interactive Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
