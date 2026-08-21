"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/auth";
import CountryPhoneInput from "@/components/common/CountryPhoneInput";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuthUser, register: registerContextUser } = useAuth();

  const [view, setView] = useState<"signup" | "creating" | "success">("signup");
  const [creationStep, setCreationStep] = useState<number>(1);
  const [creationProgress, setCreationProgress] = useState<number>(0);

  // Form State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+20");
  const [customCountryCode, setCustomCountryCode] = useState("+");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // Password Strength Calculator
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) {
      return {
        score: 0,
        label: "Empty",
        color: "bg-gray-200",
        rules: {
          min8Chars: false,
          hasUpper: false,
          hasNumber: false,
          hasSpecial: false,
        },
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
    const passedCount = [min8Chars, hasUpper, hasNumber, hasSpecial].filter(
      Boolean,
    ).length;
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

  const passwordStrength = calculatePasswordStrength(signUpPassword);

  // Validate & Submit Registration
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!signUpName.trim()) {
      errors.name = "Full name is required.";
    } else if (signUpName.trim().length < 3) {
      errors.name = "Name must be at least 3 characters.";
    }

    if (!signUpEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailDomainRegex.test(signUpEmail.trim())) {
      errors.email =
        "Please enter a valid email address with a domain (e.g. user@gmail.com).";
    }

    if (!signUpPhone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (signUpPhone.trim().length < 7) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!signUpPassword) {
      errors.password = "Password is required.";
    } else if (passwordStrength.isWeak) {
      errors.password =
        "Password is too weak. Please meet at least 3 security rules (Min 8 chars, uppercase, number, or special char) to continue.";
    }

    if (!signUpConfirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (signUpConfirmPassword !== signUpPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      errors.terms = "You must agree to the Terms of Service & Privacy Policy.";
    }

    setSignUpErrors(errors);

    if (Object.keys(errors).length === 0) {
      setView("creating");
      setCreationStep(1);
      setCreationProgress(25);

      try {
        await new Promise((res) => setTimeout(res, 500));
        setCreationStep(2);
        setCreationProgress(65);

        const effectiveCode =
          countryCode === "OTHER"
            ? customCountryCode.trim() || "+"
            : countryCode;
        const fullPhone = `${effectiveCode} ${signUpPhone.trim()}`;

        const result = await authService.register({
          name: signUpName.trim(),
          email: signUpEmail.trim(),
          password: signUpPassword,
          phone: fullPhone,
        });

        setCreationStep(3);
        setCreationProgress(100);
        await new Promise((res) => setTimeout(res, 600));

        if (result.user) {
          setAuthUser({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            phone: result.user.phone || fullPhone,
          });
        } else {
          registerContextUser({
            name: signUpName.trim(),
            email: signUpEmail.trim(),
            phone: fullPhone,
          });
        }
        setView("success");
      } catch (err: any) {
        console.error("Registration error:", err);
        setView("signup");
        const responseMessage = err.response?.data?.message;
        let msg =
          "Registration failed. Please make sure backend is running on http://localhost:3001.";
        if (Array.isArray(responseMessage)) {
          msg = responseMessage[0];
        } else if (typeof responseMessage === "string") {
          msg = responseMessage;
        } else if (err.message) {
          msg = err.message;
        }
        setSignUpErrors({ email: msg });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF0E9]/30 text-gray-800 font-sans selection:bg-[#0E6875] selection:text-white flex flex-col justify-between">
      <main className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Ambient Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#0E6875]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Page Top Breadcrumbs */}
        <div className="w-full max-w-xl mb-4 relative z-10 flex justify-start">
          <Breadcrumbs />
        </div>

        <div className="w-full max-w-xl relative z-10 my-auto">
          {view === "signup" && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-10 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-2xl mx-auto border border-[#0E6875]/20 shadow-xs">
                  <i className="fa-solid fa-graduation-cap" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1C2B2D] tracking-tight">
                  Create Student Account
                </h1>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-user absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. user full name"
                      className={`w-full pl-10 pr-4 py-3 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                        signUpErrors.name
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {signUpErrors.name && (
                    <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                      <i className="fa-solid fa-circle-exclamation" />
                      <span>{signUpErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-envelope absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="user@gmail.com"
                      className={`w-full pl-10 pr-4 py-3 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                        signUpErrors.email
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {signUpErrors.email && (
                    <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                      <i className="fa-solid fa-circle-exclamation" />
                      <span>{signUpErrors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-700">
                    Phone Number
                  </label>
                  <CountryPhoneInput
                    countryCode={countryCode}
                    setCountryCode={setCountryCode}
                    phone={signUpPhone}
                    setPhone={setSignUpPhone}
                    customCode={customCountryCode}
                    setCustomCode={setCustomCountryCode}
                    placeholder="1123456789"
                    error={signUpErrors.phone}
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 upper, 1 number"
                      className={`w-full pl-10 pr-10 py-3 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                        signUpErrors.password
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 text-sm cursor-pointer"
                    >
                      <i
                        className={`fa-solid ${showSignUpPassword ? "fa-eye-slash" : "fa-eye"}`}
                      />
                    </button>
                  </div>

                  {/* Password Strength Indicator & Checklist */}
                  {signUpPassword && (
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
                          <div
                            className={`flex items-center gap-1.5 ${passwordStrength.rules.min8Chars ? "text-emerald-700" : "text-gray-400"}`}
                          >
                            <i
                              className={`fa-solid ${passwordStrength.rules.min8Chars ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-red-400"}`}
                            />
                            <span>Min 8 characters</span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${passwordStrength.rules.hasUpper ? "text-emerald-700" : "text-gray-400"}`}
                          >
                            <i
                              className={`fa-solid ${passwordStrength.rules.hasUpper ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-red-400"}`}
                            />
                            <span>Uppercase (A-Z)</span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${passwordStrength.rules.hasNumber ? "text-emerald-700" : "text-gray-400"}`}
                          >
                            <i
                              className={`fa-solid ${passwordStrength.rules.hasNumber ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-red-400"}`}
                            />
                            <span>Number (0-9)</span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${passwordStrength.rules.hasSpecial ? "text-emerald-700" : "text-gray-400"}`}
                          >
                            <i
                              className={`fa-solid ${passwordStrength.rules.hasSpecial ? "fa-circle-check text-emerald-600" : "fa-circle-xmark text-red-400"}`}
                            />
                            <span>Special (!@#$)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {signUpErrors.password && (
                    <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                      <i className="fa-solid fa-circle-exclamation" />
                      <span>{signUpErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-extrabold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-shield-check absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="password"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className={`w-full pl-10 pr-4 py-3 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                        signUpErrors.confirmPassword
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {signUpErrors.confirmPassword && (
                    <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                      <i className="fa-solid fa-circle-exclamation" />
                      <span>{signUpErrors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                {/* Terms Agreement Checkbox (REQUIRED) */}
                <div className="space-y-1 pt-1">
                  <div
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                      agreeTerms
                        ? "bg-[#E6F3F5]/80 border-[#0E6875]/40 shadow-xs"
                        : signUpErrors.terms || !agreeTerms
                          ? "bg-amber-50/60 border-amber-300 hover:bg-amber-50"
                          : "bg-[#FAF0E9]/60 hover:bg-[#FAF0E9] border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                        agreeTerms
                          ? "bg-[#0E6875] border-[#0E6875] text-white shadow-xs scale-105"
                          : "bg-white border-gray-300 text-transparent"
                      }`}
                    >
                      <i className="fa-solid fa-check text-[10px] font-bold" />
                    </div>

                    <div className="text-xs text-gray-700 font-semibold leading-relaxed">
                      I agree to TimeValley's{" "}
                      <Link
                        href="/terms"
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#0E6875] font-extrabold hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      &{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#0E6875] font-extrabold hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      . <span className="text-red-500 font-black ml-0.5">*</span>{" "}
                      <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded-md">
                        Required
                      </span>
                    </div>
                  </div>
                  {!agreeTerms && (
                    <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1 mt-0.5 pl-1">
                      <i className="fa-solid fa-circle-info text-amber-500" />
                      <span>Check this box to accept terms and enable registration.</span>
                    </p>
                  )}
                  {signUpErrors.terms && (
                    <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5 pl-1">
                      <i className="fa-solid fa-circle-exclamation" />
                      <span>{signUpErrors.terms}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!agreeTerms}
                  className="w-full py-3.5 bg-linear-to-r from-[#0C4E58] to-[#0E6875] hover:from-[#093c44] hover:to-[#0C4E58] active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold rounded-2xl transition-all shadow-lg shadow-[#0E6875]/25 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
                >
                  <i className="fa-solid fa-user-plus text-teal-200" />
                  <span>Complete Registration & Enroll</span>
                </button>
              </form>

              {/* Footer Switcher */}
              <div className="text-center pt-2 text-xs text-gray-500 font-medium">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#0E6875] font-extrabold hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Creation Animation View */}
          {view === "creating" && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center space-y-6">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-[#0E6875]/20 border-t-[#0E6875] border-r-teal-400 animate-spin" />
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#0E6875] to-teal-400 text-white flex items-center justify-center text-3xl shadow-xl shadow-teal-900/30">
                  {creationStep === 1 && (
                    <i className="fa-solid fa-user-shield animate-bounce" />
                  )}
                  {creationStep === 2 && (
                    <i className="fa-solid fa-bolt-lightning text-amber-300 animate-pulse" />
                  )}
                  {creationStep === 3 && (
                    <i className="fa-solid fa-key text-teal-100 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">
                  {creationStep === 1 && "Encrypting & Validating Account..."}
                  {creationStep === 2 && "Provisioning Student Environment..."}
                  {creationStep === 3 && "Issuing JWT Token & Profile Setup..."}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Setting up your TimeValley workspace for{" "}
                  <span className="font-bold text-[#0E6875]">
                    {signUpName || "you"}
                  </span>
                  ...
                </p>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                  <div
                    className="h-full bg-linear-to-r from-[#0E6875] via-teal-400 to-[#0E6875] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${creationProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-500 px-1">
                  <span>0%</span>
                  <span className="text-[#0E6875] font-extrabold">
                    {creationProgress}% Completed
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Confirmation View */}
          {view === "success" && (
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-4xl mx-auto border-4 border-white shadow-xl">
                <i className="fa-solid fa-circle-check" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#1C2B2D]">
                  Account Created Successfully!
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm font-medium max-w-sm mx-auto">
                  Welcome to TimeValley Studio,{" "}
                  <span className="font-bold text-[#0E6875]">
                    {signUpName || "Student"}
                  </span>
                  !
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/workspace"
                  className="px-6 py-3 bg-[#0E6875] hover:bg-[#0C4E58] text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-[#0E6875]/20"
                >
                  Go to Student Workspace
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold rounded-2xl transition-all"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
