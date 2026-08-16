"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import authService from "@/services/auth";
import Breadcrumbs from "@/components/common/Breadcrumbs";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  // Password Strength Calculator
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) {
      return {
        score: 0,
        label: "Empty",
        color: "bg-gray-200",
        rules: { min8Chars: false, hasUpper: false, hasNumber: false, hasSpecial: false },
        passedCount: 0,
        isWeak: true,
      };
    }

    const min8Chars = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    let score = 0;
    if (min8Chars) score += 30;
    if (hasUpper) score += 25;
    if (hasNumber) score += 25;
    if (hasSpecial) score += 20;

    const rules = { min8Chars, hasUpper, hasNumber, hasSpecial };
    const passedCount = [min8Chars, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    const isWeak = score < 55 || passedCount < 3;

    let label = "Weak";
    let color = "bg-red-500";

    if (!isWeak) {
      if (score >= 80 || passedCount === 4) {
        label = "Strong & Secure";
        color = "bg-[#0E6875]";
      } else {
        label = "Medium / Fair";
        color = "bg-amber-400";
      }
    }

    return { score, label, color, rules, passedCount, isWeak };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (passwordStrength.isWeak) {
      setError("Password is too weak. Please meet at least 3 security rules (Min 8 chars, uppercase, number, or special char) to continue.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (confirmPassword !== newPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token.trim(), newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      const responseMsg = err.response?.data?.message;
      const msg = Array.isArray(responseMsg)
        ? responseMsg[0]
        : responseMsg || "Failed to reset password. Token may be expired or invalid.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const customBreadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Student Sign In", href: "/login" },
    { label: "Reset Password" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF0E9]/30 text-gray-800 font-sans selection:bg-[#0E6875] selection:text-white flex flex-col justify-between">
      <main className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Ambient Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#0E6875]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Page Top Breadcrumbs */}
        <div className="w-full max-w-md mb-4 relative z-10 flex justify-start">
          <Breadcrumbs customItems={customBreadcrumbItems} />
        </div>

        <div className="w-full max-w-md relative z-10 my-auto">
          {!isSuccess ? (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-10 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-2xl mx-auto border border-[#0E6875]/20 shadow-xs">
                  <i className="fa-solid fa-lock" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1C2B2D] tracking-tight">
                  Set New Password
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Create a strong, secure password for your account
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-600 flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-red-500 shrink-0 text-sm" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reset Token Input (if missing from query) */}
                {!searchParams.get("token") && (
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold text-gray-700">Reset Token</label>
                    <input
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste reset token here"
                      className="w-full px-4 py-3 bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                    />
                  </div>
                )}

                {/* New Password Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-700">New Password</label>
                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 upper, 1 number"
                      className="w-full pl-10 pr-10 py-3 bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 text-sm cursor-pointer"
                    >
                      <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                    </button>
                  </div>

                  {/* Password Strength Indicator & Checklist */}
                  {newPassword && (
                    <div className="space-y-2 pt-2">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-gray-500 flex justify-between items-center">
                        <span>Password Strength:</span>
                        <span
                          className={`font-extrabold px-2 py-0.5 rounded-md ${
                            passwordStrength.isWeak
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-teal-50 text-[#0E6875] border border-teal-200"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>

                      {/* Requirements Checklist */}
                      <div className="bg-[#FAF0E9]/60 rounded-xl p-3 border border-gray-200/80 space-y-1.5 text-[11px]">
                        <p className="font-extrabold text-gray-700 text-[10px] uppercase tracking-wider">
                          Security Rules (Meet at least 3):
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 font-semibold">
                          <div className={`flex items-center gap-1.5 ${passwordStrength.rules.min8Chars ? "text-emerald-700" : "text-gray-400"}`}>
                            <i className={`fa-solid ${passwordStrength.rules.min8Chars ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-red-400"}`} />
                            <span>Min 8 characters</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordStrength.rules.hasUpper ? "text-emerald-700" : "text-gray-400"}`}>
                            <i className={`fa-solid ${passwordStrength.rules.hasUpper ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-red-400"}`} />
                            <span>Uppercase (A-Z)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordStrength.rules.hasNumber ? "text-emerald-700" : "text-gray-400"}`}>
                            <i className={`fa-solid ${passwordStrength.rules.hasNumber ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-red-400"}`} />
                            <span>Number (0-9)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordStrength.rules.hasSpecial ? "text-emerald-700" : "text-gray-400"}`}>
                            <i className={`fa-solid ${passwordStrength.rules.hasSpecial ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-red-400"}`} />
                            <span>Special (!@#$)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-700">Confirm New Password</label>
                  <div className="relative">
                    <i className="fa-solid fa-shield-check absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-linear-to-r from-[#0C4E58] to-[#0E6875] hover:from-[#093c44] hover:to-[#0C4E58] active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold rounded-2xl transition-all shadow-lg shadow-[#0E6875]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-spinner animate-spin text-teal-200" />
                      <span>Updating Password...</span>
                    </div>
                  ) : (
                    <>
                      <i className="fa-solid fa-check-double text-teal-200" />
                      <span>Save New Password & Sign In</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer Switcher */}
              <div className="text-center pt-2 text-xs text-gray-500 font-medium border-t border-gray-100">
                Back to{" "}
                <Link href="/login" className="text-[#0E6875] font-extrabold hover:underline">
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            /* Success Confirmation Screen */
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-4xl mx-auto border-4 border-white shadow-xl">
                <i className="fa-solid fa-circle-check" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#1C2B2D]">Password Updated Successfully!</h2>
                <p className="text-gray-500 text-xs sm:text-sm font-medium max-w-sm mx-auto">
                  Your password has been securely updated. You can now sign in to your student workspace using your new password.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0E6875] hover:bg-[#0C4E58] text-white text-xs sm:text-sm font-extrabold rounded-2xl transition-all shadow-md shadow-[#0E6875]/20"
                >
                  <i className="fa-solid fa-right-to-bracket text-teal-200" />
                  <span>Sign In to Your Account</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
