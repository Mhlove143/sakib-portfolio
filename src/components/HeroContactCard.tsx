import { useState } from "react";
import { MapPin, Phone, Mail, Check, Copy, MessageSquare, ExternalLink } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export function HeroContactCard() {
  const { personalInfo } = usePortfolio();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopy = async (text: string, type: "email" | "phone") => {
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
    <div className="group relative w-full max-w-2xl">
      {/* Animated subtle ambient glow behind card */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent/40 via-teal-400/30 to-primary/40 opacity-70 blur-lg transition-all duration-700 group-hover:opacity-100 group-hover:blur-xl" />

      <div className="relative overflow-hidden rounded-2xl border border-primary-foreground/25 bg-black/25 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-accent/60 sm:p-5">
        <div className="mb-3 flex items-center justify-between border-b border-primary-foreground/15 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-sora text-[11px] font-bold uppercase tracking-widest text-primary-foreground/90">
              Direct Contact & Base
            </span>
          </div>
          <span className="rounded-full bg-primary-foreground/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">
            Dhaka Standard Time (GMT+6)
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {/* Location Item */}
          <div className="flex items-start gap-2.5 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-3 transition-colors hover:bg-primary-foreground/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60">
                Location
              </span>
              <p className="truncate font-sora text-xs font-bold text-primary-foreground">
                {personalInfo.location}
              </p>
              <span className="text-[10px] text-emerald-400">Remote / On-Site</span>
            </div>
          </div>

          {/* Phone / WhatsApp Item */}
          <div className="flex items-start justify-between gap-2 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-3 transition-colors hover:bg-primary-foreground/10">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-400/20 text-sky-300">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60">
                  Call & WhatsApp
                </span>
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="truncate font-sora text-xs font-bold text-primary-foreground transition-colors hover:text-accent"
                >
                  {personalInfo.phoneDisplay}
                </a>
                <div className="flex items-center gap-1 mt-0.5">
                  <a
                    href={personalInfo.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-accent hover:underline"
                  >
                    <MessageSquare className="h-2.5 w-2.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleCopy(personalInfo.phone, "phone")}
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-accent"
              title="Copy phone number"
            >
              {copiedPhone ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>

          {/* Official Email Item */}
          <div className="flex items-start justify-between gap-2 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-3 transition-colors hover:bg-primary-foreground/10">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-400/20 text-teal-300">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60">
                  Official Email
                </span>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="block truncate font-sora text-xs font-bold text-primary-foreground transition-colors hover:text-accent"
                  title={personalInfo.email}
                >
                  {personalInfo.email}
                </a>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-1 text-[10px] text-teal-300 hover:underline"
                >
                  <span>Compose</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
            <button
              onClick={() => handleCopy(personalInfo.email, "email")}
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-accent"
              title="Copy email address"
            >
              {copiedEmail ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
