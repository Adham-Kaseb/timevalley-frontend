"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from "@/services/auth";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    if (step !== "code") return;
    setTimeLeft(100);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    } else if (!emailDomainRegex.test(email.trim())) {
      setError("Please enter a valid email address (e.g. user@gmail.com).");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotPassword(email.trim());
      setSuccessMessage(
        res.message || "A 6-digit security code (expires in 100s) has been sent to your email."
      );
      setStep("code");
      setTimeLeft(100);
    } catch (err: any) {
      const responseMsg = err.response?.data?.message;
      const msg = Array.isArray(responseMsg)
        ? responseMsg[0]
        : responseMsg || "Failed to send reset code. Please check your backend connection.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim() || code.trim().length !== 6) {
      setError("Please enter the 6-digit security code sent to your email.");
      return;
    }

    if (timeLeft === 0) {
      setError("Verification code has expired (100s limit reached). Please click Resend Code.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyResetCode(email.trim(), code.trim());
      if (res.token) {
        router.push(`/reset-password?token=${encodeURIComponent(res.token)}`);
      } else {
        setError("Invalid reset token received.");
      }
    } catch (err: any) {
      const responseMsg = err.response?.data?.message;
      const msg = Array.isArray(responseMsg)
        ? responseMsg[0]
        : responseMsg || "Invalid code or code expired. Please request a new code.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const customBreadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Student Sign In", href: "/login" },
    { label: "Forgot Password" },
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
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-10 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-2xl mx-auto border border-[#0E6875]/20 shadow-xs">
                <i className="fa-solid fa-key" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C2B2D] tracking-tight">
                {step === "email" ? "Restore Password" : "Enter Verification Code"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {step === "email"
                  ? "Enter your email address to receive a 6-digit verification code"
                  : `We sent a 6-digit code to ${email}`}
              </p>
            </div>

            {/* Error / Alert */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-600 flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation text-red-500 shrink-0 text-sm" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Info */}
            {successMessage && step === "code" && (
              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs font-semibold text-[#0E6875] flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-[#0E6875] shrink-0 text-sm" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Step 1: Request OTP Code */}
            {step === "email" && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-700">Email Address</label>
                  <div className="relative">
                    <i className="fa-solid fa-envelope absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-linear-to-r from-[#0C4E58] to-[#0E6875] hover:from-[#093c44] hover:to-[#0C4E58] active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold rounded-2xl transition-all shadow-lg shadow-[#0E6875]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-spinner animate-spin text-teal-200" />
                      <span>Sending Verification Code...</span>
                    </div>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-teal-200" />
                      <span>Send 6-Digit Code</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Enter 6-Digit Code */}
            {step === "code" && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center px-1 mb-1">
                    <label className="block text-xs font-extrabold text-gray-700">
                      6-Digit Security Code
                    </label>
                    <div className="text-[11px] font-extrabold flex items-center gap-1">
                      {timeLeft > 0 ? (
                        <span className="text-[#0E6875] bg-[#E6F3F5] px-2 py-0.5 rounded-full border border-[#0E6875]/20">
                          ⏱️ Expires in {timeLeft}s
                        </span>
                      ) : (
                        <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                          ⚠️ Code Expired
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="839201"
                    className="w-full py-3 text-center tracking-[0.5em] font-mono font-black text-2xl bg-[#FAF0E9]/60 border border-[#0E6875]/40 rounded-2xl text-[#0E6875] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || timeLeft === 0}
                  className="w-full py-3.5 bg-linear-to-r from-[#0C4E58] to-[#0E6875] hover:from-[#093c44] hover:to-[#0C4E58] active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold rounded-2xl transition-all shadow-lg shadow-[#0E6875]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-spinner animate-spin text-teal-200" />
                      <span>Verifying Code...</span>
                    </div>
                  ) : (
                    <>
                      <i className="fa-solid fa-shield-check text-teal-200" />
                      <span>Verify Code & Reset Password</span>
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="font-bold text-[#0E6875] hover:underline cursor-pointer"
                  >
                    ← Change Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCode()}
                    disabled={loading}
                    className="font-extrabold text-[#0E6875] hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  >
                    <i className="fa-solid fa-rotate-right" />
                    <span>Resend Code</span>
                  </button>
                </div>
              </form>
            )}

            {/* Footer Link */}
            <div className="text-center pt-2 text-xs text-gray-500 font-medium border-t border-gray-100">
              Remembered your password?{" "}
              <Link href="/login" className="text-[#0E6875] font-extrabold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
