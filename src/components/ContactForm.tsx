import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, Copy, Check, MessageSquare, Sparkles } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const TOPICS = [
  "Shopify Store / App",
  "Full-Stack Django & React",
  "Custom CMS / WordPress",
  "API & Automation",
  "Job Opportunity",
];

interface ContactFormProps {
  compact?: boolean;
  className?: string;
}

export function ContactForm({ compact = false, className = "" }: ContactFormProps) {
  const { personalInfo, contactTopics, submitContactMessage } = usePortfolio();
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const EMAIL = personalInfo.email || "mdsakibsardar222@gmail.com";
  const WHATSAPP_URL = personalInfo.whatsappUrl;
  const topicsList =
    Array.isArray(contactTopics) && contactTopics.length > 0 ? contactTopics : TOPICS;

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTopicClick(topic: string) {
    setForm((prev) => ({
      ...prev,
      subject: topic,
    }));
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    
    // Save to Firestore database in the cloud + triggers direct email delivery
    const success = await submitContactMessage({
      name: form.name,
      email: form.email,
      subject: form.subject || "General Enquiry",
      message: form.message,
    });

    setSent(true);
    setSubmitting(false);
    if (success) {
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 outline-none backdrop-blur-md transition-all duration-300 focus:border-accent focus:bg-primary-foreground/20 focus:ring-2 focus:ring-accent/40";

  return (
    <div
      className={`relative w-full rounded-3xl border border-primary-foreground/25 bg-black/25 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 sm:p-9 ${className}`}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-primary-foreground/20 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Quick Contact
          </span>
          <h3 className="font-sora text-xl font-bold tracking-tight text-primary-foreground sm:text-2xl">
            Start a Conversation
          </h3>
        </div>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="btn-shine inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          title="Copy email to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent group-hover:text-inherit" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy Email
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary-foreground/90">
            What are you interested in?
          </label>
          <div className="flex flex-wrap gap-2">
            {topicsList.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleTopicClick(topic)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  form.subject === topic
                    ? "bg-accent text-accent-foreground shadow-md shadow-accent/30 ring-2 ring-accent"
                    : "border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:border-accent hover:bg-primary-foreground/20"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary-foreground/90"
            >
              Your Name *
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Alex Morgan"
              className={fieldClass}
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary-foreground/90"
            >
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="alex@company.com"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary-foreground/90"
          >
            Subject / Project Type
          </label>
          <input
            id="subject"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="e.g. Shopify Store Redesign & Speed Optimization"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary-foreground/90"
          >
            Message / Project Details *
          </label>
          <textarea
            id="message"
            required
            rows={compact ? 3 : 5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell me about your requirements, timeline, budget, or ideas..."
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn-shine group flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-bold tracking-wide text-accent-foreground shadow-xl shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent/50 active:translate-y-0 active:scale-[0.98] disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                Sending Message...
              </>
            ) : sent ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-950" />
                Message Delivered to Sakib's Inbox!
              </>
            ) : (
              <>
                Send Message Directly
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-primary-foreground/70">
          <span>⚡ Typically responds within 2–4 hours</span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-accent underline-offset-4 hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Chat via WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
