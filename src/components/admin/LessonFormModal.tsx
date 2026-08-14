"use client";

import { useState, useEffect } from "react";
import adminService, { AdminLessonPayload } from "@/services/admin";

export interface MaterialItem {
  name: string;
  size: string;
  type: string;
  url?: string;
}

interface LessonFormModalProps {
  isOpen: boolean;
  moduleId: string;
  onClose: () => void;
  onSuccess: () => void;
  lessonToEdit?: {
    id: string;
    lessonNumber: number;
    title: string;
    desc: string;
    duration: string;
    videoUrl: string;
    materials?: MaterialItem[];
  } | null;
}

export default function LessonFormModal({
  isOpen,
  moduleId,
  onClose,
  onSuccess,
  lessonToEdit,
}: LessonFormModalProps) {
  const [lessonNumber, setLessonNumber] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("25 Mins");
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
  
  // Dynamic Downloadable Materials State
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [matName, setMatName] = useState("");
  const [matSize, setMatSize] = useState("1.2 MB");
  const [matType, setMatType] = useState("pdf");
  const [matUrl, setMatUrl] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lessonToEdit) {
      setLessonNumber(lessonToEdit.lessonNumber || 1);
      setTitle(lessonToEdit.title || "");
      setDesc(lessonToEdit.desc || "");
      setDuration(lessonToEdit.duration || "25 Mins");
      setVideoUrl(lessonToEdit.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
      
      if (Array.isArray(lessonToEdit.materials)) {
        setMaterials(lessonToEdit.materials);
      } else {
        setMaterials([]);
      }
    } else {
      setLessonNumber(1);
      setTitle("");
      setDesc("");
      setDuration("25 Mins");
      setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
      setMaterials([
        { name: "Step 1 Founder Guide (PDF)", size: "1.2 MB", type: "pdf", url: "#" },
        { name: "Day-Zero Checklist (.XLSX)", size: "850 KB", type: "excel", url: "#" },
      ]);
    }
    setMatName("");
    setMatSize("1.2 MB");
    setMatType("pdf");
    setMatUrl("");
    setEditingIndex(null);
    setError("");
  }, [lessonToEdit, isOpen]);

  if (!isOpen) return null;

  // Add or Save Material
  const handleSaveMaterial = () => {
    if (!matName.trim()) return;

    const newItem: MaterialItem = {
      name: matName.trim(),
      size: matSize.trim() || "1.2 MB",
      type: matType,
      url: matUrl.trim() || "#",
    };

    if (editingIndex !== null) {
      const updated = [...materials];
      updated[editingIndex] = newItem;
      setMaterials(updated);
      setEditingIndex(null);
    } else {
      setMaterials([...materials, newItem]);
    }

    setMatName("");
    setMatSize("1.2 MB");
    setMatType("pdf");
    setMatUrl("");
  };

  // Edit existing material
  const handleStartEditMaterial = (index: number) => {
    const target = materials[index];
    if (target) {
      setMatName(target.name);
      setMatSize(target.size || "1.2 MB");
      setMatType(target.type || "pdf");
      setMatUrl(target.url || "");
      setEditingIndex(index);
    }
  };

  // Delete material
  const handleDeleteMaterial = (index: number) => {
    setMaterials(materials.filter((_, idx) => idx !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setMatName("");
      setMatSize("1.2 MB");
      setMatType("pdf");
      setMatUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !desc.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: AdminLessonPayload = {
        moduleId,
        lessonNumber: Number(lessonNumber) || 1,
        title: title.trim(),
        desc: desc.trim(),
        duration: duration.trim() || "25 Mins",
        videoUrl: videoUrl.trim(),
        materials: materials,
      };

      if (lessonToEdit) {
        await adminService.updateLesson(lessonToEdit.id, payload);
      } else {
        await adminService.createLesson(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to save lesson:", err);
      setError(err.response?.data?.message || err.message || "Failed to save lesson.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative animate-modal-pop max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold transition-all cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="text-left space-y-1.5 mb-5 border-b border-gray-200/80 pb-4">
          <div className="inline-flex items-center gap-2 bg-[#E6F3F5] text-[#0E6875] text-xs font-black px-3 py-1 rounded-full">
            <i className="fa-solid fa-play"></i>
            <span>Diploma Lesson Builder</span>
          </div>
          <h2 className="text-2xl font-black text-[#1C2B2D]">
            {lessonToEdit ? "Edit Lesson & Materials" : "Add Lesson to Module"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Global Lesson # *</label>
              <input
                type="number"
                value={lessonNumber}
                onChange={(e) => setLessonNumber(Number(e.target.value))}
                required
                min={1}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1">Duration *</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                placeholder="e.g. 30 Mins"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Lesson Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Lesson 41: Advanced SAFEs & Equity Math"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Video Stream URL *</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              placeholder="https://..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-700 mb-1">Lesson Breakdown & Description *</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              rows={2}
              placeholder="Detailed breakdown of what students learn in this video lesson..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
            />
          </div>

          {/* DYNAMIC LESSON DOWNLOADABLE MATERIALS MANAGER */}
          <div className="pt-3 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-2">
                <i className="fa-solid fa-paperclip text-[#0E6875]"></i>
                <span>Lesson Downloadable Materials ({materials.length})</span>
              </h4>
            </div>

            {/* List of Current Materials */}
            {materials.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {materials.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-all ${
                      editingIndex === idx
                        ? "bg-[#E6F3F5] border-[#0E6875] ring-1 ring-[#0E6875]"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <i className={`text-sm shrink-0 ${
                        item.type === 'excel' || item.type === 'xlsx'
                          ? 'fa-solid fa-file-excel text-emerald-600'
                          : item.type === 'word' || item.type === 'docx'
                          ? 'fa-solid fa-file-word text-blue-600'
                          : item.type === 'zip'
                          ? 'fa-solid fa-file-zipper text-amber-600'
                          : 'fa-solid fa-file-pdf text-rose-500'
                      }`} />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate">{item.name}</p>
                        <span className="text-[10px] text-gray-400 font-mono">{item.size || "1.2 MB"} • {item.type.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEditMaterial(idx)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#0E6875] hover:bg-white transition-all text-xs"
                        title="Edit Material"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(idx)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-white transition-all text-xs"
                        title="Delete Material"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium italic p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                No downloadable materials attached yet. Use the form below to add PDFs, spreadsheets, or toolkits.
              </p>
            )}

            {/* Add / Edit Material Inline Form */}
            <div className="p-3 bg-slate-50 border border-gray-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-black text-[#0E6875]">
                <span>{editingIndex !== null ? "✏️ Edit Downloadable File" : "➕ Add Downloadable File"}</span>
                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIndex(null);
                      setMatName("");
                      setMatSize("1.2 MB");
                      setMatType("pdf");
                      setMatUrl("");
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={matName}
                    onChange={(e) => setMatName(e.target.value)}
                    placeholder="Document Name (e.g. Day-Zero Checklist)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>
                <div>
                  <select
                    value={matType}
                    onChange={(e) => setMatType(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  >
                    <option value="pdf">PDF Document (.PDF)</option>
                    <option value="excel">Excel Sheet (.XLSX)</option>
                    <option value="word">Word Document (.DOCX)</option>
                    <option value="zip">ZIP Archive (.ZIP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    value={matSize}
                    onChange={(e) => setMatSize(e.target.value)}
                    placeholder="File Size (e.g. 1.2 MB)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="url"
                    value={matUrl}
                    onChange={(e) => setMatUrl(e.target.value)}
                    placeholder="Download URL (Optional e.g. https://...)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E6875]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveMaterial}
                disabled={!matName.trim()}
                className="w-full py-2 bg-[#E6F3F5] hover:bg-[#D4ECF0] text-[#0E6875] font-extrabold text-xs rounded-xl border border-[#0E6875]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <i className={`fa-solid ${editingIndex !== null ? "fa-check" : "fa-plus"}`}></i>
                <span>{editingIndex !== null ? "Update File" : "Add File to Lesson"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>{lessonToEdit ? "Save Lesson & Materials" : "Add Lesson"}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
