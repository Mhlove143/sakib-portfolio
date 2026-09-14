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

export type AdminRole = "superadmin" | "admin" | "editor";

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  passwordPlain?: string;
  createdAt: string;
  lastLogin?: string;
  avatarBg?: string;
}

export const defaultAdminUsers: AdminUser[] = [
  {
    id: "user_primary_sakib",
    username: "mhlove143",
    name: "Sakib Sardar",
    email: "sakibsardar.official@gmail.com",
    role: "superadmin",
    passwordPlain: "$@kib$@rdar",
    createdAt: "2024-01-01T00:00:00.000Z",
    avatarBg: "from-emerald-500 to-teal-700",
  },
];

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

  // Admin Users & Auth Management
  adminUsers: AdminUser[];
  currentUser: AdminUser | null;
  setCurrentUser: (user: AdminUser | null) => void;
  addAdminUser: (user: Omit<AdminUser, "id" | "createdAt">) => Promise<{ success: boolean; error?: string }>;
  updateAdminUser: (id: string, updated: Partial<AdminUser>) => Promise<{ success: boolean; error?: string }>;
  deleteAdminUser: (id: string) => Promise<{ success: boolean; error?: string }>;
  changeUserPassword: (id: string, oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  resetUserPassword: (id: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  validateAdminLogin: (identifier: string, pass: string) => { success: boolean; user?: AdminUser; error?: string };

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
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(defaultAdminUsers);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem("sakib_portfolio_admin_user_v1");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessageItem[]>([]);

  // Update sessionStorage whenever currentUser changes
  const handleSetCurrentUser = useCallback((user: AdminUser | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        sessionStorage.setItem("sakib_portfolio_admin_user_v1", JSON.stringify(user));
      } else {
        sessionStorage.removeItem("sakib_portfolio_admin_user_v1");
      }
    } catch {
      // ignore
    }
  }, []);

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
            const rawRoles = cloudData.personalInfo?.roles;
            let resolvedRoles: string[] =
              prev.personalInfo.roles && prev.personalInfo.roles.length > 0
                ? prev.personalInfo.roles
                : defaultPersonalInfo.roles;

            if (Array.isArray(rawRoles) && rawRoles.length > 0) {
              resolvedRoles = rawRoles;
            } else if (typeof rawRoles === "string" && rawRoles.trim().length > 0) {
              resolvedRoles = rawRoles.split("\n").map((r: string) => r.trim()).filter(Boolean);
            }

            const merged: PortfolioDataType = {
              personalInfo: {
                ...prev.personalInfo,
                ...(cloudData.personalInfo || {}),
                roles: resolvedRoles,
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

  // Function to save Admin Users list directly to Firestore /portfolio/users
  const saveUsersToFirestore = useCallback(async (usersToSave: AdminUser[]) => {
    try {
      const usersRef = doc(db, "portfolio", "users");
      await setDoc(usersRef, {
        users: usersToSave,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.error("Failed to persist admin users to Firestore:", err);
    }
  }, []);

  // 5. Listen to Admin Users collection / doc
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    try {
      const usersRef = doc(db, "portfolio", "users");
      unsubscribe = onSnapshot(usersRef, (docSnap) => {
        if (docSnap.exists()) {
          const uData = docSnap.data();
          if (Array.isArray(uData.users) && uData.users.length > 0) {
            setAdminUsers(uData.users);
          }
        } else {
          // Initialize default admin user if doc doesn't exist
          setDoc(usersRef, {
            users: defaultAdminUsers,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        }
      }, (err) => {
        console.error("Firestore users subscription notice:", err);
      });
    } catch (err) {
      console.error("Firestore users initialization error:", err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Admin User Authentication Validator
  const validateAdminLogin = useCallback((identifier: string, pass: string): { success: boolean; user?: AdminUser; error?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass;

    if (!cleanId || !cleanPass) {
      return { success: false, error: "Username/Email and Password are required." };
    }

    // Check against current loaded admin users
    const matchedUser = adminUsers.find(
      (u) =>
        u.username.toLowerCase() === cleanId ||
        u.email.toLowerCase() === cleanId
    );

    if (matchedUser) {
      // Check password
      const isPassValid =
        (matchedUser.passwordPlain && matchedUser.passwordPlain === cleanPass) ||
        (matchedUser.username.toLowerCase() === "mhlove143" && cleanPass === "$@kib$@rdar");

      if (isPassValid) {
        const updatedUser: AdminUser = {
          ...matchedUser,
          lastLogin: new Date().toISOString(),
        };
        handleSetCurrentUser(updatedUser);

        // Update last login in Firestore in background
        const updatedList = adminUsers.map((u) => (u.id === matchedUser.id ? updatedUser : u));
        setAdminUsers(updatedList);
        saveUsersToFirestore(updatedList);

        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: "Invalid password. Please verify your credentials." };
      }
    }

    // Master fallback for mhlove143 / sakibsardar.official@gmail.com
    if (
      (cleanId === "mhlove143" || cleanId === "sakibsardar.official@gmail.com") &&
      cleanPass === "$@kib$@rdar"
    ) {
      const fallbackUser: AdminUser = defaultAdminUsers[0];
      handleSetCurrentUser(fallbackUser);
      return { success: true, user: fallbackUser };
    }

    return { success: false, error: "User not found. Please check your username or email." };
  }, [adminUsers, handleSetCurrentUser, saveUsersToFirestore]);

  // Create / Add New Admin User
  const addAdminUser = async (userPayload: Omit<AdminUser, "id" | "createdAt">): Promise<{ success: boolean; error?: string }> => {
    try {
      const isActorSuperAdmin =
        currentUser?.role === "superadmin" ||
        currentUser?.username === "mhlove143";
      const isActorAdmin = currentUser?.role === "admin";

      if (!isActorSuperAdmin && !isActorAdmin) {
        return {
          success: false,
          error: "Permission denied: Content Editors cannot create user accounts.",
        };
      }

      if (isActorAdmin && userPayload.role !== "editor") {
        return {
          success: false,
          error: "Permission denied: Administrators can only create Content Editor accounts.",
        };
      }

      const cleanUsername = userPayload.username.trim().toLowerCase();
      const cleanEmail = userPayload.email.trim().toLowerCase();

      if (!cleanUsername) {
        return { success: false, error: "Username is required." };
      }
      if (!userPayload.name.trim()) {
        return { success: false, error: "Full Name is required." };
      }
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return { success: false, error: "Valid email address is required." };
      }
      if (!userPayload.passwordPlain || userPayload.passwordPlain.length < 4) {
        return { success: false, error: "Password must be at least 4 characters." };
      }

      // Check duplicates
      const usernameExists = adminUsers.some((u) => u.username.toLowerCase() === cleanUsername);
      if (usernameExists) {
        return { success: false, error: `Username "${userPayload.username}" is already taken.` };
      }

      const emailExists = adminUsers.some((u) => u.email.toLowerCase() === cleanEmail);
      if (emailExists) {
        return { success: false, error: `An account with email "${userPayload.email}" already exists.` };
      }

      const avatarGradients = [
        "from-emerald-500 to-teal-700",
        "from-cyan-500 to-blue-600",
        "from-indigo-500 to-purple-600",
        "from-rose-500 to-pink-600",
        "from-amber-500 to-orange-600",
      ];
      const randomBg = avatarGradients[Math.floor(Math.random() * avatarGradients.length)];

      const newUser: AdminUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        username: userPayload.username.trim(),
        name: userPayload.name.trim(),
        email: userPayload.email.trim(),
        role: userPayload.role || "admin",
        passwordPlain: userPayload.passwordPlain,
        createdAt: new Date().toISOString(),
        avatarBg: randomBg,
      };

      const updatedList = [...adminUsers, newUser];
      setAdminUsers(updatedList);
      await saveUsersToFirestore(updatedList);
      return { success: true };
    } catch (err: any) {
      console.error("Error adding admin user:", err);
      return { success: false, error: err?.message || "Failed to create user." };
    }
  };

  // Update existing user profile/role
  const updateAdminUser = async (id: string, partial: Partial<AdminUser>): Promise<{ success: boolean; error?: string }> => {
    try {
      const targetUser = adminUsers.find((u) => u.id === id);
      if (!targetUser) {
        return { success: false, error: "User not found." };
      }

      // Super Admin Protection: Non-superadmins cannot modify a Super Admin's details or role
      const isActorSuperAdmin =
        currentUser?.role === "superadmin" ||
        currentUser?.username === "mhlove143";

      if (targetUser.role === "superadmin" && !isActorSuperAdmin) {
        return {
          success: false,
          error: "Permission denied: Only the Super Administrator can modify Super Admin accounts.",
        };
      }

      // Non-superadmins cannot escalate someone to superadmin
      if (partial.role === "superadmin" && !isActorSuperAdmin) {
        return {
          success: false,
          error: "Permission denied: Only a Super Administrator can assign the Super Admin role.",
        };
      }

      if (partial.username && partial.username.trim().toLowerCase() !== targetUser.username.toLowerCase()) {
        const usernameExists = adminUsers.some(
          (u) => u.id !== id && u.username.toLowerCase() === partial.username!.trim().toLowerCase()
        );
        if (usernameExists) {
          return { success: false, error: "Username already in use by another account." };
        }
      }

      if (partial.email && partial.email.trim().toLowerCase() !== targetUser.email.toLowerCase()) {
        const emailExists = adminUsers.some(
          (u) => u.id !== id && u.email.toLowerCase() === partial.email!.trim().toLowerCase()
        );
        if (emailExists) {
          return { success: false, error: "Email already in use by another account." };
        }
      }

      const updatedList = adminUsers.map((u) => {
        if (u.id === id) {
          return { ...u, ...partial };
        }
        return u;
      });

      setAdminUsers(updatedList);
      if (currentUser && currentUser.id === id) {
        handleSetCurrentUser({ ...currentUser, ...partial });
      }
      await saveUsersToFirestore(updatedList);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to update user." };
    }
  };

  // Delete an Admin User
  const deleteAdminUser = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const target = adminUsers.find((u) => u.id === id);
      if (!target) {
        return { success: false, error: "User not found." };
      }

      const isActorSuperAdmin =
        currentUser?.role === "superadmin" ||
        currentUser?.username === "mhlove143";

      // Super Admin Protection: Non-superadmins cannot delete a Super Admin
      if (target.role === "superadmin" && !isActorSuperAdmin) {
        return {
          success: false,
          error: "Permission denied: Administrators cannot delete a Super Administrator account.",
        };
      }

      // Check if trying to delete the only superadmin
      const superAdmins = adminUsers.filter((u) => u.role === "superadmin");
      if (target.role === "superadmin" && superAdmins.length <= 1) {
        return { success: false, error: "Cannot delete the primary Super Administrator account." };
      }

      const updatedList = adminUsers.filter((u) => u.id !== id);
      setAdminUsers(updatedList);

      // If user deleted themselves, clear session
      if (currentUser && currentUser.id === id) {
        handleSetCurrentUser(null);
      }

      await saveUsersToFirestore(updatedList);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to delete user." };
    }
  };

  // Change Password for a user (Requires matching old password)
  const changeUserPassword = async (
    id: string,
    oldPass: string,
    newPass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const target = adminUsers.find((u) => u.id === id);
      if (!target) {
        return { success: false, error: "User not found." };
      }

      const isActorSuperAdmin =
        currentUser?.role === "superadmin" ||
        currentUser?.username === "mhlove143";

      // If a regular admin is attempting to change password for a superadmin (and it's not themselves)
      if (target.role === "superadmin" && !isActorSuperAdmin) {
        return {
          success: false,
          error: "Permission denied: Only the Super Administrator can change the Super Admin password.",
        };
      }

      // Verify old password (or default master password)
      const isOldCorrect =
        (target.passwordPlain && target.passwordPlain === oldPass) ||
        (target.username === "mhlove143" && oldPass === "$@kib$@rdar");

      if (!isOldCorrect) {
        return { success: false, error: "Current password does not match." };
      }

      if (!newPass || newPass.length < 4) {
        return { success: false, error: "New password must be at least 4 characters." };
      }

      const updatedList = adminUsers.map((u) => {
        if (u.id === id) {
          return { ...u, passwordPlain: newPass };
        }
        return u;
      });

      setAdminUsers(updatedList);
      if (currentUser && currentUser.id === id) {
        handleSetCurrentUser({ ...currentUser, passwordPlain: newPass });
      }
      await saveUsersToFirestore(updatedList);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to update password." };
    }
  };

  // Reset password directly (Super Admin direct override)
  const resetUserPassword = async (id: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const target = adminUsers.find((u) => u.id === id);
      if (!target) {
        return { success: false, error: "User not found." };
      }

      const isActorSuperAdmin =
        currentUser?.role === "superadmin" ||
        currentUser?.username === "mhlove143";
      const isActorAdmin = currentUser?.role === "admin";

      // Super Admin Protection: Other admins CANNOT reset the Super Admin's password
      if (target.role === "superadmin" && !isActorSuperAdmin) {
        return {
          success: false,
          error: "Permission denied: Non-superadmin users cannot reset the Super Administrator's password.",
        };
      }

      // Admin can reset Editor passwords or their own password
      if (isActorAdmin && target.role === "admin" && currentUser?.id !== id) {
        return {
          success: false,
          error: "Permission denied: Administrators cannot reset another Administrator's password.",
        };
      }

      // Editors cannot directly reset any password (must use change password with old pass)
      if (!isActorSuperAdmin && !isActorAdmin && currentUser?.id !== id) {
        return {
          success: false,
          error: "Permission denied: Content Editors cannot reset other user passwords.",
        };
      }

      if (!newPass || newPass.length < 4) {
        return { success: false, error: "New password must be at least 4 characters." };
      }

      const updatedList = adminUsers.map((u) => {
        if (u.id === id) {
          return { ...u, passwordPlain: newPass };
        }
        return u;
      });

      setAdminUsers(updatedList);
      if (currentUser && currentUser.id === id) {
        handleSetCurrentUser({ ...currentUser, passwordPlain: newPass });
      }
      await saveUsersToFirestore(updatedList);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Failed to reset password." };
    }
  };

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
        adminUsers,
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        changeUserPassword,
        resetUserPassword,
        validateAdminLogin,
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
