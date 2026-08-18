"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  verifyCertificate,
  VerificationResponse,
} from "@/src/services/certificate";

function CertificateVerificationContent() {
  const searchParams = useSearchParams();
  const initialSerial =
    searchParams.get("serial") || searchParams.get("code") || "";
  const shouldAutoDownload = searchParams.get("download") === "true";

  const [serialCode, setSerialCode] = useState(initialSerial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialSerial) {
      handleSearch(initialSerial);
    }
  }, [initialSerial]);

  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!result) return;
    setIsDownloadingPDF(true);

    try {
      if (!(window as any).jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const { jsPDF } = (window as any).jspdf;
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const width = doc.internal.pageSize.getWidth(); // 297 mm
      const height = doc.internal.pageSize.getHeight(); // 210 mm

      // Background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, width, height, "F");

      // Outer Teal Border Frame
      doc.setDrawColor(14, 104, 117); // #0E6875
      doc.setLineWidth(3.5);
      doc.rect(8, 8, width - 16, height - 16);

      // Inner Gold Accent Frame
      doc.setDrawColor(217, 119, 6); // amber-600
      doc.setLineWidth(1);
      doc.rect(11, 11, width - 22, height - 22);

      // Corner Ornaments
      doc.setDrawColor(14, 104, 117);
      doc.setLineWidth(0.5);
      doc.circle(17, 17, 3);
      doc.circle(width - 17, 17, 3);

      // Organization Header
      doc.setTextColor(14, 104, 117);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TIMEVALLEY INSTITUTE OF ENTREPRENEURSHIP", width / 2, 28, { align: "center" });

      // Title
      doc.setTextColor(17, 24, 39); // gray-900
      doc.setFontSize(24);
      doc.text("Official Certificate of Completion & Excellence", width / 2, 42, { align: "center" });

      // Certification Subtitle
      doc.setTextColor(107, 114, 128); // gray-500
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("This is to certify that the graduate candidate", width / 2, 56, { align: "center" });

      // Candidate Name
      doc.setTextColor(14, 104, 117); // teal
      doc.setFont("times", "bold");
      doc.setFontSize(32);
      doc.text(result.recipient.name, width / 2, 72, { align: "center" });

      if (result.recipient.studentId) {
        doc.setTextColor(156, 163, 175);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Student ID: ${result.recipient.studentId}`, width / 2, 80, { align: "center" });
      }

      // Accreditation text
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(
        "has successfully completed all required training modules, evaluations, and coursework,",
        width / 2,
        93,
        { align: "center" }
      );
      doc.text("earning official accreditation in:", width / 2, 100, { align: "center" });

      // Wide Diploma Award Box across 220mm
      doc.setFillColor(254, 243, 199); // amber-100
      doc.setDrawColor(252, 211, 77); // amber-300
      doc.setLineWidth(0.5);
      doc.roundedRect(width / 2 - 110, 107, 220, 24, 4, 4, "FD");

      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(result.title, width / 2, 117, { align: "center" });

      doc.setTextColor(146, 64, 14); // amber-800
      doc.setFontSize(9);
      doc.text("Venture Architect & Startup Engineering Track (120 Training Hours)", width / 2, 125, { align: "center" });

      // Wide Footer divider line across 237mm
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(30, 145, width - 30, 145);

      // Wide Metadata Grid
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(8);
      doc.text("VERIFIED SERIAL CODE", 40, 153);
      doc.setTextColor(17, 24, 39);
      doc.setFont("courier", "bold");
      doc.setFontSize(11);
      doc.text(result.code, 40, 160);

      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("ISSUE DATE", width / 2, 153, { align: "center" });
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      const dateStr = new Date(result.issueDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      doc.text(dateStr, width / 2, 160, { align: "center" });

      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("ISSUING BODY & GOVERNANCE", width - 40, 153, { align: "right" });
      doc.setTextColor(14, 104, 117);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`${result.issuer.founder} (${result.issuer.title})`, width - 40, 160, { align: "right" });

      // Signatures & Official Seal
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(8);
      doc.text("MANAGING PARTNER SIGNATURE", 40, 177);
      doc.setTextColor(14, 104, 117);
      doc.setFont("times", "bolditalic");
      doc.setFontSize(15);
      doc.text("Dr. Wael Signature", 40, 186);

      // Official Seal Stamp on Right
      doc.setDrawColor(245, 158, 11); // amber-500
      doc.setFillColor(254, 243, 199);
      doc.setLineWidth(1);
      doc.circle(width - 40, 180, 10, "FD");
      doc.setTextColor(180, 83, 9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("TIMEVALLEY", width - 40, 179, { align: "center" });
      doc.text("SEAL", width - 40, 183, { align: "center" });

      doc.save(`TimeValley-Certificate-${result.code}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setIsDownloadingPDF(false);
    }
  };



  const handleSearch = async (codeToSearch?: string) => {
    const query = (codeToSearch || serialCode).trim();
    if (!query) {
      setError(
        "Please enter a valid certificate serial code or verification ID.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await verifyCertificate(query);
      setResult(data);
    } catch (err: any) {
      setError(
        err?.message ||
          "No verified certificate found matching this serial code. Please verify the code and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && result) {
      const url = `${window.location.origin}/our-certificates?serial=${encodeURIComponent(result.code)}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f2f7f8] via-white to-gray-50 text-gray-900 pb-20">
      {/* GLOBAL PRINT STYLES FOR SINGLE-PAGE LANDSCAPE CERTIFICATE GENERATION */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0 !important;
          }
          html,
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide standard website components */
          header,
          nav,
          footer,
          .no-print {
            display: none !important;
          }
          /* Force printable container to occupy full landscape sheet */
          #printable-certificate-document {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 2.5rem !important;
            box-sizing: border-box !important;
            border-width: 10px !important;
            border-color: #0e6875 !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            box-shadow: none !important;
            z-index: 99999 !important;
          }
        }
      `}</style>

      {/* HERO BANNER */}
      <section className="relative bg-[#072F35] text-white pt-24 pb-20 px-4 sm:px-6 overflow-hidden no-print">
        <div className="absolute inset-0 bg-radial from-[#0E6875]/40 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Official Certificate & Credential Verification
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Instant verification portal for official credentials issued by
            TimeValley Entrepreneurship & Venture Institute. Authenticate
            diploma ownership and graduate credentials using your unique Serial
            Code.
          </p>

          {/* SEARCH INPUT BOX */}
          <div className="max-w-2xl mx-auto pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-2xl border border-white/20"
            >
              <div className="relative flex-1 w-full flex items-center px-4">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-base"></i>
                <input
                  type="text"
                  value={serialCode}
                  onChange={(e) => setSerialCode(e.target.value)}
                  placeholder="Enter Certificate Serial Code (e.g. TV-DIP-2026-X89F2A)"
                  className="w-full bg-transparent border-none outline-none py-3 px-3 text-gray-900 font-mono text-sm sm:text-base placeholder:text-gray-400"
                />
                {serialCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setSerialCode("");
                      setResult(null);
                      setError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl sm:rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Verifying Credential...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check text-xs"></i>
                    <span>Verify Credential</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400 font-mono">
              <span>Sample Test Code:</span>
              <button
                type="button"
                onClick={() => {
                  setSerialCode("TV-DIP-2026-X89F2A");
                  handleSearch("TV-DIP-2026-X89F2A");
                }}
                className="underline hover:text-emerald-300 transition-colors"
              >
                TV-DIP-2026-X89F2A
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS / VERIFICATION CONTENT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {error && (
          <div className="bg-white rounded-3xl border border-red-200 p-8 shadow-xl text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-3xl mx-auto border border-red-200 shadow-xs">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900">
                Certificate Not Found
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {error}
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setSerialCode("")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Try Another Serial Code
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-fadeIn">
            {/* VERIFIED STATUS BADGE CARD */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden no-print">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0 border border-emerald-200/80 shadow-xs">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-emerald-100/80 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-300/80 uppercase tracking-wider inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      100% Authenticated & Verified
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-mono font-bold px-3 py-1 rounded-full border border-gray-200">
                      #{result.code}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    Official Verified Certificate Issued by TimeValley
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Issue Date:{" "}
                    {new Date(result.issueDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPDF}
                  className="flex-1 md:flex-initial bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap disabled:opacity-60 active:scale-95"
                >
                  {isDownloadingPDF ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-file-pdf text-xs"></i>
                      <span>Download Official PDF 🎓</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <i
                    className={`fa-solid ${copied ? "fa-check text-emerald-600" : "fa-link"}`}
                  ></i>
                  <span>
                    {copied ? "Link Copied!" : "Copy Verification Link"}
                  </span>
                </button>
              </div>
            </div>

            {/* CERTIFICATE VISUAL CANVAS CARD */}
            <div
              id="printable-certificate-document"
              style={{
                backgroundColor: "#ffffff",
                backgroundImage:
                  "linear-gradient(to top right, #fef9f6, #ffffff, #f0f7f8)",
              }}
              className="rounded-3xl border-8 border-[#0E6875] p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden"
            >
              {/* WATERMARK BACKGROUND SEAL */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <i className="fa-solid fa-award text-[320px] text-[#0E6875]"></i>
              </div>

              {/* CORNER ORNAMENTS */}
              <div className="absolute top-4 left-4 text-[#0E6875]/40 text-xl">
                <i className="fa-solid fa-certificate"></i>
              </div>
              <div className="absolute top-4 right-4 text-[#0E6875]/40 text-xl">
                <i className="fa-solid fa-certificate"></i>
              </div>

              <div className="space-y-6 relative z-10 max-w-4xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-[#0E6875] text-white flex items-center justify-center text-4xl mx-auto shadow-lg border-4 border-amber-300">
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>

                <div>
                  <span className="text-[#0E6875] text-xs font-black tracking-widest uppercase block">
                    {result.issuer.organization}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                    Official Certificate of Completion & Excellence
                  </h3>
                </div>

                <div className="py-2">
                  <p className="text-xs sm:text-sm text-gray-500">
                    This is to certify that the graduate candidate
                  </p>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0E6875] mt-1 font-serif underline decoration-amber-400 underline-offset-8">
                    {result.recipient.name}
                  </h4>
                  {result.recipient.studentId && (
                    <span className="text-[11px] text-gray-400 font-mono block mt-2">
                      Student ID: {result.recipient.studentId}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  has successfully completed all required training modules,
                  evaluations, and coursework, earning official accreditation
                  in:
                </p>

                <div
                  style={{
                    backgroundColor: "#fffbf2",
                    borderColor: "#fcd34d",
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
                  className="rounded-2xl p-4 sm:p-5 shadow-xs"
                >
                  <h5 className="text-lg sm:text-xl font-extrabold text-gray-900">
                    {result.title}
                  </h5>
                  <span className="text-xs text-amber-800 font-bold block mt-1">
                    Venture Architect & Startup Engineering Track (120 Training
                    Hours)
                  </span>
                </div>

                {/* METADATA FOOTER GRID */}
                <div className="pt-8 border-t border-gray-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
                  <div className="space-y-1">
                    <span className="text-gray-400 block text-[11px]">
                      Verified Serial Code
                    </span>
                    <strong className="font-mono text-gray-900 text-sm block">
                      {result.code}
                    </strong>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400 block text-[11px]">
                      Issue Date
                    </span>
                    <strong className="text-gray-900 text-sm block">
                      {new Date(result.issueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </strong>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400 block text-[11px]">
                      Issuing Body & Governance
                    </span>
                    <strong className="text-[#0E6875] text-xs block font-extrabold">
                      {result.issuer.founder} ({result.issuer.title})
                    </strong>
                  </div>
                </div>

                {/* SIGNATURE & SEAL ROW */}
                <div className="pt-6 flex items-center justify-between border-t border-dashed border-gray-200">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">
                      Managing Partner Signature
                    </span>
                    <div className="font-serif italic text-lg text-[#0E6875] font-bold">
                      Dr. Wael Signature
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-600 bg-amber-50 shadow-inner">
                    <i className="fa-solid fa-award text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* RECIPIENT PROFILE METRICS */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4 no-print">
              <h4 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-user-graduate text-[#0E6875]"></i>
                <span>Graduate Candidate Metadata</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0E6875] text-white flex items-center justify-center text-sm font-extrabold shrink-0">
                    {result.recipient.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">
                      Full Graduate Name
                    </span>
                    <strong className="text-gray-900 text-sm">
                      {result.recipient.name}
                    </strong>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm shrink-0">
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">
                      Current Venture / Startup
                    </span>
                    <strong className="text-gray-900 text-sm">
                      {result.recipient.companyName ||
                        "TimeValley Founder Candidate"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT FAQ SECTION */}
        {!result && !error && (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6 no-print">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-900">
                How Credential Verification Works
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                The platform ensures complete cryptographic anti-forgery
                protection by issuing a unique, immutable serial code to every
                graduate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#0E6875] text-white flex items-center justify-center text-lg mx-auto shadow-sm">
                  <i className="fa-solid fa-qrcode"></i>
                </div>
                <h4 className="font-extrabold text-gray-900">
                  Unique Serial Hash
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  Every document carries an unforgeable serial code
                  cryptographically linked to the graduate's database record.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-lg mx-auto shadow-sm">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <h4 className="font-extrabold text-gray-900">
                  Automated Email Dispatch
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  An official verified email is automatically dispatched upon
                  diploma fulfillment with direct credential access links.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg mx-auto shadow-sm">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <h4 className="font-extrabold text-gray-900">
                  Investor & Employer Access
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  Employers, venture partners, and investors can input the
                  serial code to instantly verify graduate identity and track
                  completion.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function CertificateVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF0E9] flex items-center justify-center p-6">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-md border border-gray-200">
            <i className="fa-solid fa-spinner animate-spin text-[#0E6875] text-lg"></i>
            <span className="text-sm font-black text-gray-800 font-sans">
              Loading Verification Portal...
            </span>
          </div>
        </div>
      }
    >
      <CertificateVerificationContent />
    </Suspense>
  );
}
