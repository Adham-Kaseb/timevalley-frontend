"use client";

import { useState, useEffect } from "react";
import adminService, { AdminUser } from "@/services/admin";

interface DiplomaModule {
  id: string;
  moduleNumber: string;
  title: string;
  badgeTitle: string;
}

interface StudentManageDrawerProps {
  isOpen: boolean;
  student: AdminUser | null;
  allModules: DiplomaModule[];
  onClose: () => void;
  onRefresh: () => void;
}

export default function StudentManageDrawer({
  isOpen,
  student,
  allModules,
  onClose,
  onRefresh,
}: StudentManageDrawerProps) {
  const [activeTab, setActiveTab] = useState<"access" | "assign" | "progress">(
    "access",
  );

  // Student Full Detail State
  const [studentDetail, setStudentDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isTogglingEnrollment, setIsTogglingEnrollment] = useState(false);
  const [togglingModuleId, setTogglingModuleId] = useState<string | null>(null);

  // Custom Assignment Form State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSendingTask, setIsSendingTask] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    if (student && isOpen) {
      loadStudentDetail(student.id);
    } else {
      setStudentDetail(null);
    }
    setActionMsg("");
  }, [student, isOpen]);

  const loadStudentDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const data = await adminService.getStudentDetail(id);
      setStudentDetail(data);
    } catch (err) {
      console.error("Failed to load student detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (!isOpen || !student) return null;

  const isEnrolled = studentDetail?.enrollments?.some(
    (e: any) => e.status === "ACTIVE",
  );
  const unlockedModuleIds =
    studentDetail?.unlockedModules?.flatMap((u: any) => [u.moduleId, u.module?.id, u.module?.moduleNumber].filter(Boolean)) || [];

  const handleToggleEnrollment = async () => {
    setActionMsg("");
    setIsTogglingEnrollment(true);
    try {
      const newStatus = isEnrolled ? "INACTIVE" : "ACTIVE";
      
      // Execute backend enrollment toggle
      const updatedPayload = await adminService.toggleEnrollment(student.id, newStatus);
      setStudentDetail(updatedPayload);
      setActionMsg(
        newStatus === "ACTIVE"
          ? "🎉 Full Diploma Access & all modules granted to student!"
          : "🔒 Full Diploma Access revoked."
      );
      onRefresh();
    } catch (err: any) {
      console.error("Failed to update enrollment:", err);
      setActionMsg("Failed to update enrollment status.");
      loadStudentDetail(student.id);
    } finally {
      setIsTogglingEnrollment(false);
    }
  };

  const handleToggleModuleUnlock = async (moduleId: string) => {
    setActionMsg("");
    setTogglingModuleId(moduleId);
    const currentlyUnlocked = unlockedModuleIds.includes(moduleId);
    try {
      const updatedDetail = await adminService.unlockModule(student.id, moduleId, !currentlyUnlocked);
      if (updatedDetail && updatedDetail.id) {
        setStudentDetail(updatedDetail);
      }
      setActionMsg(
        !currentlyUnlocked
          ? `Module access granted successfully!`
          : `Module access revoked.`
      );
      await loadStudentDetail(student.id);
      onRefresh();
    } catch (err) {
      console.error("Failed to toggle module unlock:", err);
      setActionMsg("Failed to update module unlock.");
      loadStudentDetail(student.id);
    } finally {
      setTogglingModuleId(null);
    }
  };

  const handleAssignContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMsg("");
    if (!taskTitle.trim() || !taskDesc.trim()) {
      setActionMsg("Please fill in task title and description.");
      return;
    }

    setIsSendingTask(true);
    try {
      await adminService.assignContent({
        userId: student.id,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        attachmentUrl: attachmentUrl.trim() || undefined,
        dueDate: dueDate || undefined,
      });

      setTaskTitle("");
      setTaskDesc("");
      setAttachmentUrl("");
      setDueDate("");
      setActionMsg("Custom content & task sent to student successfully!");
      loadStudentDetail(student.id);
    } catch (err: any) {
      console.error("Failed to assign custom content:", err);
      setActionMsg("Failed to assign content.");
    } finally {
      setIsSendingTask(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex justify-end bg-black/65 backdrop-blur-sm animate-fadeIn overflow-hidden"
      data-lenis-prevent
    >
      <div
        className="bg-white w-full max-w-xl h-screen flex flex-col shadow-2xl border-l border-gray-200 animate-slide-left"
        data-lenis-prevent
      >
        {/* Fixed Header */}
        <div className="p-6 sm:px-8 sm:pt-8 sm:pb-4 border-b border-gray-200 shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E6F3F5] text-[#0E6875] text-xs font-black px-3 py-1 rounded-full mb-1">
                <i className="fa-solid fa-user-gear"></i>
                <span>Student Access & Content Control</span>
              </div>
              <h2 className="text-2xl font-black text-[#1C2B2D]">
                {student.name}
              </h2>
              <p className="text-xs text-gray-500 font-mono">{student.email}</p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab("access")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "access"
                  ? "bg-[#0E6875] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Diploma & Modules
            </button>

            <button
              onClick={() => setActiveTab("assign")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "assign"
                  ? "bg-[#0E6875] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Dispatch Content
            </button>

            <button
              onClick={() => setActiveTab("progress")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "progress"
                  ? "bg-[#0E6875] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Progress Audit
            </button>
          </div>
        </div>

        {/* Scrollable Middle Body */}
        <div
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 min-h-0"
          data-lenis-prevent
        >
          {actionMsg && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-[#0E6875] text-xs font-bold flex items-center gap-2">
              <i className="fa-solid fa-circle-check"></i>
              <span>{actionMsg}</span>
            </div>
          )}

          {/* TAB 1: DIPLOMA ACCESS & MODULE UNLOCKS */}
          {activeTab === "access" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Primary Diploma Enrollment Card */}
              <div
                className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
                  isTogglingEnrollment
                    ? "bg-amber-50/70 border-amber-400 ring-4 ring-amber-400/20 animate-pulse scale-[1.01]"
                    : isEnrolled
                    ? "bg-linear-to-r from-emerald-50/80 to-teal-50/40 border-emerald-300 shadow-xs"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#1C2B2D]">
                      Venture Architect & Founder Diploma
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      120-Hour Complete Founder Curriculum (5,000 LE value)
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all duration-300 ${
                      isEnrolled
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs animate-bounce"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {isEnrolled ? "ACTIVE ENROLLMENT" : "UNENROLLED"}
                  </span>
                </div>

                <button
                  disabled={isTogglingEnrollment}
                  onClick={handleToggleEnrollment}
                  className={`w-full py-3 rounded-xl text-xs font-extrabold shadow-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                    isTogglingEnrollment
                      ? "bg-amber-500 text-white cursor-wait opacity-90 shadow-md scale-98"
                      : isEnrolled
                      ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 active:scale-98"
                      : "bg-[#0E6875] hover:bg-[#0B4E58] text-white active:scale-98"
                  }`}
                >
                  {isTogglingEnrollment ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                      <span>Updating Diploma Access & Module Keys...</span>
                    </>
                  ) : (
                    <>
                      <i className={`fa-solid ${isEnrolled ? "fa-user-xmark" : "fa-user-check"}`}></i>
                      <span>
                        {isEnrolled
                          ? "Remove / Revoke Full Diploma Access"
                          : "Grant Full Diploma Access"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Granular Module Unlocks List */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Granular Module Unlocks ({allModules.length} Modules)
                </div>
                <div className="space-y-2">
                  {allModules.map((m, idx) => {
                    const isIntro = idx === 0 || m.moduleNumber === "00" || m.id === "intro" || m.title.toUpperCase().includes("INTRO");
                    const isUnlocked = isIntro || unlockedModuleIds.some((id: any) => {
                      if (!id) return false;
                      const idStr = String(id).toLowerCase().trim();
                      const mIdStr = String(m.id).toLowerCase().trim();
                      const mNumStr = String(m.moduleNumber).toLowerCase().trim();
                      return idStr === mIdStr || idStr === mNumStr || idStr.includes(mNumStr) || (mNumStr.length > 0 && idStr.endsWith(mNumStr));
                    });
                    const isModuleLoading = togglingModuleId === m.id;

                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between gap-3 ${
                          isUnlocked || isEnrolled
                            ? "bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-xs"
                            : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl font-extrabold text-[11px] flex items-center justify-center shrink-0 ${
                            isUnlocked || isEnrolled || isIntro
                              ? "bg-emerald-200 text-emerald-900"
                              : "bg-gray-200/80 text-gray-800"
                          }`}>
                            {m.moduleNumber}
                          </span>
                          <div>
                            <div className="font-extrabold text-[#1C2B2D]">{m.title}</div>
                            <div className="text-[10px] font-bold mt-0.5">
                              {isIntro ? (
                                <span className="text-emerald-700 font-extrabold">Always Free & Available to All</span>
                              ) : isEnrolled ? (
                                <span className="text-emerald-700 font-extrabold">Unlocked via Full Diploma Pass</span>
                              ) : isUnlocked ? (
                                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                                  <i className="fa-solid fa-circle-check text-emerald-600"></i>
                                  <span>Module Access Granted</span>
                                </span>
                              ) : (
                                <span className="text-gray-400 font-medium">Access Locked</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isIntro ? (
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                              <i className="fa-solid fa-lock-open text-[10px] text-emerald-600"></i>
                              <span>FREE UNLOCKED</span>
                            </span>
                          ) : isModuleLoading ? (
                            <button
                              disabled
                              className="px-3 py-1.5 bg-gray-100 text-gray-500 font-extrabold text-[11px] rounded-xl border border-gray-300 flex items-center gap-1.5 cursor-wait"
                            >
                              <i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i>
                              <span>Updating...</span>
                            </button>
                          ) : isUnlocked ? (
                            <button
                              type="button"
                              disabled={isTogglingEnrollment}
                              onClick={() => handleToggleModuleUnlock(m.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-red-600 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 group"
                              title="Click to revoke module access"
                            >
                              <i className="fa-solid fa-check text-[10px] group-hover:hidden"></i>
                              <i className="fa-solid fa-xmark text-[10px] hidden group-hover:inline"></i>
                              <span className="group-hover:hidden">GRANTED</span>
                              <span className="hidden group-hover:inline">REVOKE ACCESS</span>
                            </button>
                          ) : isEnrolled ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-200 text-emerald-900">
                              FULL PASS
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={isTogglingEnrollment}
                              onClick={() => handleToggleModuleUnlock(m.id)}
                              className="px-3 py-1.5 bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                            >
                              <i className="fa-solid fa-key text-[10px]"></i>
                              <span>Grant Access</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISPATCH CUSTOM CONTENT & TASKS */}
          {activeTab === "assign" && (
            <div className="space-y-6 animate-fadeIn">
              <form
                onSubmit={handleAssignContent}
                className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200"
              >
                <div className="text-xs font-black text-[#0E6875] uppercase tracking-wider border-b border-gray-200 pb-2">
                  Send Custom Playbook or Task
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">
                    Task / Content Title *
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                    placeholder="e.g. Customized B2B SaaS Pitch Deck Feedback"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1">
                    Instructions & Description *
                  </label>
                  <textarea
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    required
                    rows={3}
                    placeholder="Provide specific instructions or playbook breakdown for the student..."
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 mb-1">
                      Attachment Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 mb-1">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingTask}
                  className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white text-xs font-extrabold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSendingTask ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Send to Student</span>
                    </>
                  )}
                </button>
              </form>

              {/* Sent Tasks Log */}
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Sent Custom Content History (
                  {studentDetail?.customAssignments?.length || 0})
                </div>
                {studentDetail?.customAssignments &&
                studentDetail.customAssignments.length > 0 ? (
                  <div className="space-y-2">
                    {studentDetail.customAssignments.map((task: any) => (
                      <div
                        key={task.id}
                        className="bg-white p-3.5 rounded-xl border border-gray-200 text-xs space-y-1"
                      >
                        <div className="font-extrabold text-[#1C2B2D] flex items-center justify-between">
                          <span>{task.title}</span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px] leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-gray-400 font-medium bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    No custom content sent to this student yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROGRESS AUDIT */}
          {activeTab === "progress" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center">
                  <div className="text-xs font-bold text-gray-500">
                    Completed Lessons
                  </div>
                  <div className="text-2xl font-black text-[#0E6875]">
                    {studentDetail?.lessonProgress?.filter(
                      (p: any) => p.isCompleted,
                    ).length || 0}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                  <div className="text-xs font-bold text-gray-500">
                    Certificates Earned
                  </div>
                  <div className="text-2xl font-black text-amber-600">
                    {studentDetail?.certificates?.length || 0}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                  Lesson Progress Activity
                </div>
                {studentDetail?.lessonProgress &&
                studentDetail.lessonProgress.length > 0 ? (
                  <div className="space-y-2">
                    {studentDetail.lessonProgress.map((p: any) => (
                      <div
                        key={p.id}
                        className="p-3 bg-white rounded-xl border border-gray-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-extrabold text-gray-800">
                            {p.lesson?.title || `Lesson ${p.lessonId}`}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Watch duration:{" "}
                            {Math.round(p.watchDurationSec / 60)} mins
                          </div>
                        </div>
                        <span className="text-emerald-600 font-bold">
                          ✓ Completed
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-gray-400 font-medium bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    No lesson activity recorded for this student yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer Close */}
        <div className="p-4 sm:px-8 border-t border-gray-200 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer"
          >
            Done / Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
