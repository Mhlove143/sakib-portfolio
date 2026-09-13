import { Link } from "react-router-dom";
import { useState, type ComponentType } from "react";
import {
  Layers,
  Check,
  ArrowRight,
  ArrowUpRight,
  Server,
  ShoppingBag,
  Globe,
  Zap,
  Star,
  Palette,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { usePortfolio } from "@/context/PortfolioContext";
import { Service } from "@/data/portfolio";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";
import { TechLogo } from "@/components/TechLogo";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  "full-stack": Server,
  shopify: ShoppingBag,
  "cms-headless": Globe,
  "api-automation": Zap,
  performance: Star,
  "ui-ux": Palette,
};

export function ServicesPage() {
  const { services } = usePortfolio();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <Navbar />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 text-primary-foreground sm:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-35">
          <div className="grid-lines absolute inset-0 opacity-55" />
          <div className="animate-float-soft absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
          <div className="animate-float-slow absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Layers className="h-4 w-4 text-accent" />
              What I Deliver
            </div>
            <h1 className="mt-4 font-sora text-4xl font-extrabold tracking-tight sm:text-6xl">
              Specialized <span className="text-accent">Services</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              From enterprise full-stack web platforms and bespoke Shopify Liquid ecosystems to Core
              Web Vitals performance tuning, every service is executed for tangible business impact.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services Grid */}
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14 py-14 sm:py-20 overflow-hidden">
        <div className="grid w-full min-w-0 max-w-full gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = iconMap[service.id] || Server;
            const cardGlowClass =
              service.color === "emerald"
                ? "card-glow-emerald"
                : service.color === "sky"
                  ? "card-glow-sky"
                  : service.color === "purple"
                    ? "card-glow-purple"
                    : "card-glow-amber";

            const displayImage =
              service.imageUrl ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop";

            return (
              <Reveal key={service.id} delay={i * 80}>
                <div
                  className={`group flex h-full w-full min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl ${cardGlowClass}`}
                >
                  {/* Service Image Banner with Floating Tagline Badge */}
                  <div
                    onClick={() => setSelectedService(service)}
                    className="relative h-52 w-full overflow-hidden bg-muted/40 cursor-pointer border-b border-border/70"
                  >
                    <img
                      src={displayImage}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {/* Floating Tagline Pill (Top-Left) */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="inline-flex items-center rounded-lg bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1 font-sora text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                        {service.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 flex flex-1 flex-col justify-between">
                    <div>
                      <h2
                        onClick={() => setSelectedService(service)}
                        className="font-sora text-lg sm:text-xl font-bold tracking-tight text-foreground hover:text-accent cursor-pointer transition-colors line-clamp-1"
                        title={service.title}
                      >
                        {service.title}
                      </h2>

                      <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
                        {service.description}
                      </p>

                      {/* Business Impact Box */}
                      {service.businessValue && (
                        <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span className="truncate">{service.businessValue}</span>
                        </div>
                      )}

                      {/* Deliverables */}
                      <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
                        <p className="font-sora text-[11px] font-bold uppercase tracking-wider text-foreground">
                          Included Deliverables:
                        </p>
                        <ul className="space-y-1.5">
                          {service.deliverables.slice(0, 3).map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs font-medium text-muted-foreground"
                            >
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div className="mt-4 border-t border-border/60 pt-3">
                        <div className="flex flex-wrap gap-1.5">
                          {service.technologies.slice(0, 4).map((t) => (
                            <div
                              key={t}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground"
                            >
                              <TechLogo name={t} className="h-3.5 w-3.5 shrink-0" size={14} />
                              <span>{t}</span>
                            </div>
                          ))}
                          {service.technologies.length > 4 && (
                            <span className="inline-flex items-center rounded-lg border border-border/70 bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                              +{service.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/60 pt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className="group/btn inline-flex items-center gap-1 font-sora text-xs sm:text-[13px] font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                      >
                        <span>Scope & Arch</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </button>

                      <Link
                        to="/contact"
                        className="group inline-flex items-center gap-1.5 font-sora text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
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
      </div>

      <Footer />
    </div>
  );
}
