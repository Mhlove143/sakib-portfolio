import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, CheckCircle2, Tag, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { type Service } from "@/data/portfolio";
import { TechLogo } from "@/components/TechLogo";

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
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

  if (!service) return null;

  const heroImage =
    service.imageUrl ||
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop";

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
                alt={service.title}
                className="h-full w-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Dark Gradient Overlay seamlessly blending with modal background */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

              {/* Circular Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/85 text-foreground/80 backdrop-blur-md transition-all hover:bg-background hover:text-foreground border border-border shadow-lg"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Category Badge Pill */}
              <div className="absolute bottom-4 left-6 z-10">
                <span className="inline-flex items-center rounded-lg bg-primary px-3 py-1 font-sora text-[11px] font-extrabold uppercase tracking-widest text-primary-foreground shadow-md">
                  {service.tagline.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5">
              {/* Title & Narrative */}
              <div>
                <h3 className="font-sora text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>

              {/* Business Value Highlight Box */}
              {service.businessValue && (
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                    {service.businessValue}
                  </p>
                </div>
              )}

              {/* Key Deliverables & Architecture */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span>Key Deliverables & Capabilities</span>
                  </div>
                  <ul className="space-y-2 pl-0.5">
                    {service.deliverables.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies & Stack */}
              {service.technologies && service.technologies.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 font-sora text-xs font-bold uppercase tracking-wider text-foreground">
                    <Tag className="h-3.5 w-3.5 text-accent" />
                    <span>Technologies & Tooling</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {service.technologies.map((t, idx) => (
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
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-sora text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Book / Inquire Service</span>
                  </Link>

                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-4 py-2.5 font-sora text-xs sm:text-sm font-bold text-foreground transition-all duration-200 hover:bg-muted"
                  >
                    <span>Request Custom Quote</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
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
