"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/auth";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthUser, login: loginContextUser, isLoggedIn } = useAuth();

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signInErrors, setSignInErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/workspace");
    }
    const savedEmail = authService.getRememberedEmail();
    if (savedEmail) {
      setSignInEmail(savedEmail);
      setRememberMe(true);
    }
  }, [isLoggedIn, router]);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};

    const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!signInEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailDomainRegex.test(signInEmail.trim())) {
      errors.email =
        "Please enter a valid email address (e.g. user@gmail.com).";
    }

    if (!signInPassword) {
      errors.password = "Password is required.";
    } else if (signInPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setSignInErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        authService.setRememberedEmail(signInEmail.trim(), rememberMe);
        const result = await authService.login({
          email: signInEmail.trim(),
          password: signInPassword,
        });

        if (result.user) {
          setAuthUser({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            phone: result.user.phone,
            bio: result.user.bio,
            avatar: result.user.avatar,
          });
        } else {
          loginContextUser(signInEmail, signInEmail.split("@")[0]);
        }
        router.push("/workspace");
      } catch (err: any) {
        const responseMessage = err.response?.data?.message;
        const msg = Array.isArray(responseMessage)
          ? responseMessage[0]
          : responseMessage ||
            "Login failed. Please check your credentials or backend status.";
        setSignInErrors({ password: msg });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF0E9]/30 text-gray-800 font-sans selection:bg-[#0E6875] selection:text-white flex flex-col justify-between">
      <main className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Ambient Orbs */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#0E6875]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Page Top Breadcrumbs */}
        <div className="w-full max-w-md mb-4 relative z-10 flex justify-start">
          <Breadcrumbs />
        </div>

        <div className="w-full max-w-md relative z-10 my-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-2xl mx-auto border border-[#0E6875]/20 shadow-xs">
                <i className="fa-solid fa-right-to-bracket" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C2B2D] tracking-tight">
                Sign In to Your Account
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className={`w-full pl-10 pr-4 py-3 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                      signInErrors.email
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                {signInErrors.email && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-circle-exclamation" />
                    <span>{signInErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-extrabold text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-bold text-[#0E6875] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-3 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                      signInErrors.password
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 text-sm cursor-pointer"
                  >
                    <i
                      className={`fa-solid ${showSignInPassword ? "fa-eye-slash" : "fa-eye"}`}
                    />
                  </button>
                </div>
                {signInErrors.password && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-circle-exclamation" />
                    <span>{signInErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Branded Remember Me Checkbox */}
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  rememberMe
                    ? "bg-[#E6F3F5]/80 border-[#0E6875]/40 shadow-xs"
                    : "bg-[#FAF0E9]/60 hover:bg-[#FAF0E9] border-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    rememberMe
                      ? "bg-[#0E6875] border-[#0E6875] text-white shadow-xs scale-105"
                      : "bg-white border-gray-300 text-transparent"
                  }`}
                >
                  <i className="fa-solid fa-check text-[10px] font-bold" />
                </div>
                <span className="text-xs text-gray-700 font-semibold">
                  Remember me on this browser
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-linear-to-r from-[#0C4E58] to-[#0E6875] hover:from-[#093c44] hover:to-[#0C4E58] active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold rounded-2xl transition-all shadow-lg shadow-[#0E6875]/25 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-spinner animate-spin text-teal-200" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    <i className="fa-solid fa-[#0E6875] fa-right-to-bracket text-teal-200" />
                    <span>Sign In to Student Workspace</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="text-center pt-2 text-xs text-gray-500 font-medium border-t border-gray-100">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#0E6875] font-extrabold hover:underline"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
