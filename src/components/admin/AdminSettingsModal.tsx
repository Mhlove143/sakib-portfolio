import React, { useState, useEffect, type FormEvent } from "react";
import {
  X,
  Settings,
  UserPlus,
  Users,
  KeyRound,
  ShieldCheck,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
  AlertCircle,
  Database,
  Mail,
  User,
  RefreshCw,
  Copy,
  Check,
  Server,
  Download,
  Palette,
  Moon,
} from "lucide-react";
import { usePortfolio, type AdminUser, type AdminRole } from "@/context/PortfolioContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

type SettingsTab = "users" | "create" | "password" | "appearance" | "system";

export function AdminSettingsModal({ isOpen, onClose, onLogout }: AdminSettingsModalProps) {
  const { theme, setTheme, themes } = useTheme();
  const {
    adminUsers,
    currentUser,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    changeUserPassword,
    resetUserPassword,
    isFirebaseConnected,
    isSyncing,
    contactMessages,
    projects,
    services,
    experiences,
    skillCategories,
    educationList,
    exportDataJson,
  } = usePortfolio();

  const isSuperAdmin =
    currentUser?.role === "superadmin" || currentUser?.username === "mhlove143";
  const isEditor = currentUser?.role === "editor";
  const isAdmin = currentUser?.role === "admin";

  const [activeTab, setActiveTab] = useState<SettingsTab>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New User Form State (Super Admin Only)
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "admin" as AdminRole,
    password: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Filter visible admin users based on actor permissions
  const visibleAdminUsers = adminUsers.filter((u) => {
    if (isSuperAdmin) return true;
    if (isAdmin) return u.role !== "superadmin"; // Super Admin is completely hidden from Administrators
    if (isEditor) return u.id === currentUser?.id; // Editor only sees own account
    return false;
  });

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    targetUserId: currentUser?.id || visibleAdminUsers[0]?.id || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Quick reset password modal / state
  const [resetModalUser, setResetModalUser] = useState<AdminUser | null>(null);
  const [resetDirectPass, setResetDirectPass] = useState("");
  const [showResetPass, setShowResetPass] = useState(false);

  // Copied feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Keep targetUserId valid if permissions or users change
  useEffect(() => {
    if (currentUser?.id) {
      setPasswordForm((prev) => ({
        ...prev,
        targetUserId: currentUser.id,
      }));
    } else if (visibleAdminUsers.length > 0) {
      setPasswordForm((prev) => ({
        ...prev,
        targetUserId: visibleAdminUsers[0].id,
      }));
    }
  }, [currentUser?.id, visibleAdminUsers.length]);

  // Tab guard: if tab is restricted for current role, reset to "users"
  useEffect(() => {
    if (isEditor && (activeTab === "create" || activeTab === "system")) {
      setActiveTab("users");
    }
  }, [isEditor, activeTab]);

  if (!isOpen) return null;

  // Generate strong random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUserForm((prev) => ({
      ...prev,
      password: pass,
      confirmPassword: pass,
    }));
    toast.success(`Generated strong password: ${pass}`);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard!");
  };

  // Handle Create User (Super Admin can create any, Administrator can create Editor)
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin && !isAdmin) {
      toast.error("Permission denied: You do not have permission to create user accounts.");
      return;
    }
    if (isAdmin && newUserForm.role !== "editor") {
      toast.error("Permission denied: Administrators can only create Content Editor accounts.");
      return;
    }
    if (newUserForm.password !== newUserForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newUserForm.password.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    setIsSubmitting(true);
    const res = await addAdminUser({
      name: newUserForm.name,
      username: newUserForm.username,
      email: newUserForm.email,
      role: isAdmin ? "editor" : newUserForm.role,
      passwordPlain: newUserForm.password,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(`User "${newUserForm.name}" created successfully!`);
      setNewUserForm({
        name: "",
        username: "",
        email: "",
        role: isAdmin ? "editor" : "admin",
        password: "",
        confirmPassword: "",
      });
      setActiveTab("users");
    } else {
      toast.error(res.error || "Failed to create user.");
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      toast.error("New password must be at least 4 characters.");
      return;
    }

    // For editor, always target their own account
    const targetId = isEditor
      ? currentUser?.id
      : passwordForm.targetUserId || currentUser?.id || visibleAdminUsers[0]?.id;

    if (!targetId) {
      toast.error("Target user account not found.");
      return;
    }

    const targetUser = adminUsers.find((u) => u.id === targetId);
    if (!targetUser) {
      toast.error("User not found.");
      return;
    }

    // Super Admin Protection: Non-superadmins cannot modify Super Admin credentials
    if (targetUser.role === "superadmin" && !isSuperAdmin) {
      toast.error("Permission denied: Super Admin credentials cannot be modified by other users.");
      return;
    }

    // Admin can only change own or editor's password
    if (isAdmin && targetUser.role === "admin" && targetUser.id !== currentUser?.id) {
      toast.error("Permission denied: You can only modify your own account or Content Editor accounts.");
      return;
    }

    // Editor can only change own password
    if (isEditor && targetUser.id !== currentUser?.id) {
      toast.error("Permission denied: You can only change your own password.");
      return;
    }

    setIsSubmitting(true);
    const res = await changeUserPassword(
      targetId,
      passwordForm.currentPassword,
      passwordForm.newPassword
    );
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Password updated successfully!");
      setPasswordForm({
        targetUserId: currentUser?.id || visibleAdminUsers[0]?.id || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(res.error || "Failed to update password. Please check your current password.");
    }
  };

  // Handle Direct Reset Password
  const handleDirectReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!resetModalUser) return;

    if (resetModalUser.role === "superadmin" && !isSuperAdmin) {
      toast.error("Permission denied: Super Admin accounts cannot be reset by other users.");
      return;
    }

    if (isAdmin && resetModalUser.role !== "editor" && resetModalUser.id !== currentUser?.id) {
      toast.error("Permission denied: Administrators can only reset passwords for Content Editors.");
      return;
    }

    if (isEditor && resetModalUser.id !== currentUser?.id) {
      toast.error("Permission denied: Content Editors cannot reset passwords.");
      return;
    }

    if (!resetDirectPass || resetDirectPass.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    setIsSubmitting(true);
    const res = await resetUserPassword(resetModalUser.id, resetDirectPass);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(`Password for @${resetModalUser.username} updated!`);
      setResetModalUser(null);
      setResetDirectPass("");
    } else {
      toast.error(res.error || "Failed to reset password.");
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (user: AdminUser) => {
    if (user.role === "superadmin" && !isSuperAdmin) {
      toast.error("Permission denied: Super Admin accounts cannot be deleted by other users.");
      return;
    }

    if (isAdmin && user.role !== "editor") {
      toast.error("Permission denied: Administrators can only delete Content Editor accounts.");
      return;
    }

    if (isEditor) {
      toast.error("Permission denied: Content Editors cannot delete user accounts.");
      return;
    }

    if (user.role === "superadmin" && adminUsers.filter((u) => u.role === "superadmin").length <= 1) {
      toast.error("Cannot delete the primary Super Administrator account.");
      return;
    }

    const confirmMsg = `Are you sure you want to permanently delete user @${user.username} (${user.name})?`;
    if (window.confirm(confirmMsg)) {
      setIsSubmitting(true);
      const res = await deleteAdminUser(user.id);
      setIsSubmitting(false);

      if (res.success) {
        toast.success(`User @${user.username} deleted successfully.`);
        if (currentUser?.id === user.id && onLogout) {
          onLogout();
        }
      } else {
        toast.error(res.error || "Failed to delete user.");
      }
    }
  };

  const filteredUsers = visibleAdminUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab definitions according to active role
  const settingsTabs = [
    {
      id: "users" as SettingsTab,
      label: isEditor ? "My Account" : `User List (${visibleAdminUsers.length})`,
      icon: isEditor ? User : Users,
    },
    ...(!isEditor
      ? [
          {
            id: "create" as SettingsTab,
            label: isSuperAdmin ? "Create User" : "Add Editor",
            icon: UserPlus,
          },
        ]
      : []),
    { id: "password" as SettingsTab, label: "Change Password", icon: KeyRound },
    { id: "appearance" as SettingsTab, label: "Theme & Colors", icon: Palette },
    ...(!isEditor
      ? [{ id: "system" as SettingsTab, label: "System & Cloud", icon: Server }]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex h-[90vh] max-h-[820px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border/90 bg-card text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/80 bg-muted/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-accent/25">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sora text-lg font-black tracking-tight text-foreground">
                  {isEditor ? "Editor Account Settings" : "Admin & User Settings"}
                </h2>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isSuperAdmin
                    ? "bg-emerald-500/15 text-emerald-500"
                    : isAdmin
                    ? "bg-cyan-500/15 text-cyan-500"
                    : "bg-purple-500/15 text-purple-500"
                }`}>
                  {isSuperAdmin ? "Super Admin Access" : isAdmin ? "Administrator Access" : "Content Editor Access"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isEditor
                  ? "Manage your credentials and view your content editing permissions."
                  : "Manage authorized user accounts, security passwords & cloud database status."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Close Settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex shrink-0 gap-2 border-b border-border/80 bg-muted/10 px-6 py-2.5 overflow-x-auto">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: USERS LIST & INFO */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Current Logged-in User Card */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${
                      currentUser?.avatarBg || "from-emerald-500 to-teal-700"
                    } text-xl font-black text-white shadow-lg`}>
                      {currentUser?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-sora text-base font-extrabold text-foreground">
                          {currentUser?.name || "Sakib Sardar"}
                        </h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border ${
                          currentUser?.role === "superadmin"
                            ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                            : currentUser?.role === "admin"
                            ? "bg-cyan-500/20 text-cyan-500 border-cyan-500/30"
                            : "bg-purple-500/20 text-purple-500 border-purple-500/30"
                        }`}>
                          {currentUser?.role === "superadmin" ? "Super Admin" : currentUser?.role === "admin" ? "Administrator" : "Content Editor"}
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <UserCheck className="h-3 w-3" />
                          Current Session
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          @{currentUser?.username || "user"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-accent" />
                          {currentUser?.email || "user@example.com"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPasswordForm((prev) => ({
                          ...prev,
                          targetUserId: currentUser?.id || visibleAdminUsers[0]?.id || "",
                        }));
                        setActiveTab("password");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-xs font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* EDITOR SPECIFIC OVERVIEW (NO OTHER USERS VISIBLE) */}
              {isEditor ? (
                <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-purple-500" />
                    <h3 className="font-sora text-sm font-bold text-foreground">
                      Assigned Editor Privileges
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    As a Content Editor, you have focused permissions to update and maintain the following core sections in the portfolio CMS:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
                    {[
                      { title: "Experience", count: experiences.length, desc: "Work history & roles" },
                      { title: "Skills", count: skillCategories.reduce((acc, c) => acc + c.skills.length, 0), desc: "Technical categories & badges" },
                      { title: "Projects", count: projects.length, desc: "Showcase items & GitHub links" },
                      { title: "Services", count: services.length, desc: "Offerings & pricing features" },
                      { title: "Education", count: educationList.length, desc: "Academic degrees & honors" },
                    ].map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-border/70 bg-muted/20 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-sora text-xs font-bold text-foreground">{item.title}</span>
                          <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-500">
                            {item.count} items
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-accent shrink-0" />
                    <span>User management, core personal identity, CV upload, and cloud system settings are restricted to Administrators.</span>
                  </div>
                </div>
              ) : (
                /* ADMIN & SUPER ADMIN USER DIRECTORY */
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-sora text-sm font-bold text-foreground">
                        {isSuperAdmin ? `Registered Users (${visibleAdminUsers.length})` : `Team Members & Editors (${visibleAdminUsers.length})`}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isSuperAdmin
                          ? "All users authorized to log in and manage the portfolio CMS."
                          : "Manage Content Editors and view your administrator profile."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className="w-56 rounded-xl border border-border/80 bg-muted/30 px-3.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                      />
                      {!isEditor && (
                        <button
                          onClick={() => {
                            if (isAdmin) {
                              setNewUserForm((prev) => ({ ...prev, role: "editor" }));
                            }
                            setActiveTab("create");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>{isSuperAdmin ? "Add New" : "Add Editor"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Users Grid */}
                  <div className="grid gap-3">
                    {filteredUsers.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center">
                        <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
                        <p className="mt-2 text-xs font-bold text-muted-foreground">No users found matching your search.</p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => {
                        const isSelf = currentUser?.id === user.id;
                        const userIsSuperAdmin = user.role === "superadmin";
                        const canResetThisUser = isSuperAdmin || (isAdmin && user.role === "editor");
                        const canDeleteThisUser =
                          (isSuperAdmin && !userIsSuperAdmin) ||
                          (isAdmin && user.role === "editor");

                        return (
                          <div
                            key={user.id}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-4 transition-all hover:border-accent/40"
                          >
                            <div className="flex items-center gap-3.5">
                              <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${
                                  user.avatarBg || "from-primary to-accent"
                                } font-sora text-sm font-black text-white shadow-sm`}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-sora text-sm font-bold text-foreground">{user.name}</h4>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                                      user.role === "superadmin"
                                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                                        : user.role === "admin"
                                        ? "bg-cyan-500/15 text-cyan-500 border border-cyan-500/30"
                                        : "bg-purple-500/15 text-purple-500 border border-purple-500/30"
                                    }`}
                                  >
                                    {user.role === "superadmin" ? "Super Admin" : user.role === "admin" ? "Administrator" : "Content Editor"}
                                  </span>
                                  {isSelf && (
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-mono text-foreground/80">@{user.username}</span>
                                  <span>•</span>
                                  <span>{user.email}</span>
                                  {user.createdAt && (
                                    <>
                                      <span>•</span>
                                      <span className="text-[11px]">
                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyText(`Username: ${user.username}\nEmail: ${user.email}`, user.id)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Copy user details"
                              >
                                {copiedId === user.id ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>

                              {/* Reset Password Button */}
                              {canResetThisUser && (
                                <button
                                  onClick={() => {
                                    setResetModalUser(user);
                                    setResetDirectPass("");
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                                  title="Reset password for this user"
                                >
                                  <KeyRound className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Reset Pass</span>
                                </button>
                              )}

                              {/* Delete User Button */}
                              {canDeleteThisUser && (
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 transition-colors hover:bg-rose-500/20"
                                  title="Delete user account"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE USER (SUPER ADMIN & ADMINISTRATOR) */}
          {activeTab === "create" && !isEditor && (
            <div className="mx-auto max-w-xl space-y-6">
              <div>
                <h3 className="font-sora text-base font-extrabold text-foreground">
                  {isSuperAdmin ? "Create New Administrator / CMS User" : "Add New Content Editor"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isSuperAdmin
                    ? "Add a new teammate with specific privileges to help manage your portfolio content."
                    : "Create a new Content Editor account who can manage Experience, Skills, Projects, Services & Education."}
                </p>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 rounded-2xl border border-border/80 bg-muted/10 p-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder={isSuperAdmin ? "e.g. Content Team Member or Admin" : "e.g. Content Editor Name"}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserForm.username}
                      onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value.toLowerCase().trim() })}
                      placeholder="e.g. editor_team"
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Role / Privilege Level *
                    </label>
                    {isSuperAdmin ? (
                      <select
                        value={newUserForm.role}
                        onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as AdminRole })}
                        className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                      >
                        <option value="editor">Content Editor (Experience, Skills, Projects, Services, Education)</option>
                        <option value="admin">Administrator (CMS, Inquiries & Content Management)</option>
                        <option value="superadmin">Super Administrator (Full System & User Control)</option>
                      </select>
                    ) : (
                      <div className="mt-1.5 flex h-[42px] items-center rounded-xl border border-border/80 bg-muted/40 px-4 text-xs font-semibold text-foreground">
                        <span className="flex items-center gap-1.5 text-purple-400">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Content Editor (Assigned)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value.trim() })}
                    placeholder="e.g. team@example.com"
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Initial Password *
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Generate Strong</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      placeholder="Minimum 4 characters"
                      className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Confirm Password *
                    </label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newUserForm.confirmPassword}
                      onChange={(e) => setNewUserForm({ ...newUserForm, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>{isSubmitting ? "Creating User..." : isSuperAdmin ? "Create User Account" : "Create Editor Account"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: CHANGE PASSWORD */}
          {activeTab === "password" && (
            <div className="mx-auto max-w-xl space-y-6">
              <div>
                <h3 className="font-sora text-base font-extrabold text-foreground">
                  Security & Password Management
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isEditor
                    ? "Update your password by verifying your current password."
                    : "Change the password for your administrator account or another selected account."}
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 rounded-2xl border border-border/80 bg-muted/10 p-6">
                {!isEditor && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Target Account
                    </label>
                    <select
                      value={passwordForm.targetUserId}
                      onChange={(e) => setPasswordForm({ ...passwordForm, targetUserId: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    >
                      {visibleAdminUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} (@{u.username}) — {u.role === "superadmin" ? "Super Admin" : u.role === "admin" ? "Administrator" : "Content Editor"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Current Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter your current password"
                      className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        New Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
                          let pass = "";
                          for (let i = 0; i < 10; i++) {
                            pass += chars.charAt(Math.floor(Math.random() * chars.length));
                          }
                          setPasswordForm((p) => ({ ...p, newPassword: pass, confirmPassword: pass }));
                          toast.success(`Generated new password: ${pass}`);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Generate Strong</span>
                      </button>
                    </div>
                    <div className="relative mt-1.5">
                      <input
                        type={showNewPass ? "text" : "password"}
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Confirm New Password *
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter new password"
                        className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-sora text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>{isSubmitting ? "Updating Password..." : "Update Password"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: THEME & APPEARANCE (ALL ROLES) */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-sora text-base font-extrabold text-foreground flex items-center gap-2">
                    <Palette className="h-4 w-4 text-accent" />
                    Portfolio Theme & Color Schemes
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select a color palette for the public portfolio and admin workspace. Changes take effect immediately.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active: {themes.find((t) => t.id === theme)?.name || "Day"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {themes.map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id);
                        toast.success(`Active theme changed to ${t.name}`);
                      }}
                      className={`group relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/40"
                          : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/40"
                      }`}
                    >
                      {/* Theme Preview Swatch */}
                      <div
                        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 shadow-inner overflow-hidden"
                        style={{ backgroundColor: t.previewBg }}
                      >
                        <span
                          className="absolute -right-1 -bottom-1 h-7 w-7 rounded-full border-2 border-white/40 shadow-sm"
                          style={{ backgroundColor: t.previewPrimary }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-sora text-sm font-bold text-foreground">
                            {t.name}
                          </span>
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground shadow-sm">
                              <Check className="h-3 w-3" /> Active
                            </span>
                          ) : (
                            <span className="rounded-full border border-border/70 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground group-hover:border-primary/60 group-hover:text-foreground transition-colors">
                              Click to apply
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {t.description}
                        </p>

                        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-white/30"
                              style={{ backgroundColor: t.previewPrimary }}
                            />
                            <span className="font-medium">Accent Color</span>
                          </div>
                          <span className="text-border">•</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-block h-3 w-3 rounded-full border border-white/30"
                              style={{ backgroundColor: t.previewBg }}
                            />
                            <span className="font-medium">Canvas Background</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-3">
                <Sparkles className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Real-time synchronization: </span>
                  When you switch themes here or from the top navigation bar, the chosen color palette is saved to your browser preferences and immediately updates across all public pages, modals, and the admin CMS.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM & CLOUD OVERVIEW (ADMIN & SUPER ADMIN ONLY) */}
          {activeTab === "system" && !isEditor && (
            <div className="space-y-6">
              <div>
                <h3 className="font-sora text-base font-extrabold text-foreground">
                  System Architecture & Database Health
                </h3>
                <p className="text-xs text-muted-foreground">
                  Overview of real-time Firebase Firestore database synchronization and metrics.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-border/80 bg-card p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-bold uppercase">Database Status</span>
                    <Database className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-2 font-sora text-lg font-black text-foreground">
                    {isFirebaseConnected ? "Firestore Cloud" : "Connecting"}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Real-Time Sync</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-bold uppercase">
                      {isSuperAdmin ? "Admin Users" : "Team Members"}
                    </span>
                    <Users className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div className="mt-2 font-sora text-lg font-black text-foreground">
                    {visibleAdminUsers.length} Users
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {isSuperAdmin
                      ? `${adminUsers.filter((u) => u.role === "superadmin").length} Super Admin(s)`
                      : "Authorized CMS users"}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-bold uppercase">Contact Inquiries</span>
                    <Mail className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="mt-2 font-sora text-lg font-black text-foreground">
                    {contactMessages.length} Messages
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Stored in Firestore
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-4">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-bold uppercase">Portfolio Items</span>
                    <ShieldCheck className="h-4 w-4 text-accent" />
                  </div>
                  <div className="mt-2 font-sora text-lg font-black text-foreground">
                    {projects.length + services.length + experiences.length} Items
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Projects, Services, Exp.
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-muted/10 p-5">
                <h4 className="font-sora text-sm font-bold text-foreground">Data Backup & Export</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Generate a complete snapshot JSON file of all portfolio content, services, projects, and metadata.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => {
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
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Full Backup JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Reset Password Sub-Modal */}
        {resetModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div
              className="w-full max-w-md rounded-2xl border border-border/90 bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="h-5 w-5 text-accent" />
                  <h3 className="font-sora text-base font-bold text-foreground">
                    Reset Password for @{resetModalUser.username}
                  </h3>
                </div>
                <button
                  onClick={() => setResetModalUser(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Set a new password for <span className="font-bold text-foreground">{resetModalUser.name}</span>.
              </p>

              <form onSubmit={handleDirectReset} className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-muted-foreground">New Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
                        let pass = "";
                        for (let i = 0; i < 10; i++) {
                          pass += chars.charAt(Math.floor(Math.random() * chars.length));
                        }
                        setResetDirectPass(pass);
                      }}
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      Generate Strong
                    </button>
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      type={showResetPass ? "text" : "password"}
                      required
                      autoFocus
                      value={resetDirectPass}
                      onChange={(e) => setResetDirectPass(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPass(!showResetPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showResetPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalUser(null)}
                    className="rounded-xl border border-border/80 px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Apply New Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
