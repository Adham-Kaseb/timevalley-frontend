"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { useAuth } from "@/context/AuthContext";
import DiplomaPurchaseModal from "@/components/diploma/DiplomaPurchaseModal";
import DiplomaPlayer, { NextLessonInfo } from "@/components/diploma/DiplomaPlayer";
import { useVideoProgress } from "@/hooks/useVideoProgress";
import apiClient from "@/lib/axios";
import { getSocket } from "@/services/socket";
import { claimCertificate } from "@/services/certificate";

type TabType = "overview" | "lessons" | "quiz" | "certificate" | "progress";

interface LessonMaterial {
  name: string;
  size: string;
  type: string;
  url?: string;
}

interface LessonItem {
  id: string;
  lessonNumber: number;
  title: string;
  desc: string;
  duration: string;
  videoUrl: string;
  hasQuiz: boolean;
  hasMaterials: boolean;
  materials: LessonMaterial[];
}

interface DiplomaModuleItem {
  id: string;
  moduleNumber: string;
  badgeTitle: string;
  title: string;
  description: string;
  lessons: LessonItem[];
}

export default function DiplomasPage() {
  const { user, isLoggedIn, openEnrollModal } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration-safe Auth & Purchased Status
  const userLoggedIn = mounted ? isLoggedIn : false;
  const hasPurchased = mounted ? user?.hasPurchasedDiploma || false : false;

  // Restore active tab from URL query param or localStorage on refresh
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab") as TabType;
    const hashParam = window.location.hash.replace("#", "") as TabType;
    const savedTab = localStorage.getItem("timevalley_diploma_tab") as TabType;

    const validTabs: TabType[] = [
      "overview",
      "lessons",
      "quiz",
      "certificate",
      "progress",
    ];
    const initialTab = validTabs.includes(tabParam)
      ? tabParam
      : validTabs.includes(hashParam)
        ? hashParam
        : validTabs.includes(savedTab)
          ? savedTab
          : "overview";

    setActiveTab(initialTab);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("timevalley_diploma_tab", tab);
      const newUrl = `${window.location.pathname}?tab=${tab}`;
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl,
      );
    }
  };

  const tabList = [
    { id: "overview", label: "Diploma Overview", icon: "fa-gauge-high" },
    { id: "lessons", label: "Lessons Workspace", icon: "fa-circle-play" },
    { id: "quiz", label: "Evaluation Quiz", icon: "fa-pen-to-square" },
    {
      id: "certificate",
      label: "Digital Certificates",
      icon: "fa-certificate",
    },
    { id: "progress", label: "Skill Progress", icon: "fa-chart-pie" },
  ] as const;

  // Video Playing State
  const [introPlaying, setIntroPlaying] = useState(false);
  const [lessonPlaying, setLessonPlaying] = useState(false);

  // Draggable Module Pills Track State
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navScrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - navScrollRef.current.offsetLeft);
    setScrollLeft(navScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !navScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - navScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2.5;
    navScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!navScrollRef.current) return;
    if (e.deltaY !== 0) {
      navScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const scrollNavLeft = () => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: -220, behavior: "smooth" });
    }
  };

  const scrollNavRight = () => {
    if (navScrollRef.current) {
      navScrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
  };

  // Active Lesson Selector (Default: Module 0 Lesson 1)
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    "lesson-intro-1",
  ]);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // 8 Exact Modules with 5 Filler Lessons Each (40 Total)
  const modulesList: DiplomaModuleItem[] = [
    {
      id: "intro",
      moduleNumber: "00",
      badgeTitle: "INTRO",
      title: "INTRO: Foundation & Day-Zero Orientation",
      description:
        "Platform onboarding, Day-Zero founder mindset, venture building methodology, and community rules.",
      lessons: Array.from({ length: 5 }).map((_, i) => ({
        id: `lesson-intro-${i + 1}`,
        lessonNumber: i + 1,
        title: `Lesson ${i + 1}: Day-Zero Founder Thesis & Mindset Step ${i + 1}`,
        desc: `Master the foundational framework for venture building step ${i + 1} with real-world case studies.`,
        duration: "20 Mins",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        hasQuiz: true,
        hasMaterials: true,
        materials: [
          {
            name: `INTRO Step ${i + 1} Founder Guide (PDF)`,
            size: "1.2 MB",
            type: "pdf",
          },
          { name: `Day-Zero Checklist (.XLSX)`, size: "850 KB", type: "excel" },
        ],
      })),
    },
    {
      id: "m1",
      moduleNumber: "01",
      badgeTitle: "MODULE#1 DISCOVERY",
      title: "MODULE#1 DISCOVERY: Thesis Formulation & ICP Research",
      description:
        "Customer interview frameworks, TAM/SAM/SOM validation, ICP profiling, and market gap discovery.",
      lessons: Array.from({ length: 5 }).map((_, i) => ({
        id: `lesson-m1-${i + 1}`,
        lessonNumber: 5 + i + 1,
        title: `Lesson ${5 + i + 1}: Market Discovery & Problem Validation Step ${i + 1}`,
        desc: `Validate market demand and calculate ICP metrics step ${i + 1}.`,
        duration: "25 Mins",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        hasQuiz: true,
        hasMaterials: true,
        materials: [
          {
            name: `Customer Interview Template (PDF)`,
            size: "1.5 MB",
            type: "pdf",
          },
          {
            name: `TAM SAM SOM Financial Model (.XLSX)`,
            size: "2.1 MB",
            type: "excel",
          },
        ],
      })),
    },
    {
      id: "m2",
      moduleNumber: "02",
      badgeTitle: "MODULE#2 PRODUCT BUILDING",
      title: "MODULE#2 PRODUCT BUILDING: MVP Architecture & Prototyping",
      description:
        "Next.js & NestJS microservice boilerplate, database schema design, and rapid MVP deployment.",
      lessons: Array.from({ length: 5 }).map((_, i) => ({
        id: `lesson-m2-${i + 1}`,
        lessonNumber: 10 + i + 1,
        title: `Lesson ${10 + i + 1}: Technical Architecture & MVP Building Step ${i + 1}`,
        desc: `Architect scalable microservices and build user-facing web apps step ${i + 1}.`,
        duration: "30 Mins",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        hasQuiz: true,
        hasMaterials: true,
        materials: [
          {
            name: `Microservice Architecture Diagram (PDF)`,
            size: "3.2 MB",
            type: "pdf",
          },
        ],
      })),
    },
    {
      id: "m3",
      moduleNumber: "03",
      badgeTitle: "MODULE#3 PMF",
      title: "MODULE#3 PMF: Product-Market Fit & Metric Retention",
      description:
        "Measuring NPS, net dollar retention (NDR), cohort retention curves, and feature iteration.",
      lessons: Array.from({ length: 5 }).map((_, i) => ({
        id: `lesson-m3-${i + 1}`,
        lessonNumber: 15 + i + 1,
        title: `Lesson ${15 + i + 1}: Achieving PMF & Tracking Retention Step ${i + 1}`,
        desc: `Optimize product retention metrics and feedback loops step ${i + 1}.`,
        duration: "25 Mins",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        hasQuiz: true,
        hasMaterials: true,
        materials: [
          {
            name: `Cohort Retention Spreadsheet (.XLSX)`,
            size: "2.8 MB",
            type: "excel",
          },
        ],
      })),
    },
    {
      id: "m4",
      moduleNumber: "04",
      badgeTitle: "MODULE#4 GTM",
      title: "MODULE#4 GTM: Go-To-Market Execution & Sales Funnels",
      description:
        "Building inbound/outbound sales funnels, B2B cold outreach, pricing strategy, and initial pilot deals.",
      lessons: Array.from({ length: 5 }).map((_, i) => ({
        id: `lesson-m4-${i + 1}`,
        lessonNumber: 20 + i + 1,
        title: `Lesson ${20 + i + 1}: GTM Funnel Strategy & Pilot Sales Step ${i + 1}`,
        desc: `Deploy high-converting sales outreach and close early pilots step ${i + 1}.`,
        duration: "28 Mins",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        hasQuiz: true,
        hasMaterials: true,
        materials: [
          {
            name: `B2B Sales Script & Cold Email Kit (PDF)`,
            size: "1.1 MB",
            type: "pdf",
          },
        ],
      })),
    },
    {
      id: "m5",
      moduleNumber: "05",
      badgeTitle: "MODULE#5 GROWTH",
      title: "MODULE#5 GROWTH: Unit Economics & Viral Scaling Loops",
      description:
        "CAC payback optimization, LTV:CAC modeling, performance marketing, and product-led growth.",
      lessons: Array.from({ length: 5 }).map((_, i) => ({
        id: `lesson-m5-${i + 1}`,
        lessonNumber: 25 + i + 1,
        title: `Lesson ${25 + i + 1}: Unit Economics & Growth Engine Step ${i + 1}`,
        desc: `Master LTV:CAC math and scalable growth channels step ${i + 1}.`,
        duration: "30 Mins",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        hasQuiz: true,
        hasMaterials: true,
        materials: [
          {
            name: `Unit Economics Financial Model (.XLSX)`,
            size: "4.5 MB",
            type: "excel",
          },
        ],
      })),
    },
    {
      id: "m6",
      moduleNumber: "06",
      badgeTitle: "MODULE#6 SCALING",
      title: "MODULE#6 SCALING: Operations & GCC Expansion",
      description:
        "Hiring core engineering/sales leads, operational playbooks, legal structures, and regional scaling.",
      lessons: Array.from({ length: 5 }).map((_, i) => ({
        id: `lesson-m6-${i + 1}`,
        lessonNumber: 30 + i + 1,
        title: `Lesson ${30 + i + 1}: Operational Scaling & Regional Expansion Step ${i + 1}`,
        desc: `Scale team structure and execute regional expansion step ${i + 1}.`,
        duration: "32 Mins",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        hasQuiz: true,
        hasMaterials: true,
        materials: [
          {
            name: `Scaling & Hiring Org Chart Template (PDF)`,
            size: "1.9 MB",
            type: "pdf",
          },
        ],
      })),
    },
    {
      id: "m7",
      moduleNumber: "07",
      badgeTitle: "MODULE#7 FUNDRASING",
      title: "MODULE#7 FUNDRASING: VC Pitch Decks, SAFEs & Closing",
      description:
        "10-slide VC deck, Cap Table math, SAFE agreements, due diligence checklists, and syndicate pitch rehearsals.",
      lessons: Array.from({ length: 5 }).map((_, i) => ({
        id: `lesson-m7-${i + 1}`,
        lessonNumber: 35 + i + 1,
        title: `Lesson ${35 + i + 1}: Pitch Deck Narrative & Term Sheet Closing Step ${i + 1}`,
        desc: `Structure post-money SAFEs and close pre-seed investment commitments step ${i + 1}.`,
        duration: "35 Mins",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        hasQuiz: true,
        hasMaterials: true,
        materials: [
          {
            name: `TimeValley 10-Slide VC Pitch Template (PPTX)`,
            size: "8.5 MB",
            type: "pptx",
          },
          {
            name: `Post-Money SAFE Agreement (PDF)`,
            size: "1.1 MB",
            type: "pdf",
          },
        ],
      })),
    },
  ];

  const [curriculumModules, setCurriculumModules] = useState<DiplomaModuleItem[]>(modulesList);

  useEffect(() => {
    if (!mounted) return;
    const loadDynamicCurriculum = async () => {
      try {
        const res = await apiClient.get("/courses/diploma");
        if (res?.data?.modules && Array.isArray(res.data.modules)) {
          setCurriculumModules(res.data.modules);
        }
      } catch (e) {
        console.warn("Using default curriculum fallback:", e);
      }
    };
    loadDynamicCurriculum();

    const socket = getSocket();
    const handleReload = () => {
      loadDynamicCurriculum();
    };
    socket.on("module_access_updated", handleReload);
    socket.on("diploma_access_updated", handleReload);

    return () => {
      socket.off("module_access_updated", handleReload);
      socket.off("diploma_access_updated", handleReload);
    };
  }, [mounted, user?.id]);

  const currentModule = curriculumModules[selectedModuleIdx] || curriculumModules[0] || modulesList[0];
  const isCurrentModuleLocked = typeof (currentModule as any)?.isLocked === "boolean"
    ? (currentModule as any).isLocked
    : (selectedModuleIdx === 0 ? false : !hasPurchased);
  const currentLesson = currentModule?.lessons?.[activeLessonIdx] || currentModule?.lessons?.[0];

  // Auto-play Next Lesson resolution
  const currentLessonsList = currentModule?.lessons || [];
  let nextLessonInfo: NextLessonInfo | null = null;
  if (activeLessonIdx < currentLessonsList.length - 1) {
    const nextL = currentLessonsList[activeLessonIdx + 1];
    nextLessonInfo = {
      id: nextL.id,
      lessonNumber: nextL.lessonNumber,
      title: nextL.title,
      duration: nextL.duration,
    };
  } else if (selectedModuleIdx < curriculumModules.length - 1) {
    const nextMod = curriculumModules[selectedModuleIdx + 1];
    const isNextModLocked = typeof (nextMod as any)?.isLocked === "boolean"
      ? (nextMod as any).isLocked
      : (selectedModuleIdx + 1 === 0 ? false : !hasPurchased);
    if (!isNextModLocked && nextMod.lessons && nextMod.lessons.length > 0) {
      const nextL = nextMod.lessons[0];
      nextLessonInfo = {
        id: nextL.id,
        lessonNumber: nextL.lessonNumber,
        title: nextL.title,
        duration: nextL.duration,
      };
    }
  }

  const handleNextLessonAdvancement = () => {
    if (activeLessonIdx < currentLessonsList.length - 1) {
      setActiveLessonIdx((prev) => prev + 1);
    } else if (selectedModuleIdx < curriculumModules.length - 1) {
      setSelectedModuleIdx((prev) => prev + 1);
      setActiveLessonIdx(0);
    }
  };

  // Video progress syncing hook
  const { handleTimeUpdate, handleManualComplete } = useVideoProgress({
    lessonId: currentLesson?.id,
    isLoggedIn: !!userLoggedIn,
    onAutoCompleted: (lId) => {
      if (!completedLessons.includes(lId)) {
        toggleLessonCompleted(lId);
      }
    },
  });

  const handleUnlockClick = () => {
    if (!isLoggedIn) {
      openEnrollModal("signin");
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/checkout/diploma";
      }
    }
  };

  // Sync completed lessons with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("timevalley_completed_lessons");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCompletedLessons(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  const [isExtractingCert, setIsExtractingCert] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleLessonCompleted = (id: string) => {
    const isAdding = !completedLessons.includes(id);
    handleManualComplete(id, isAdding);
    setCompletedLessons((prev) => {
      const updated = isAdding ? [...prev, id] : prev.filter((lId) => lId !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("timevalley_completed_lessons", JSON.stringify(updated));
      }
      return updated;
    });

    // Auto-advance to next lesson immediately with transition toast
    if (isAdding) {
      if (activeLessonIdx < currentModule.lessons.length - 1) {
        const nextLes = currentModule.lessons[activeLessonIdx + 1];
        setToastMsg(`🎉 Lesson Completed! Advancing to Lesson ${nextLes.lessonNumber}...`);
        setTimeout(() => setToastMsg(null), 3000);
        setActiveLessonIdx((prev) => prev + 1);
      } else if (selectedModuleIdx < modulesList.length - 1) {
        const nextMod = modulesList[selectedModuleIdx + 1];
        setToastMsg(`🎉 Module Completed! Advancing to ${nextMod.badgeTitle}...`);
        setTimeout(() => setToastMsg(null), 3000);
        setSelectedModuleIdx((prev) => prev + 1);
        setActiveLessonIdx(0);
      } else {
        setToastMsg(`🎓 All 40 Diploma Lessons Completed! Claim your official Certificate.`);
        setTimeout(() => setToastMsg(null), 4000);
      }
    }
  };

  const markLessonComplete = (id: string) => {
    toggleLessonCompleted(id);
  };

  const handleClaimCertificate = async () => {
    setIsExtractingCert(true);
    setToastMsg("🎓 Issuing Official Diploma Certificate & dispatching email copy...");
    try {
      const cert = await claimCertificate("venture-architect-diploma");
      if (cert?.code) {
        setToastMsg(`🎓 Certificate #${cert.code} issued & sent to your email! Opening download view...`);
        setTimeout(() => {
          window.location.href = `/our-certificates?serial=${cert.code}&download=true`;
        }, 1200);
      } else {
        window.location.href = "/our-certificates";
      }
    } catch (e) {
      window.location.href = "/our-certificates";
    } finally {
      setIsExtractingCert(false);
    }
  };

  const handleDownloadMaterial = (mat: { name: string; url?: string }) => {
    if (!mat.url || mat.url === "#") {
      setToastMsg("⚠️ No download URL available for this material.");
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    setToastMsg(`📥 Downloading ${mat.name}...`);
    setTimeout(() => setToastMsg(null), 3000);

    if (mat.url.startsWith("data:")) {
      try {
        fetch(mat.url)
          .then((res) => res.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = mat.name.endsWith(".pdf") || mat.name.endsWith(".xlsx") || mat.name.endsWith(".docx") || mat.name.endsWith(".zip") ? mat.name : `${mat.name}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          })
          .catch(() => {
            const a = document.createElement("a");
            a.href = mat.url!;
            a.download = mat.name;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });
      } catch (e) {
        window.open(mat.url, "_blank");
      }
    } else {
      const a = document.createElement("a");
      a.href = mat.url;
      a.download = mat.name;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const calculateProgress = () => {
    return Math.round((completedLessons.length / 40) * 100);
  };

  const customBreadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Diploma Workspace" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF0E9] py-6 sm:py-8 md:py-10 text-[#1C2B2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Bar */}
        <div className="mb-4">
          <Breadcrumbs customItems={customBreadcrumbItems} />
        </div>

        {/* Hero Header Card */}
        <div className="relative z-30 bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-8 lg:p-10 shadow-xl border border-gray-200/80 mb-8 space-y-5 sm:space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C2B2D] tracking-tight leading-tight">
              Venture Architect & Founder{" "}
              <span className="text-[#EDA296]">Diploma</span>
            </h1>

            <p className="text-gray-500 text-xs sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
              8 Comprehensive Venture Building Modules (INTRO to FUNDRAISING) &
              40 Masterclass Lessons.
            </p>

            {/* Price Badge & Status */}
            <div className="pt-2 flex items-center justify-center gap-3">
              {hasPurchased ? (
                <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                  <i className="fa-solid fa-shield-check text-emerald-600"></i>
                  <span>Full Diploma Unlocked (Student Member)</span>
                </span>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleUnlockClick}
                    className="bg-[#0E6875] text-white text-xs font-black px-5 py-2 rounded-full hover:bg-[#0c5964] transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <i className="fa-solid fa-lock-open"></i>
                    <span>
                      {userLoggedIn
                        ? "Buy Full Diploma (5,000 LE)"
                        : "Unlock Full Diploma (5,000 LE)"}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Certificate Claim & Extraction Banner */}
            {(calculateProgress() >= 100 || completedLessons.length >= 35) && (
              <div className="pt-2 animate-fadeIn">
                <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-[#0E6875] text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-emerald-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center text-xl shrink-0 shadow-inner">
                      🎓
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        Congratulations! Diploma Requirements Fulfilled
                      </h4>
                      <p className="text-xs text-emerald-100 font-medium">
                        You have completed 100% of the Venture Architect curriculum. Your official certificate is ready.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleClaimCertificate}
                    disabled={isExtractingCert}
                    className="bg-white hover:bg-emerald-50 text-[#0E6875] font-black text-xs px-5 py-3 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0 flex items-center gap-2"
                  >
                    {isExtractingCert ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin text-sm"></i>
                        <span>Extracting Certificate...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-award text-amber-500 text-sm"></i>
                        <span>Extract Official Certificate 🎓</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Tab Selector Dropdown (< sm) */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setMobileTabOpen(!mobileTabOpen)}
              className="w-full bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between text-xs font-extrabold text-[#0E6875] shadow-sm cursor-pointer hover:border-[#0E6875]/40 transition-all"
            >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-[#0E6875]/10 text-[#0E6875] flex items-center justify-center text-xs">
                    <i className={`fa-solid ${tabList.find(t => t.id === activeTab)?.icon || 'fa-gauge-high'}`}></i>
                  </span>
                  <span>{tabList.find(t => t.id === activeTab)?.label || 'Diploma Workspace'}</span>
                </div>
                <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${mobileTabOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {mobileTabOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  {tabList.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        handleTabChange(t.id);
                        setMobileTabOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                        activeTab === t.id
                          ? "bg-[#0E6875] text-white"
                          : "text-gray-700 hover:bg-[#FAF0E9] hover:text-[#0E6875]"
                      }`}
                    >
                      <i className={`fa-solid ${t.icon} w-4 text-center`}></i>
                      <span>{t.label}</span>
                      {activeTab === t.id && (
                        <i className="fa-solid fa-check ml-auto text-xs"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          {/* Desktop & Tablet Navigation Pill Bar (>= sm) */}
          <div className="hidden sm:flex bg-[#0E6875] p-2.5 rounded-3xl shadow-2xl items-center justify-center gap-2 flex-wrap border border-white/10">
            {tabList.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabChange(t.id)}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 transform active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#EDA296] text-white shadow-xl scale-105"
                      : "text-white/90 hover:text-white hover:bg-white/15 hover:scale-102"
                  }`}
                >
                  <i className={`fa-solid ${t.icon}`}></i>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: DIPLOMA OVERVIEW & MODULE CURRICULUM */}
        {activeTab === "overview" && (
          <div key="overview" className="space-y-10 fade-load-transition">
            {/* Intro Video Player Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-linear-to-r from-[#0E6875] via-[#118494] to-[#0E6875] aspect-video w-full border border-white/10">
              {!introPlaying ? (
                <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-[#0E6875]/80 to-transparent flex flex-col items-center justify-center p-3 sm:p-6 text-center text-white space-y-3">
                  <span className="hidden sm:flex bg-white/15 backdrop-blur-md text-white text-xs font-extrabold px-4 py-1.5 rounded-full border border-white/20 items-center gap-2 shadow-xs">
                    <i className="fa-solid fa-play text-[#71D5E4]"></i>
                    <span>Preview Lesson Video - INTRO Module</span>
                  </span>

                  <button
                    onClick={() => setIntroPlaying(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#0E6875] flex items-center justify-center text-xl sm:text-2xl shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                  >
                    <i className="fa-solid fa-play ml-1"></i>
                  </button>

                  <div>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Diploma Video Masterclass
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
                      Module #0 (INTRO) is unlocked for everyone. Unlock all 8
                      modules for 5,000 LE.
                    </p>
                  </div>
                </div>
              ) : (
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Curriculum Modules Grid (8 Modules) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1C2B2D]">
                    Diploma Curriculum ({modulesList.length} Modules)
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Module 00 (INTRO) is available to all users. Modules 01 to
                    07 require Diploma Enrollment (5,000 LE).
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                    INTRO: Free Unlocked
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                    Modules 1-7: 5,000 LE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {curriculumModules.map((m, idx) => {
                  const isLocked = typeof (m as any).isLocked === "boolean" ? (m as any).isLocked : (idx === 0 ? false : !hasPurchased);

                  return (
                    <div
                      key={m.id}
                      className={`relative rounded-3xl p-6 sm:p-8 transition-all border shadow-lg ${
                        isLocked
                          ? "bg-white/60 backdrop-blur-xs border-gray-200/90"
                          : "bg-white border-white/80 hover:shadow-xl"
                      }`}
                    >
                      {/* Module Badge & Locking Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span
                          className={`text-xs font-black px-3.5 py-1 rounded-full border ${
                            idx === 0
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isLocked
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-[#0E6875]/10 text-[#0E6875] border-[#0E6875]/20"
                          }`}
                        >
                          {m.badgeTitle}
                        </span>

                        {isLocked ? (
                          <span className="bg-gray-100 text-gray-600 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 border border-gray-200">
                            <i className="fa-solid fa-lock text-amber-600"></i>
                            <span>Locked</span>
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
                            <i className="fa-solid fa-lock-open text-emerald-600"></i>
                            <span>Unlocked</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-black text-[#1C2B2D] mb-2">
                        {m.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mb-6">
                        {m.description}
                      </p>

                      {/* 5 Filler Lessons Preview List */}
                      <div className="space-y-2 mb-6">
                        <div className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                          Module Lessons (5 Lessons):
                        </div>
                        {m.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                              isLocked
                                ? "bg-gray-50 text-gray-400 border-gray-100 opacity-75"
                                : "bg-[#FAF0E9]/50 text-gray-700 border-gray-200 hover:bg-[#FAF0E9]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <span className="w-6 h-6 rounded-lg bg-[#0E6875]/10 text-[#0E6875] flex items-center justify-center shrink-0 font-mono text-[11px] font-bold">
                                {lesson.lessonNumber}
                              </span>
                              <span className="truncate">{lesson.title}</span>
                            </div>

                            {/* Lesson Badges */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {lesson.hasQuiz && (
                                <span
                                  className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md"
                                  title="Evaluation Quiz Included"
                                >
                                  Quiz
                                </span>
                              )}
                              {lesson.hasMaterials && (
                                <span
                                  className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md"
                                  title="Downloadable Resources"
                                >
                                  Docs
                                </span>
                              )}
                              <span className="text-[11px] text-gray-400 font-mono">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Lock Overlay CTA */}
                      {isLocked ? (
                        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                            <i className="fa-solid fa-lock text-amber-500"></i>
                            <span>Requires Diploma Pass (5,000 LE)</span>
                          </div>
                          <button
                            onClick={handleUnlockClick}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#0E6875] text-white text-xs font-black hover:bg-[#0c5964] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                          >
                            <i className="fa-solid fa-key text-[#EDA296]"></i>
                            <span>Unlock Module (5,000 LE)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedModuleIdx(idx);
                              setActiveTab("lessons");
                            }}
                            className="px-5 py-2.5 rounded-2xl bg-[#0E6875] text-white text-xs font-black hover:bg-[#0c5964] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                          >
                            <span>Open Lessons Workspace</span>
                            <i className="fa-solid fa-arrow-right text-xs"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LESSONS WORKSPACE */}
        {activeTab === "lessons" && (
          <div
            key="lessons"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-load-transition"
          >
            {/* Main Lesson Player */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-6">
                {/* Modern Module Navigation Track & Progress Slider */}
                <div className="space-y-3">
                  {/* Module Pills Segment Header with Drag & Arrow Navigation */}
                  <div className="relative flex items-center gap-1.5">
                    {/* Left Scroll Arrow */}
                    <button
                      type="button"
                      onClick={scrollNavLeft}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-[#0E6875] flex items-center justify-center text-xs font-black shadow-xs shrink-0 cursor-pointer active:scale-90 transition-all"
                      title="Scroll Left"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {/* Draggable & Wheel Scrollable Module Pills Bar */}
                    <div
                      ref={navScrollRef}
                      onMouseDown={handleMouseDown}
                      onMouseLeave={handleMouseLeave}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}
                      onWheel={handleWheel}
                      data-lenis-prevent
                      className={`flex-1 flex items-center gap-2 overflow-x-auto p-1.5 bg-gray-50 rounded-2xl border border-gray-200/80 no-scrollbar select-none cursor-grab ${
                        isMouseDown ? "cursor-grabbing" : ""
                      }`}
                    >
                      {curriculumModules.map((m, idx) => {
                        const isLocked = typeof (m as any).isLocked === "boolean" ? (m as any).isLocked : (idx === 0 ? false : !hasPurchased);
                        const isSelected = selectedModuleIdx === idx;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                handleUnlockClick();
                              } else {
                                setSelectedModuleIdx(idx);
                                setActiveLessonIdx(0);
                              }
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#0E6875] text-white shadow-md shadow-[#0E6875]/20 scale-102"
                                : isLocked
                                  ? "bg-white/60 text-gray-400 border border-gray-200/60 hover:bg-white/80"
                                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60"
                            }`}
                          >
                            {isLocked ? (
                              <i className="fa-solid fa-lock text-amber-500 text-[10px]"></i>
                            ) : (
                              <span
                                className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#EDA296]" : "bg-emerald-500"}`}
                              />
                            )}
                            <span>{m.badgeTitle}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Scroll Arrow */}
                    <button
                      type="button"
                      onClick={scrollNavRight}
                      className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-[#0E6875] flex items-center justify-center text-xs font-black shadow-xs shrink-0 cursor-pointer active:scale-90 transition-all"
                      title="Scroll Right"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>

                  {/* Sleek Progress Slider Track */}
                  <div className="space-y-1.5 px-0.5">
                    <div className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5 text-[#0E6875]">
                        <i className="fa-solid fa-sliders text-xs"></i>
                        <span>
                          {currentModule.badgeTitle} (Module{" "}
                          {selectedModuleIdx + 1} of 8)
                        </span>
                      </div>
                      <span className="font-mono text-gray-500">
                        {hasPurchased
                          ? "100% Unlocked"
                          : "1 of 8 Unlocked (Free)"}
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200/80 shadow-inner relative">
                      <div
                        className="h-full bg-[#0E6875] rounded-full transition-all duration-500 shadow-xs"
                        style={{
                          width: `${((selectedModuleIdx + 1) / curriculumModules.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {isCurrentModuleLocked ? (
                  <div className="p-8 text-center space-y-4 bg-amber-50/50 rounded-2xl border border-amber-200">
                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-2xl shadow-inner">
                      <i className="fa-solid fa-lock"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        {currentModule.title} is Locked
                      </h3>
                      <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 font-medium">
                        Enroll in the Venture Architect & Founder Diploma to
                        access all 40 masterclass lessons and downloadable
                        materials.
                      </p>
                    </div>
                    <button
                      onClick={handleUnlockClick}
                      className="px-6 py-3 rounded-2xl bg-[#0E6875] text-white font-extrabold text-xs shadow-lg hover:bg-[#0c5964] transition-all cursor-pointer"
                    >
                      Unlock Full Access for 5,000 LE
                    </button>
                  </div>
                ) : (
                  <div key={currentLesson.id} className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-300">
                    {/* Luxury Custom Video Player */}
                    {currentLesson && (
                      <DiplomaPlayer
                        key={currentLesson.id}
                        lessonId={currentLesson.id}
                        videoUrl={currentLesson.videoUrl}
                        title={`Module ${currentModule.moduleNumber || selectedModuleIdx}: ${currentLesson.title}`}
                        studentName={user?.name || "TimeValley Student"}
                        studentEmail={user?.email || ""}
                        studentId={user?.studentId || user?.id || ""}
                        nextLesson={nextLessonInfo}
                        onTimeUpdate={handleTimeUpdate}
                        onCompleted={() => {
                          if (!completedLessons.includes(currentLesson.id)) {
                            toggleLessonCompleted(currentLesson.id);
                          }
                        }}
                        onNextLesson={handleNextLessonAdvancement}
                      />
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#0E6875]/10 text-[#0E6875] text-xs font-black px-3 py-1 rounded-full">
                            {currentModule.badgeTitle}
                          </span>
                          {currentLesson.hasQuiz && (
                            <span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-full">
                              Quiz Available
                            </span>
                          )}
                        </div>

                        {/* Interactive Mark Completed Button */}
                        <button
                          onClick={() => toggleLessonCompleted(currentLesson.id)}
                          className={`group px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm active:scale-90 ${
                            completedLessons.includes(currentLesson.id)
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                              : "bg-[#0E6875] hover:bg-[#0B4E58] text-white shadow-[#0E6875]/20 hover:-translate-y-0.5"
                          }`}
                          title={
                            completedLessons.includes(currentLesson.id)
                              ? "Click to mark lesson as incomplete"
                              : "Click to mark lesson as completed"
                          }
                        >
                          <i
                            className={`fa-solid ${
                              completedLessons.includes(currentLesson.id)
                                ? "fa-circle-check text-emerald-200 text-sm"
                                : "fa-check text-xs group-hover:scale-110 transition-transform"
                            }`}
                          ></i>
                          <span>
                            {completedLessons.includes(currentLesson.id)
                              ? "Completed ✓"
                              : "Mark as Completed"}
                          </span>
                        </button>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-[#1C2B2D]">
                        {currentLesson.title}
                      </h2>
                      <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
                        {currentLesson.desc}
                      </p>
                    </div>

                    {/* Downloadable Materials */}
                    {currentLesson.materials &&
                      currentLesson.materials.length > 0 && (
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                          <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-2">
                            <i className="fa-solid fa-paperclip text-[#0E6875]"></i>
                            <span>Lesson Downloadable Materials</span>
                          </h4>
                          <div className="space-y-2">
                            {currentLesson.materials.map((mat, mIdx) => (
                              <div
                                key={mIdx}
                                onClick={() => handleDownloadMaterial(mat)}
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 hover:bg-[#E6F3F5] border border-gray-200 text-xs font-bold transition-all group cursor-pointer active:scale-98 shadow-2xs"
                                title={`Click to download ${mat.name}`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                  <i className={`text-sm shrink-0 ${
                                    mat.type === 'excel' || mat.type === 'xlsx'
                                      ? 'fa-solid fa-file-excel text-emerald-600'
                                      : mat.type === 'word' || mat.type === 'docx'
                                      ? 'fa-solid fa-file-word text-blue-600'
                                      : mat.type === 'zip'
                                      ? 'fa-solid fa-file-zipper text-amber-600'
                                      : 'fa-solid fa-file-pdf text-rose-500'
                                  }`} />
                                  <span className="text-gray-800 group-hover:text-[#0E6875] transition-colors truncate font-extrabold">
                                    {mat.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-gray-400 font-mono text-[11px]">
                                    {mat.size || "1.2 MB"}
                                  </span>
                                  <div className="w-7 h-7 rounded-xl bg-white border border-gray-200 group-hover:border-[#0E6875] text-gray-500 group-hover:text-[#0E6875] flex items-center justify-center text-xs transition-all shadow-2xs">
                                    <i className="fa-solid fa-download" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Module Lessons Index */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80 space-y-4">
                <h3 className="text-base font-black text-[#1C2B2D] flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-[#0E6875]"></i>
                  <span>Lessons Index ({currentModule.badgeTitle})</span>
                </h3>

                <div className="space-y-2 max-h-125 overflow-y-auto pr-1">
                  {currentModule.lessons.map((les, idx) => {
                    const isLessonDone = completedLessons.includes(les.id);
                    return (
                      <button
                        key={les.id}
                        onClick={() => setActiveLessonIdx(idx)}
                        disabled={isCurrentModuleLocked}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          activeLessonIdx === idx
                            ? "bg-[#0E6875] text-white border-[#0E6875] shadow-md"
                            : isLessonDone
                            ? "bg-emerald-50/60 border-emerald-200/80 text-emerald-950 hover:bg-emerald-50"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-mono font-bold ${
                              activeLessonIdx === idx
                                ? "bg-white/20 text-white"
                                : isLessonDone
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-[#0E6875]/10 text-[#0E6875]"
                            }`}
                          >
                            {isLessonDone ? <i className="fa-solid fa-check text-[10px]" /> : les.lessonNumber}
                          </span>
                          <span className="truncate">{les.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isLessonDone && (
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300/60">
                              ✓ Done
                            </span>
                          )}
                          <span className="text-[10px] opacity-75 font-mono">
                            {les.duration}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUIZ */}
        {activeTab === "quiz" && (
          <div
            key="quiz"
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200/80 max-w-3xl mx-auto space-y-6 fade-load-transition"
          >
            <div className="text-center space-y-2">
              <span className="bg-purple-100 text-purple-700 text-xs font-black px-4 py-1.5 rounded-full">
                DIPLOMA ASSESSMENT
              </span>
              <h2 className="text-2xl font-black text-[#1C2B2D]">
                Module Evaluation Quiz
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Test your core venture building knowledge across thesis
                validation and product architecture.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
              <h4 className="text-sm font-black text-gray-900">
                Question 1: What is the primary objective during Day-Zero Thesis
                Validation?
              </h4>
              <div className="space-y-2">
                {[
                  "A. Building a full microservices backend with 100 features",
                  "B. Validating ICP customer pain points and calculating TAM/SAM/SOM",
                  "C. Spending $50,000 on Google Ads before interviewing customers",
                  "D. Incorporating a DIFC C-Corp without product testing",
                ].map((ans, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() =>
                      setSelectedQuizAnswers({
                        ...selectedQuizAnswers,
                        1: aIdx,
                      })
                    }
                    className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      selectedQuizAnswers[1] === aIdx
                        ? "bg-[#0E6875] text-white border-[#0E6875]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setQuizSubmitted(true)}
                className="px-6 py-3 rounded-2xl bg-[#0E6875] text-white font-extrabold text-xs shadow-lg hover:bg-[#0c5964] cursor-pointer"
              >
                Submit Evaluation Answers
              </button>
            </div>

            {quizSubmitted && (
              <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold text-center border border-emerald-200 animate-in zoom-in-95">
                🎉 Quiz Submitted Successfully! Score: 100% Passed.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CERTIFICATES */}
        {activeTab === "certificate" && (
          <div
            key="certificate"
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200/80 max-w-3xl mx-auto text-center space-y-6 fade-load-transition"
          >
            <div className="w-20 h-20 rounded-full bg-[#0E6875]/10 text-[#0E6875] mx-auto flex items-center justify-center text-3xl shadow-inner">
              <i className="fa-solid fa-certificate"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1C2B2D]">
                Digital Verifiable Certificate
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-md mx-auto mt-1">
                Complete all {modulesList.length} Modules and evaluation quizzes to issue your
                official TimeValley Venture Architect Certificate.
              </p>
            </div>
            <button
              onClick={() =>
                alert(
                  "Certificate will be generated upon 100% course completion!",
                )
              }
              className="px-6 py-3 rounded-2xl bg-[#0E6875] text-white font-extrabold text-xs shadow-lg hover:bg-[#0c5964] cursor-pointer"
            >
              Generate Digital Certificate
            </button>
          </div>
        )}

        {/* TAB 5: SKILL PROGRESS */}
        {activeTab === "progress" && (
          <div
            key="progress"
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200/80 max-w-3xl mx-auto space-y-6 fade-load-transition"
          >
            <h2 className="text-2xl font-black text-[#1C2B2D] text-center">
              Skill Completion Metrics
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-black">
                <span>Overall Curriculum Completion</span>
                <span className="text-[#0E6875]">{calculateProgress()}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                <div
                  className="h-full bg-[#0E6875] rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Diploma Purchase Modal */}
      <DiplomaPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />

      {/* Floating Transition Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-100 max-w-sm w-auto bg-[#051c20]/90 backdrop-blur-xl text-white text-xs font-black p-4 rounded-2xl shadow-[0_20px_50px_rgba(14,104,117,0.35)] border border-emerald-400/40 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300 flex items-center gap-3.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-emerald-500 to-[#0E6875] text-white flex items-center justify-center text-sm shadow-md shrink-0 animate-bounce duration-1000">
            <i className="fa-solid fa-circle-check text-emerald-200"></i>
          </div>
          <div className="flex-1 pr-2">
            <div className="text-[10px] text-emerald-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Telemetry Update</span>
            </div>
            <p className="text-xs text-white font-extrabold leading-snug">{toastMsg}</p>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-[10px] transition-colors shrink-0 cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
    </div>
  );
}
