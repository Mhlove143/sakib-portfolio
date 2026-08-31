import { useState, useEffect, useMemo } from "react";
import {
  X,
  Download,
  Share2,
  Check,
  Printer,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Sparkles,
  FileCheck,
  FileText,
  Eye,
  Languages,
  Code2,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Convert base64 data URI to standard Blob
function base64ToBlob(base64Data: string, fallbackContentType = "application/pdf"): Blob {
  try {
    const parts = base64Data.split(",");
    const base64 = parts.length > 1 ? parts[1] : parts[0];
    const mimeMatch = parts.length > 1 ? parts[0].match(/:(.*?);/) : null;
    const mime = mimeMatch ? mimeMatch[1] : fallbackContentType;

    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];
    const sliceSize = 512;

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  } catch (err) {
    console.error("Failed to parse base64 blob:", err);
    return new Blob([base64Data], { type: fallbackContentType });
  }
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"formatted" | "pdf">("formatted");
  const [isDownloading, setIsDownloading] = useState(false);
  const { personalInfo, experiences, educationList, languages } = usePortfolio();

  // Create memoized Blob URL for preview and download
  const pdfBlobUrl = useMemo(() => {
    if (!personalInfo.customCvDataUri) return null;
    try {
      if (personalInfo.customCvDataUri.startsWith("data:")) {
        const blob = base64ToBlob(personalInfo.customCvDataUri);
        return URL.createObjectURL(blob);
      }
      return personalInfo.customCvDataUri;
    } catch {
      return null;
    }
  }, [personalInfo.customCvDataUri]);

  // Clean up object URL when component unmounts or blob changes
  useEffect(() => {
    return () => {
      if (pdfBlobUrl && pdfBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  // Switch to PDF tab automatically if a custom file is uploaded and available
  useEffect(() => {
    if (isOpen && personalInfo.customCvDataUri) {
      // Default to formatted interactive view or pdf depending on availability
      setViewMode("formatted");
    }
  }, [isOpen, personalInfo.customCvDataUri]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  // Robust download handler
  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      const fileName =
        personalInfo.customCvFileName ||
        `${personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`;

      // 1. If custom uploaded CV data exists
      if (personalInfo.customCvDataUri) {
        if (personalInfo.customCvDataUri.startsWith("data:")) {
          const blob = base64ToBlob(personalInfo.customCvDataUri);
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 300);
        } else {
          const link = document.createElement("a");
          link.href = personalInfo.customCvDataUri;
          link.download = fileName;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          setTimeout(() => document.body.removeChild(link), 300);
        }
        setIsDownloading(false);
        return;
      }

      // 2. If external cloud CV URL exists
      if (personalInfo.cvUrl && personalInfo.cvUrl.startsWith("http")) {
        window.open(personalInfo.cvUrl, "_blank");
        setIsDownloading(false);
        return;
      }

      // 3. Otherwise trigger clean print-to-PDF
      handlePrint();
    } catch (err) {
      console.error("PDF Download error:", err);
      handlePrint();
    } finally {
      setIsDownloading(false);
    }
  };

  // Printable isolated window handler
  const handlePrint = () => {
    const printableElement = document.getElementById("printable-resume-sheet");
    if (!printableElement) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      window.print();
      return;
    }

    const printHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${personalInfo.name} — Curriculum Vitae</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            background: #ffffff;
            line-height: 1.5;
            padding: 32px 40px;
            font-size: 12.5px;
          }
          h1, h2, h3, h4, .heading { font-family: 'Sora', sans-serif; }
          h1 {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.3px;
            text-transform: uppercase;
            color: #0f172a;
            margin-bottom: 2px;
          }
          .role-title {
            font-size: 13.5px;
            font-weight: 700;
            color: #0284c7;
            margin-bottom: 6px;
          }
          .contact-bar {
            font-size: 11px;
            color: #475569;
            font-weight: 500;
            margin-bottom: 4px;
          }
          .links-bar {
            font-size: 11px;
            color: #0284c7;
            font-weight: 600;
          }
          .links-bar a {
            color: #0284c7;
            text-decoration: none;
            margin: 0 4px;
          }
          .section {
            margin-top: 16px;
          }
          .section-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #0f172a;
            border-bottom: 1.5px solid #cbd5e1;
            padding-bottom: 3px;
            margin-bottom: 8px;
          }
          .summary-text {
            font-size: 11.5px;
            line-height: 1.55;
            color: #334155;
            text-align: justify;
          }
          .skills-text {
            font-size: 11.5px;
            line-height: 1.55;
            color: #334155;
          }
          .exp-item {
            margin-bottom: 12px;
          }
          .exp-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          .exp-role {
            font-size: 12.5px;
            font-weight: 700;
            color: #0f172a;
          }
          .exp-company {
            font-size: 11.5px;
            font-weight: 600;
            color: #0284c7;
          }
          .exp-date {
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
          }
          ul.highlights {
            margin-left: 16px;
            margin-top: 4px;
          }
          ul.highlights li {
            margin-bottom: 2.5px;
            font-size: 11.5px;
            color: #334155;
            line-height: 1.45;
          }
          .edu-item {
            margin-bottom: 8px;
          }
          .edu-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          }
          .edu-degree {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
          }
          .edu-school {
            font-size: 11px;
            font-weight: 600;
            color: #475569;
          }
          .edu-meta {
            font-size: 11px;
            font-weight: 600;
            color: #0284c7;
          }
          @media print {
            body { padding: 10mm 12mm; }
            @page { margin: 0; size: A4 portrait; }
          }
        </style>
      </head>
      <body>
        <div id="print-content">
          ${printableElement.innerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  return (
    <div
      id="resume-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 backdrop-blur-md sm:p-4 md:p-6"
    >
      <div
        id="resume-modal-container"
        className="relative flex max-h-[94vh] w-full max-w-4xl flex-col rounded-3xl border border-border/90 bg-card text-card-foreground shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
      >
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="resume-modal-title" className="font-sora text-base font-bold text-foreground sm:text-lg">
                  {personalInfo.name} — Curriculum Vitae
                </h2>
                {personalInfo.customCvFileName && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                    <FileCheck className="h-3 w-3" />
                    Verified PDF
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {personalInfo.title}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle (Interactive Sheet vs Uploaded PDF Viewer) */}
            {personalInfo.customCvDataUri && (
              <div className="flex items-center rounded-full border border-border/80 bg-muted/40 p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setViewMode("formatted")}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition-all ${
                    viewMode === "formatted"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="h-3 w-3" />
                  <span className="hidden sm:inline">Clean Resume</span>
                </button>
                <button
                  onClick={() => setViewMode("pdf")}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition-all ${
                    viewMode === "pdf"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span className="hidden sm:inline">PDF Document</span>
                </button>
              </div>
            )}

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="btn-shine inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
              title="Download Resume PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Print / Save */}
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
              title="Print or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Print / Save</span>
            </button>

            {/* Share link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-2 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
              title="Share portfolio link"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative flex-1 overflow-y-auto bg-muted/10 p-3 sm:p-6 md:p-8">
          {/* TAB 1: UPLOADED PDF VIEWER */}
          {viewMode === "pdf" && pdfBlobUrl && (
            <div className="flex h-full min-h-[580px] w-full flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-2 shadow-inner">
              <div className="mb-3 flex w-full items-center justify-between border-b border-border/60 px-3 pb-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {personalInfo.customCvFileName || "Sakib_Sardar_Resume.pdf"}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={pdfBlobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open in Fullscreen
                  </a>
                </div>
              </div>
              <iframe
                src={pdfBlobUrl}
                title="Sakib Sardar CV PDF Document"
                className="h-[650px] w-full rounded-xl border border-border/60 bg-white"
              />
            </div>
          )}

          {/* TAB 2: CLEAN INTERACTIVE RESUME SHEET (MATCHING SAKIB SARDAR'S EXACT PDF DESIGN) */}
          {viewMode === "formatted" && (
            <div className="mx-auto max-w-3xl rounded-2xl border border-border/80 bg-card p-6 shadow-xl sm:p-10 text-foreground">
              <div id="printable-resume-sheet" className="space-y-6">
                {/* Header Profile Info */}
                <div className="border-b border-border/80 pb-5 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                    <div>
                      <h1 className="font-sora text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
                        {personalInfo.name}
                      </h1>
                      <p className="mt-1 font-sora text-sm font-bold text-accent">
                        {personalInfo.title}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info Line */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-y-1 gap-x-3 text-xs text-muted-foreground sm:justify-start font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {personalInfo.location}
                    </span>
                    <span className="text-border font-bold">|</span>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="flex items-center gap-1 text-foreground hover:text-accent font-semibold"
                    >
                      <Phone className="h-3.5 w-3.5 text-accent" />
                      {personalInfo.phoneDisplay}
                    </a>
                    <span className="text-border font-bold">|</span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="flex items-center gap-1 text-foreground hover:text-accent font-semibold"
                    >
                      <Mail className="h-3.5 w-3.5 text-accent" />
                      {personalInfo.email}
                    </a>
                  </div>

                  {/* Links Bar */}
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold sm:justify-start">
                    <a
                      href={personalInfo.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      GitHub ({personalInfo.github.replace("https://", "")})
                    </a>
                    <span className="text-muted-foreground">·</span>
                    <a
                      href={personalInfo.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      LinkedIn ({personalInfo.linkedin.replace("https://", "")})
                    </a>
                    <span className="text-muted-foreground">·</span>
                    <a
                      href={window.location.origin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      Portfolio Website
                    </a>
                  </div>
                </div>

                {/* 1. PROFESSIONAL SUMMARY */}
                <div>
                  <h3 className="border-b border-border/80 pb-1 font-sora text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Professional Summary
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {personalInfo.bio}
                  </p>
                </div>

                {/* 2. CORE SKILLS */}
                <div>
                  <h3 className="border-b border-border/80 pb-1 font-sora text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-accent" />
                    Core Skills
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    <strong className="text-foreground">Full-Stack & Technologies: </strong>
                    Django, Python, React.js, JavaScript, HTML, CSS, Shopify, Shopify App Development, Shopify Theme Development & Troubleshooting, WordPress, Wix, CMS Development, Full-Stack Development, REST API, API Integration, Liquid, Responsive Web Design, Web Development, Problem Solving & Decision Making.
                  </p>
                </div>

                {/* 3. PROFESSIONAL EXPERIENCE */}
                <div>
                  <h3 className="border-b border-border/80 pb-1 font-sora text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-accent" />
                    Professional Experience
                  </h3>
                  <div className="mt-4 space-y-5">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="group rounded-xl border border-border/60 bg-muted/15 p-4 sm:p-5">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                          <div>
                            <h4 className="font-sora text-sm font-bold text-foreground">
                              {exp.title}
                            </h4>
                            <p className="text-xs font-semibold text-accent">
                              {exp.company}
                            </p>
                          </div>
                          <span className="font-sora text-xs font-bold text-muted-foreground">
                            {exp.period}
                          </span>
                        </div>

                        <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. EDUCATION & ACADEMIC CREDENTIALS */}
                <div>
                  <h3 className="border-b border-border/80 pb-1 font-sora text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-accent" />
                    Education
                  </h3>
                  <div className="mt-3 space-y-3">
                    {educationList.map((edu, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col justify-between gap-1 rounded-xl border border-border/60 bg-muted/15 p-3.5 sm:flex-row sm:items-center"
                      >
                        <div>
                          <h4 className="font-sora text-xs font-bold text-foreground sm:text-sm">
                            {edu.degree}
                          </h4>
                          <p className="text-xs font-medium text-muted-foreground">
                            {edu.institution} {edu.location ? `· ${edu.location}` : ""}
                          </p>
                        </div>
                        <span className="font-sora text-xs font-semibold text-accent">
                          {edu.detail || edu.period}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. LANGUAGES */}
                <div>
                  <h3 className="border-b border-border/80 pb-1 font-sora text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Languages className="h-3.5 w-3.5 text-accent" />
                    Languages
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {languages.map((lang, i) => (
                      <div key={i} className="rounded-lg border border-border/60 bg-muted/20 px-3 py-1.5">
                        <strong className="text-foreground">{lang.name}: </strong>
                        <span>
                          Reading: {lang.reading || "High"}, Writing: {lang.writing || "Medium"}, Speaking: {lang.speaking || "Medium"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-card px-4 py-3 sm:px-6 rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {personalInfo.customCvFileName
                ? `Custom CV Active: ${personalInfo.customCvFileName}`
                : "Standard Full-Stack Resume Format"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="btn-shine inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF File</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full border border-border/80 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
