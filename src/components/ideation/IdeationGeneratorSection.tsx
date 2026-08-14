"use client";

import React, { useState } from "react";

export default function IdeationGeneratorSection() {
  const [industry, setIndustry] = useState("AI & Autonomous Agents");
  const [target, setTarget] = useState("B2B Enterprise SaaS");
  const [problem, setProblem] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<null | {
    title: string;
    desc: string;
    tam: string;
    score: number;
  }>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setResult(null);

    setTimeout(() => {
      setIsGenerating(false);
      setResult({
        title: `${industry} Automated Protocol`,
        desc: `Zero-knowledge automated validation platform engineered for ${target} systems. Solve pain points around data integrity, velocity, and regulatory alignment.`,
        tam: "$14.2 Billion",
        score: 94,
      });
    }, 1200);
  };

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold uppercase tracking-wider mb-2">
          <i className="fa-solid fa-lightbulb"></i> Ideation Engine
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1C2B2D] leading-tight">
          Venture Idea Generator & <span className="text-[#0E6875]">Validation Matrix</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Formulate disruptive startup theses, evaluate addressable market size, and leverage AI market synthesis.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls Column */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-[#1C2B2D] mb-6 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-[#0E6875]"></i>
            <span>Configure Venture Parameters</span>
          </h3>

          <div className="space-y-5">
            {/* Target Industry */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Target Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#0E6875] focus:ring-2 focus:ring-[#0E6875]/20 transition-all cursor-pointer"
              >
                <option value="AI & Autonomous Agents">AI & Autonomous Agents</option>
                <option value="Fintech & Trade Infrastructure">Fintech & Trade Infrastructure</option>
                <option value="Clinical HealthTech AI">Clinical HealthTech AI</option>
                <option value="Supply Chain & Logistics SaaS">Supply Chain & Logistics SaaS</option>
                <option value="Enterprise Cyber & Security">Enterprise Cyber & Security</option>
              </select>
            </div>

            {/* Customer Persona */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Customer Persona
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#0E6875] focus:ring-2 focus:ring-[#0E6875]/20 transition-all cursor-pointer"
              >
                <option value="B2B Enterprise SaaS">B2B Enterprise SaaS</option>
                <option value="SME Commerce & Supply Chain">SME Commerce & Supply Chain</option>
                <option value="Healthcare System Operators">Healthcare System Operators</option>
                <option value="Cross-Border Traders">Cross-Border Traders</option>
              </select>
            </div>

            {/* Core Problem Statement */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Core Problem Statement
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={3}
                placeholder="Describe the pain point, operational bottleneck, or market inefficiency..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#0E6875] focus:ring-2 focus:ring-[#0E6875]/20 transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Synthesizing Market Viability...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  <span>Synthesize Idea & Validate TAM</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6">
          {isGenerating ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#0E6875]/10 text-[#0E6875] text-xs font-bold flex items-center gap-2">
                  <i className="fa-solid fa-gear fa-spin"></i> AI Synthesis In Progress
                </span>
                <span className="text-xs font-mono text-gray-400">Processing v3.4</span>
              </div>

              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0E6875] animate-pulse w-3/4 rounded-full"></div>
                </div>
                <p className="text-xs font-mono text-gray-500">
                  Benchmarking TAM/SAM metrics for {industry}...
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : result ? (
            <div className="bg-linear-to-br from-white via-[#FAF0E9]/50 to-white border-2 border-[#0E6875]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EDA296]/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#0E6875] text-white text-xs font-bold flex items-center gap-1.5">
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Synthesized Thesis
                </span>
                <span className="px-3 py-1 rounded-full bg-[#EDA296]/20 text-[#0E6875] border border-[#EDA296]/40 text-xs font-extrabold">
                  {result.score}/100 Viability Score
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#1C2B2D] mb-2">
                {result.title}
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {result.desc}
              </p>

              <div className="p-4 bg-[#0E6875]/10 rounded-2xl border border-[#0E6875]/20 mb-6">
                <small className="text-xs font-bold uppercase tracking-wider text-[#0E6875] block mb-1">
                  Est. Addressable Market (TAM):
                </small>
                <div className="text-3xl font-black text-[#0E6875]">
                  {result.tam}
                </div>
              </div>

              <button
                onClick={() => alert("🎉 Thesis successfully added to your Founder Ideation Canvas!")}
                className="w-full bg-[#0E6875] hover:bg-[#0B4E58] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-bookmark"></i>
                <span>Claim & Add to Ideation Canvas</span>
              </button>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-4 shadow-sm h-full flex flex-col justify-center items-center min-h-80">
              <div className="w-16 h-16 rounded-2xl bg-[#0E6875]/10 text-[#0E6875] flex items-center justify-center text-2xl font-bold">
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <h3 className="text-lg font-bold text-[#1C2B2D]">
                Ready for Synthesis
              </h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Select your target industry parameters and click generate to synthesize market viability scores and pitch metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
