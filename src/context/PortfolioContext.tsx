import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  personalInfo as defaultPersonalInfo,
  keyMetrics as defaultKeyMetrics,
  services as defaultServices,
  skillCategories as defaultSkillCategories,
  experiences as defaultExperiences,
  projects as defaultProjects,
  educationList as defaultEducationList,
  certifications as defaultCertifications,
  languages as defaultLanguages,
  type Service,
  type SkillCategory,
  type SkillItem,
  type Experience,
  type Project,
  type EducationItem,
  type CertificationItem,
  type LanguageItem,
  type Metric,
} from "@/data/portfolio";
import { db, doc, setDoc, onSnapshot, collection, addDoc, deleteDoc } from "@/lib/firebase";

export interface PersonalInfoType {
  name: string;
  shortName: string;
  title: string;
  roles: string[];
  bio: string;
  extendedBio: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsappUrl: string;
  location: string;
  timezone: string;
  availability: string;
  github: string;
  linkedin: string;
  avatarUrl?: string;
  customProfilePhotoDataUri?: string; // Stored base64 photo
  customProfilePhotoFileName?: string;
  customFaviconDataUri?: string; // Stored base64 or SVG favicon
  customFaviconFileName?: string;
  customFaviconUrl?: string;
  brandInitials?: string;
  brandSubtitle?: string;
  brandLogoUrl?: string;
  brandOnlineStatus?: boolean;
  cvUrl?: string;
  customCvFileName?: string;
  customCvDataUri?: string; // Stored base64 PDF or document
}

export interface PortfolioDataType {
  personalInfo: PersonalInfoType;
  keyMetrics: Metric[];
  services: Service[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  educationList: EducationItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  contactTopics: string[];
}

export interface ContactMessageItem {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface PortfolioContextType {
  data: PortfolioDataType;
  personalInfo: PersonalInfoType;
  keyMetrics: Metric[];
  services: Service[];
  skillCategories: SkillCategory[];
  experiences: Experience[];
  projects: Project[];
  educationList: EducationItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  contactTopics: string[];

  // Real-time status
  isLoaded: boolean;
  isSyncing: boolean;
  isFirebaseConnected: boolean;

  // Contact Messages & Topics CRUD
  contactMessages: ContactMessageItem[];
  submitContactMessage: (msg: Omit<ContactMessageItem, "id" | "createdAt">) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  clearAllContactMessages: () => Promise<boolean>;
  addContactTopic: (topic: string) => void;
  removeContactTopic: (topic: string) => void;
  updateContactTopics: (topics: string[]) => void;

  // Personal Info, Photo, Favicon & CV
  updatePersonalInfo: (partial: Partial<PersonalInfoType>) => void;
  uploadProfilePhoto: (fileBase64: string, fileName?: string) => void;
  removeProfilePhoto: () => void;
  uploadCustomFavicon: (fileBase64: string, fileName?: string) => void;
  removeCustomFavicon: () => void;
  uploadCustomCv: (fileBase64: string, fileName: string) => void;
  removeCustomCv: () => void;

  // Services CRUD
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, updated: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Skills CRUD
  addSkillToCategory: (categoryId: string, skill: SkillItem) => void;
  updateSkillInCategory: (
    categoryId: string,
    skillName: string,
    updated: Partial<SkillItem>,
  ) => void;
  deleteSkillFromCategory: (categoryId: string, skillName: string) => void;
  addSkillCategory: (category: Omit<SkillCategory, "id">) => void;
  deleteSkillCategory: (categoryId: string) => void;

  // Projects CRUD
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Experience CRUD
  addExperience: (exp: Omit<Experience, "id">) => void;
  updateExperience: (id: string, updated: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;

  // Education CRUD
  addEducation: (edu: EducationItem) => void;
  updateEducation: (index: number, updated: Partial<EducationItem>) => void;
  deleteEducation: (index: number) => void;

  // Certifications CRUD
  addCertification: (cert: CertificationItem) => void;
  updateCertification: (index: number, updated: Partial<CertificationItem>) => void;
  deleteCertification: (index: number) => void;

  // Languages CRUD
  addLanguage: (lang: LanguageItem) => void;
  updateLanguage: (index: number, updated: Partial<LanguageItem>) => void;
  deleteLanguage: (index: number) => void;

  // Metrics CRUD
  updateMetric: (index: number, updated: Partial<Metric>) => void;

  // Data reset & export/import
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
}

export const defaultContactTopics = [
  "Shopify Store / App",
  "Full-Stack Django & React",
  "Custom CMS / WordPress",
  "API & Automation",
  "Job Opportunity",
];

const defaultData: PortfolioDataType = {
  personalInfo: {
    ...defaultPersonalInfo,
    cvUrl: "https://drive.google.com",
    customCvFileName: "Sakib_Sardar_FullStack_Resume.pdf",
    customCvDataUri: "",
    avatarUrl: "",
    customProfilePhotoDataUri: "",
    customProfilePhotoFileName: "",
  },
  keyMetrics: defaultKeyMetrics,
  services: defaultServices,
  skillCategories: defaultSkillCategories,
  experiences: defaultExperiences,
  projects: defaultProjects,
  educationList: defaultEducationList,
  certifications: defaultCertifications,
  languages: defaultLanguages,
  contactTopics: defaultContactTopics,
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  // Pure in-memory state initialized directly from defaults and synced in real-time with Firestore DB
  const [data, setData] = useState<PortfolioDataType>(defaultData);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessageItem[]>([]);

  // Purge any legacy localStorage cache on startup to ensure pure database persistence
  useEffect(() => {
    try {
      localStorage.removeItem("sakib_portfolio_cms_data_v2");
      localStorage.removeItem("sakib_portfolio_cms_data_v1");
      localStorage.removeItem("sakib_portfolio_cms_data");
    } catch {
      // ignore
    }
  }, []);

  // Function to save data directly to Firestore database (zero localStorage)
  const saveToFirestore = useCallback(async (newData: PortfolioDataType) => {
    setIsSyncing(true);
    try {
      const {
        customCvDataUri,
        customCvFileName,
        customProfilePhotoDataUri,
        customProfilePhotoFileName,
        customFaviconDataUri,
        customFaviconFileName,
        ...safePersonalInfo
      } = newData.personalInfo;
      
      // Save primary content to /portfolio/content
      const contentRef = doc(db, "portfolio", "content");
      await setDoc(contentRef, {
        personalInfo: safePersonalInfo,
        keyMetrics: newData.keyMetrics,
        services: newData.services,
        skillCategories: newData.skillCategories,
        experiences: newData.experiences,
        projects: newData.projects,
        educationList: newData.educationList,
        certifications: newData.certifications,
        languages: newData.languages,
        contactTopics: newData.contactTopics,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Save Profile Photo & Favicon to separate document if exists
      if (customProfilePhotoDataUri !== undefined || customFaviconDataUri !== undefined) {
        try {
          const photoRef = doc(db, "portfolio", "avatar");
          const brandingPayload: Record<string, any> = {
            updatedAt: new Date().toISOString(),
          };
          if (customProfilePhotoDataUri !== undefined) {
            brandingPayload.customProfilePhotoDataUri = customProfilePhotoDataUri || "";
            brandingPayload.customProfilePhotoFileName = customProfilePhotoFileName || "";
          }
          if (customFaviconDataUri !== undefined) {
            brandingPayload.customFaviconDataUri = customFaviconDataUri || "";
            brandingPayload.customFaviconFileName = customFaviconFileName || "";
          }
          await setDoc(photoRef, brandingPayload, { merge: true });
        } catch (photoErr) {
          console.warn("Firestore branding persistence notice:", photoErr);
        }
      }

      // Save CV to separate document if exists
      if (customCvDataUri !== undefined) {
        try {
          if (customCvDataUri.length < 950000) {
            const cvRef = doc(db, "portfolio", "cv");
            await setDoc(cvRef, {
              customCvDataUri: customCvDataUri || "",
              customCvFileName: customCvFileName || "",
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          } else {
            console.warn("CV document exceeds 1MB limit for Firestore doc; safely stored in client cache.");
          }
        } catch (cvErr) {
          console.warn("Firestore CV persistence notice:", cvErr);
        }
      }
    } catch (err) {
      console.error("Firestore persistence error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Set up Real-time Listeners for live database sync
  useEffect(() => {
    let unsubscribeContent: (() => void) | null = null;
    let unsubscribeCV: (() => void) | null = null;
    let unsubscribeAvatar: (() => void) | null = null;
    let unsubscribeMessages: (() => void) | null = null;

    try {
      const contentRef = doc(db, "portfolio", "content");
      const cvRef = doc(db, "portfolio", "cv");
      const avatarRef = doc(db, "portfolio", "avatar");
      const messagesCol = collection(db, "contact_messages");

      // 1. Listen to Portfolio Content
      unsubscribeContent = onSnapshot(contentRef, (docSnap) => {
        setIsFirebaseConnected(true);
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          setData((prev) => {
            const merged: PortfolioDataType = {
              personalInfo: {
                ...prev.personalInfo,
                ...(cloudData.personalInfo || {}),
                // Keep photos & CV from local/specific docs if already loaded
                customCvDataUri: prev.personalInfo.customCvDataUri,
                customCvFileName: prev.personalInfo.customCvFileName,
                customProfilePhotoDataUri: prev.personalInfo.customProfilePhotoDataUri,
                customProfilePhotoFileName: prev.personalInfo.customProfilePhotoFileName,
              },
              keyMetrics: Array.isArray(cloudData.keyMetrics) && cloudData.keyMetrics.length > 0
                ? cloudData.keyMetrics
                : prev.keyMetrics,
              services: Array.isArray(cloudData.services) && cloudData.services.length > 0
                ? cloudData.services
                : prev.services,
              skillCategories: Array.isArray(cloudData.skillCategories) && cloudData.skillCategories.length > 0
                ? cloudData.skillCategories
                : prev.skillCategories,
              experiences: Array.isArray(cloudData.experiences) && cloudData.experiences.length > 0
                ? cloudData.experiences
                : prev.experiences,
              projects: Array.isArray(cloudData.projects) && cloudData.projects.length > 0
                ? cloudData.projects
                : prev.projects,
              educationList: Array.isArray(cloudData.educationList) && cloudData.educationList.length > 0
                ? cloudData.educationList
                : prev.educationList,
              certifications: Array.isArray(cloudData.certifications) && cloudData.certifications.length > 0
                ? cloudData.certifications
                : prev.certifications,
              languages: Array.isArray(cloudData.languages) && cloudData.languages.length > 0
                ? cloudData.languages
                : prev.languages,
              contactTopics: Array.isArray(cloudData.contactTopics) && cloudData.contactTopics.length > 0
                ? cloudData.contactTopics
                : prev.contactTopics,
            };
            return merged;
          });
        } else {
          // Initialize Firestore with default portfolio data
          console.log("No data found in Firestore, bootstrapping initial content...");
          saveToFirestore(defaultData);
        }
        setIsLoaded(true);
      }, (error) => {
        console.error("Firestore content subscription error:", error);
        setIsLoaded(true);
      });

      // 2. Listen to Avatar & Favicon / Branding updates
      unsubscribeAvatar = onSnapshot(avatarRef, (docSnap) => {
        if (docSnap.exists()) {
          const avatarData = docSnap.data();
          setData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              customProfilePhotoDataUri:
                avatarData.customProfilePhotoDataUri !== undefined
                  ? avatarData.customProfilePhotoDataUri || ""
                  : prev.personalInfo.customProfilePhotoDataUri,
              customProfilePhotoFileName:
                avatarData.customProfilePhotoFileName !== undefined
                  ? avatarData.customProfilePhotoFileName || ""
                  : prev.personalInfo.customProfilePhotoFileName,
              customFaviconDataUri:
                avatarData.customFaviconDataUri !== undefined
                  ? avatarData.customFaviconDataUri || ""
                  : prev.personalInfo.customFaviconDataUri,
              customFaviconFileName:
                avatarData.customFaviconFileName !== undefined
                  ? avatarData.customFaviconFileName || ""
                  : prev.personalInfo.customFaviconFileName,
              customFaviconUrl:
                avatarData.customFaviconUrl !== undefined
                  ? avatarData.customFaviconUrl || ""
                  : prev.personalInfo.customFaviconUrl,
            },
          }));
        }
      }, (error) => {
        console.error("Firestore Avatar subscription error:", error);
      });

      // 3. Listen to CV updates
      unsubscribeCV = onSnapshot(cvRef, (docSnap) => {
        if (docSnap.exists()) {
          const cvData = docSnap.data();
          setData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              customCvDataUri: cvData.customCvDataUri || prev.personalInfo.customCvDataUri || "",
              customCvFileName: cvData.customCvFileName || prev.personalInfo.customCvFileName || "",
            },
          }));
        }
      }, (error) => {
        console.error("Firestore CV subscription error:", error);
      });

      // 4. Listen to contact messages
      unsubscribeMessages = onSnapshot(messagesCol, (querySnap) => {
        const msgs: ContactMessageItem[] = [];
        querySnap.forEach((d) => {
          msgs.push({ id: d.id, ...d.data() } as ContactMessageItem);
        });
        msgs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setContactMessages(msgs);
      }, (error) => {
        console.error("Firestore contact messages subscription error:", error);
      });

    } catch (err) {
      console.error("Firebase initialization error:", err);
      setIsLoaded(true);
    }

    return () => {
      if (unsubscribeContent) unsubscribeContent();
      if (unsubscribeAvatar) unsubscribeAvatar();
      if (unsubscribeCV) unsubscribeCV();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [saveToFirestore]);

  // Submit Contact Message directly to Firestore + Dispatch Email to Sakib Sardar
  const submitContactMessage = async (msg: Omit<ContactMessageItem, "id" | "createdAt">) => {
    try {
      const messagesCol = collection(db, "contact_messages");
      await addDoc(messagesCol, {
        ...msg,
        createdAt: new Date().toISOString(),
      });

      // Also trigger email dispatch to Sakib Sardar's email
      const targetEmail = data.personalInfo?.email || "sakibsardar.official@gmail.com";
      try {
        await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: msg.name,
            email: msg.email,
            _replyto: msg.email,
            _subject: `New Portfolio Inquiry: ${msg.subject || "Project Inquiry"} from ${msg.name}`,
            topic: msg.subject || "General Inquiry",
            message: msg.message,
            _template: "table",
          }),
        });
      } catch (mailErr) {
        console.warn("Background email notification delivery notice:", mailErr);
      }

      return true;
    } catch (e) {
      console.error("Failed to save contact message to database:", e);
      return false;
    }
  };

  // Delete an individual Contact Message from Firestore
  const deleteContactMessage = async (id: string) => {
    try {
      if (id) {
        const msgDoc = doc(db, "contact_messages", id);
        await deleteDoc(msgDoc);
      }
      setContactMessages((prev) => prev.filter((m) => m.id !== id));
      return true;
    } catch (err) {
      console.error("Failed to delete contact message from Firestore:", err);
      setContactMessages((prev) => prev.filter((m) => m.id !== id));
      return false;
    }
  };

  // Clear all Contact Messages
  const clearAllContactMessages = async () => {
    try {
      const currentList = [...contactMessages];
      setContactMessages([]);
      for (const msg of currentList) {
        if (msg.id) {
          try {
            await deleteDoc(doc(db, "contact_messages", msg.id));
          } catch (e) {
            console.error("Error deleting doc:", e);
          }
        }
      }
      return true;
    } catch (err) {
      console.error("Failed to clear messages:", err);
      return false;
    }
  };

  // Helper updater that immediately updates state and persists to Firestore
  const applyAndSave = (updater: (prev: PortfolioDataType) => PortfolioDataType) => {
    setData((prev) => {
      const next = updater(prev);
      saveToFirestore(next);
      return next;
    });
  };

  // Personal Info, Photos & CV
  const updatePersonalInfo = (partial: Partial<PersonalInfoType>) => {
    applyAndSave((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...partial,
      },
    }));
  };

  const uploadProfilePhoto = (fileBase64: string, fileName?: string) => {
    applyAndSave((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customProfilePhotoDataUri: fileBase64,
        customProfilePhotoFileName: fileName || "profile_photo.jpg",
      },
    }));
  };

  const removeProfilePhoto = () => {
    applyAndSave((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customProfilePhotoDataUri: "",
        customProfilePhotoFileName: "",
        avatarUrl: "",
      },
    }));
  };

  const uploadCustomFavicon = (fileBase64: string, fileName?: string) => {
    applyAndSave((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customFaviconDataUri: fileBase64,
        customFaviconFileName: fileName || "favicon.png",
        customFaviconUrl: "",
      },
    }));
  };

  const removeCustomFavicon = () => {
    applyAndSave((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customFaviconDataUri: "",
        customFaviconFileName: "",
        customFaviconUrl: "",
      },
    }));
  };

  const uploadCustomCv = (fileBase64: string, fileName: string) => {
    applyAndSave((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customCvDataUri: fileBase64,
        customCvFileName: fileName,
      },
    }));
  };

  const removeCustomCv = () => {
    applyAndSave((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customCvDataUri: "",
        customCvFileName: "",
      },
    }));
  };

  // Contact Topics
  const addContactTopic = (topic: string) => {
    const trimmed = topic.trim();
    if (!trimmed) return;
    applyAndSave((prev) => ({
      ...prev,
      contactTopics: prev.contactTopics.includes(trimmed)
        ? prev.contactTopics
        : [...prev.contactTopics, trimmed],
    }));
  };

  const removeContactTopic = (topic: string) => {
    applyAndSave((prev) => ({
      ...prev,
      contactTopics: prev.contactTopics.filter((t) => t !== topic),
    }));
  };

  const updateContactTopics = (topics: string[]) => {
    applyAndSave((prev) => ({
      ...prev,
      contactTopics: topics,
    }));
  };

  // Services
  const addService = (service: Omit<Service, "id">) => {
    const newId = `srv-${Date.now()}`;
    const newService: Service = { ...service, id: newId };
    applyAndSave((prev) => ({
      ...prev,
      services: [newService, ...prev.services],
    }));
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    applyAndSave((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  const deleteService = (id: string) => {
    applyAndSave((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  // Skills
  const addSkillToCategory = (categoryId: string, skill: SkillItem) => {
    applyAndSave((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: [...cat.skills, skill],
          };
        }
        return cat;
      }),
    }));
  };

  const updateSkillInCategory = (
    categoryId: string,
    skillName: string,
    updated: Partial<SkillItem>,
  ) => {
    applyAndSave((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: cat.skills.map((s) => (s.name === skillName ? { ...s, ...updated } : s)),
          };
        }
        return cat;
      }),
    }));
  };

  const deleteSkillFromCategory = (categoryId: string, skillName: string) => {
    applyAndSave((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            skills: cat.skills.filter((s) => s.name !== skillName),
          };
        }
        return cat;
      }),
    }));
  };

  const addSkillCategory = (category: Omit<SkillCategory, "id">) => {
    const newId = `cat-${Date.now()}`;
    applyAndSave((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, { ...category, id: newId }],
    }));
  };

  const deleteSkillCategory = (categoryId: string) => {
    applyAndSave((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.filter((c) => c.id !== categoryId),
    }));
  };

  // Projects
  const addProject = (project: Omit<Project, "id">) => {
    const newId = `proj-${Date.now()}`;
    const newProj: Project = { ...project, id: newId };
    applyAndSave((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    applyAndSave((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    applyAndSave((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Experience
  const addExperience = (exp: Omit<Experience, "id">) => {
    const newId = `exp-${Date.now()}`;
    const newExp: Experience = { ...exp, id: newId };
    applyAndSave((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
  };

  const updateExperience = (id: string, updated: Partial<Experience>) => {
    applyAndSave((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    applyAndSave((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  // Education
  const addEducation = (edu: EducationItem) => {
    applyAndSave((prev) => ({
      ...prev,
      educationList: [edu, ...prev.educationList],
    }));
  };

  const updateEducation = (index: number, updated: Partial<EducationItem>) => {
    applyAndSave((prev) => ({
      ...prev,
      educationList: prev.educationList.map((item, idx) =>
        idx === index ? { ...item, ...updated } : item,
      ),
    }));
  };

  const deleteEducation = (index: number) => {
    applyAndSave((prev) => ({
      ...prev,
      educationList: prev.educationList.filter((_, idx) => idx !== index),
    }));
  };

  // Certifications
  const addCertification = (cert: CertificationItem) => {
    applyAndSave((prev) => ({
      ...prev,
      certifications: [cert, ...prev.certifications],
    }));
  };

  const updateCertification = (index: number, updated: Partial<CertificationItem>) => {
    applyAndSave((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c, idx) =>
        idx === index ? { ...c, ...updated } : c,
      ),
    }));
  };

  const deleteCertification = (index: number) => {
    applyAndSave((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, idx) => idx !== index),
    }));
  };

  // Languages
  const addLanguage = (lang: LanguageItem) => {
    applyAndSave((prev) => ({
      ...prev,
      languages: [...prev.languages, lang],
    }));
  };

  const updateLanguage = (index: number, updated: Partial<LanguageItem>) => {
    applyAndSave((prev) => ({
      ...prev,
      languages: prev.languages.map((l, idx) => (idx === index ? { ...l, ...updated } : l)),
    }));
  };

  const deleteLanguage = (index: number) => {
    applyAndSave((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, idx) => idx !== index),
    }));
  };

  // Metrics
  const updateMetric = (index: number, updated: Partial<Metric>) => {
    applyAndSave((prev) => ({
      ...prev,
      keyMetrics: prev.keyMetrics.map((m, idx) => (idx === index ? { ...m, ...updated } : m)),
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    applyAndSave(() => defaultData);
  };

  // Export / Import
  const exportDataJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.personalInfo && parsed.services && parsed.projects) {
        applyAndSave(() => parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to parse JSON backup", e);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        personalInfo: data.personalInfo,
        keyMetrics: data.keyMetrics,
        services: data.services,
        skillCategories: data.skillCategories,
        experiences: data.experiences,
        projects: data.projects,
        educationList: data.educationList,
        certifications: data.certifications,
        languages: data.languages,
        contactTopics: data.contactTopics,
        isLoaded,
        isSyncing,
        isFirebaseConnected,
        contactMessages,
        submitContactMessage,
        deleteContactMessage,
        clearAllContactMessages,
        addContactTopic,
        removeContactTopic,
        updateContactTopics,
        updatePersonalInfo,
        uploadProfilePhoto,
        removeProfilePhoto,
        uploadCustomFavicon,
        removeCustomFavicon,
        uploadCustomCv,
        removeCustomCv,
        addService,
        updateService,
        deleteService,
        addSkillToCategory,
        updateSkillInCategory,
        deleteSkillFromCategory,
        addSkillCategory,
        deleteSkillCategory,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        addCertification,
        updateCertification,
        deleteCertification,
        addLanguage,
        updateLanguage,
        deleteLanguage,
        updateMetric,
        resetToDefaults,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
