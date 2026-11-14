"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { apiRequest } from "@/utils/api";
import { 
  Calculator, 
  ArrowRight, 
  FileSpreadsheet,
  CheckCircle2,
  X,
  Info,
  Building,
  PhoneCall
} from "lucide-react";

// Website Brand Colors
const BRAND_OLIVE = "#5E6623";
const BRAND_DARK_OLIVE = "#3D4316";

// Format numbers in Indian numbering system (e.g., 30,00,000 or 5 Cr)
const formatINR = (val) => {
  if (isNaN(val) || val === null || val === undefined) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(val));
};

const formatShortINR = (val) => {
  if (val >= 10000000) {
    return `${(val / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (val >= 100000) {
    return `${(val / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  }
  if (val >= 1000) {
    return `${(val / 1000).toFixed(0)}k`;
  }
  return val.toString();
};

export default function HomeLoanCalculatorPage() {
  // Input states for Home Loan
  const [amount, setAmount] = useState(3000000); // 30 Lakhs default
  const [rate, setRate] = useState(7.75); // 7.75% default
  const [tenure, setTenure] = useState(20); // 20 years default
  const [tenureType, setTenureType] = useState("years"); // years | months

  // Amortization table view state
  const [tableTab, setTableTab] = useState("yearly"); // yearly | monthly

  // Modal State
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicant, setApplicant] = useState({ name: "", phone: "", email: "", city: "" });

  // Hover state for interactive SVG Stacked Bar chart
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Home Loan Bounds
  const bounds = {
    minAmount: 100000,
    maxAmount: 50000000,
    amountStep: 50000,
    minRate: 5,
    maxRate: 15,
    rateStep: 0.05,
    minTenure: 1,
    maxTenure: 30,
    minLabel: "1 L",
    maxLabel: "5 Cr"
  };

  // Core Math Calculations
  const calculated = useMemo(() => {
    const P = Math.max(1000, Number(amount) || 0);
    const r = (Number(rate) || 0) / 12 / 100;
    const totalMonths = tenureType === "years" ? (Number(tenure) || 1) * 12 : (Number(tenure) || 1);

    let emi = 0;
    if (r === 0) {
      emi = P / totalMonths;
    } else {
      emi = (P * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
    }

    const totalPayment = emi * totalMonths;
    const totalInterest = Math.max(0, totalPayment - P);
    const principalPercent = totalPayment > 0 ? (P / totalPayment) * 100 : 100;
    const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    // Build Amortization Schedule
    const startYear = new Date().getFullYear();
    let currentBalance = P;
    let monthList = [];
    let yearList = [];

    let currentYearObj = {
      year: startYear,
      principalPaid: 0,
      interestPaid: 0,
      emiPaid: 0,
      endBalance: P,
    };

    for (let m = 1; m <= totalMonths; m++) {
      const monthInterest = currentBalance * r;
      const monthPrincipal = Math.min(currentBalance, emi - monthInterest);
      currentBalance = Math.max(0, currentBalance - monthPrincipal);

      monthList.push({
        month: m,
        year: startYear + Math.floor((m - 1) / 12),
        monthInYear: ((m - 1) % 12) + 1,
        interest: monthInterest,
        principal: monthPrincipal,
        emi: monthInterest + monthPrincipal,
        balance: currentBalance,
      });

      currentYearObj.principalPaid += monthPrincipal;
      currentYearObj.interestPaid += monthInterest;
      currentYearObj.emiPaid += monthInterest + monthPrincipal;
      currentYearObj.endBalance = currentBalance;

      if (m % 12 === 0 || m === totalMonths) {
        yearList.push({ ...currentYearObj });
        const nextYr = startYear + Math.floor(m / 12);
        currentYearObj = {
          year: nextYr,
          principalPaid: 0,
          interestPaid: 0,
          emiPaid: 0,
          endBalance: currentBalance,
        };
      }
    }

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principalPercent,
      interestPercent,
      monthList,
      yearList,
      totalMonths,
    };
  }, [amount, rate, tenure, tenureType]);

  // Handle Consultation Submission
  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest("/enquiry", {
        method: "POST",
        body: JSON.stringify({
          name: applicant.name,
          email: applicant.email,
          phone: applicant.phone,
          enquiryType: "HOME LOAN CONSULTATION GUIDANCE",
          propertyName: `Home Loan Calculation: ₹${formatINR(amount)} @ ${rate}% for ${tenure} ${tenureType}`,
          message: `User requested home loan guidance. Name: ${applicant.name}, Phone: ${applicant.phone}, City: ${applicant.city || "N/A"}. Calculated EMI: ₹${formatINR(calculated.emi)}/month.`
        })
      });
      setSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setConsultModalOpen(false);
        setApplicant({ name: "", phone: "", email: "", city: "" });
      }, 2500);
    } catch (err) {
      setSubmitting(false);
      alert("Failed to submit enquiry. Please try again or contact us directly.");
    }
  };

  // SVG Donut Calculations
  const donutRadius = 75;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * donutRadius;
  const interestDash = (calculated.interestPercent / 100) * circumference;
  const principalDash = circumference - interestDash;

  // Render (EMI) Stacked Bar + Line Chart Data
  const chartYears = calculated.yearList;
  const maxYearTotal = Math.max(...chartYears.map(y => y.emiPaid), 1);
  const maxBalance = Math.max(...chartYears.map(y => y.endBalance), Number(amount) || 1);

  return (
    <div className="min-h-screen bg-[#F9FAF6] text-slate-800 font-sans selection:bg-[#5E6623] selection:text-white">
      <Navbar />

      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 bg-[#5E6623] text-white overflow-hidden">
        {/* Abstract luxury background overlays */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-semibold uppercase tracking-widest backdrop-blur-md mb-4 border border-white/20">
            <Building className="w-3.5 h-3.5" /> Property Purchase Financial Overview
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Home Loan EMI Calculator
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/85 font-light leading-relaxed">
            Estimate your monthly home loan instalments, inspect complete interest breakdowns, and plan your property purchase with clarity.
          </p>
        </div>
      </section>

      {/* ── MAIN CALCULATOR SECTION (Combining Image 1 Design & Brand Colors) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_15px_45px_rgba(94,102,35,0.08)] border border-black/5 p-6 sm:p-10">

          {/* ── 1. SINGLE FOCUSED HOME LOAN HEADER TAB (Image 1 Top) ───── */}
          <div className="flex justify-center items-center mb-10">
            <div className="px-6 py-3 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#5E6623] text-white shadow-md shadow-[#5E6623]/30 ring-2 ring-[#5E6623]">
              HOME LOAN EMI CALCULATOR
            </div>
          </div>

          {/* ── 2 & 3. INPUT SLIDERS & DONUT CARD GRID ─────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* LEFT COLUMN: SLIDERS & EMI BOX (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              
              {/* SLIDER 1: LOAN AMOUNT */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-base font-bold text-gray-800 flex items-center gap-2">
                    Loan Amount
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md bg-gray-50/80 px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#5E6623] focus-within:border-transparent transition-all">
                    <span className="text-gray-500 font-medium text-sm mr-2">₹</span>
                    <input
                      type="text"
                      value={formatINR(amount)}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, "");
                        if (!isNaN(raw)) setAmount(Number(raw));
                      }}
                      className="w-32 text-right font-bold text-gray-900 bg-transparent outline-none text-base sm:text-lg"
                    />
                  </div>
                </div>

                <div className="relative pt-2">
                  <input
                    type="range"
                    min={bounds.minAmount}
                    max={bounds.maxAmount}
                    step={bounds.amountStep}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5E6623]"
                  />
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
                    <span>{bounds.minLabel}</span>
                    <span>{bounds.maxLabel}</span>
                  </div>
                </div>
              </div>

              {/* SLIDER 2: INTEREST RATE */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-base font-bold text-gray-800">
                    Interest Rate (p.a)
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md bg-gray-50/80 px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#5E6623] focus-within:border-transparent transition-all">
                    <input
                      type="number"
                      step="0.05"
                      min={bounds.minRate}
                      max={bounds.maxRate}
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-20 text-right font-bold text-gray-900 bg-transparent outline-none text-base sm:text-lg"
                    />
                    <span className="text-gray-500 font-medium text-sm ml-1">%</span>
                  </div>
                </div>

                <div className="relative pt-2">
                  <input
                    type="range"
                    min={bounds.minRate}
                    max={bounds.maxRate}
                    step={bounds.rateStep}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5E6623]"
                  />
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
                    <span>{bounds.minRate}%</span>
                    <span>{bounds.maxRate}%</span>
                  </div>
                </div>
              </div>

              {/* SLIDER 3: TENURE */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-base font-bold text-gray-800">
                      Tenure ({tenureType})
                    </label>
                    <div className="inline-flex border border-gray-200 rounded-md p-0.5 bg-gray-100 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          if (tenureType === "months") {
                            setTenure(Math.max(1, Math.round(tenure / 12)));
                            setTenureType("years");
                          }
                        }}
                        className={`px-2 py-0.5 rounded font-bold ${
                          tenureType === "years" ? "bg-[#5E6623] text-white" : "text-gray-600"
                        }`}
                      >
                        Yr
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (tenureType === "years") {
                            setTenure(tenure * 12);
                            setTenureType("months");
                          }
                        }}
                        className={`px-2 py-0.5 rounded font-bold ${
                          tenureType === "months" ? "bg-[#5E6623] text-white" : "text-gray-600"
                        }`}
                      >
                        Mo
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center border border-gray-300 rounded-md bg-gray-50/80 px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#5E6623] focus-within:border-transparent transition-all">
                    <input
                      type="number"
                      min={1}
                      max={tenureType === "years" ? bounds.maxTenure : bounds.maxTenure * 12}
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-16 text-right font-bold text-gray-900 bg-transparent outline-none text-base sm:text-lg"
                    />
                    <span className="text-gray-500 font-medium text-sm ml-2.5 uppercase">
                      {tenureType === "years" ? "Y" : "M"}
                    </span>
                  </div>
                </div>

                <div className="relative pt-2">
                  <input
                    type="range"
                    min={1}
                    max={tenureType === "years" ? bounds.maxTenure : bounds.maxTenure * 12}
                    step={1}
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5E6623]"
                  />
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mt-2">
                    <span>1 {tenureType === "years" ? "Y" : "M"}</span>
                    <span>
                      {bounds.maxTenure} {tenureType === "years" ? "Y" : "Y (360M)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* EMI SUMMARY BOX & CONSULTATION BUTTON */}
              <div className="pt-4">
                <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-gray-600 text-sm font-medium flex items-center gap-1.5">
                      Your EMI<span className="text-xs text-gray-400">*</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#5E6623] tracking-tight mt-1">
                      ₹ {formatINR(calculated.emi)}
                      <span className="text-xs font-normal text-gray-500 ml-1">/ month</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      *Equated Monthly Installment estimate
                    </p>
                  </div>

                  <button
                    onClick={() => setConsultModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#5E6623] hover:bg-[#4A521A] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group text-xs sm:text-sm uppercase tracking-wide"
                  >
                    <span>Talk to Advisor</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: DONUT CARD (5 Cols - Image 1 Right) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="h-full bg-white rounded-xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between items-center text-center">
                
                {/* SVG DONUT CHART */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    {/* Background Ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r={donutRadius}
                      className="text-gray-100"
                      strokeWidth={strokeWidth}
                      stroke="currentColor"
                      fill="transparent"
                    />
                    
                    {/* Principal Arc (Brand Olive) */}
                    <circle
                      cx="100"
                      cy="100"
                      r={donutRadius}
                      stroke={BRAND_OLIVE}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={0}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Interest Arc (Rose Accent) */}
                    <circle
                      cx="100"
                      cy="100"
                      r={donutRadius}
                      stroke="#FFC85C"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${interestDash} ${circumference}`}
                      strokeDashoffset={-principalDash}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Donut Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Amount Payable
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1">
                      ₹{formatINR(calculated.totalPayment)}
                    </span>
                  </div>
                </div>

                {/* DONUT LEGEND (Bottom of Card) */}
                <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 mt-4 text-left">
                  <div className="flex items-start gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#5E6623] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Principal Amount</div>
                      <div className="text-sm font-bold text-gray-900">
                        ₹{formatINR(amount)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FFC85C] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Interest Amount</div>
                      <div className="text-sm font-bold text-gray-900">
                        ₹{formatINR(calculated.totalInterest)}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* INFORMATIONAL DISCLAIMER BANNER */}
          <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start gap-3 text-xs text-gray-600 leading-relaxed">
            <Info className="w-4 h-4 text-[#5E6623] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800">Note:</strong> Adjective Real Estate provides home loan estimates and financial visualizers for informational purposes to help home buyers evaluate property affordability. We are a real estate consultancy and do not directly disburse loans. We assist buyers in connecting with partner banking institutions.
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. (EMI) STACKED BAR + LINE CHART SECTION (Image 2 Replica with Brand Colors) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-black/5 p-6 sm:p-10">
          
          {/* SECTION HEADER & LEGEND */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span>(EMI) Chart</span>
            </h2>

            {/* CHART LEGEND (Image 2 Top Right) */}
            <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#5E6623]" />
                <span>Principal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#2D3310]" />
                <span>Interest</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#D97706] border-2 border-white ring-1 ring-[#D97706]" />
                <span>Balance</span>
              </div>
            </div>
          </div>

          {/* DUAL-AXIS SVG STACKED BAR + LINE CHART */}
          <div className="w-full overflow-x-auto pb-4 scrollbar-thin">
            <div className="min-w-[700px] h-[340px] relative">
              
              {/* Custom SVG Rendering */}
              <svg viewBox="0 0 900 300" className="w-full h-full overflow-visible">
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = 240 - ratio * 200;
                  const balVal = maxBalance * ratio;
                  const emiVal = maxYearTotal * ratio;
                  return (
                    <g key={idx}>
                      <line x1="60" y1={y} x2="840" y2={y} stroke="#E5E7EB" strokeDasharray="3 3" />
                      {/* Left Y Axis Label (Balance) */}
                      <text x="50" y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-medium">
                        {formatShortINR(balVal)}
                      </text>
                      {/* Right Y Axis Label (EMI Payment/Year) */}
                      <text x="850" y={y + 4} textAnchor="start" className="text-[10px] fill-gray-400 font-medium">
                        {formatShortINR(emiVal)}
                      </text>
                    </g>
                  );
                })}

                {/* Y Axis Titles */}
                <text x="15" y="140" textAnchor="middle" transform="rotate(-90 15 140)" className="text-[10px] fill-gray-400 font-bold uppercase tracking-wider">
                  Balance
                </text>
                <text x="890" y="140" textAnchor="middle" transform="rotate(90 890 140)" className="text-[10px] fill-gray-400 font-bold uppercase tracking-wider">
                  EMI Payment / Year
                </text>

                {/* STACKED BARS AND LINE POINTS */}
                {(() => {
                  const numYears = chartYears.length;
                  const chartWidth = 780;
                  const colWidth = Math.min(32, (chartWidth / numYears) * 0.65);

                  // Balance line path points
                  const linePoints = chartYears.map((yr, i) => {
                    const cx = 60 + i * (chartWidth / numYears) + (chartWidth / numYears) / 2;
                    const cy = 240 - (yr.endBalance / maxBalance) * 200;
                    return { x: cx, y: cy, year: yr.year, balance: yr.endBalance };
                  });

                  const linePathStr = linePoints
                    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                    .join(" ");

                  return (
                    <g>
                      {/* 1. Stacked Bars */}
                      {chartYears.map((yr, idx) => {
                        const cx = 60 + idx * (chartWidth / numYears) + (chartWidth / numYears) / 2;
                        const bx = cx - colWidth / 2;

                        // Height calculations based on maxYearTotal
                        const totalH = (yr.emiPaid / maxYearTotal) * 200;
                        const principalRatio = yr.emiPaid > 0 ? yr.principalPaid / yr.emiPaid : 1;
                        const principalH = totalH * principalRatio;
                        const interestH = totalH - principalH;

                        const yBase = 240;
                        const yPrincipal = yBase - principalH;
                        const yInterest = yPrincipal - interestH;

                        const isHovered = hoveredBarIndex === idx;

                        return (
                          <g 
                            key={yr.year}
                            onMouseEnter={() => setHoveredBarIndex(idx)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                            className="cursor-pointer transition-opacity duration-200"
                          >
                            {/* Invisible hit area for hover ease */}
                            <rect
                              x={cx - (chartWidth / numYears) / 2}
                              y={30}
                              width={chartWidth / numYears}
                              height={220}
                              fill="transparent"
                            />

                            {/* Principal Bar (Bottom) */}
                            <rect
                              x={bx}
                              y={yPrincipal}
                              width={colWidth}
                              height={Math.max(1, principalH)}
                              fill={BRAND_OLIVE}
                              rx={interestH <= 0 ? 3 : 0}
                              className="transition-all duration-300"
                              opacity={isHovered ? 0.9 : 1}
                            />

                            {/* Interest Bar (Top) */}
                            {interestH > 0 && (
                              <rect
                                x={bx}
                                y={yInterest}
                                width={colWidth}
                                height={interestH}
                                fill={BRAND_DARK_OLIVE}
                                rx={3}
                                className="transition-all duration-300"
                                opacity={isHovered ? 0.9 : 1}
                              />
                            )}

                            {/* Year X-Axis Text Label */}
                            <text
                              x={cx}
                              y={260}
                              textAnchor="middle"
                              className={`text-[11px] font-medium transition-colors ${
                                isHovered ? "fill-[#5E6623] font-bold" : "fill-gray-600"
                              }`}
                            >
                              {yr.year}
                            </text>
                          </g>
                        );
                      })}

                      {/* 2. Balance Line Overlay (Amber/Gold) */}
                      <path
                        d={linePathStr}
                        fill="none"
                        stroke="#D97706"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* 3. Balance Line Circle Markers */}
                      {linePoints.map((pt, i) => (
                        <circle
                          key={i}
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredBarIndex === i ? 6 : 4}
                          fill="#D97706"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="transition-all duration-200 cursor-pointer"
                          onMouseEnter={() => setHoveredBarIndex(i)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                        />
                      ))}

                      {/* 4. Interactive Tooltip */}
                      {hoveredBarIndex !== null && (() => {
                        const yr = chartYears[hoveredBarIndex];
                        const cx = 60 + hoveredBarIndex * (chartWidth / numYears) + (chartWidth / numYears) / 2;
                        const tooltipX = Math.min(Math.max(cx, 130), 770);
                        const tooltipY = 40;

                        return (
                          <g pointerEvents="none" className="transition-opacity duration-200">
                            {/* Vertical Hover Highlight Line */}
                            <line
                              x1={cx}
                              y1={40}
                              x2={cx}
                              y2={240}
                              stroke="#5E6623"
                              strokeDasharray="4 4"
                              strokeWidth="1.5"
                              opacity="0.6"
                            />
                            
                            <foreignObject x={tooltipX - 110} y={tooltipY} width="220" height="130">
                              <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl border border-white/20 text-xs backdrop-blur-md">
                                <div className="font-bold text-[#F2DCDC] border-b border-white/10 pb-1 mb-1.5 flex justify-between">
                                  <span>Year {yr.year}</span>
                                  <span>Bal: ₹{formatShortINR(yr.endBalance)}</span>
                                </div>
                                <div className="flex justify-between py-0.5 text-gray-300">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#5E6623]" /> Principal:
                                  </span>
                                  <span className="font-semibold text-white">₹{formatINR(yr.principalPaid)}</span>
                                </div>
                                <div className="flex justify-between py-0.5 text-gray-300">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#3D4316]" /> Interest:
                                  </span>
                                  <span className="font-semibold text-white">₹{formatINR(yr.interestPaid)}</span>
                                </div>
                                <div className="flex justify-between pt-1 mt-1 border-t border-white/10 font-bold text-amber-400">
                                  <span>Total Paid:</span>
                                  <span>₹{formatINR(yr.emiPaid)}</span>
                                </div>
                              </div>
                            </foreignObject>
                          </g>
                        );
                      })()}

                    </g>
                  );
                })()}

                {/* X Axis Bottom Line */}
                <line x1="60" y1="240" x2="840" y2="240" stroke="#9CA3AF" strokeWidth="1.5" />
              </svg>
              
              <div className="text-center text-xs text-gray-400 font-semibold mt-2">
                Year
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. AMORTIZATION SCHEDULE TABLE ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.04)] border border-black/5 p-6 sm:p-10">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-[#5E6623]" />
                Amortization Schedule
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Detailed period-by-period payment breakdown showing opening balance, EMI, principal, interest, and ending loan balance.
              </p>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg self-stretch sm:self-auto justify-center">
              <button
                onClick={() => setTableTab("yearly")}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${
                  tableTab === "yearly"
                    ? "bg-[#5E6623] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly View
              </button>
              <button
                onClick={() => setTableTab("monthly")}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${
                  tableTab === "monthly"
                    ? "bg-[#5E6623] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly View
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#5E6623] text-white font-bold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-4">Period</th>
                  <th className="py-3.5 px-4 text-right">Opening Balance</th>
                  <th className="py-3.5 px-4 text-right">EMI Paid</th>
                  <th className="py-3.5 px-4 text-right">Principal Paid</th>
                  <th className="py-3.5 px-4 text-right">Interest Paid</th>
                  <th className="py-3.5 px-4 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {tableTab === "yearly" ? (
                  (() => {
                    let runningBal = Number(amount) || 0;
                    return calculated.yearList.map((row, idx) => {
                      const openBal = runningBal;
                      runningBal = row.endBalance;
                      return (
                        <tr key={row.year} className={idx % 2 === 0 ? "bg-white hover:bg-gray-50/80" : "bg-gray-50/40 hover:bg-gray-50"}>
                          <td className="py-3 px-4 font-bold text-gray-900">Year {row.year}</td>
                          <td className="py-3 px-4 text-right text-gray-600">₹{formatINR(openBal)}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">₹{formatINR(row.emiPaid)}</td>
                          <td className="py-3 px-4 text-right text-[#5E6623] font-semibold">₹{formatINR(row.principalPaid)}</td>
                          <td className="py-3 px-4 text-right text-[#FFC85C] font-semibold">₹{formatINR(row.interestPaid)}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">₹{formatINR(row.endBalance)}</td>
                        </tr>
                      );
                    });
                  })()
                ) : (
                  (() => {
                    let runningBal = Number(amount) || 0;
                    return calculated.monthList.slice(0, 60).map((row) => {
                      const openBal = runningBal;
                      runningBal = row.balance;
                      return (
                        <tr key={row.month} className={row.month % 2 === 0 ? "bg-white hover:bg-gray-50/80" : "bg-gray-50/40 hover:bg-gray-50"}>
                          <td className="py-3 px-4 font-bold text-gray-900">Month {row.month} ({row.year})</td>
                          <td className="py-3 px-4 text-right text-gray-600">₹{formatINR(openBal)}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">₹{formatINR(row.emi)}</td>
                          <td className="py-3 px-4 text-right text-[#5E6623] font-semibold">₹{formatINR(row.principal)}</td>
                          <td className="py-3 px-4 text-right text-[#FFC85C] font-semibold">₹{formatINR(row.interest)}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">₹{formatINR(row.balance)}</td>
                        </tr>
                      );
                    });
                  })()
                )}
              </tbody>
            </table>

            {tableTab === "monthly" && calculated.monthList.length > 60 && (
              <div className="p-3 bg-gray-50 text-center text-xs text-gray-500 font-medium border-t border-gray-100">
                Showing first 60 months of {calculated.monthList.length} months duration. Switch to Yearly view for full summary.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── CONSULTATION & ADVICE MODAL ──────────────────────────── */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative">
            
            {/* Modal Header */}
            <div className="bg-[#5E6623] text-white p-6 relative">
              <button
                onClick={() => setConsultModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs uppercase tracking-wider font-semibold text-white/80">
                Adjective Real Estate Consultancy
              </span>
              <h3 className="text-xl font-bold mt-1 text-white">
                Talk to Property Advisor
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submitSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-[#5E6623] mx-auto animate-bounce" />
                  <h4 className="text-xl font-bold text-gray-900">Consultation Requested!</h4>
                  <p className="text-sm text-gray-600">
                    Our property and home financial advisor will contact you to discuss your property purchase options.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-4">
                  {/* Summary Box */}
                  <div className="bg-[#F7F8F4] p-3.5 rounded-lg border border-[#5E6623]/20 text-xs flex justify-between items-center">
                    <div>
                      <div className="text-gray-500 font-medium">Estimated Home Loan</div>
                      <div className="font-bold text-gray-900 text-sm">₹{formatINR(amount)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 font-medium">Calculated Monthly EMI</div>
                      <div className="font-bold text-[#5E6623] text-sm">₹{formatINR(calculated.emi)}/mo</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={applicant.name}
                      onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#5E6623]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={applicant.phone}
                        onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={applicant.email}
                        onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#5E6623]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Preferred Location / City</label>
                    <input
                      type="text"
                      placeholder="e.g., Kolkata, Salt Lake, New Town"
                      value={applicant.city}
                      onChange={(e) => setApplicant({ ...applicant, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#5E6623]"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 leading-tight">
                    *Adjective provides real estate consultancy and property advisory. We help buyers evaluate property budgets and connect with banking partners.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#5E6623] hover:bg-[#4A521A] text-white font-bold rounded-lg shadow-md transition-all uppercase text-xs tracking-wider mt-2"
                  >
                    {submitting ? "Submitting Request..." : "Request Advisor Callback"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
