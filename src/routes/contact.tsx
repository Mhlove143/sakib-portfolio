import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Sparkles,
  Download,
  Copy,
  Check,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { ResumeModal } from "@/components/ResumeModal";
import { usePortfolio } from "@/context/PortfolioContext";

export function ContactPage() {
  const { personalInfo } = usePortfolio();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = async (text: string, type: "email" | "phone") => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        if (type === "email") {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2200);
        } else {
          setCopiedPhone(true);
          setTimeout(() => setCopiedPhone(false), 2200);
        }
      }
    } catch {
      // Fallback
    }
  };

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
              <Sparkles className="h-4 w-4 text-accent" />
              Available for Q3 / Q4 Opportunities
            </div>
            <h1 className="mt-4 font-sora text-4xl font-extrabold tracking-tight sm:text-6xl">
              Let's Build Something <span className="text-accent">Exceptional</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Whether you need a high-scale Django/React web application, a bespoke high-converting
              Shopify storefront, or a dedicated technical team leader — I'm ready to collaborate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Content */}
      <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Direct Info Cards */}
          <div className="space-y-6 lg:col-span-5">
            <Reveal>
              <h2 className="font-sora text-2xl font-bold tracking-tight text-foreground">
                Direct Channels & Coordinates
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Reach out directly via email, phone, or instant WhatsApp messaging. I typically
                respond within 2 to 4 hours.
              </p>
            </Reveal>

            {/* Email Card */}
            <Reveal delay={60}>
              <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/80 bg-card p-5 shadow-sm card-glow-emerald">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-sora text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="mt-1 block font-sora text-sm font-bold text-foreground hover:text-accent"
                    >
                      {personalInfo.email}
                    </a>
                    <span className="text-xs text-emerald-500">Fastest Response</span>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(personalInfo.email, "email")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-accent hover:text-accent"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Reveal>

            {/* Phone Card */}
            <Reveal delay={120}>
              <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/80 bg-card p-5 shadow-sm card-glow-sky">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-sora text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Direct Phone & Mobile
                    </span>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="mt-1 block font-sora text-sm font-bold text-foreground hover:text-accent"
                    >
                      {personalInfo.phoneDisplay}
                    </a>
                    <a
                      href={personalInfo.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline mt-0.5"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(personalInfo.phone, "phone")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-accent hover:text-accent"
                  title="Copy phone"
                >
                  {copiedPhone ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Reveal>

            {/* Location & Timezone */}
            <Reveal delay={180}>
              <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-sora text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Base Location
                  </span>
                  <p className="mt-1 font-sora text-sm font-bold text-foreground">
                    {personalInfo.location}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-accent" />
                    <span>{personalInfo.timezone}</span>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Resume Trigger */}
            <Reveal delay={240}>
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-5">
                <h4 className="font-sora text-sm font-bold text-foreground">
                  Need a copy of my credentials?
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review my complete work history, academic qualifications, and technical toolsets.
                </p>
                <button
                  onClick={() => setResumeOpen(true)}
                  className="btn-shine mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 font-sora text-xs font-bold uppercase tracking-wider text-foreground hover:border-accent hover:text-accent"
                >
                  <Download className="h-3.5 w-3.5 text-accent" />
                  <span>Download Curriculum Vitae (PDF)</span>
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <Reveal delay={100}>
              <div className="overflow-hidden rounded-3xl bg-hero-gradient p-1">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Footer />
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
