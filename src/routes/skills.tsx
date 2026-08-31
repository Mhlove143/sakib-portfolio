import { Link } from "react-router-dom";
import { type ComponentType } from "react";
import { Code2, ArrowRight, CheckCircle2, Cpu, Database, ShoppingBag, Wrench } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { usePortfolio } from "@/context/PortfolioContext";

const categoryIcons: Record<string, ComponentType<{ className?: string }>> = {
  frontend: Cpu,
  backend: Database,
  "shopify-cms": ShoppingBag,
  tools: Wrench,
};

export function SkillsPage() {
  const { skillCategories } = usePortfolio();
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
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Code2 className="h-4 w-4 text-accent" />
              Technical Stack & Competencies
            </div>
            <h1 className="mt-4 font-sora text-4xl font-extrabold tracking-tight sm:text-6xl">
              Engineered for <span className="text-accent">Scale & Speed</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              A comprehensive directory of technologies, frameworks, and architecture patterns honed
              through 2+ years of production software development and agency leadership.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Skills Categories */}
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-14 py-14 sm:py-20 overflow-hidden">
        <div className="space-y-12 sm:space-y-16 w-full min-w-0 max-w-full">
          {skillCategories.map((cat, idx) => {
            const Icon = categoryIcons[cat.id] || Code2;

            return (
              <section key={cat.id} className="w-full min-w-0 max-w-full overflow-hidden">
                <Reveal delay={idx * 60}>
                  <div className="flex flex-col justify-between gap-2 border-b border-border/80 pb-4 sm:flex-row sm:items-end">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-sora text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                          {cat.name}
                        </h2>
                        <p className="text-xs text-muted-foreground truncate">{cat.highlight}</p>
                      </div>
                    </div>
                    <span className="font-sora text-xs font-bold uppercase tracking-wider text-accent shrink-0">
                      {cat.skills.length} Core Technologies
                    </span>
                  </div>
                </Reveal>

                <div className="mt-6 sm:mt-8 grid w-full min-w-0 max-w-full gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.skills.map((skill, sIdx) => (
                    <Reveal key={skill.name} delay={sIdx * 40}>
                      <div className="flex h-full w-full min-w-0 max-w-full flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md card-glow-emerald">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-sora text-base font-bold text-foreground">
                              {skill.name}
                            </h3>
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-sora text-[10px] font-bold uppercase tracking-wider ${
                                skill.level === "Expert"
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                              }`}
                            >
                              {skill.level}
                            </span>
                          </div>

                          <span className="mt-1 block text-xs font-semibold text-accent">
                            {skill.experience} Experience
                          </span>

                          {skill.description && (
                            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                              {skill.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-1.5 border-t border-border/50 pt-3 text-[11px] font-semibold text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                          <span>Production Tested</span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <section className="mt-24">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-border/80 bg-section-alt p-8 sm:p-12 lg:flex-row">
              <div>
                <h3 className="font-sora text-2xl font-black text-foreground">
                  Need a custom tech stack integration?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  I adapt quickly to modern frameworks, headless APIs, and bespoke architectures.
                </p>
              </div>
              <Link
                to="/contact"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
              >
                <span>Discuss Requirements</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </section>
      </div>

      <Footer />
    </div>
  );
}
