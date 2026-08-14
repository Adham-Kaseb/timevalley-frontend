"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "@/services/auth";
import { User } from "@/types";
import { getSocket, joinUserRoom, joinAdminRoom, disconnectSocket } from "@/services/socket";
import RealtimeNotificationToast, { RealtimeAccessEvent } from "@/components/common/RealtimeNotificationToast";

export interface UserSession {
  id?: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  studentId?: string;
  hasDiplomaAccess?: boolean;
  hasPurchasedDiploma?: boolean;
  enrolledAt?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  isEnrollModalOpen: boolean;
  openEnrollModal: (initialView?: "check" | "signin" | "signup") => void;
  closeEnrollModal: () => void;
  initialModalView: "check" | "signin" | "signup";
  setAuthUser: (user: UserSession) => void;
  login: (email: string, name?: string) => void;
  register: (data: { name: string; email: string; phone?: string }) => void;
  markDiplomaPurchased: () => void;
  logout: () => void;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Synchronously initialize user from stored session on render frame 1 (zero flash!)
  const [user, setUser] = useState<UserSession | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = authService.getStoredUser();
      if (savedUser) {
        return {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          phone: savedUser.phone,
          bio: savedUser.bio,
          avatar: savedUser.avatar,
          hasPurchasedDiploma: savedUser.role === "SUPER_ADMIN" || savedUser.hasPurchasedDiploma || false,
          studentId: `TV-STD-${savedUser.id ? savedUser.id.substring(0, 5).toUpperCase() : "MEMBER"}`,
        };
      }
    }
    return null;
  });

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [initialModalView, setInitialModalView] = useState<"check" | "signin" | "signup">("check");
  const [realtimeEvent, setRealtimeEvent] = useState<RealtimeAccessEvent | null>(null);

  // Restore user session from authService / localStorage on mount and verify with backend
  useEffect(() => {
    if (typeof window === "undefined") return;
    const initializeAuth = async () => {
      try {
        const savedUser = authService.getStoredUser();
        const token = authService.getToken();
        if (savedUser && !user) {
          setUser({
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
            phone: savedUser.phone,
            bio: savedUser.bio,
            avatar: savedUser.avatar,
            hasPurchasedDiploma: savedUser.role === "SUPER_ADMIN" || savedUser.hasPurchasedDiploma || false,
            studentId: `TV-STD-${savedUser.id ? savedUser.id.substring(0, 5).toUpperCase() : "MEMBER"}`,
          });
        }
        if (token) {
          const liveUser = await authService.getMe();
          if (liveUser) {
            setUser({
              id: liveUser.id,
              name: liveUser.name,
              email: liveUser.email,
              role: liveUser.role,
              phone: liveUser.phone,
              bio: liveUser.bio,
              avatar: liveUser.avatar,
              hasPurchasedDiploma: liveUser.hasPurchasedDiploma || false,
              studentId: `TV-STD-${liveUser.id ? liveUser.id.substring(0, 5).toUpperCase() : "MEMBER"}`,
            });
          }
        }
      } catch (e) {
        console.error("Failed to load user session", e);
      } finally {
        setIsAuthLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Real-time WebSocket connection & diploma access sync
  useEffect(() => {
    if (typeof window === "undefined" || !user?.id) return;

    // Join socket room for current user
    joinUserRoom(user.id);
    if (user.role === "SUPER_ADMIN") {
      joinAdminRoom();
    }

    const socket = getSocket();

    const handleAccessUpdate = (payload: RealtimeAccessEvent) => {
      console.log("⚡ [Realtime Access Event Received]:", payload);

      if (payload.userId === user.id) {
        const isGranted = payload.status === "ACTIVE" || payload.hasDiplomaAccess;

        // 1. Update React user session state in real-time
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            hasPurchasedDiploma: isGranted,
          };
        });

        // 2. Persist updated status in local storage
        const stored = authService.getStoredUser();
        if (stored) {
          authService.setStoredUser({
            ...stored,
            hasDiplomaAccess: isGranted,
            hasPurchasedDiploma: isGranted,
          });
        }

        // 3. Trigger Realtime Notification Toast
        setRealtimeEvent({ ...payload, type: "diploma" });
      }
    };

    const handleModuleAccessUpdate = (payload: RealtimeAccessEvent) => {
      console.log("⚡ [Realtime Module Access Event Received]:", payload);
      if (payload.userId === user.id) {
        setRealtimeEvent({
          ...payload,
          type: "module",
        });
      }
    };

    const handleCustomAssignment = (payload: RealtimeAccessEvent) => {
      console.log("⚡ [Realtime Assignment Event Received]:", payload);
      if (payload.userId === user.id) {
        setRealtimeEvent({
          ...payload,
          type: "assignment",
        });
      }
    };

    socket.on("diploma_access_updated", handleAccessUpdate);
    socket.on("module_access_updated", handleModuleAccessUpdate);
    socket.on("custom_assignment_created", handleCustomAssignment);

    return () => {
      socket.off("diploma_access_updated", handleAccessUpdate);
      socket.off("module_access_updated", handleModuleAccessUpdate);
      socket.off("custom_assignment_created", handleCustomAssignment);
    };
  }, [user?.id, user?.role]);

  const openEnrollModal = (view: "check" | "signin" | "signup" = "check") => {
    setInitialModalView(view);
    setIsEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    setIsEnrollModalOpen(false);
  };

  const setAuthUser = (userData: UserSession) => {
    const formattedUser: UserSession = {
      ...userData,
      studentId: userData.studentId || `TV-STD-${userData.id ? userData.id.substring(0, 5).toUpperCase() : "MEMBER"}`,
      enrolledAt: userData.enrolledAt || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setUser(formattedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("timevalley_user_session", JSON.stringify(formattedUser));
    }
  };

  const login = (email: string, name: string = "Valued Student") => {
    const session: UserSession = {
      name: user?.name || name,
      email,
      studentId: user?.studentId || `TV-STD-${Math.floor(10000 + Math.random() * 90000)}`,
      enrolledAt: user?.enrolledAt || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setUser(session);
    if (typeof window !== "undefined") {
      localStorage.setItem("timevalley_user_session", JSON.stringify(session));
    }
  };

  const register = (data: { name: string; email: string; phone?: string }) => {
    const session: UserSession = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      studentId: `TV-STD-${Math.floor(10000 + Math.random() * 90000)}`,
      enrolledAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setUser(session);
    if (typeof window !== "undefined") {
      localStorage.setItem("timevalley_user_session", JSON.stringify(session));
    }
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutProgress, setLogoutProgress] = useState(0);
  const [logoutStepText, setLogoutStepText] = useState("Syncing workspace data...");

  const logout = async () => {
    setIsLoggingOut(true);
    setLogoutProgress(25);
    setLogoutStepText("Syncing workspace data...");
    await new Promise((res) => setTimeout(res, 350));

    setLogoutProgress(65);
    setLogoutStepText("Clearing secure auth tokens...");
    await new Promise((res) => setTimeout(res, 400));

    setLogoutProgress(100);
    setLogoutStepText("Session closed successfully!");
    await new Promise((res) => setTimeout(res, 350));

    authService.logout();
    setUser(null);
    setIsLoggingOut(false);
    setLogoutProgress(0);
  };

  const markDiplomaPurchased = () => {
    if (!user) return;
    const updatedUser: UserSession = {
      ...user,
      hasPurchasedDiploma: true,
    };
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("timevalley_user_session", JSON.stringify(updatedUser));
      const stored = authService.getStoredUser();
      if (stored) {
        authService.setStoredUser({ ...stored, hasPurchasedDiploma: true });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthLoading,
        isEnrollModalOpen,
        openEnrollModal,
        closeEnrollModal,
        initialModalView,
        setAuthUser,
        login,
        register,
        markDiplomaPurchased,
        logout,
        isLoggingOut,
      }}
    >
      {children}

      {/* Live Real-time Access Grant Toast Banner */}
      <RealtimeNotificationToast
        event={realtimeEvent}
        onClose={() => setRealtimeEvent(null)}
      />

      {/* Premium Glassmorphism Sign Out Animated Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#052328]/80 backdrop-blur-xl animate-fadeIn">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0E6875]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Glassmorphism Card */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 max-w-sm w-full border border-white/60 shadow-[0_25px_70px_rgba(14,104,117,0.35)] text-center space-y-6 relative z-10">
            {/* Animated Multi-Ring Icon Badge */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {/* Outer Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#0E6875]/20 border-t-[#0E6875] border-r-teal-400 animate-spin" />
              {/* Soft Pulse Glow */}
              <div className="absolute inset-2 rounded-full bg-[#E6F3F5] animate-ping opacity-25" />
              {/* Center Emblem */}
              <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#0C4E58] to-[#0E6875] text-white flex items-center justify-center text-2xl shadow-lg relative z-10">
                <i className="fa-solid fa-right-from-bracket text-teal-200"></i>
              </div>
            </div>

            {/* Header Text */}
            <div className="space-y-1.5">
              <span className="bg-[#E6F3F5] text-[#0E6875] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#0E6875]/20">
                TimeValley Security
              </span>
              <h3 className="text-xl font-black text-gray-900 pt-1">Signing Out...</h3>
              <p className="text-xs text-gray-500 font-medium h-4 transition-all">
                {logoutStepText}
              </p>
            </div>

            {/* Smooth Gradient Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200 shadow-inner">
                <div
                  className="h-full bg-linear-to-r from-[#0E6875] via-teal-400 to-[#0E6875] rounded-full transition-all duration-300 ease-out shadow-xs"
                  style={{ width: `${logoutProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-400">
                <span>SAFE LOGOUT</span>
                <span className="text-[#0E6875] font-extrabold">{logoutProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
