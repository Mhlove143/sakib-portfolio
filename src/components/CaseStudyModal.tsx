import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Github, Sparkles, CheckCircle2, Tag } from "lucide-react";
import { type Project } from "@/data/portfolio";
import { TechLogo } from "@/components/TechLogo";

interface CaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  // Prevent background scrolling and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  // Fallback image based on category if project.imageUrl is missing
  const heroImage =
    project.imageUrl ||
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop";

  // Category badge styling adhering to website theme
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Full-Stack":
        return "bg-primary text-primary-foreground";
      case "Shopify":
        return "bg-emerald-600 text-white";
      case "SaaS":
        return "bg-teal-600 text-white";
      case "CMS":
        return "bg-sky-600 text-white";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  // Compile key architecture & feature points
  const featurePoints = [
    project.challenge ? `Challenge: ${project.challenge}` : null,
    project.solution ? `Architecture Solution: ${project.solution}` : null,
    ...(project.metrics || []).map((m) => `Benchmark: ${m}`),
  ].filter(Boolean) as string[];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 dark:bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 my-auto w-full max-w-xl sm:max-w-2xl overflow-hidden rounded-3xl border border-border/90 bg-card text-card-foreground shadow-2xl transition-all"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Hero Image Banner */}
            <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-muted/40">
              <img
                src={heroImage}
                alt={project.title}
                className="h-full w-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay seamlessly blending with card background */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

              {/* Circular Close Button (top-right) */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 text-foreground/80 backdrop-blur-md transition-all hover:bg-background hover:text-foreground border border-border shadow-lg"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Category Badge Pill (bottom-left) */}
              <div className="absolute bottom-4 left-6 z-10">
                <span
                  className={`inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-sora font-extrabold uppercase tracking-widest shadow-md ${getCategoryBadgeClass(
                    project.category,
                  )}`}
                >
                  {project.category.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5">
              {/* Title & Narrative */}
              <div>
                <h3 className="font-sora text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* Impact / Business Value Highlight Box */}
              {project.impact && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                    {project.impact}
                  </p>
                </div>
              )}

              {/* Key Features & Architecture */}
              {featurePoints.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Key Features & Architecture</span>
                  </div>
                  <ul className="space-y-2 pl-0.5">
                    {featurePoints.map((point, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies & Stack */}
              {project.tech && project.tech.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-foreground">
                    <Tag className="h-3.5 w-3.5 text-accent" />
                    <span>Technologies & Stack</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {project.tech.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        <TechLogo name={t} className="h-3.5 w-3.5 shrink-0" size={14} />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-sora text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Live Preview</span>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-4 py-2.5 font-sora text-xs sm:text-sm font-bold text-foreground transition-all duration-200 hover:bg-muted"
                    >
                      <Github className="h-4 w-4" />
                      <span>View Source Code</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="font-sora text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
