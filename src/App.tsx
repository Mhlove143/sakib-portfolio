import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { PortfolioProvider, usePortfolio } from "@/context/PortfolioContext";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";

import { HomePage } from "@/routes/index";
import { AboutPage } from "@/routes/about";
import { ServicesPage } from "@/routes/services";
import { SkillsPage } from "@/routes/skills";
import { ProjectsPage } from "@/routes/projects";
import { ExperiencePage } from "@/routes/experience";
import { EducationPage } from "@/routes/education";
import { ContactPage } from "@/routes/contact";
import { AdminPage } from "@/routes/admin";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function DynamicBrandingHandler() {
  const { personalInfo } = usePortfolio();

  useEffect(() => {
    const faviconUrl =
      personalInfo.customFaviconDataUri || personalInfo.customFaviconUrl || "/favicon.svg";

    // Update or create favicon link tag
    let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      document.head.appendChild(iconLink);
    }
    iconLink.href = faviconUrl;

    let altIconLink = document.querySelector(
      "link[rel='alternate icon']",
    ) as HTMLLinkElement | null;
    if (altIconLink) {
      altIconLink.href = faviconUrl;
    }
  }, [personalInfo.customFaviconDataUri, personalInfo.customFaviconUrl]);

  return null;
}

export default function App() {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <ScrollToTop />
        <DynamicBrandingHandler />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <StickyWhatsApp />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </PortfolioProvider>
  );
}

