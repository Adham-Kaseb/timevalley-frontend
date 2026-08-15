"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/lib/axios";

interface Coupon {
  id: string;
  code: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  minPurchaseAmount: number;
  validFrom: string;
  validUntil?: string | null;
  maxRedemptions?: number | null;
  timesRedeemed: number;
  allowStacking: boolean;
  applicableScope: string;
  status: "ACTIVE" | "DISABLED" | "EXPIRED";
  createdAt: string;
}

interface CouponManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CouponManagerModal({ isOpen, onClose }: CouponManagerModalProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Animated Opening & Closing states
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  // Form State for New Coupon
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"FIXED" | "PERCENTAGE">("FIXED");
  const [discountValue, setDiscountValue] = useState<number>(500);
  const [minPurchaseAmount, setMinPurchaseAmount] = useState<number>(0);
  const [validUntil, setValidUntil] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState<string>("");
  const [allowStacking, setAllowStacking] = useState(false);
  const [applicableScope, setApplicableScope] = useState("DIPLOMA");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/coupons");
      if (Array.isArray(res.data)) {
        setCoupons(res.data);
      }
    } catch (e: any) {
      console.warn("Failed to fetch coupons:", e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      fetchCoupons();
      setErrorMsg("");
      setSuccessMsg("");
    } else if (isMounted && !isClosing) {
      handleCloseWithAnimation();
    }
  }, [isOpen]);

  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMounted(false);
      setIsClosing(false);
      onClose();
    }, 200);
  };

  if (!isMounted && !isOpen) return null;

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!code.trim()) {
      setErrorMsg("Please enter a coupon code.");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post("/coupons", {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minPurchaseAmount: Number(minPurchaseAmount) || 0,
        validUntil: validUntil ? new Date(validUntil).toISOString() : null,
        maxRedemptions: maxRedemptions ? Number(maxRedemptions) : null,
        allowStacking,
        applicableScope,
      });

      setSuccessMsg(`Coupon "${code.trim().toUpperCase()}" created successfully!`);
      setCode("");
      setDiscountValue(500);
      setValidUntil("");
      setMaxRedemptions("");
      setAllowStacking(false);
      fetchCoupons();
      setActiveTab("list");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Failed to create coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const newStatus = coupon.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    try {
      await apiClient.patch(`/coupons/${coupon.id}`, { status: newStatus });
      fetchCoupons();
    } catch (e: any) {
      alert("Failed to update status");
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      await apiClient.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (e: any) {
      alert("Failed to delete coupon");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-9999 overflow-y-auto bg-black/70 backdrop-blur-md p-4 sm:p-6 lg:pl-72 flex items-start justify-center pt-6 sm:pt-10 transition-all duration-200 ${
        isClosing ? "animate-out fade-out" : "animate-in fade-in"
      }`}
    >
      <div
        className={`relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 text-[#1C2B2D] overflow-hidden mb-12 transition-all duration-200 ${
          isClosing ? "animate-out zoom-out-95 fade-out" : "animate-in zoom-in-95 fade-in"
        }`}
      >
        {/* Header Section */}
        <div className="bg-linear-to-r from-[#0E6875] via-[#118494] to-[#0E6875] p-6 sm:p-8 text-white relative">
          <button
            onClick={handleCloseWithAnimation}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>

          <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <i className="fa-solid fa-ticket text-[#EDA296]"></i>
            <span>DIPLOMA COUPON ENGINE</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Diploma Promo & Discount Coupons
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            Create, manage usage limits, duration, stacking rules, and active discount codes.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-3 pt-6">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "list"
                  ? "bg-white text-[#0E6875] shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <i className="fa-solid fa-list-check mr-2 text-[#0E6875]"></i>
              <span>Active Coupons ({coupons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("create")}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "create"
                  ? "bg-white text-[#0E6875] shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <i className="fa-solid fa-plus mr-2 text-[#0E6875]"></i>
              <span>+ Create New Coupon</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">

          {/* TAB 1: ACTIVE COUPONS LIST */}
          {activeTab === "list" && (
            <div className="space-y-4">
              {loading ? (
                <div className="py-12 text-center text-gray-400 font-bold text-xs">
                  <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2 text-[#0E6875] block"></i>
                  Loading coupons...
                </div>
              ) : coupons.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
                  <i className="fa-solid fa-ticket text-4xl text-gray-300"></i>
                  <h4 className="text-sm font-black text-gray-700">No Custom Coupons Yet</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Default codes <code className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-[#0E6875]">FOUNDER2026</code> (-500 LE) and <code className="font-mono bg-gray-200 px-1.5 py-0.5 rounded text-[#0E6875]">EARLYBIRD</code> (-1,000 LE) are enabled by default.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-5 py-2.5 bg-[#0E6875] text-white text-xs font-extrabold rounded-xl hover:bg-[#0c5964] transition-all cursor-pointer"
                  >
                    + Create First Coupon
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black text-[#0E6875] bg-[#0E6875]/10 px-3 py-1 rounded-lg border border-[#0E6875]/20">
                            {c.code}
                          </span>

                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                              c.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : c.status === "EXPIRED"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {c.status}
                          </span>

                          {c.allowStacking && (
                            <span className="text-[9px] bg-purple-100 text-purple-700 font-extrabold px-2 py-0.5 rounded-md">
                              Stackable
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-600 font-medium flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                          <span>
                            Discount: <strong className="text-[#1C2B2D] font-bold">
                              {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `${c.discountValue.toLocaleString()} LE OFF`}
                            </strong>
                          </span>

                          <span>
                            Redemptions: <strong className="text-[#1C2B2D] font-bold">
                              {c.timesRedeemed} / {c.maxRedemptions ? c.maxRedemptions : "∞"}
                            </strong>
                          </span>

                          {c.validUntil && (
                            <span>
                              Expires: <strong className="text-gray-700 font-mono">
                                {new Date(c.validUntil).toLocaleDateString()}
                              </strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            c.status === "ACTIVE"
                              ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {c.status === "ACTIVE" ? "Disable" : "Activate"}
                        </button>

                        <button
                          onClick={() => handleDeleteCoupon(c.id, c.code)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold hover:bg-red-100 transition-all cursor-pointer"
                        >
                          <i className="fa-solid fa-trash text-xs mr-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CREATE COUPON FORM */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateCoupon} className="space-y-4 animate-in fade-in duration-200">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Coupon Code */}
                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    Coupon Code (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER2026 or FOUNDER50"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#0E6875] uppercase"
                  />
                </div>

                {/* Custom Styled Discount Type Dropdown */}
                <div className="relative">
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    Discount Type *
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-extrabold text-[#1C2B2D] flex items-center justify-between focus:outline-none focus:border-[#0E6875] focus:ring-2 focus:ring-[#0E6875]/20 shadow-xs cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <i className={`fa-solid ${discountType === "FIXED" ? "fa-money-bill-wave text-[#0E6875]" : "fa-percent text-[#0E6875]"}`}></i>
                      <span>{discountType === "FIXED" ? "Fixed Amount (LE)" : "Percentage (%)"}</span>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-[#0E6875]" : ""}`}></i>
                  </button>

                  {/* Styled Dropdown Menu Overlay */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                      <div
                        onClick={() => {
                          setDiscountType("FIXED");
                          setIsDropdownOpen(false);
                        }}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between cursor-pointer transition-all ${
                          discountType === "FIXED"
                            ? "bg-[#0E6875]/10 text-[#0E6875]"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#0E6875]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <i className="fa-solid fa-money-bill-wave text-[#0E6875]"></i>
                          <span>Fixed Amount (LE)</span>
                        </div>
                        {discountType === "FIXED" && <i className="fa-solid fa-check text-xs text-[#0E6875]"></i>}
                      </div>

                      <div
                        onClick={() => {
                          setDiscountType("PERCENTAGE");
                          setIsDropdownOpen(false);
                        }}
                        className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between cursor-pointer transition-all ${
                          discountType === "PERCENTAGE"
                            ? "bg-[#0E6875]/10 text-[#0E6875]"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#0E6875]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <i className="fa-solid fa-percent text-[#0E6875]"></i>
                          <span>Percentage (%)</span>
                        </div>
                        {discountType === "PERCENTAGE" && <i className="fa-solid fa-check text-xs text-[#0E6875]"></i>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Discount Value */}
                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    Discount Value ({discountType === "FIXED" ? "LE Amount" : "% Percentage"}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    placeholder={discountType === "FIXED" ? "e.g. 500 LE" : "e.g. 20%"}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#0E6875]"
                  />
                </div>

                {/* Max Redemptions */}
                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    Max Redemptions / Uses (Leave empty for unlimited)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={maxRedemptions}
                    onChange={(e) => setMaxRedemptions(e.target.value)}
                    placeholder="e.g. 100 uses"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#0E6875]"
                  />
                </div>

                {/* Expiration Date */}
                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#0E6875] bg-white"
                  />
                </div>

                {/* Minimum Purchase Amount */}
                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    Minimum Order Amount (LE)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minPurchaseAmount}
                    onChange={(e) => setMinPurchaseAmount(Number(e.target.value))}
                    placeholder="e.g. 0 LE"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#0E6875]"
                  />
                </div>

              </div>

              {/* Stackability Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowStacking}
                    onChange={(e) => setAllowStacking(e.target.checked)}
                    className="w-4 h-4 text-[#0E6875] rounded focus:ring-[#0E6875]"
                  />
                  <span className="text-xs font-extrabold text-gray-700">
                    Allow Stacking / Combination with other active platform discounts
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0E6875] text-white text-xs font-black hover:bg-[#0c5964] transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Creating Coupon..." : "+ Publish Coupon"}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
