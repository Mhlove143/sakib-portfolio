import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  User,
  FileText,
  Briefcase,
  Layers,
  Code2,
  FolderKanban,
  GraduationCap,
  Plus,
  Trash2,
  Edit,
  Upload,
  Download,
  RotateCcw,
  ExternalLink,
  Save,
  CheckCircle2,
  X,
  FileCheck,
  Building,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  Search,
  Sparkles,
  ShieldCheck,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  MessageSquare,
  MessageSquarePlus,
  Database,
  RefreshCw,
  Camera,
  Image as ImageIcon,
  Copy,
  Github,
  Settings,
  Users,
  Moon,
  Palette,
  Check,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import portraitAsset from "@/assets/sakib-portrait.png.asset.json";
import { usePortfolio } from "@/context/PortfolioContext";
import { useTheme } from "@/context/ThemeContext";
import { AdminSettingsModal } from "@/components/admin/AdminSettingsModal";
import { Typewriter } from "@/components/Typewriter";
import { toast } from "sonner";
import {
  personalInfo as defaultPersonalInfo,
  type Service,
  type Experience,
  type Project,
  type SkillItem,
  type EducationItem,
  type CertificationItem,
  type LanguageItem,
} from "@/data/portfolio";

type TabType =
  | "profile"
  | "cv"
  | "topics"
  | "messages"
  | "experience"
  | "skills"
  | "projects"
  | "services"
  | "education";

const ADMIN_STORAGE_AUTH_KEY = "sakib_portfolio_admin_session_v1";

export function AdminPage() {
  const {
    personalInfo,
    updatePersonalInfo,
    uploadCustomCv,
    removeCustomCv,
    uploadProfilePhoto,
    removeProfilePhoto,
    uploadCustomFavicon,
    removeCustomFavicon,
    services,
    addService,
    updateService,
    deleteService,
    skillCategories,
    addSkillToCategory,
    updateSkillInCategory,
    deleteSkillFromCategory,
    addSkillCategory,
    deleteSkillCategory,
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    projects,
    addProject,
    updateProject,
    deleteProject,
    educationList,
    addEducation,
    updateEducation,
    deleteEducation,
    certifications,
    addCertification,
    deleteCertification,
    languages,
    addLanguage,
    deleteLanguage,
    contactTopics,
    addContactTopic,
    removeContactTopic,
    contactMessages,
    deleteContactMessage,
    clearAllContactMessages,
    isFirebaseConnected,
    isSyncing,
    resetToDefaults,
    exportDataJson,
    importDataJson,
    adminUsers,
    currentUser,
    setCurrentUser,
    validateAdminLogin,
  } = usePortfolio();

  // Authentication State - Stored in sessionStorage only so localStorage remains completely clean
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      // Purge old localStorage key if any exists
      localStorage.removeItem("sakib_portfolio_admin_auth_v1");
      return sessionStorage.getItem(ADMIN_STORAGE_AUTH_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isSuperAdmin = currentUser?.role === "superadmin" || currentUser?.username === "mhlove143";
  const isEditor = currentUser?.role === "editor";
  const isAdmin = currentUser?.role === "admin";

  // Content Editor Role Restriction: Automatically route to Experience if current tab is restricted
  useEffect(() => {
    if (isEditor && ["profile", "cv", "topics", "messages"].includes(activeTab)) {
      setActiveTab("experience");
    }
  }, [isEditor, activeTab]);

  const [searchQuery, setSearchQuery] = useState("");
  const [newTopicInput, setNewTopicInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const brandLogoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const jsonImportRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingBrandLogo, setIsUploadingBrandLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [customPhotoUrlInput, setCustomPhotoUrlInput] = useState("");
  const [customBrandLogoUrlInput, setCustomBrandLogoUrlInput] = useState("");
  const [customFaviconUrlInput, setCustomFaviconUrlInput] = useState("");

  const { theme, setTheme, themes } = useTheme();
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node) &&
        themeButtonRef.current &&
        !themeButtonRef.current.contains(event.target as Node)
      ) {
        setThemeDropdownOpen(false);
      }
    }

    if (themeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [themeDropdownOpen]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const result = validateAdminLogin(loginIdentifier, loginPassword);
    if (result.success) {
      setIsAuthenticated(true);
      setAuthError("");
      try {
        sessionStorage.setItem(ADMIN_STORAGE_AUTH_KEY, "true");
      } catch {
        // ignore
      }
      toast.success(`Welcome back, ${result.user?.name || "Sakib Sardar"}!`);
    } else {
      setAuthError(result.error || "Invalid username or password. Please verify your credentials.");
      toast.error("Authentication failed. Invalid username or password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_AUTH_KEY);
      sessionStorage.removeItem("sakib_portfolio_admin_user_v1");
      localStorage.removeItem("sakib_portfolio_admin_auth_v1");
    } catch {
      // ignore
    }
    toast.info("You have been signed out from Admin CMS.");
  };

  // Profile Form State
  const [profileForm, setProfileForm] = useState(() => ({
    ...personalInfo,
    roles:
      Array.isArray(personalInfo.roles) && personalInfo.roles.length > 0
        ? personalInfo.roles
        : defaultPersonalInfo.roles,
  }));

  // Sync profile form if personalInfo changes
  useEffect(() => {
    setProfileForm({
      ...personalInfo,
      roles:
        Array.isArray(personalInfo.roles) && personalInfo.roles.length > 0
          ? personalInfo.roles
          : defaultPersonalInfo.roles,
    });
  }, [personalInfo]);

  // Handlers for Animated Roles / Designations (Typewriter on Hero)
  const handleAddRole = () => {
    const currentRoles = Array.isArray(profileForm.roles) ? [...profileForm.roles] : [];
    setProfileForm({
      ...profileForm,
      roles: [...currentRoles, ""],
    });
  };

  const handleUpdateRole = (index: number, val: string) => {
    const currentRoles = Array.isArray(profileForm.roles) ? [...profileForm.roles] : [];
    currentRoles[index] = val;
    setProfileForm({
      ...profileForm,
      roles: currentRoles,
    });
  };

  const handleDeleteRole = (index: number) => {
    const currentRoles = Array.isArray(profileForm.roles) ? [...profileForm.roles] : [];
    if (currentRoles.length <= 1) {
      toast.warning("You must keep at least one role for the animated designation.");
      return;
    }
    const updated = currentRoles.filter((_, i) => i !== index);
    setProfileForm({
      ...profileForm,
      roles: updated,
    });
  };

  const handleMoveRole = (index: number, direction: "up" | "down") => {
    const currentRoles = Array.isArray(profileForm.roles) ? [...profileForm.roles] : [];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentRoles.length) return;
    const temp = currentRoles[index];
    currentRoles[index] = currentRoles[targetIndex];
    currentRoles[targetIndex] = temp;
    setProfileForm({
      ...profileForm,
      roles: currentRoles,
    });
  };

  const handleResetRolesToDefault = () => {
    setProfileForm({
      ...profileForm,
      roles: [...defaultPersonalInfo.roles],
    });
    toast.info("Hero animated designations reset to defaults. Click 'Save Changes' to save.");
  };

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    const cleanedRoles = (profileForm.roles || [])
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
    const finalRoles = cleanedRoles.length > 0 ? cleanedRoles : defaultPersonalInfo.roles;

    const payload = {
      ...profileForm,
      roles: finalRoles,
    };
    updatePersonalInfo(payload);
    setProfileForm(payload);
    toast.success("Profile information & Animated Designations updated successfully!");
  };

  // Profile Image Upload & Resize Handler
  const handlePhotoFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP, or SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = () => {
      const originalDataUri = reader.result as string;
      
      // Auto-compress & scale image if it's large to keep database super fast
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 900;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedUri = canvas.toDataURL("image/webp", 0.88);
          uploadProfilePhoto(compressedUri, file.name);
          toast.success(`Profile photo updated successfully! (${file.name})`);
        } else {
          uploadProfilePhoto(originalDataUri, file.name);
          toast.success(`Profile photo updated successfully! (${file.name})`);
        }
        setIsUploadingPhoto(false);
      };
      img.onerror = () => {
        uploadProfilePhoto(originalDataUri, file.name);
        toast.success(`Profile photo updated successfully! (${file.name})`);
        setIsUploadingPhoto(false);
      };
      img.src = originalDataUri;
    };
    reader.onerror = () => {
      toast.error("Error reading image file.");
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  // Brand Logo File Upload & Resize Handler
  const handleBrandLogoFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP, or SVG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    setIsUploadingBrandLogo(true);
    const reader = new FileReader();
    reader.onload = () => {
      const originalDataUri = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 250;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedUri = canvas.toDataURL("image/webp", 0.9);
          setProfileForm((prev) => ({ ...prev, brandLogoUrl: compressedUri }));
          updatePersonalInfo({ brandLogoUrl: compressedUri });
          toast.success(`Brand Logo uploaded and applied! (${file.name})`);
        } else {
          setProfileForm((prev) => ({ ...prev, brandLogoUrl: originalDataUri }));
          updatePersonalInfo({ brandLogoUrl: originalDataUri });
          toast.success(`Brand Logo uploaded and applied! (${file.name})`);
        }
        setIsUploadingBrandLogo(false);
      };
      img.onerror = () => {
        setProfileForm((prev) => ({ ...prev, brandLogoUrl: originalDataUri }));
        updatePersonalInfo({ brandLogoUrl: originalDataUri });
        toast.success(`Brand Logo applied!`);
        setIsUploadingBrandLogo(false);
      };
      img.src = originalDataUri;
    };
    reader.onerror = () => {
      toast.error("Error reading image file.");
      setIsUploadingBrandLogo(false);
    };
    reader.readAsDataURL(file);
  };

  // Favicon File Upload Handler (Supports SVG, PNG, ICO, WebP, JPEG)
  const handleFaviconFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Favicon exceeds 3MB limit. Please upload a lightweight icon file.");
      return;
    }

    setIsUploadingFavicon(true);
    const reader = new FileReader();

    // If it is SVG, read directly as text or data URI
    if (file.type.includes("svg") || file.name.endsWith(".svg")) {
      reader.onload = () => {
        const svgContent = reader.result as string;
        uploadCustomFavicon(svgContent, file.name);
        toast.success(`Favicon updated to custom SVG! (${file.name})`);
        setIsUploadingFavicon(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    // If raster image (PNG, ICO, WebP), scale to crisp square icon
    reader.onload = () => {
      const originalDataUri = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 64, 64);
          const iconUri = canvas.toDataURL("image/png");
          uploadCustomFavicon(iconUri, file.name);
        } else {
          uploadCustomFavicon(originalDataUri, file.name);
        }
        toast.success(`Favicon updated successfully! (${file.name})`);
        setIsUploadingFavicon(false);
      };
      img.onerror = () => {
        uploadCustomFavicon(originalDataUri, file.name);
        toast.success(`Favicon updated!`);
        setIsUploadingFavicon(false);
      };
      img.src = originalDataUri;
    };
    reader.onerror = () => {
      toast.error("Error reading icon file.");
      setIsUploadingFavicon(false);
    };
    reader.readAsDataURL(file);
  };

  const applyFaviconPreset = (name: string, svgMarkup: string) => {
    const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;
    uploadCustomFavicon(encoded, `${name}.svg`);
    toast.success(`Applied ${name} favicon preset!`);
  };

  // CV File Upload Handler
  const handleCvFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit. Please upload a compressed PDF.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      uploadCustomCv(result, file.name);
      toast.success(`Successfully uploaded CV: ${file.name}`);
    };
    reader.onerror = () => {
      toast.error("Error reading uploaded file.");
    };
    reader.readAsDataURL(file);
  };

  // Modals for CRUD
  const [serviceModal, setServiceModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    id?: string;
    data: Partial<Service>;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      title: "",
      tagline: "",
      description: "",
      color: "emerald",
      deliverables: [],
      technologies: [],
      businessValue: "",
    },
  });

  const [expModal, setExpModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    id?: string;
    data: Partial<Experience>;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      title: "",
      company: "",
      period: "",
      location: "",
      type: "Full-Time",
      roleSummary: "",
      highlights: [],
      techs: [],
      badge: "ScaleUP Ads",
      badgeColor: "emerald",
    },
  });

  const [projModal, setProjModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    id?: string;
    data: Partial<Project>;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      title: "",
      category: "Full-Stack",
      description: "",
      challenge: "",
      solution: "",
      impact: "",
      metrics: [],
      tech: [],
      badge: "Production SaaS",
    },
  });

  const [skillModal, setSkillModal] = useState<{
    isOpen: boolean;
    categoryId: string;
    skillName?: string;
    isEdit: boolean;
    data: Partial<SkillItem>;
  }>({
    isOpen: false,
    categoryId: skillCategories[0]?.id || "",
    isEdit: false,
    data: {
      name: "",
      level: "Advanced",
      experience: "2+ Years",
      description: "",
    },
  });

  const [eduModal, setEduModal] = useState<{
    isOpen: boolean;
    index?: number;
    isEdit: boolean;
    data: Partial<EducationItem>;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      degree: "",
      institution: "",
      location: "",
      period: "",
      cgpa: "",
      detail: "",
      status: "In Progress",
      statusType: "active",
      description: "",
      highlights: [],
      coursework: [],
    },
  });

  const [certModal, setCertModal] = useState<{
    isOpen: boolean;
    data: Partial<CertificationItem>;
  }>({
    isOpen: false,
    data: { title: "", issuer: "", date: "", skills: [] },
  });

  const [langModal, setLangModal] = useState<{
    isOpen: boolean;
    data: Partial<LanguageItem>;
  }>({
    isOpen: false,
    data: {
      name: "",
      proficiency: "Fluent",
      scorePercent: 90,
      reading: "Native",
      writing: "Professional",
      speaking: "Fluent",
      useCase: "",
    },
  });

  // Export JSON handler
  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sakib_portfolio_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded successfully!");
  };

  // Import JSON handler
  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const success = importDataJson(content);
      if (success) {
        toast.success("Backup imported and applied successfully!");
      } else {
        toast.error("Invalid backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* AUTHENTICATION GATE */}
      {!isAuthenticated ? (
        <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
          {/* Top Bar for Login Screen */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {/* Quick theme cycle button */}
            <button
              type="button"
              onClick={() => {
                const currentIndex = themes.findIndex((t) => t.id === theme);
                const nextTheme = themes[(currentIndex + 1) % themes.length];
                setTheme(nextTheme.id);
                toast.success(`Theme: ${nextTheme.name}`);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md transition-colors hover:border-accent shadow-sm"
              title="Change Theme Color Scheme"
            >
              <Moon className="h-3.5 w-3.5 text-accent" />
              <span className="hidden sm:inline">Theme:</span>
              <span className="font-bold text-accent">{themes.find((t) => t.id === theme)?.name}</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md transition-colors hover:border-accent hover:text-accent shadow-sm"
              title="Return to Public Portfolio"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>
          </div>

          <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-accent/25">
                <Lock className="h-7 w-7" />
              </div>
              <h1 className="mt-5 font-sora text-2xl font-black tracking-tight text-foreground">
                Admin Authentication
              </h1>
              <p className="mt-2 text-xs text-muted-foreground">
                Enter your Sakib Sardar portfolio administrator credentials to access the dynamic CMS dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              {authError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                  {authError}
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={loginIdentifier}
                  onChange={(e) => {
                    setLoginIdentifier(e.target.value);
                    setAuthError("");
                  }}
                  placeholder="mhlove143"
                  className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-4 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-shine mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-sora text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98]"
              >
                <Lock className="h-4 w-4" />
                <span>Unlock CMS Dashboard</span>
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/"
                  className="text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  ← Return to Public Portfolio
                </Link>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Top Admin Header */}
          <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-black text-primary-foreground shadow-sm shadow-accent/25"
                >
                  S
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-sora text-base font-extrabold tracking-tight sm:text-lg">
                      Portfolio CMS & Admin
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500">
                      <Database className="h-3 w-3" />
                      {isFirebaseConnected ? "Firestore Cloud Live" : "Connecting..."}
                    </span>
                    {isSyncing && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[10px] font-bold text-cyan-500 animate-pulse">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Syncing
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Real-time cloud database synchronization powered by Firebase Firestore.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Theme Selector Dropdown */}
                <div className="relative">
                  <button
                    ref={themeButtonRef}
                    onClick={() => setThemeDropdownOpen((prev) => !prev)}
                    className={`btn-shine inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
                      themeDropdownOpen
                        ? "border-accent bg-accent/15 text-accent shadow-sm"
                        : "border-border/80 bg-card text-foreground hover:border-accent hover:text-accent shadow-sm"
                    }`}
                    title="Change Theme Color Scheme"
                    aria-label="Change Theme Color Scheme"
                    aria-expanded={themeDropdownOpen}
                  >
                    <Moon className="h-3.5 w-3.5 text-accent" />
                    <span className="hidden sm:inline">Theme:</span>
                    <span className="font-bold text-accent">
                      {themes.find((t) => t.id === theme)?.name || "Theme"}
                    </span>
                  </button>

                  {/* Theme Dropdown Menu */}
                  {themeDropdownOpen && (
                    <div
                      ref={themeDropdownRef}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/90 bg-card/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <Palette className="h-3.5 w-3.5 text-accent" />
                          <span>Theme Colors</span>
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          4 Themes
                        </span>
                      </div>

                      <div className="mt-1.5 space-y-1">
                        {themes.map((t) => {
                          const isSelected = theme === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                setTheme(t.id);
                                setThemeDropdownOpen(false);
                                toast.success(`Theme switched to ${t.name}!`);
                              }}
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                                isSelected
                                  ? "bg-accent/15 text-accent font-semibold"
                                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
                                  style={{ backgroundColor: t.previewPrimary }}
                                />
                                <span>{t.name}</span>
                              </div>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-accent" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                  title="View Public Portfolio"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Live Site</span>
                </Link>

                {!isEditor && (
                  <>
                    <button
                      onClick={handleExport}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent"
                      title="Download Data Backup"
                    >
                      <Download className="h-3.5 w-3.5 text-accent" />
                      <span className="hidden sm:inline">Export</span>
                    </button>

                    <button
                      onClick={() => jsonImportRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent"
                      title="Import JSON Backup"
                    >
                      <Upload className="h-3.5 w-3.5 text-accent" />
                      <span className="hidden sm:inline">Import</span>
                    </button>
                    <input
                      type="file"
                      ref={jsonImportRef}
                      onChange={handleImport}
                      accept=".json"
                      className="hidden"
                    />
                  </>
                )}

                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to reset all data to default values?")) {
                        resetToDefaults();
                        toast.success("Reset all portfolio data to default!");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-500/20"
                    title="Reset everything to factory defaults"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset Defaults</span>
                  </button>
                )}

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/20 hover:border-primary shadow-sm"
                  title="Admin & User Settings (User Create, Info, Delete, Password)"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                  title="Sign out of Admin CMS"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            </div>

            {/* Tab Navigation Pill Bar */}
            <div className="mx-auto max-w-[1500px] overflow-x-auto px-4 pb-2 sm:px-8">
              <div className="flex items-center gap-1.5 py-1">
                {[
                  ...(!isEditor
                    ? [
                        { id: "profile", label: "Profile & Info", icon: User },
                        { id: "cv", label: "Curriculum Vitae", icon: FileText },
                        {
                          id: "topics",
                          label: `Contact Topics (${contactTopics?.length || 0})`,
                          icon: MessageSquarePlus,
                        },
                        {
                          id: "messages",
                          label: `Inquiries (${contactMessages?.length || 0})`,
                          icon: MessageSquare,
                        },
                      ]
                    : []),
                  { id: "experience", label: `Experience (${experiences.length})`, icon: Briefcase },
                  {
                    id: "skills",
                    label: `Skills (${skillCategories.reduce((acc, c) => acc + c.skills.length, 0)})`,
                    icon: Code2,
                  },
                  { id: "projects", label: `Projects (${projects.length})`, icon: FolderKanban },
                  { id: "services", label: `Services (${services.length})`, icon: Layers },
                  {
                    id: "education",
                    label: `Education (${educationList.length})`,
                    icon: GraduationCap,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 font-sora text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-bold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

      {/* Main Admin Content */}
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8">
        {/* TAB 1: PROFILE & PERSONAL INFO */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Dedicated Profile Photo & Avatar Management Studio */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                      Profile Photo & Portrait Management
                    </h2>
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">
                      Dynamic Image Studio
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload your high-res headshot or enter a custom photo URL. Updates everywhere in real-time across Home, About, and navigation.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>{isUploadingPhoto ? "Processing..." : "Upload New Photo"}</span>
                  </button>
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Photo Preview & Controls Grid */}
              <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-center">
                {/* Visual Previews */}
                <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border/60 bg-muted/20 p-6 lg:col-span-6">
                  {/* Circular Avatar Preview */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Navbar / Circular Preview
                    </span>
                    <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-accent/40 bg-muted shadow-lg">
                      <img
                        src={
                          personalInfo.customProfilePhotoDataUri ||
                          personalInfo.avatarUrl ||
                          portraitAsset.url
                        }
                        alt={personalInfo.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Hero Card Portrait Preview */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Hero & About Card Preview
                    </span>
                    <div className="relative h-32 w-28 overflow-hidden rounded-2xl border-2 border-primary/30 bg-primary/20 shadow-md">
                      <img
                        src={
                          personalInfo.customProfilePhotoDataUri ||
                          personalInfo.avatarUrl ||
                          portraitAsset.url
                        }
                        alt={personalInfo.name}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload & Action Details */}
                <div className="space-y-4 lg:col-span-6">
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Current Photo Status</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          personalInfo.customProfilePhotoDataUri
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : personalInfo.avatarUrl
                              ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {personalInfo.customProfilePhotoDataUri
                          ? "Custom Upload Active"
                          : personalInfo.avatarUrl
                            ? "Custom URL Active"
                            : "Default Portrait"}
                      </span>
                    </div>
                    {personalInfo.customProfilePhotoFileName && (
                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        File: <span className="font-semibold text-foreground">{personalInfo.customProfilePhotoFileName}</span>
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Choose File</span>
                      </button>

                      {(personalInfo.customProfilePhotoDataUri || personalInfo.avatarUrl) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Reset profile photo to the default portfolio portrait?")) {
                              removeProfilePhoto();
                              updatePersonalInfo({ avatarUrl: "" });
                              toast.info("Reset to default portrait.");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span>Reset to Default</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Or Custom Image URL */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Or Paste Image URL (GitHub, Cloudinary, Imgur, etc.)
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="url"
                        value={customPhotoUrlInput || personalInfo.avatarUrl || ""}
                        onChange={(e) => setCustomPhotoUrlInput(e.target.value)}
                        placeholder="https://example.com/your-headshot.jpg"
                        className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2 text-xs font-medium text-foreground focus:border-accent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customPhotoUrlInput.trim()) {
                            updatePersonalInfo({ avatarUrl: customPhotoUrlInput.trim() });
                            toast.success("Profile photo URL saved!");
                          }
                        }}
                        className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                      >
                        Save URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BRANDING & NAVBAR HEADER CMS (Matches requested image customization) */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                      Header & Navbar Branding
                    </h2>
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                      Dynamic Navbar Identity
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Customize your header avatar/logo, 2-letter monogram initials, display title, role subtitle tagline, and live status indicator.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleProfileSave}
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Branding</span>
                </button>
              </div>

              {/* Live Preview Box (Matches image.png) */}
              <div className="mb-6 rounded-2xl border border-accent/20 bg-accent/5 p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Live Navbar Badge Preview (How it appears to visitors)
                </span>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/80 bg-background/90 p-4 shadow-sm backdrop-blur-xl w-fit">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white font-black text-base shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/20">
                    {profileForm.brandLogoUrl ? (
                      <img
                        src={profileForm.brandLogoUrl}
                        alt={profileForm.name || "Brand"}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{profileForm.brandInitials || "SS"}</span>
                    )}
                    {profileForm.brandOnlineStatus !== false && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-sora text-sm font-extrabold tracking-tight text-foreground leading-tight sm:text-base">
                      {profileForm.name || "Sakib Sardar"}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase leading-none mt-0.5">
                      {profileForm.brandSubtitle || "FULL-STACK & SHOPIFY LEAD"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Branding Configuration Controls */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Brand Initials / Monogram */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Navbar Monogram / Initials
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={profileForm.brandInitials || "SS"}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        brandInitials: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g. SS"
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground uppercase tracking-widest focus:border-accent focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Short 2 to 3-letter initials displayed when no custom logo is uploaded.
                  </p>
                </div>

                {/* Subtitle / Role Tagline */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Navbar Subtitle / Role Tagline
                  </label>
                  <input
                    type="text"
                    value={profileForm.brandSubtitle || "FULL-STACK & SHOPIFY LEAD"}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        brandSubtitle: e.target.value,
                      })
                    }
                    placeholder="e.g. FULL-STACK & SHOPIFY LEAD"
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Secondary green designation text shown directly below the name.
                  </p>
                </div>

                {/* Online Status Toggle */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Online Status Indicator
                  </label>
                  <div className="mt-1.5 flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold text-foreground">
                        {profileForm.brandOnlineStatus !== false ? "Active (Green Pulsing Dot)" : "Disabled"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setProfileForm({
                          ...profileForm,
                          brandOnlineStatus: profileForm.brandOnlineStatus === false,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profileForm.brandOnlineStatus !== false ? "bg-emerald-500" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profileForm.brandOnlineStatus !== false ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Toggle active availability beacon in header.
                  </p>
                </div>
              </div>

              {/* Brand Custom Logo Upload & URL Option */}
              <div className="mt-6 rounded-2xl border border-border/60 bg-muted/20 p-5">
                <h3 className="font-sora text-sm font-bold text-foreground">
                  Custom Logo / Brand Avatar Icon (Optional)
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Upload a custom square logo or portrait to replace the monogram gradient box in the navbar.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {/* File Upload Button */}
                  <input
                    type="file"
                    ref={brandLogoInputRef}
                    onChange={handleBrandLogoFileUpload}
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingBrandLogo}
                    onClick={() => brandLogoInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:border-accent hover:text-accent shadow-sm"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploadingBrandLogo ? "Uploading & Resizing..." : "Upload Logo / Avatar File"}</span>
                  </button>

                  {/* Or Custom URL */}
                  <div className="flex flex-1 min-w-[260px] items-center gap-2">
                    <input
                      type="url"
                      value={customBrandLogoUrlInput || profileForm.brandLogoUrl || ""}
                      onChange={(e) => setCustomBrandLogoUrlInput(e.target.value)}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-medium text-foreground focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customBrandLogoUrlInput.trim()) {
                          setProfileForm((prev) => ({
                            ...prev,
                            brandLogoUrl: customBrandLogoUrlInput.trim(),
                          }));
                          updatePersonalInfo({
                            brandLogoUrl: customBrandLogoUrlInput.trim(),
                          });
                          toast.success("Brand Logo URL saved!");
                        }
                      }}
                      className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      Apply URL
                    </button>
                  </div>

                  {/* Reset Logo button */}
                  {profileForm.brandLogoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileForm((prev) => ({ ...prev, brandLogoUrl: "" }));
                        updatePersonalInfo({ brandLogoUrl: "" });
                        toast.info("Reverted to default monogram icon.");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Use Monogram</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* FAVICON & BROWSER TAB ICON STUDIO */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                      Favicon & Browser Tab Icon Studio
                    </h2>
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Live Dynamic Favicon
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload your custom website favicon (SVG, PNG, ICO) or choose a branded preset. Changes reflect instantly in the browser tab and bookmarks.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={faviconInputRef}
                    onChange={handleFaviconFileUpload}
                    accept="image/svg+xml,image/png,image/x-icon,image/vnd.microsoft.icon,image/webp,image/jpeg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingFavicon}
                    onClick={() => faviconInputRef.current?.click()}
                    className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploadingFavicon ? "Processing..." : "Upload New Favicon"}</span>
                  </button>
                </div>
              </div>

              {/* Favicon Simulation & Preview Grid */}
              <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
                {/* Left: Realistic Browser Tab Simulator */}
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-5 lg:col-span-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Live Browser Tab Simulation
                  </span>

                  {/* Browser Chrome Frame */}
                  <div className="mt-3 overflow-hidden rounded-xl border border-border/80 bg-background shadow-md">
                    {/* Tab Bar */}
                    <div className="flex items-center gap-2 border-b border-border/80 bg-muted/40 px-3 pt-2.5">
                      {/* Active Tab */}
                      <div className="flex max-w-[260px] items-center gap-2 rounded-t-lg border-t border-x border-border/80 bg-background px-3 py-1.5 shadow-sm">
                        <img
                          src={
                            personalInfo.customFaviconDataUri ||
                            personalInfo.customFaviconUrl ||
                            "/favicon.svg"
                          }
                          alt="Favicon preview"
                          className="h-4 w-4 shrink-0 rounded-sm object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <span className="truncate text-xs font-medium text-foreground">
                          Sakib Sardar — Full-Stack Developer
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                          ×
                        </span>
                      </div>
                      <span className="text-sm font-light text-muted-foreground px-1">+</span>
                    </div>

                    {/* Address Bar */}
                    <div className="flex items-center gap-2 bg-background px-3 py-2 border-b border-border/40">
                      <div className="flex flex-1 items-center gap-2 rounded-lg bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                        <span className="text-emerald-500 font-bold text-[10px]">🔒</span>
                        <span className="text-foreground font-medium truncate">
                          https://sakibsardar.dev/portfolio
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resolution Scaled Previews */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-border/60 bg-card p-3.5">
                    <div className="flex items-center gap-6">
                      {/* 16px */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50 p-1 border border-border/50">
                          <img
                            src={
                              personalInfo.customFaviconDataUri ||
                              personalInfo.customFaviconUrl ||
                              "/favicon.svg"
                            }
                            alt="16px"
                            className="h-4 w-4 object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">16px</span>
                      </div>

                      {/* 32px */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/50 p-1.5 border border-border/50">
                          <img
                            src={
                              personalInfo.customFaviconDataUri ||
                              personalInfo.customFaviconUrl ||
                              "/favicon.svg"
                            }
                            alt="32px"
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">32px</span>
                      </div>

                      {/* 64px */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 p-2 border border-border/50 shadow-inner">
                          <img
                            src={
                              personalInfo.customFaviconDataUri ||
                              personalInfo.customFaviconUrl ||
                              "/favicon.svg"
                            }
                            alt="64px"
                            className="h-12 w-12 object-contain"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">64px HD</span>
                      </div>
                    </div>

                    {/* Reset Button */}
                    {(personalInfo.customFaviconDataUri || personalInfo.customFaviconUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          removeCustomFavicon();
                          setCustomFaviconUrlInput("");
                          toast.info("Favicon reset to default branded SVG.");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset Default</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Quick Designer Presets & URL Option */}
                <div className="space-y-4 lg:col-span-6">
                  {/* Preset Favicons */}
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <span className="text-xs font-bold text-foreground">
                      One-Click Branded Favicon Presets
                    </span>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Select any of these high-contrast vector favicons crafted specifically for Sakib Sardar:
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {/* Preset 1 */}
                      <button
                        type="button"
                        onClick={() =>
                          applyFaviconPreset(
                            "Emerald Monogram",
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#061214"/><path d="M41 22C41 17.5 37 14.5 32 14.5C26 14.5 22 18.5 22 23.5C22 30 40 31.5 40 40.5C40 46 35.5 49.5 30 49.5C24 49.5 20.5 45.5 20.5 40" stroke="#10B981" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="16" r="4.5" fill="#06B6D4"/></svg>`,
                          )
                        }
                        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-accent hover:shadow-sm"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#061214] text-emerald-400 font-bold border border-emerald-500/30">
                          S
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">Emerald S</span>
                      </button>

                      {/* Preset 2 */}
                      <button
                        type="button"
                        onClick={() =>
                          applyFaviconPreset(
                            "Cyber Cyan",
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#0A1628"/><circle cx="32" cy="32" r="22" stroke="#00F0FF" stroke-width="4.5"/><path d="M25 24h14M32 24v16M25 40h14" stroke="#00F0FF" stroke-width="4.5" stroke-linecap="round"/></svg>`,
                          )
                        }
                        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-accent hover:shadow-sm"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A1628] text-cyan-400 font-bold border border-cyan-500/30">
                          ⚡
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">Cyber Cyan</span>
                      </button>

                      {/* Preset 3 */}
                      <button
                        type="button"
                        onClick={() =>
                          applyFaviconPreset(
                            "Terminal Code",
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#111827"/><path d="M20 23l-8 9 8 9M44 23l8 9-8 9M36 17l-8 30" stroke="#10B981" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
                          )
                        }
                        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-accent hover:shadow-sm"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111827] text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                          &lt;/&gt;
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">Code &lt;/&gt;</span>
                      </button>

                      {/* Preset 4 */}
                      <button
                        type="button"
                        onClick={() =>
                          applyFaviconPreset(
                            "Gold Prestige",
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#1C1608"/><path d="M41 22C41 17.5 37 14.5 32 14.5C26 14.5 22 18.5 22 23.5C22 30 40 31.5 40 40.5C40 46 35.5 49.5 30 49.5C24 49.5 20.5 45.5 20.5 40" stroke="#F59E0B" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="48" cy="16" r="4.5" fill="#FBBF24"/></svg>`,
                          )
                        }
                        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-accent hover:shadow-sm"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1C1608] text-amber-400 font-bold border border-amber-500/30">
                          ★
                        </div>
                        <span className="text-[11px] font-semibold text-foreground">Gold Star</span>
                      </button>
                    </div>
                  </div>

                  {/* Or Custom Favicon URL */}
                  <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Or Direct Favicon URL (.ico, .svg, .png)
                    </label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="url"
                        value={customFaviconUrlInput || personalInfo.customFaviconUrl || ""}
                        onChange={(e) => setCustomFaviconUrlInput(e.target.value)}
                        placeholder="https://example.com/custom-favicon.svg"
                        className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-medium text-foreground focus:border-accent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customFaviconUrlInput.trim()) {
                            updatePersonalInfo({
                              customFaviconUrl: customFaviconUrlInput.trim(),
                              customFaviconDataUri: "",
                            });
                            toast.success("Favicon URL applied successfully!");
                          }
                        }}
                        className="shrink-0 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Form */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-border/70 pb-4">
                <div>
                  <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                    Personal Information & Bio
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Update your identity, hero headlines, bio, location, and social links.
                  </p>
                </div>
                <button
                  onClick={handleProfileSave}
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Short / Display Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.shortName}
                    onChange={(e) => setProfileForm({ ...profileForm, shortName: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Primary Professional Title
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g. Dhaka, Bangladesh"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Primary Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phone / Display Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.phoneDisplay}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        phone: e.target.value,
                        phoneDisplay: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    WhatsApp Chat URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.whatsappUrl}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, whatsappUrl: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Hero Animated Designations (Typewriter Effect) */}
                <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border-2 border-accent/40 bg-accent/5 p-4 sm:p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-accent/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <h3 className="font-sora text-sm sm:text-base font-bold text-foreground">
                          Hero Animated Designations (Typewriter Effect)
                        </h3>
                        <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-accent">
                          Hero Subtitle
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        These designations animate one-by-one under your name on the homepage Hero section. You can add, edit, reorder, or remove any role here.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleAddRole}
                        className="btn-shine inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 font-sora text-xs font-bold text-slate-950 shadow-sm transition-all hover:bg-accent/90 active:scale-95"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Designation</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetRolesToDefault}
                        className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-card px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground active:scale-95"
                        title="Reset to default designations"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Hero Typewriter Preview */}
                  <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-background/80 px-4 py-2.5 shadow-inner">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-accent" />
                      Live Typing Preview:
                    </span>
                    <div className="font-sora text-xs sm:text-sm font-extrabold text-accent min-h-[1.4rem] flex items-center truncate">
                      <Typewriter
                        words={
                          profileForm.roles && profileForm.roles.length > 0
                            ? profileForm.roles.filter(Boolean)
                            : ["Full-Stack Web Architect"]
                        }
                        typingSpeed={65}
                        pauseTime={1800}
                      />
                    </div>
                  </div>

                  {/* Role List with sequence, inputs, move up/down and delete */}
                  <div className="space-y-2">
                    {(profileForm.roles || []).map((role, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-2 shadow-sm transition-all hover:border-accent/50"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-black text-muted-foreground">
                          {idx + 1}
                        </div>

                        <input
                          type="text"
                          value={role}
                          onChange={(e) => handleUpdateRole(idx, e.target.value)}
                          placeholder="e.g. Full-Stack Web Architect (Django & React.js)"
                          className="flex-1 rounded-lg border border-border/80 bg-muted/20 px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground focus:border-accent focus:outline-none"
                        />

                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => handleMoveRole(idx, "up")}
                          disabled={idx === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                          title="Move up"
                          aria-label="Move up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => handleMoveRole(idx, "down")}
                          disabled={idx === (profileForm.roles || []).length - 1}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
                          title="Move down"
                          aria-label="Move down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteRole(idx)}
                          disabled={(profileForm.roles || []).length <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-30"
                          title="Delete designation"
                          aria-label="Delete designation"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Availability Status (Hero Tag)
                  </label>
                  <input
                    type="text"
                    value={profileForm.availability}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, availability: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g. Available for Full-Time Roles & High-Impact Contracts"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Primary Bio (Hero & Overview)
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 p-3.5 text-sm leading-relaxed text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Extended Professional Bio (About Page & CV Summary)
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.extendedBio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, extendedBio: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-muted/30 p-3.5 text-sm leading-relaxed text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* TAB 2: CURRICULUM VITAE (CV) */}
        {activeTab === "cv" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border/70 pb-4">
                <div>
                  <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                    Curriculum Vitae (Resume) Upload & Management
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Upload your updated PDF resume so employers and clients can download it directly
                    from any page.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload New PDF</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCvFileUpload}
                    accept=".pdf"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Status Card */}
              <div className="mt-6 rounded-2xl border border-border/70 bg-muted/20 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-sora text-sm font-bold text-foreground">
                          {personalInfo.customCvFileName || "Sakib_Sardar_Curriculum_Vitae.pdf"}
                        </h4>
                        {personalInfo.customCvDataUri && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Custom File Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {personalInfo.customCvDataUri
                          ? "Custom uploaded document stored safely in client data store."
                          : "Using standard portfolio resume generator."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {personalInfo.customCvDataUri && (
                      <button
                        onClick={() => {
                          try {
                            const dataUri = personalInfo.customCvDataUri!;
                            const fileName = personalInfo.customCvFileName || "Sakib_Sardar_Resume.pdf";
                            if (dataUri.startsWith("data:")) {
                              const parts = dataUri.split(",");
                              const base64 = parts.length > 1 ? parts[1] : parts[0];
                              const mimeMatch = parts.length > 1 ? parts[0].match(/:(.*?);/) : null;
                              const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
                              const byteChars = atob(base64);
                              const byteArr = new Uint8Array(byteChars.length);
                              for (let i = 0; i < byteChars.length; i++) {
                                byteArr[i] = byteChars.charCodeAt(i);
                              }
                              const blob = new Blob([byteArr], { type: mime });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = fileName;
                              document.body.appendChild(a);
                              a.click();
                              setTimeout(() => {
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                              }, 300);
                            } else {
                              const a = document.createElement("a");
                              a.href = dataUri;
                              a.download = fileName;
                              a.target = "_blank";
                              document.body.appendChild(a);
                              a.click();
                              setTimeout(() => document.body.removeChild(a), 300);
                            }
                            toast.success("Download started!");
                          } catch (e) {
                            console.error(e);
                            toast.error("Download failed, opening in new tab...");
                            window.open(personalInfo.customCvDataUri, "_blank");
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:border-accent"
                      >
                        <Download className="h-3.5 w-3.5 text-accent" />
                        <span>Test Download</span>
                      </button>
                    )}

                    {personalInfo.customCvDataUri && (
                      <button
                        onClick={() => {
                          if (window.confirm("Remove custom uploaded CV file?")) {
                            removeCustomCv();
                            toast.success("Custom CV file removed.");
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove File</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Preview Box if CV is uploaded */}
              {personalInfo.customCvDataUri && (
                <div className="mt-6 rounded-2xl border border-border/70 bg-card p-4">
                  <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-3">
                    <h4 className="font-sora text-xs font-bold uppercase tracking-wider text-foreground">
                      Live Document Preview
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      {personalInfo.customCvFileName}
                    </span>
                  </div>
                  <iframe
                    src={personalInfo.customCvDataUri}
                    title="CV Preview"
                    className="w-full h-[450px] rounded-xl border border-border/60 bg-white"
                  />
                </div>
              )}

              {/* External CV Link */}
              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Or Direct Cloud / Google Drive CV URL (Optional)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="url"
                    value={personalInfo.cvUrl || ""}
                    onChange={(e) => updatePersonalInfo({ cvUrl: e.target.value })}
                    className="w-full rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    placeholder="https://drive.google.com/your-resume.pdf"
                  />
                  <button
                    onClick={() => toast.success("CV link updated!")}
                    className="rounded-xl bg-muted px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/80"
                  >
                    Save Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CONTACT TOPICS */}
        {activeTab === "topics" && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border/70 pb-4">
              <div>
                <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                  Contact Form Inquiry Topics
                </h2>
                <p className="text-xs text-muted-foreground">
                  Customize the quick-select subject pills displayed on the public contact form.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  placeholder="e.g. Next.js App Development"
                  className="rounded-full border border-border/80 bg-muted/30 px-4 py-2 text-xs font-medium text-foreground focus:border-accent focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTopicInput.trim()) {
                      e.preventDefault();
                      addContactTopic(newTopicInput.trim());
                      setNewTopicInput("");
                      toast.success("Topic added!");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTopicInput.trim()) {
                      addContactTopic(newTopicInput.trim());
                      setNewTopicInput("");
                      toast.success("Topic added!");
                    }
                  }}
                  className="btn-shine inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sora text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Topic</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {contactTopics.map((topic) => (
                <div
                  key={topic}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/20 px-4 py-2 text-xs font-semibold text-foreground shadow-sm"
                >
                  <span>{topic}</span>
                  <button
                    type="button"
                    onClick={() => {
                      removeContactTopic(topic);
                      toast.info(`Removed topic "${topic}"`);
                    }}
                    className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                    title={`Delete ${topic}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: INQUIRIES & MESSAGES */}
        {activeTab === "messages" && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                  Visitor Inquiries & Contact Messages
                </h2>
                <p className="text-xs text-muted-foreground">
                  Live Firestore database collection storing all messages submitted via the portfolio.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 font-sora text-xs font-bold text-primary">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {contactMessages.length} Total Received
                </span>

                {contactMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to permanently delete all contact messages?",
                        )
                      ) {
                        clearAllContactMessages();
                        toast.success("All contact messages cleared.");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 font-sora text-xs font-bold text-rose-500 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {contactMessages.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-12 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
                <h3 className="mt-3 font-sora text-sm font-bold text-foreground">
                  No Contact Inquiries Yet
                </h3>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  When potential clients or recruiters submit the contact form on your portfolio, their messages will immediately appear here in real-time and be delivered to your email.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {contactMessages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className="group rounded-2xl border border-border/80 bg-muted/20 p-5 transition-all hover:border-accent/50 hover:bg-muted/30"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-sora text-sm font-bold text-foreground">
                            {msg.name}
                          </h4>
                          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                            {msg.subject || "General Enquiry"}
                          </span>
                        </div>
                        <a
                          href={`mailto:${msg.email}`}
                          className="mt-0.5 inline-block text-xs font-semibold text-muted-foreground hover:text-accent hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {msg.createdAt && (
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        )}
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Your inquiry")}`}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20"
                        >
                          <Mail className="h-3 w-3" />
                          Reply
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `From: ${msg.name} (${msg.email})\nSubject: ${msg.subject}\n\n${msg.message}`,
                            );
                            toast.success("Message copied to clipboard!");
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                          title="Copy details"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete inquiry message from "${msg.name}"?`)) {
                              if (msg.id) {
                                deleteContactMessage(msg.id);
                              }
                              toast.success("Message deleted.");
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                          title="Delete message"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFESSIONAL EXPERIENCE */}
        {activeTab === "experience" && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border/70 pb-4">
              <div>
                <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                  Work Experience & Leadership
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add, update, or remove professional career timeline items.
                </p>
              </div>

              <button
                onClick={() =>
                  setExpModal({
                    isOpen: true,
                    isEdit: false,
                    data: {
                      title: "",
                      company: "",
                      period: "2024 — Present",
                      location: "Dhaka, Bangladesh",
                      type: "Full-Time",
                      roleSummary: "",
                      highlights: [""],
                      techs: ["React", "Django"],
                      badge: "ScaleUP Ads",
                      badgeColor: "emerald",
                    },
                  })
                }
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-muted/20 p-5 sm:flex-row sm:items-start"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sora text-base font-bold text-foreground">{exp.title}</h3>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-sora text-xs font-bold text-primary">
                        {exp.period}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {exp.type}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-accent">
                      {exp.company} · {exp.location}
                    </p>

                    <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
                      {exp.roleSummary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.techs.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border/60 bg-card px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setExpModal({
                          isOpen: true,
                          isEdit: true,
                          id: exp.id,
                          data: { ...exp },
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete experience "${exp.title}"?`)) {
                          deleteExperience(exp.id);
                          toast.success("Experience removed.");
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TECHNICAL SKILLS */}
        {activeTab === "skills" && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border/70 pb-4">
              <div>
                <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                  Technical Skills & Competency Matrix
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add, update, or remove individual technical skills or skill categories.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setSkillModal({
                      isOpen: true,
                      categoryId: skillCategories[0]?.id || "",
                      isEdit: false,
                      data: {
                        name: "",
                        level: "Expert",
                        experience: "2+ Years",
                        description: "",
                      },
                    })
                  }
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-8">
              {skillCategories.map((cat) => (
                <div key={cat.id} className="rounded-2xl border border-border/80 bg-muted/10 p-5">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <span className="font-sora text-xs font-bold uppercase tracking-wider text-accent">
                        {cat.highlight}
                      </span>
                      <h3 className="font-sora text-lg font-bold text-foreground">{cat.name}</h3>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      {cat.skills.length} Skills
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 shadow-sm"
                      >
                        <div>
                          <p className="font-sora text-xs font-bold text-foreground">
                            {skill.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                                skill.level === "Expert"
                                  ? "bg-emerald-500/15 text-emerald-500"
                                  : skill.level === "Advanced"
                                    ? "bg-sky-500/15 text-sky-500"
                                    : "bg-purple-500/15 text-purple-500"
                              }`}
                            >
                              {skill.level}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {skill.experience}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setSkillModal({
                                isOpen: true,
                                categoryId: cat.id,
                                skillName: skill.name,
                                isEdit: true,
                                data: { ...skill },
                              })
                            }
                            className="p-1 text-muted-foreground hover:text-accent"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete skill "${skill.name}"?`)) {
                                deleteSkillFromCategory(cat.id, skill.name);
                                toast.success("Skill deleted.");
                              }
                            }}
                            className="p-1 text-muted-foreground hover:text-rose-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROJECTS */}
        {activeTab === "projects" && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border/70 pb-4">
              <div>
                <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                  Case Studies & Featured Projects
                </h2>
                <p className="text-xs text-muted-foreground">
                  Manage applications, metrics, and architecture case studies.
                </p>
              </div>

              <button
                onClick={() =>
                  setProjModal({
                    isOpen: true,
                    isEdit: false,
                    data: {
                      title: "",
                      category: "Full-Stack",
                      badge: "Production App",
                      description: "",
                      challenge: "",
                      solution: "",
                      impact: "",
                      metrics: ["99.9% Uptime"],
                      tech: ["Django", "React", "Tailwind CSS"],
                    },
                  })
                }
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-muted/20 p-5 sm:flex-row sm:items-start"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sora text-base font-bold text-foreground">
                        {proj.title}
                      </h3>
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-sora text-xs font-bold text-accent">
                        {proj.category}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border/60 bg-card px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setProjModal({
                          isOpen: true,
                          isEdit: true,
                          id: proj.id,
                          data: { ...proj },
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete project "${proj.title}"?`)) {
                          deleteProject(proj.id);
                          toast.success("Project deleted.");
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SERVICES */}
        {activeTab === "services" && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border/70 pb-4">
              <div>
                <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                  Specialized Services & Deliverables
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add, update, or remove engineering service packages.
                </p>
              </div>

              <button
                onClick={() =>
                  setServiceModal({
                    isOpen: true,
                    isEdit: false,
                    data: {
                      title: "",
                      tagline: "Architecture & Delivery",
                      description: "",
                      color: "emerald",
                      deliverables: [""],
                      technologies: ["React", "Django"],
                      businessValue: "",
                    },
                  })
                }
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-muted/20 p-5 sm:flex-row sm:items-start"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-sora text-base font-bold text-foreground">{srv.title}</h3>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-sora text-xs font-bold text-primary">
                        {srv.tagline}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
                      {srv.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {srv.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-border/60 bg-card px-2 py-0.5 text-[11px] font-semibold text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {(srv.liveUrl || srv.githubUrl) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {srv.liveUrl && (
                          <a
                            href={srv.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500 hover:bg-emerald-500/20"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Live: {srv.liveUrl}</span>
                          </a>
                        )}
                        {srv.githubUrl && (
                          <a
                            href={srv.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground hover:bg-muted"
                          >
                            <Github className="h-3 w-3" />
                            <span>Git: {srv.githubUrl}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setServiceModal({
                          isOpen: true,
                          isEdit: true,
                          id: srv.id,
                          data: { ...srv },
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete service "${srv.title}"?`)) {
                          deleteService(srv.id);
                          toast.success("Service removed.");
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: EDUCATION & CERTIFICATIONS */}
        {activeTab === "education" && (
          <div className="space-y-8">
            {/* Degrees */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-border/70 pb-4">
                <div>
                  <h2 className="font-sora text-xl font-bold tracking-tight text-foreground">
                    Academic Degrees & Qualifications
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Add or update your university, diploma, and school credentials.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setEduModal({
                      isOpen: true,
                      isEdit: false,
                      data: {
                        degree: "",
                        institution: "",
                        location: "Dhaka, Bangladesh",
                        period: "2024 — Present",
                        cgpa: "",
                        detail: "",
                        status: "In Progress",
                        statusType: "active",
                        description: "",
                        coursework: [],
                        highlights: [],
                      },
                    })
                  }
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {educationList.map((edu, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-muted/20 p-5 sm:flex-row sm:items-start"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-sora text-base font-bold text-foreground">
                          {edu.degree}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-sora text-xs font-bold ${
                            edu.statusType === "distinction"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              : edu.statusType === "active"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                          }`}
                        >
                          {edu.status || "Active"}
                        </span>
                        {edu.cgpa && (
                          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-sora text-xs font-bold text-accent">
                            CGPA: {edu.cgpa}
                          </span>
                        )}
                        {edu.detail && (
                          <span className="rounded-full bg-muted px-2.5 py-0.5 font-sora text-xs text-muted-foreground">
                            {edu.detail}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {edu.institution} · {edu.location} ({edu.period})
                      </p>
                      <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
                        {edu.description}
                      </p>
                      {(edu.coursework?.length || edu.highlights?.length) ? (
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                          {edu.coursework && edu.coursework.length > 0 && (
                            <span>{edu.coursework.length} Coursework modules</span>
                          )}
                          {edu.coursework && edu.highlights && edu.coursework.length > 0 && edu.highlights.length > 0 && (
                            <span>·</span>
                          )}
                          {edu.highlights && edu.highlights.length > 0 && (
                            <span>{edu.highlights.length} Highlights</span>
                          )}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          setEduModal({
                            isOpen: true,
                            isEdit: true,
                            index: idx,
                            data: { ...edu },
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${edu.degree}"?`)) {
                            deleteEducation(idx);
                            toast.success("Degree removed.");
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODALS FOR CREATING / EDITING ENTITIES
      ========================================================================== */}

      {/* SERVICE MODAL */}
      {serviceModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h3 className="font-sora text-base font-bold text-foreground">
                {serviceModal.isEdit ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={() => setServiceModal({ ...serviceModal, isOpen: false })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (serviceModal.isEdit && serviceModal.id) {
                  updateService(serviceModal.id, serviceModal.data);
                  toast.success("Service updated successfully!");
                } else {
                  addService(serviceModal.data as Omit<Service, "id">);
                  toast.success("New service added successfully!");
                }
                setServiceModal({ ...serviceModal, isOpen: false });
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
                <input
                  type="text"
                  required
                  value={serviceModal.data.title || ""}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      data: { ...serviceModal.data, title: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Tagline</label>
                <input
                  type="text"
                  required
                  value={serviceModal.data.tagline || ""}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      data: { ...serviceModal.data, tagline: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={serviceModal.data.description || ""}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      data: { ...serviceModal.data, description: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Service Cover / Architecture Image
                </label>
                <div className="mt-1 flex flex-col gap-2">
                  <input
                    type="url"
                    value={serviceModal.data.imageUrl || ""}
                    onChange={(e) =>
                      setServiceModal({
                        ...serviceModal,
                        data: { ...serviceModal.data, imageUrl: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="https://images.unsplash.com/... or paste image URL"
                  />
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Local Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error("Image file size should be less than 2MB");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              setServiceModal({
                                ...serviceModal,
                                data: { ...serviceModal.data, imageUrl: base64 },
                              });
                              toast.success("Image uploaded successfully!");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {serviceModal.data.imageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setServiceModal({
                            ...serviceModal,
                            data: { ...serviceModal.data, imageUrl: "" },
                          })
                        }
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  {serviceModal.data.imageUrl && (
                    <div className="relative mt-1 h-32 w-full overflow-hidden rounded-xl border border-border/80 bg-black/40">
                      <img
                        src={serviceModal.data.imageUrl}
                        alt="Service Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={(serviceModal.data.technologies || []).join(", ")}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      data: {
                        ...serviceModal.data,
                        technologies: e.target.value.split(",").map((s) => s.trim()),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="React, Django, Shopify, PostgreSQL"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setServiceModal({ ...serviceModal, isOpen: false })}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-shine rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  {serviceModal.isEdit ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPERIENCE MODAL */}
      {expModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h3 className="font-sora text-base font-bold text-foreground">
                {expModal.isEdit ? "Edit Experience" : "Add New Experience"}
              </h3>
              <button
                onClick={() => setExpModal({ ...expModal, isOpen: false })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (expModal.isEdit && expModal.id) {
                  updateExperience(expModal.id, expModal.data);
                  toast.success("Experience updated!");
                } else {
                  addExperience(expModal.data as Omit<Experience, "id">);
                  toast.success("Experience added!");
                }
                setExpModal({ ...expModal, isOpen: false });
              }}
              className="mt-4 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={expModal.data.title || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, title: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={expModal.data.company || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, company: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Period
                  </label>
                  <input
                    type="text"
                    required
                    value={expModal.data.period || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, period: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="e.g. 2024 — Present"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Location & Type
                  </label>
                  <input
                    type="text"
                    required
                    value={expModal.data.location || ""}
                    onChange={(e) =>
                      setExpModal({
                        ...expModal,
                        data: { ...expModal.data, location: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Role Summary
                </label>
                <textarea
                  rows={3}
                  required
                  value={expModal.data.roleSummary || ""}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      data: { ...expModal.data, roleSummary: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={(expModal.data.techs || []).join(", ")}
                  onChange={(e) =>
                    setExpModal({
                      ...expModal,
                      data: {
                        ...expModal.data,
                        techs: e.target.value.split(",").map((s) => s.trim()),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setExpModal({ ...expModal, isOpen: false })}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-shine rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  {expModal.isEdit ? "Save Changes" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {skillModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h3 className="font-sora text-base font-bold text-foreground">
                {skillModal.isEdit ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                onClick={() => setSkillModal({ ...skillModal, isOpen: false })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (skillModal.isEdit && skillModal.skillName) {
                  updateSkillInCategory(
                    skillModal.categoryId,
                    skillModal.skillName,
                    skillModal.data,
                  );
                  toast.success("Skill updated!");
                } else {
                  addSkillToCategory(skillModal.categoryId, skillModal.data as SkillItem);
                  toast.success("Skill added!");
                }
                setSkillModal({ ...skillModal, isOpen: false });
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Category
                </label>
                <select
                  value={skillModal.categoryId}
                  onChange={(e) => setSkillModal({ ...skillModal, categoryId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                >
                  {skillCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={skillModal.data.name || ""}
                  onChange={(e) =>
                    setSkillModal({
                      ...skillModal,
                      data: { ...skillModal.data, name: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Proficiency Level
                  </label>
                  <select
                    value={skillModal.data.level || "Expert"}
                    onChange={(e) =>
                      setSkillModal({
                        ...skillModal,
                        data: {
                          ...skillModal.data,
                          level: e.target.value as "Expert" | "Advanced" | "Proficient",
                        },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="Expert">Expert</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Proficient">Proficient</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={skillModal.data.experience || "2+ Years"}
                    onChange={(e) =>
                      setSkillModal({
                        ...skillModal,
                        data: { ...skillModal.data, experience: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setSkillModal({ ...skillModal, isOpen: false })}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-shine rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  {skillModal.isEdit ? "Save Changes" : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {projModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h3 className="font-sora text-base font-bold text-foreground">
                {projModal.isEdit ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={() => setProjModal({ ...projModal, isOpen: false })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (projModal.isEdit && projModal.id) {
                  updateProject(projModal.id, projModal.data);
                  toast.success("Project updated!");
                } else {
                  addProject(projModal.data as Omit<Project, "id">);
                  toast.success("Project added!");
                }
                setProjModal({ ...projModal, isOpen: false });
              }}
              className="mt-4 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={projModal.data.title || ""}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: { ...projModal.data, title: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={projModal.data.category || "Full-Stack"}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: {
                          ...projModal.data,
                          category: e.target.value as "Full-Stack" | "Shopify" | "CMS" | "SaaS",
                        },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Shopify">Shopify</option>
                    <option value="CMS">CMS</option>
                    <option value="SaaS">SaaS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={projModal.data.description || ""}
                  onChange={(e) =>
                    setProjModal({
                      ...projModal,
                      data: { ...projModal.data, description: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={(projModal.data.tech || []).join(", ")}
                  onChange={(e) =>
                    setProjModal({
                      ...projModal,
                      data: {
                        ...projModal.data,
                        tech: e.target.value.split(",").map((s) => s.trim()),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="Django, React, PostgreSQL, Tailwind CSS"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Project Hero / Case Study Image
                </label>
                <div className="mt-1 flex flex-col gap-2">
                  <input
                    type="url"
                    value={projModal.data.imageUrl || ""}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: { ...projModal.data, imageUrl: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="https://images.unsplash.com/... or paste image URL"
                  />
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Local Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error("Image file size should be less than 2MB");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string;
                              setProjModal({
                                ...projModal,
                                data: { ...projModal.data, imageUrl: base64 },
                              });
                              toast.success("Image uploaded successfully!");
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {projModal.data.imageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setProjModal({
                            ...projModal,
                            data: { ...projModal.data, imageUrl: "" },
                          })
                        }
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  {projModal.data.imageUrl && (
                    <div className="relative mt-1 h-36 w-full overflow-hidden rounded-xl border border-border/80 bg-black/40">
                      <img
                        src={projModal.data.imageUrl}
                        alt="Project Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Live Project / Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={projModal.data.liveUrl || ""}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: { ...projModal.data, liveUrl: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="https://mysite.com/demo"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Git Code Repository URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={projModal.data.githubUrl || ""}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: { ...projModal.data, githubUrl: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="https://github.com/sakibsardar/repo"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Challenge
                  </label>
                  <input
                    type="text"
                    value={projModal.data.challenge || ""}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: { ...projModal.data, challenge: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="Client's core bottleneck or challenge..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Solution
                  </label>
                  <input
                    type="text"
                    value={projModal.data.solution || ""}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: { ...projModal.data, solution: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="Engineering architecture or framework used..."
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Impact Highlight
                  </label>
                  <input
                    type="text"
                    value={projModal.data.impact || ""}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: { ...projModal.data, impact: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="+40% performance gain"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Metrics (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(projModal.data.metrics || []).join(", ")}
                    onChange={(e) =>
                      setProjModal({
                        ...projModal,
                        data: {
                          ...projModal.data,
                          metrics: e.target.value.split(",").map((s) => s.trim()),
                        },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none"
                    placeholder="99.9% Uptime, Sub-second TTFB"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setProjModal({ ...projModal, isOpen: false })}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-shine rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  {projModal.isEdit ? "Save Changes" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {eduModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <h3 className="font-sora text-base font-bold text-foreground">
                {eduModal.isEdit ? "Edit Academic Degree" : "Add Academic Degree"}
              </h3>
              <button
                onClick={() => setEduModal({ ...eduModal, isOpen: false })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Ensure detail is populated if empty
                const finalData = { ...eduModal.data };
                if (!finalData.detail && finalData.cgpa) {
                  finalData.detail = `CGPA ${finalData.cgpa} · ${finalData.status || "Graduated"}`;
                }
                if (eduModal.isEdit && eduModal.index !== undefined) {
                  updateEducation(eduModal.index, finalData);
                  toast.success("Degree updated!");
                } else {
                  addEducation(finalData as EducationItem);
                  toast.success("Degree added!");
                }
                setEduModal({ ...eduModal, isOpen: false });
              }}
              className="mt-4 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Degree Name
                  </label>
                  <input
                    type="text"
                    required
                    value={eduModal.data.degree || ""}
                    onChange={(e) =>
                      setEduModal({
                        ...eduModal,
                        data: { ...eduModal.data, degree: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. Diploma in Computer Science & Engineering (CSE)"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    required
                    value={eduModal.data.institution || ""}
                    onChange={(e) =>
                      setEduModal({
                        ...eduModal,
                        data: { ...eduModal.data, institution: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. AMDA Institute of Engineering & Technology"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={eduModal.data.location || ""}
                    onChange={(e) =>
                      setEduModal({
                        ...eduModal,
                        data: { ...eduModal.data, location: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. Dhaka, Bangladesh"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Period / Years
                  </label>
                  <input
                    type="text"
                    required
                    value={eduModal.data.period || ""}
                    onChange={(e) =>
                      setEduModal({
                        ...eduModal,
                        data: { ...eduModal.data, period: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. 2020 – 2024"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    CGPA / Result Score
                  </label>
                  <input
                    type="text"
                    value={eduModal.data.cgpa || ""}
                    onChange={(e) => {
                      const newCgpa = e.target.value;
                      setEduModal({
                        ...eduModal,
                        data: {
                          ...eduModal.data,
                          cgpa: newCgpa,
                          detail:
                            newCgpa && (!eduModal.data.detail || eduModal.data.detail.startsWith("CGPA"))
                              ? `CGPA ${newCgpa} · ${eduModal.data.status || "Graduated"}`
                              : eduModal.data.detail,
                        },
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. 3.85 / 4.00 or 3.80 / 4.00"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Status Badge Text
                  </label>
                  <input
                    type="text"
                    value={eduModal.data.status || ""}
                    onChange={(e) =>
                      setEduModal({
                        ...eduModal,
                        data: { ...eduModal.data, status: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. Distinction — Top 5%, Active Student, Completed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Status Badge Theme
                  </label>
                  <select
                    value={eduModal.data.statusType || "active"}
                    onChange={(e) =>
                      setEduModal({
                        ...eduModal,
                        data: {
                          ...eduModal.data,
                          statusType: e.target.value as "distinction" | "active" | "completed",
                        },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="distinction">Distinction (Amber / Gold)</option>
                    <option value="active">Active / In Progress (Emerald / Green)</option>
                    <option value="completed">Completed (Sky / Cyan)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Academic Status Summary (Shown in cards)
                  </label>
                  <input
                    type="text"
                    value={eduModal.data.detail || ""}
                    onChange={(e) =>
                      setEduModal({
                        ...eduModal,
                        data: { ...eduModal.data, detail: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. CGPA 3.85 / 4.00 · Graduated with Distinction"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Overview & Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={eduModal.data.description || ""}
                  onChange={(e) =>
                    setEduModal({
                      ...eduModal,
                      data: { ...eduModal.data, description: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Describe the curriculum, technical emphasis, and degree focus..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Key Coursework (Separate each with commas or newlines)
                </label>
                <textarea
                  rows={3}
                  value={eduModal.data.coursework ? eduModal.data.coursework.join("\n") : ""}
                  onChange={(e) =>
                    setEduModal({
                      ...eduModal,
                      data: {
                        ...eduModal.data,
                        coursework: e.target.value
                          .split(/\n|,/)
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent font-mono text-xs"
                  placeholder="Data Structures & Algorithms&#10;Relational Database Design & SQL&#10;Python & Web Engineering"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Academic Highlights & Honors (One per line)
                </label>
                <textarea
                  rows={3}
                  value={eduModal.data.highlights ? eduModal.data.highlights.join("\n") : ""}
                  onChange={(e) =>
                    setEduModal({
                      ...eduModal,
                      data: {
                        ...eduModal.data,
                        highlights: e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent font-mono text-xs"
                  placeholder="Graduated with Distinction, ranking Top 5%&#10;Led Capstone Project on Automated ERP Software"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/80">
                <button
                  type="button"
                  onClick={() => setEduModal({ ...eduModal, isOpen: false })}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-shine rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 shadow-md"
                >
                  {eduModal.isEdit ? "Save Changes" : "Add Degree"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Settings & User Management Modal */}
      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onLogout={handleLogout}
      />
        </>
      )}
    </div>
  );
}
