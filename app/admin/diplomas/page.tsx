"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/axios";
import adminService from "@/services/admin";
import ModuleFormModal from "@/components/admin/ModuleFormModal";
import LessonFormModal from "@/components/admin/LessonFormModal";
import CouponManagerModal from "@/components/admin/CouponManagerModal";

interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  desc: string;
  duration: string;
  videoUrl: string;
  materials?: any[];
}

interface DiplomaModule {
  id: string;
  moduleNumber: string;
  title: string;
  badgeTitle: string;
  description: string;
  lessons: Lesson[];
}

export default function DiplomaBuilderPage() {
  const [modules, setModules] = useState<DiplomaModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Modals state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleToEdit, setModuleToEdit] = useState<DiplomaModule | null>(null);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string>("");
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const fetchCurriculum = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/courses/diploma");
      const data = res.data;
      if (data && data.modules) {
        setModules(data.modules);
        if (data.modules.length > 0 && !expandedModuleId) {
          setExpandedModuleId(data.modules[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load diploma curriculum for builder:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- MODULE ACTIONS ---

  const handleOpenAddModule = () => {
    setModuleToEdit(null);
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (m: DiplomaModule, e: React.MouseEvent) => {
    e.stopPropagation();
    setModuleToEdit(m);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete module "${title}"? All its lessons will be removed.`)) {
      try {
        await adminService.deleteModule(id);
        fetchCurriculum();
      } catch (err) {
        console.error("Failed to delete module:", err);
        alert("Failed to delete module.");
      }
    }
  };

  // --- LESSON ACTIONS ---

  const handleOpenAddLesson = (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetModuleId(moduleId);
    setLessonToEdit(null);
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (moduleId: string, l: Lesson, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetModuleId(moduleId);
    setLessonToEdit(l);
    setIsLessonModalOpen(true);
  };

  const handleDeleteLesson = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete lesson "${title}"?`)) {
      try {
        await adminService.deleteLesson(id);
        fetchCurriculum();
      } catch (err) {
        console.error("Failed to delete lesson:", err);
        alert("Failed to delete lesson.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-200/80">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#E6F3F5] text-[#0E6875] text-xs font-black px-3.5 py-1 rounded-full border border-[#0E6875]/20 mb-2">
            🎓 Diploma Content Builder Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C2B2D] tracking-tight">
            Venture Architect Diploma Builder
          </h1>
          <p className="text-xs text-gray-600 font-medium mt-1">
            Add, edit, remove, and reorder diploma modules and video lessons. Changes apply live across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="bg-[#EDA296] hover:bg-[#e28d80] text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-ticket text-sm"></i>
            <span>+ Create Coupon</span>
          </button>

          <Link
            href="/diplomas"
            target="_blank"
            className="bg-gray-100 hover:bg-gray-200 text-[#1C2B2D] font-extrabold text-xs px-4 py-3 rounded-2xl transition-all flex items-center gap-2 border border-gray-200"
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <span>Preview Student View</span>
          </Link>

          <button
            onClick={handleOpenAddModule}
            className="bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-plus text-sm"></i>
            <span>Add New Module</span>
          </button>
        </div>
      </div>

      {/* Main Modules & Lessons List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl p-8 border border-gray-200 text-xs text-gray-500 font-bold flex items-center justify-center gap-2 shadow-sm">
          <i className="fa-solid fa-spinner animate-spin text-base text-[#0E6875]"></i>
          <span>Loading diploma curriculum builder...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((m, mIdx) => {
            const isExpanded = expandedModuleId === m.id;
            return (
              <div
                key={m.id}
                className="bg-white rounded-3xl shadow-lg border border-gray-200/90 overflow-hidden transition-all"
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => setExpandedModuleId(isExpanded ? null : m.id)}
                  className="p-5 sm:p-6 bg-linear-to-r from-white to-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/80 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <span className="w-9 h-9 rounded-2xl bg-[#0E6875] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md">
                      {m.moduleNumber || `0${mIdx}`}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-[#1C2B2D]">{m.title}</h2>
                        <span className="text-[10px] font-extrabold bg-[#E6F3F5] text-[#0E6875] px-2.5 py-0.5 rounded-full border border-[#0E6875]/20">
                          {m.lessons?.length || 0} Lessons
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5 max-w-2xl truncate">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Expand Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={(e) => handleOpenAddLesson(m.id, e)}
                      className="bg-teal-50 hover:bg-teal-100 text-[#0E6875] text-xs font-extrabold px-3 py-1.5 rounded-xl border border-[#0E6875]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="fa-solid fa-plus text-[10px]"></i>
                      <span>Add Lesson</span>
                    </button>

                    <button
                      onClick={(e) => handleOpenEditModule(m, e)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold p-2 rounded-xl transition-all cursor-pointer"
                      title="Edit Module"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>

                    <button
                      onClick={(e) => handleDeleteModule(m.id, m.title, e)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold p-2 rounded-xl transition-all cursor-pointer"
                      title="Delete Module"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>

                    <span
                      className={`w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-black flex items-center justify-center text-xs transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expandable Lessons List */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-6 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                        Lessons List ({m.title})
                      </span>
                      <button
                        onClick={(e) => handleOpenAddLesson(m.id, e)}
                        className="text-xs font-extrabold text-[#0E6875] hover:underline flex items-center gap-1"
                      >
                        + Add New Lesson
                      </button>
                    </div>

                    {m.lessons && m.lessons.length > 0 ? (
                      m.lessons.map((l) => (
                        <div
                          key={l.id}
                          className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs hover:border-[#0E6875]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-gray-100 text-[#0E6875] font-extrabold text-xs flex items-center justify-center shrink-0">
                              #{l.lessonNumber}
                            </span>
                            <div>
                              <div className="font-extrabold text-xs text-[#1C2B2D] flex items-center gap-2">
                                <span>{l.title}</span>
                                <span className="text-[10px] font-bold text-gray-400">({l.duration})</span>
                              </div>
                              <div className="text-[11px] text-gray-500 truncate max-w-xl mt-0.5">
                                {l.desc}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <a
                              href={l.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gray-400 hover:text-[#0E6875] text-xs p-1.5"
                              title="Preview Video Link"
                            >
                              <i className="fa-solid fa-video"></i>
                            </a>

                            <button
                              onClick={(e) => handleOpenEditLesson(m.id, l, e)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <i className="fa-solid fa-pen text-[10px]"></i>
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={(e) => handleDeleteLesson(l.id, l.title, e)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <i className="fa-solid fa-trash text-[10px]"></i>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-gray-500 font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                        No lessons created in this module yet. Click "+ Add Lesson" to build video lessons.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ModuleFormModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSuccess={fetchCurriculum}
        moduleToEdit={moduleToEdit}
      />

      <LessonFormModal
        isOpen={isLessonModalOpen}
        moduleId={targetModuleId}
        onClose={() => setIsLessonModalOpen(false)}
        onSuccess={fetchCurriculum}
        lessonToEdit={lessonToEdit}
      />

      <CouponManagerModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />
    </div>
  );
}
