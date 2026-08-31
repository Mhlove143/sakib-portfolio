import { useState } from "react";
import { MessageSquare, X, Send, CheckCircle2, Sparkles } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import portraitAsset from "@/assets/sakib-portrait.png.asset.json";

export function StickyWhatsApp() {
  const { personalInfo } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const activePhoto =
    personalInfo.customProfilePhotoDataUri || personalInfo.avatarUrl || portraitAsset.url;

  const quickPrompts = [
    "Hi Sakib, I have a Shopify e-commerce project to discuss!",
    "Hi Sakib, I need a Full-Stack (Django + React) web app developed.",
    "Hi Sakib, I want a speed & Core Web Vitals optimization audit.",
    "Hi Sakib, are you available for contract or full-time roles?",
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || customMsg || "Hi Sakib, I found your portfolio and would like to connect!";
    const encoded = encodeURIComponent(message);
    const cleanPhone = (personalInfo.phone || "+8801572710013").replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* WhatsApp Chat Popover Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[22rem] max-w-[22rem] overflow-hidden rounded-3xl border border-emerald-500/30 bg-card p-0 shadow-2xl backdrop-blur-2xl ring-1 ring-emerald-500/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Card Header (WhatsApp Green Gradient) */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white/80 bg-black/20 shadow-md">
                  <img
                    src={activePhoto}
                    alt={personalInfo.name}
                    className="h-full w-full object-cover object-top"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-emerald-800" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-sora text-sm font-bold leading-tight">
                      {personalInfo.name}
                    </h4>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-emerald-100/90 font-medium">
                    Online · Typically replies in minutes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-black/20 p-1.5 text-white/90 hover:bg-black/40 hover:text-white transition-colors"
                aria-label="Close WhatsApp chat popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card Body: Intro message & Quick buttons */}
          <div className="p-4 space-y-3 bg-card">
            <div className="rounded-2xl border border-border/80 bg-muted/30 p-3 text-xs leading-relaxed text-foreground">
              <p className="font-medium">
                👋 <strong>Need a project built or want to discuss an idea?</strong> Select a topic below or send a custom WhatsApp message!
              </p>
            </div>

            {/* Quick Starters */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Quick Starters:
              </p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left text-xs font-medium rounded-xl border border-border/70 bg-muted/20 px-3 py-2 text-foreground hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <Send className="h-3 w-3 shrink-0 text-muted-foreground group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  className="w-full rounded-full border border-border bg-muted/40 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  className="btn-shine flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-500 transition-colors"
                  title="Send via WhatsApp"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating WhatsApp Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-2xl shadow-emerald-600/40 ring-4 ring-emerald-500/20 transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/60 active:scale-95"
        aria-label="Open WhatsApp live chat"
        title="Chat with Sakib Sardar on WhatsApp"
      >
        {/* Pulsing Beacon Ring */}
        <span className="absolute -inset-1 -z-10 rounded-full bg-emerald-400/40 opacity-75 blur-sm animate-ping" />

        {/* WhatsApp Icon or Close Icon */}
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <div className="relative flex items-center justify-center">
            {/* SVG WhatsApp glyph */}
            <svg
              className="h-7 w-7 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-sm ring-1 ring-white">
              1
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
