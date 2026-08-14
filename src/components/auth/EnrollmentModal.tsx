"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import authService from "@/services/auth";

export default function EnrollmentModal() {
  const { isEnrollModalOpen, closeEnrollModal, initialModalView, setAuthUser, login, register, user, isLoggedIn } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<"check" | "signin" | "signup" | "creating" | "success">("check");
  const [creationStep, setCreationStep] = useState<number>(1);
  const [creationProgress, setCreationProgress] = useState<number>(0);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [signInErrors, setSignInErrors] = useState<{ email?: string; password?: string }>({});

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+20");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpTrack, setSignUpTrack] = useState("Venture Architect & Founder Diploma");
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

  // Reset or set initial view when modal opens
  useEffect(() => {
    if (isEnrollModalOpen) {
      if (isLoggedIn) {
        setView("success");
      } else {
        setView(initialModalView);
      }
      setSignInErrors({});
      setSignUpErrors({});
      const savedEmail = authService.getRememberedEmail();
      if (savedEmail) {
        setSignInEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [isEnrollModalOpen, initialModalView, isLoggedIn]);

  if (!isEnrollModalOpen) return null;

  // Calculate Password Strength Score (0 to 100)
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "Empty", color: "bg-gray-200" };
    if (pass.length >= 8) score += 30;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    if (score < 55) return { score, label: "Weak", color: "bg-red-400" };
    if (score < 80) return { score, label: "Fair", color: "bg-amber-400" };
    return { score, label: "Strong & Secure", color: "bg-[#0E6875]" };
  };

  const passwordStrength = calculatePasswordStrength(signUpPassword);

  // Validate Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signInEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(signInEmail.trim())) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com).";
    }

    if (!signInPassword) {
      errors.password = "Password is required.";
    } else if (signInPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setSignInErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        authService.setRememberedEmail(signInEmail.trim(), rememberMe);
        const result = await authService.login({ email: signInEmail.trim(), password: signInPassword });
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
          login(signInEmail, signInEmail.split("@")[0]);
        }
        setView("success");
      } catch (err: any) {
        const responseMessage = err.response?.data?.message;
        const msg = Array.isArray(responseMessage) ? responseMessage[0] : (responseMessage || "Login failed. Please check backend status.");
        setSignInErrors({ password: msg });
      }
    }
  };

  // Validate Sign Up
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!signUpName.trim()) {
      errors.name = "Full name is required.";
    } else if (signUpName.trim().length < 3) {
      errors.name = "Name must be at least 3 characters.";
    }

    if (!signUpEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(signUpEmail.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!signUpPhone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (signUpPhone.trim().length < 7) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (!signUpPassword) {
      errors.password = "Password is required.";
    } else if (signUpPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
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
      // Transition into demonstrative account creation animation view
      setView("creating");
      setCreationStep(1);
      setCreationProgress(25);

      try {
        // Step 1 Animation delay: Encrypting
        await new Promise((res) => setTimeout(res, 500));
        setCreationStep(2);
        setCreationProgress(65);

        // Send register request to backend
        const fullPhone = `${countryCode} ${signUpPhone.trim()}`;
        const result = await authService.register({
          name: signUpName.trim(),
          email: signUpEmail.trim(),
          password: signUpPassword,
          phone: fullPhone,
        });

        // Step 3 Animation: JWT Token & Profile Finalizing
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
          register({
            name: signUpName.trim(),
            email: signUpEmail.trim(),
            phone: `${countryCode} ${signUpPhone.trim()}`,
          });
        }
        setView("success");
      } catch (err: any) {
        console.error("Registration error:", err);
        setView("signup");
        const responseMessage = err.response?.data?.message;
        let msg = "Registration failed. Please make sure backend is running on http://localhost:3001.";
        if (Array.isArray(responseMessage)) {
          msg = responseMessage[0];
        } else if (typeof responseMessage === 'string') {
          msg = responseMessage;
        } else if (err.message) {
          msg = err.message;
        }
        setSignUpErrors({ email: msg });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Glassmorphic Modal Body with Smooth Height & Pop Animation */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 sm:p-7 max-h-[92vh] sm:max-h-[88vh] overflow-y-auto no-scrollbar animate-modal-pop transition-all duration-300 my-auto">
        
        {/* Close Modal Button */}
        <button
          onClick={closeEnrollModal}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 flex items-center justify-center transition-all cursor-pointer z-20"
          aria-label="Close Modal"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* VIEW 1: ACCOUNT CHECK SELECTION */}
        {view === "check" && (
          <div key="check" className="text-center space-y-6 py-2 animate-slide-left">
            <div className="w-16 h-16 rounded-2xl bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-3xl mx-auto border border-[#0E6875]/20 shadow-xs group-hover:rotate-6 transition-transform duration-300">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>

            <div>
              <span className="text-[#0E6875] text-xs font-extrabold tracking-widest uppercase">
                TimeValley Student Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2B2D] tracking-tight mt-1">
                Do you have an account?
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm font-medium mt-2 max-w-sm mx-auto">
                Sign in to your student workspace or create a new account to enroll in 120-Hour Venture Building Diplomas.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Option A: Already Have Account */}
              <button
                onClick={() => setView("signin")}
                className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white p-4 rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all duration-200 flex items-center justify-between group cursor-pointer border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-right-to-bracket"></i>
                  </div>
                  <div className="text-left">
                    <div>Yes, I already have an account</div>
                    <div className="text-[11px] text-white/80 font-normal">Sign in with email & password</div>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-xs group-hover:translate-x-1.5 transition-transform duration-300"></i>
              </button>

              {/* Option B: Create New Account */}
              <button
                onClick={() => setView("signup")}
                className="w-full bg-[#FAF0E9] hover:bg-[#F3E2D8] border border-[#EDA296]/40 text-[#1C2B2D] p-4 rounded-2xl text-sm font-extrabold shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-98 transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EDA296] text-white flex items-center justify-center text-base shadow-xs group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-user-plus"></i>
                  </div>
                  <div className="text-left">
                    <div>No, I'm new - Create Account</div>
                    <div className="text-[11px] text-gray-500 font-normal">Register & enroll in 2 minutes</div>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-xs text-gray-400 group-hover:translate-x-1.5 transition-transform duration-300"></i>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: SIGN IN FORM */}
        {view === "signin" && (
          <div key="signin" className="space-y-4 pb-4 animate-slide-right">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
              <button
                onClick={() => setView("check")}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-90 hover:-translate-x-0.5 text-gray-600 flex items-center justify-center text-xs transition-all duration-200 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">Sign In to Your Account</h2>
                <p className="text-xs text-gray-500 font-medium">Welcome back to TimeValley Studio</p>
              </div>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700">Email Address</label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                      signInErrors.email ? "border-red-400 bg-red-50/50" : "border-gray-200"
                    }`}
                  />
                </div>
                {signInErrors.email && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-1">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{signInErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-extrabold text-gray-700">Password</label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Password reset instructions have been sent to your email!");
                    }}
                    className="text-[11px] font-bold text-[#0E6875] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-3 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                      signInErrors.password ? "border-red-400 bg-red-50/50" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 text-sm"
                  >
                    <i className={`fa-solid ${showSignInPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
                {signInErrors.password && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-1">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{signInErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#0E6875] focus:ring-[#0E6875] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs text-gray-600 font-semibold cursor-pointer">
                  Remember me on this browser
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Sign In & Continue</span>
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-gray-500 font-medium">
              Don't have an account?{" "}
              <button onClick={() => setView("signup")} className="text-[#0E6875] font-extrabold hover:underline">
                Create an account
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: SIGN UP FORM */}
        {view === "signup" && (
          <div key="signup" className="space-y-3.5 pb-6 animate-slide-right">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
              <button
                onClick={() => setView("check")}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-90 hover:-translate-x-0.5 text-gray-600 flex items-center justify-center text-xs transition-all duration-200 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-[#1C2B2D]">Create Student Account</h2>
                <p className="text-xs text-gray-500 font-medium">Join the 120-Hour Venture Building Cohort</p>
              </div>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700">Full Name</label>
                <div className="relative">
                  <i className="fa-solid fa-user absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Sarah Mansoor"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                      signUpErrors.name ? "border-red-400 bg-red-50/50" : "border-gray-200"
                    }`}
                  />
                </div>
                {signUpErrors.name && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{signUpErrors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700">Email Address</label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                      signUpErrors.email ? "border-red-400 bg-red-50/50" : "border-gray-200"
                    }`}
                  />
                </div>
                {signUpErrors.email && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{signUpErrors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number with Country Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700">Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[#FAF0E9]/50 border border-gray-200 rounded-2xl px-3 py-2.5 text-xs font-extrabold text-[#1C2B2D] focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  >
                    {/* Egypt First */}
                    <option value="+20">🇪🇬 EG (+20)</option>
                    {/* Arab Countries */}
                    <option value="+966">🇸🇦 SA (+966)</option>
                    <option value="+971">🇦🇪 AE (+971)</option>
                    <option value="+965">🇰🇼 KW (+965)</option>
                    <option value="+974">🇶🇦 QA (+974)</option>
                    <option value="+973">🇧🇭 BH (+973)</option>
                    <option value="+968">🇴🇲 OM (+968)</option>
                    <option value="+962">🇯🇴 JO (+962)</option>
                    <option value="+961">🇱🇧 LB (+961)</option>
                    <option value="+964">🇮🇶 IQ (+964)</option>
                    <option value="+970">🇵🇸 PS (+970)</option>
                    <option value="+963">🇸🇾 SY (+963)</option>
                    <option value="+967">🇾🇪 YE (+967)</option>
                    <option value="+249">🇸🇩 SD (+249)</option>
                    <option value="+218">🇱🇾 LY (+218)</option>
                    <option value="+216">🇹🇳 TN (+216)</option>
                    <option value="+213">🇩ℤ DZ (+213)</option>
                    <option value="+212">🇲🇦 MA (+212)</option>
                    <option value="+222">🇲🇷 MR (+222)</option>
                    <option value="+252">🇸🇴 SO (+252)</option>
                    <option value="+253">🇩🇯 DJ (+253)</option>
                    <option value="+269">🇰🇲 KM (+269)</option>
                    {/* International */}
                    <option value="+1">🇺🇸 US (+1)</option>
                    <option value="+44">🇬🇧 UK (+44)</option>
                  </select>

                  <div className="relative flex-1">
                    <i className="fa-solid fa-phone absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="50 123 4567"
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                        signUpErrors.phone ? "border-red-400 bg-red-50/50" : "border-gray-200"
                      }`}
                    />
                  </div>
                </div>
                {signUpErrors.phone && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{signUpErrors.phone}</span>
                  </p>
                )}
              </div>



              {/* Password Input with Strength Meter */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700">Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 upper, 1 number"
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                      signUpErrors.password ? "border-red-400 bg-red-50/50" : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700 text-sm"
                  >
                    <i className={`fa-solid ${showSignUpPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>

                {/* Password Strength Indicator Bar */}
                {signUpPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 flex justify-between">
                      <span>Password Strength:</span>
                      <span className="font-extrabold text-[#0E6875]">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}

                {signUpErrors.password && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{signUpErrors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-gray-700">Confirm Password</label>
                <div className="relative">
                  <i className="fa-solid fa-shield-check absolute left-3.5 top-3.5 text-gray-400 text-sm"></i>
                  <input
                    type="password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF0E9]/50 border rounded-2xl text-xs font-semibold text-[#1C2B2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E6875] ${
                      signUpErrors.confirmPassword ? "border-red-400 bg-red-50/50" : "border-gray-200"
                    }`}
                  />
                </div>
                {signUpErrors.confirmPassword && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 mt-0.5">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{signUpErrors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Terms Checkbox Container */}
              <div className="space-y-1 pt-1">
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    agreeTerms
                      ? "bg-[#E6F3F5]/80 border-[#0E6875]/40 shadow-xs"
                      : signUpErrors.terms
                      ? "bg-red-50/50 border-red-300"
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
                    <i className="fa-solid fa-check text-[10px] font-bold"></i>
                  </div>
                  
                  <div className="text-xs text-gray-700 font-semibold leading-relaxed">
                    I agree to TimeValley's{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        alert("Terms of Service: All 120-Hour Venture Building courses, LMS materials, and advisory services are governed by TimeValley terms.");
                      }}
                      className="text-[#0E6875] font-extrabold hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    &{" "}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        alert("Privacy Policy: TimeValley respects student privacy and protects user data in accordance with international standards.");
                      }}
                      className="text-[#0E6875] font-extrabold hover:underline"
                    >
                      Privacy Policy
                    </a>.
                  </div>
                </div>

                {signUpErrors.terms && (
                  <p className="text-[11px] font-extrabold text-red-500 flex items-center gap-1 pl-1 pt-0.5">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{signUpErrors.terms}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Complete Registration & Enroll</span>
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-gray-500 font-medium">
              Already have an account?{" "}
              <button onClick={() => setView("signin")} className="text-[#0E6875] font-extrabold hover:underline">
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* VIEW: DEMONSTRATIVE ACCOUNT CREATION ANIMATION */}
        {view === "creating" && (
          <div key="creating" className="text-center py-6 space-y-6 animate-fadeIn">
            {/* Spinning Core Ring & Icon */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Outer Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#0E6875]/20 border-t-[#0E6875] animate-spin" />
              {/* Inner Dashed Ring */}
              <div className="absolute inset-2 rounded-full border-4 border-dashed border-teal-400/40 animate-spin" style={{ animationDirection: "reverse", animationDuration: "6s" }} />
              {/* Center Glow Icon */}
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#0E6875] to-teal-400 text-white flex items-center justify-center text-3xl shadow-xl shadow-teal-900/30">
                {creationStep === 1 && <i className="fa-solid fa-user-shield animate-bounce"></i>}
                {creationStep === 2 && <i className="fa-solid fa-bolt-lightning text-amber-300 animate-pulse"></i>}
                {creationStep === 3 && <i className="fa-solid fa-key text-teal-100 animate-pulse"></i>}
              </div>
            </div>

            {/* Step Header */}
            <div>
              <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold px-3.5 py-1 rounded-full border border-[#0E6875]/20 inline-block uppercase tracking-wider">
                Step {creationStep} of 3 • Creating Student Account
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C2B2D] mt-3">
                {creationStep === 1 && "Encrypting Credentials & Password..."}
                {creationStep === 2 && "Provisioning Student Workspace..."}
                {creationStep === 3 && "Issuing JWT Token & Profile Setup..."}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
                Setting up your TimeValley workspace for <span className="font-bold text-[#0E6875]">{signUpName || "you"}</span>...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-2 pt-1">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200 shadow-inner">
                <div
                  className="h-full bg-linear-to-r from-[#0E6875] via-teal-400 to-[#0E6875] rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${creationProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500 px-1">
                <span>0%</span>
                <span className="text-[#0E6875] font-extrabold">{creationProgress}% Completed</span>
                <span>100%</span>
              </div>
            </div>

            {/* Step Features Checklist */}
            <div className="grid grid-cols-3 gap-2 pt-2 max-w-md mx-auto text-left text-xs">
              <div className={`p-3 rounded-xl border transition-all ${creationStep >= 1 ? "bg-[#E6F3F5] border-[#0E6875]/40 text-[#0E6875]" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
                <i className="fa-solid fa-shield-halved mb-1 block text-sm"></i>
                <span className="font-extrabold block">Bcrypt Security</span>
                <span className="text-[10px] opacity-75">Password Hashed</span>
              </div>
              <div className={`p-3 rounded-xl border transition-all ${creationStep >= 2 ? "bg-[#E6F3F5] border-[#0E6875]/40 text-[#0E6875]" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
                <i className="fa-solid fa-database mb-1 block text-sm"></i>
                <span className="font-extrabold block">SQLite DB</span>
                <span className="text-[10px] opacity-75">User Provisioned</span>
              </div>
              <div className={`p-3 rounded-xl border transition-all ${creationStep >= 3 ? "bg-[#E6F3F5] border-[#0E6875]/40 text-[#0E6875]" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
                <i className="fa-solid fa-key mb-1 block text-sm"></i>
                <span className="font-extrabold block">JWT Session</span>
                <span className="text-[10px] opacity-75">Token Issued</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: ENROLLMENT SUCCESS */}
        {view === "success" && (
          <div key="success" className="text-center space-y-6 py-4 animate-modal-pop">
            <div className="w-20 h-20 rounded-full bg-[#E6F3F5] text-[#0E6875] flex items-center justify-center text-4xl mx-auto border-4 border-white shadow-xl">
              <i className="fa-solid fa-circle-check"></i>
            </div>

            <div>
              <span className="bg-[#E6F3F5] text-[#0E6875] text-xs font-extrabold px-4 py-1.5 rounded-full inline-block border border-[#0E6875]/20">
                Official Student Credentials Created
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2B2D] tracking-tight mt-3">
                Welcome, {user?.name || "Student"}!
              </h2>

              <p className="text-gray-600 text-xs sm:text-sm font-medium mt-1">
                You are successfully enrolled in the 120-Hour Diploma Program.
              </p>
            </div>

            {/* Student ID Card */}
            <div className="bg-[#FAF0E9] border border-[#EDA296]/30 rounded-2xl p-4 text-left space-y-2 shadow-xs">
              <div className="flex justify-between items-center text-xs font-extrabold text-[#0E6875]">
                <span>Student ID:</span>
                <span className="font-mono text-sm text-[#EDA296]">{user?.studentId || "TV-STD-88492"}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 font-semibold">
                <span>Account Email:</span>
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  closeEnrollModal();
                  router.push("/diplomas?tab=lessons");
                }}
                className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Diploma Workspace</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>

              <button
                onClick={closeEnrollModal}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Return to Browsing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
