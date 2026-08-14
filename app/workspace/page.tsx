"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import userService, { Certificate } from "@/services/user";

function WorkspaceContent() {
  const { user, isLoggedIn, isAuthLoading, logout, setAuthUser, openEnrollModal } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "certificates" | "settings">("overview");

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileBio, setProfileBio] = useState(user?.bio || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Certificates State
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Handle Avatar Upload with Client-Side Canvas Image Compression
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const srcData = reader.result as string;

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const base64Data = canvas.toDataURL("image/jpeg", 0.85);

        try {
          const updatedUser = await userService.uploadAvatar(base64Data);
          if (user) {
            setAuthUser({
              ...user,
              name: user.name,
              email: user.email,
              avatar: updatedUser.avatar || base64Data,
            });
          }
          setProfileSuccess("Profile picture updated successfully!");
        } catch (err: any) {
          console.error("Failed to upload avatar", err);
          const msg = err.response?.data?.message || "Failed to upload image. Please try again.";
          setProfileError(msg);
        }
      };
      img.src = srcData;
    };
    reader.readAsDataURL(file);
  };

  // Sync tab from URL query params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "profile" || tabParam === "certificates" || tabParam === "settings") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Sync form inputs when user context updates
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      if (user.phone) setProfilePhone(user.phone);
      if (user.bio) setProfileBio(user.bio);
    }
  }, [user]);

  // Fetch certificates from backend
  useEffect(() => {
    if (isLoggedIn) {
      userService
        .getCertificates()
        .then((certs) => setCertificates(certs))
        .catch((err) => console.warn("Using sample certificates", err));
    }
  }, [isLoggedIn]);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    setProfileSaving(true);

    try {
      const updatedUser = await userService.updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
        bio: profileBio.trim(),
      });

      if (updatedUser) {
        setAuthUser({
          ...user,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || profilePhone,
          bio: updatedUser.bio || profileBio,
        });
      }

      setProfileSuccess("Your profile has been successfully updated!");
    } catch (err: any) {
      console.error("Failed to update profile", err);
      const msg = err.response?.data?.message || err.message || "Failed to update profile. Please try again.";
      setProfileError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await userService.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(res.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Failed to change password", err);
      const msg = err.response?.data?.message || err.message || "Failed to update password. Check your current password.";
      setPasswordError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!mounted || (isAuthLoading && !user)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-2xl border border-[#0E6875]/20 shadow-xs">
            <i className="fa-solid fa-spinner animate-spin"></i>
          </div>
          <span className="text-xs font-extrabold text-gray-600">Loading Student Workspace...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-3xl mx-auto border border-[#0E6875]/20 shadow-xs">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Student Access Required</h2>
          <p className="text-gray-600 text-xs leading-relaxed">
            Please sign in or create a student account to access your TimeValley workspace, profile, and certificates.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => openEnrollModal("signin")}
              className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all block text-center cursor-pointer"
            >
              Sign In to Workspace
            </button>
            <button
              onClick={() => openEnrollModal("signup")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs py-2.5 rounded-xl transition-all block text-center cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      {/* Header Banner Spotlight */}
      <div className="bg-linear-to-r from-[#0C4E58] via-[#0E6875] to-[#148393] text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-lg">
        {/* Soft Background Decorative Shapes */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* User Details */}
          <div className="flex items-center gap-4">
            {/* Interactive Profile Picture Badge with Smooth Hover Overlay */}
            <label className="relative group/avatar shrink-0 cursor-pointer block rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-white/40 hover:border-white" title="Click to Change Profile Picture">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center text-2xl font-black uppercase overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-300" />
                ) : (
                  user?.name ? user.name.substring(0, 2) : "ST"
                )}
              </div>

              {/* Glassmorphism Hover Overlay */}
              <div className="absolute inset-0 bg-black/65 backdrop-blur-xs opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-center p-1">
                <i className="fa-solid fa-camera text-base sm:text-lg mb-0.5 text-teal-300"></i>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight">
                  Change<br />Photo
                </span>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
            <div>
              {(() => {
                const isAdminAcc = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.email === "adhamkasebssj4@gmail.com";
                return (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-widest ${
                        isAdminAcc
                          ? "bg-amber-400/20 text-amber-300 border border-amber-300/40"
                          : "bg-teal-400/20 text-teal-200 border border-teal-300/30"
                      }`}>
                        {isAdminAcc ? "⚡ Higher Admin" : "Verified Student"}
                      </span>
                      <span className="bg-white/10 text-white/90 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                        {isAdminAcc ? "TV-ADM-001" : (user?.studentId || "TV-STD-88492")}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                      Welcome back, {user?.name || "Higher Admin"}!
                    </h1>
                    <p className="text-teal-100/80 text-xs sm:text-sm font-medium mt-0.5">
                      {isAdminAcc
                        ? "Platform Super Admin • Full Access Unlocked"
                        : certificates.length > 0
                        ? "Venture Architect & Founder Diploma (120h)"
                        : "Registered Student • Unenrolled"}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            {(() => {
              const isAdminAcc = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.email === "adhamkasebssj4@gmail.com";
              if (isAdminAcc) {
                return (
                  <>
                    <Link
                      href="/admin"
                      className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <i className="fa-solid fa-shield-halved text-xs"></i>
                      <span>⚡ Super Admin Console</span>
                    </Link>
                    <Link
                      href="/diplomas"
                      className="bg-white hover:bg-gray-100 text-[#0E6875] font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <i className="fa-solid fa-graduation-cap text-xs"></i>
                      <span>Enter Classroom</span>
                    </Link>
                  </>
                );
              }
              return certificates.length > 0 ? (
                <Link
                  href="/diplomas?tab=lessons"
                  className="bg-white hover:bg-gray-100 text-[#0E6875] font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-play text-xs"></i>
                  <span>Enter Classroom</span>
                </Link>
              ) : (
                <button
                  onClick={() => openEnrollModal("signup")}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  title="Enroll in a diploma to unlock classroom access"
                >
                  <i className="fa-solid fa-lock text-xs"></i>
                  <span>Unlock Classroom</span>
                </button>
              );
            })()}

            <button
              onClick={logout}
              className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-400/40 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              title="Sign Out of Workspace"
            >
              <i className="fa-solid fa-right-from-bracket text-xs"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        {(() => {
          const isAdminAcc = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.email === "adhamkasebssj4@gmail.com";
          return (
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg text-teal-200 shrink-0">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                  <span className="text-[10px] text-teal-100 font-extrabold uppercase tracking-wider block">Diplomas</span>
                  <span className="text-base font-extrabold">{isAdminAcc ? "All Unlocked" : certificates.length > 0 ? "1 Active" : "0 Active"}</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg text-teal-200 shrink-0">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div>
                  <span className="text-[10px] text-teal-100 font-extrabold uppercase tracking-wider block">Progress</span>
                  <span className="text-base font-extrabold">{isAdminAcc ? "120 / 120 hrs" : certificates.length > 0 ? "78 / 120 hrs" : "0 / 120 hrs"}</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg text-amber-300 shrink-0">
                  <i className="fa-solid fa-award"></i>
                </div>
                <div>
                  <span className="text-[10px] text-teal-100 font-extrabold uppercase tracking-wider block">Certificates</span>
                  <span className="text-base font-extrabold">{isAdminAcc ? "All Granted" : `${certificates.length} Earned`}</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg text-emerald-300 shrink-0">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <span className="text-[10px] text-teal-100 font-extrabold uppercase tracking-wider block">Status</span>
                  <span className="text-base font-extrabold">{isAdminAcc ? "SUPER_ADMIN" : certificates.length > 0 ? "Good Standing" : "Registered Student"}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#0E6875] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <i className="fa-solid fa-chart-line text-sm"></i>
            <span>Overview & Progress</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-[#0E6875] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <i className="fa-solid fa-user-gear text-sm"></i>
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "certificates"
                ? "bg-[#0E6875] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <i className="fa-solid fa-award text-sm"></i>
            <span>My Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-[#0E6875] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <i className="fa-solid fa-sliders text-sm"></i>
            <span>Account Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & PROGRESS */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            {(() => {
              const isAdminAcc = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.email === "adhamkasebssj4@gmail.com";
              if (isAdminAcc) {
                return (
                  <div className="bg-white rounded-3xl border border-amber-200/80 p-8 sm:p-10 shadow-sm text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto border border-amber-300/40 shadow-xs">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div className="max-w-xl mx-auto space-y-2">
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-300 uppercase tracking-widest">
                        ⚡ Super Admin Console Active
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Welcome, Higher Admin!</h2>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        You have full, unrestricted access to all platform diploma modules, video lessons, user permission management, and content editing dashboards.
                      </p>
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link
                        href="/admin"
                        className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <i className="fa-solid fa-gear text-xs"></i>
                        <span>Open Super Admin Console (/admin)</span>
                      </Link>
                      <Link
                        href="/admin/diplomas"
                        className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <i className="fa-solid fa-graduation-cap text-xs"></i>
                        <span>Open Diploma Builder (/admin/diplomas)</span>
                      </Link>
                    </div>
                  </div>
                );
              }
              return certificates.length === 0 ? (
                /* Unenrolled Empty State Card */
                <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-3xl mx-auto border border-[#0E6875]/20 shadow-xs">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <div className="max-w-xl mx-auto space-y-2">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
                      No Active Diploma Enrolled
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Start Your Venture Architect Journey Today</h2>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                      You are currently registered as a TimeValley student. Enroll in our 120h Venture Architect & Founder Diploma to unlock interactive classrooms, live mentor advisory, and pre-seed advisory.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/diplomas"
                      className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <i className="fa-solid fa-compass text-xs"></i>
                      <span>Explore Diplomas & Enroll</span>
                    </Link>
                    <button
                      onClick={() => openEnrollModal("signup")}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
                    >
                      Enrollment Application
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Diploma Card */
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                      <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold px-3 py-1 rounded-full border border-[#0E6875]/20">
                        Primary Track
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
                        Venture Architect & Founder Diploma (120 Hours)
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        Master problem framing, financial modeling, prototype building, and pre-seed fundraising.
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-gray-400 font-extrabold block uppercase">Overall Progress</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#0E6875]">65%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-6 space-y-2">
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                      <div className="h-full bg-linear-to-r from-[#0E6875] to-teal-400 rounded-full w-[65%] shadow-xs" />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <span>78 Hours Completed</span>
                      <span>42 Hours Remaining</span>
                    </div>
                  </div>

                  {/* Modules Roadmap Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest">Module 1</span>
                        <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm">Market Research & Problem Framing</h4>
                      <p className="text-xs text-gray-600">TAM/SAM calculation, customer interviews, and moat validation.</p>
                    </div>

                    <div className="bg-[#E6F3F5] border border-[#0E6875]/30 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#0E6875] uppercase tracking-widest">Module 2</span>
                        <span className="bg-[#0E6875] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">In Progress</span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm">Financial Modeling & Unit Economics</h4>
                      <p className="text-xs text-gray-600">CAC/LTV ratios, burn rate modeling, and revenue projections.</p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2 opacity-80">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Module 3</span>
                        <i className="fa-solid fa-lock text-gray-400 text-sm"></i>
                      </div>
                      <h4 className="font-extrabold text-gray-800 text-sm">Pitch Deck Architecting & Demo Day</h4>
                      <p className="text-xs text-gray-500">Investor deck design, pitch rehearsals, and pre-seed advisory.</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: MY PROFILE */}
        {activeTab === "profile" && (
          <div className="mt-6 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto animate-fadeIn">
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">Edit Student Profile</h2>
              <p className="text-xs text-gray-500 mt-1">
                Update your personal information, contact details, and founder track.
              </p>
            </div>

            {profileSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-base text-emerald-600"></i>
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-base text-red-500"></i>
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  className="w-full bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed rounded-2xl px-4 py-3 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+20 100 392 0888"
                  className="w-full bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                />
              </div>



              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Entrepreneurial Bio</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {profileSaving ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i>
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: MY CERTIFICATES */}
        {activeTab === "certificates" && (
          <div className="mt-6 space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Earned Diplomas & Certificates</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Official verified credentials issued by TimeValley Institute.
                  </p>
                </div>
                <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold px-3 py-1 rounded-full border border-[#0E6875]/20 self-start sm:self-auto">
                  {certificates.length} Issued Credentials
                </span>
              </div>

              {certificates.length === 0 ? (
                /* Empty Certificates State Card */
                <div className="text-center py-12 px-4 bg-[#FAF0E9]/40 border border-dashed border-[#0E6875]/30 rounded-3xl space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto border border-amber-200">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-lg font-extrabold text-gray-900">No Verified Certificates Yet</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Complete modules in your active diploma program to earn official verified credentials issued by TimeValley Institute.
                    </p>
                  </div>
                  <Link
                    href="/diplomas"
                    className="inline-flex items-center gap-2 bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-compass text-xs"></i>
                    <span>Browse Diplomas</span>
                  </Link>
                </div>
              ) : (
                /* Certificates Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-linear-to-tr from-[#FAF0E9] to-white border border-[#EDA296]/30 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#0E6875] text-white flex items-center justify-center text-xl shadow-md shrink-0">
                          <i className="fa-solid fa-award"></i>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                          Verified
                        </span>
                      </div>

                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base group-hover:text-[#0E6875] transition-colors">
                          {cert.title}
                        </h3>
                        <p className="text-gray-500 text-xs mt-1">
                          Issued to: <span className="font-bold text-gray-800">{user?.name}</span>
                        </p>
                      </div>

                      <div className="bg-white/80 rounded-2xl p-3 border border-gray-200 text-xs space-y-1 font-mono">
                        <div className="flex justify-between text-gray-600">
                          <span>Credential ID:</span>
                          <span className="font-bold text-[#0E6875]">{cert.code}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-[11px]">
                          <span>Issued On:</span>
                          <span>{new Date(cert.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <i className="fa-solid fa-eye text-xs"></i>
                        <span>View Official Certificate</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT SETTINGS */}
        {activeTab === "settings" && (
          <div className="mt-6 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-8 animate-fadeIn">
            {/* Change Password Section */}
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">Security & Password</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Update your password to keep your TimeValley account secure.
                </p>
              </div>

              {passwordSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-base text-emerald-600"></i>
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-3">
                  <i className="fa-solid fa-circle-exclamation text-base text-red-500"></i>
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {passwordSaving ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-key"></i>
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Session & Sign Out Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">Session Management</h3>
              <p className="text-xs text-gray-500 mb-4">
                Manage your active login sessions and sign out of your account.
              </p>

              <button
                onClick={logout}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Sign Out of All Sessions</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-gray-200 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            {/* Printable Certificate Template */}
            <div className="border-8 border-[#0E6875] p-6 text-center space-y-4 rounded-2xl bg-linear-to-tr from-[#FAF0E9]/40 via-white to-teal-50/30 relative">
              <div className="w-16 h-16 rounded-full bg-[#0E6875] text-white flex items-center justify-center text-3xl mx-auto shadow-md">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>

              <div>
                <span className="text-[#0E6875] text-xs font-black tracking-widest uppercase block">
                  TimeValley Institute of Entrepreneurship
                </span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">Official Certificate of Completion</h3>
              </div>

              <p className="text-xs text-gray-600">This is to certify that</p>
              <h4 className="text-xl font-extrabold text-[#0E6875] underline underline-offset-4 font-serif">
                {user?.name}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                has successfully fulfilled all course requirements and demonstrated excellence in
              </p>

              <h5 className="text-base font-extrabold text-gray-900">{selectedCert.title}</h5>

              <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-[10px] font-mono text-gray-500">
                <span>Code: {selectedCert.code}</span>
                <span>Date: {new Date(selectedCert.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert("Downloading official PDF certificate...");
                }}
                className="flex-1 bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-download"></i>
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => setSelectedCert(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6"><i className="fa-solid fa-spinner animate-spin text-3xl text-[#0E6875]"></i></div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
