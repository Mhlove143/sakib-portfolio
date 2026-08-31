import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FolderGit2,
  ExternalLink,
  Github,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Project } from "@/data/portfolio";
import { usePortfolio } from "@/context/PortfolioContext";
import { CaseStudyModal } from "@/components/CaseStudyModal";
import { TechLogo } from "@/components/TechLogo";

const filterCategories = ["All", "Full-Stack", "Shopify", "CMS", "SaaS"] as const;
type FilterCategory = (typeof filterCategories)[number];

export function ProjectsPage() {
  const { projects } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <Navbar />

      {/* Case Study Popup Modal */}
      <CaseStudyModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 text-primary-foreground sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <div className="animate-float-soft absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
          <div className="animate-float-slow absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <FolderGit2 className="h-4 w-4 text-accent" />
              Verified Case Studies
            </div>
            <h1 className="mt-4 font-sora text-4xl font-extrabold tracking-tight sm:text-6xl">
              Featured <span className="text-accent">Projects</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Explore real-world software platforms, bespoke Shopify e-commerce engines, and custom
              automation tools engineered for resilience, speed, and business growth.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14 pt-8 sm:pt-12 overflow-hidden">
        <Reveal>
          <div className="w-full min-w-0 max-w-full overflow-hidden">
            <div className="flex w-full items-center gap-1.5 sm:gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-border/80">
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 sm:px-5 sm:py-2 font-sora text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeFilter === cat
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "border border-border/80 bg-card text-muted-foreground hover:border-accent hover:text-foreground"
                  }`}
                >
                  {cat} {cat !== "All" && `(${projects.filter((p) => p.category === cat).length})`}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Projects Grid (Exact Reference Design Layout + Native Theme Color Scheme) */}
        <div className="mt-8 sm:mt-12 grid w-full min-w-0 max-w-full gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, idx) => {
            const displayImage =
              project.imageUrl ||
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";

            return (
              <Reveal key={project.id} delay={idx * 60}>
                <div
                  className={`group flex h-full w-full min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl ${project.cardGlow}`}
                >
                  {/* Top Image Banner with Floating Category Badge */}
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="relative h-52 w-full overflow-hidden bg-muted/40 cursor-pointer border-b border-border/70"
                  >
                    <img
                      src={displayImage}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {/* Floating Category Pill in Top-Left (as in Reference Design) */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="inline-flex items-center rounded-lg bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1 font-sora text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                        {project.badge || project.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 flex flex-1 flex-col justify-between">
                    <div>
                      {/* Project Title */}
                      <h2
                        onClick={() => setSelectedProject(project)}
                        className="font-sora text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-1 hover:text-accent cursor-pointer transition-colors"
                        title={project.title}
                      >
                        {project.title}
                      </h2>

                      {/* Description */}
                      <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
                        {project.description}
                      </p>

                      {/* Impact / Rating Box (Green/Emerald Pill as in Reference Image) */}
                      {project.impact && (
                        <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span className="truncate">{project.impact}</span>
                        </div>
                      )}

                      {/* Tech Stack Badges */}
                      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                        {project.tech.slice(0, 4).map((t) => (
                          <div
                            key={t}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground"
                          >
                            <TechLogo name={t} className="h-3.5 w-3.5 shrink-0" size={14} />
                            <span>{t}</span>
                          </div>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="inline-flex items-center rounded-lg border border-border/70 bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="group/btn inline-flex items-center gap-1 font-sora text-xs sm:text-[13px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                      >
                        <span>Case Details</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </button>

                      {/* Right Action Icons (GitHub & Live Link) */}
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                            title="View Source Code"
                            aria-label="View Source Code"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                            title="Visit Live Preview"
                            aria-label="Visit Live Preview"
                          >
                            <ExternalLink className="h-4 w-4" />
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

        {/* CTA */}
        <section className="my-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-8 text-primary-foreground sm:p-14">
              <div className="max-w-2xl">
                <span className="font-sora text-xs font-bold uppercase tracking-widest text-accent">
                  Have a specific vision?
                </span>
                <h2 className="mt-3 font-sora text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Let’s engineer your next scalable web solution.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
                  Whether you need an enterprise Django backend, custom Shopify theme architecture,
                  or WordPress headless engineering, I’m ready to help you execute.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/contact"
                    className="btn-shine inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90"
                  >
                    <span>Start a Project Consultation</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      <Footer />
    </div>
  );
}
