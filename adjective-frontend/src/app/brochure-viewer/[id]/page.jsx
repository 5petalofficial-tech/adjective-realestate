"use client";

import React, { useEffect, useState } from "react";
import { fetchPropertyById } from "@/utils/api";

export default function BrochureViewerPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const p = await fetchPropertyById(id);
        if (p) {
          setProperty(p);
        } else {
          setError("Property not found.");
        }
      } catch {
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#5E6623] border-t-transparent animate-spin" />
        <p className="text-slate-400 text-sm tracking-wide">Loading property details…</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4 px-6">
        <div className="text-5xl">🏠</div>
        <h2 className="text-rose-400 text-xl font-bold">Property Unavailable</h2>
        <p className="text-slate-400 text-sm text-center max-w-sm">
          {error || "We couldn't find the property you're looking for."}
        </p>
        <a href="/" className="mt-4 px-6 py-2.5 bg-[#5E6623] text-white rounded-lg text-sm font-semibold hover:bg-[#4A5119] transition">
          ← Back to Home
        </a>
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function fmt(num) {
    if (!num) return "On Request";
    if (num >= 10_000_000) return `₹${(num / 10_000_000).toFixed(2)} Cr`;
    if (num >= 100_000)    return `₹${(num / 100_000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  }

  const priceLabel =
    property.rawPrice
      ? fmt(property.rawPrice)
      : property.price || "Price on Request";

  const downloadUrl = `/api/brochure/download/${id}`;
  const galleryImages = property.images && property.images.length > 0 ? property.images : [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">

      {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#4A5119] via-[#5E6623] to-[#3a3f12] px-6 py-12 md:px-16 overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8  w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

        {/* Back link */}
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-green-200/70 hover:text-white mb-6 transition">
          ← Back to listings
        </a>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 relative z-10">
          <div>
            {property.constructionStatus && (
              <span className="inline-block bg-[#C9A84C] text-[#2d2a00] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                {property.constructionStatus}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white">
              {property.name}
            </h1>
            <p className="mt-2 text-green-200/80 text-sm flex items-center gap-1.5">
              <span>📍</span>
              {[property.location, property.fullAddress]
                .filter(Boolean)
                .join("  —  ") || "Kolkata"}
            </p>
            {property.reraId && (
              <p className="mt-1 text-xs text-green-300/50 tracking-wide">
                RERA: {property.reraId}
              </p>
            )}
          </div>

          {/* Price + Download CTA */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div>
              <p className="text-xs text-green-200/60 uppercase tracking-widest mb-0.5">Starting Price</p>
              <p className="text-2xl md:text-3xl font-extrabold text-[#C9A84C]">{priceLabel}</p>
            </div>
            <a
              href={downloadUrl}
              className="inline-flex items-center gap-2 bg-white text-[#4A5119] hover:bg-[#C9A84C] hover:text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all duration-200 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-3.5-3.5M12 16l3.5-3.5" />
              </svg>
              Download PDF Brochure
            </a>
          </div>
        </div>

        {/* Gold bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A84C] via-[#e6c96a] to-[#C9A84C]" />
      </div>

      {/* ── BODY ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-10">

        {/* Banner Image */}
        {property.image && (
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-72 md:h-96 relative">
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-xs font-semibold text-white px-3 py-1.5 rounded-lg border border-white/10">
              📸 Hero View
            </span>
          </div>
        )}

        {/* Description */}
        {property.description && (
          <section>
            <SectionTitle icon="📋" label="Project Overview" />
            <p className="text-slate-300 text-sm leading-7 mt-4">
              {property.description}
            </p>
          </section>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <section>
            <SectionTitle icon="🖼️" label="Project Visuals & Gallery" />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-white/5 h-48 relative group">
                  <img
                    src={img}
                    alt={`${property.name} ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Configurations */}
        {property.configurations && property.configurations.length > 0 && (
          <section>
            <SectionTitle icon="🏢" label="Unit Configurations" />
            <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1e293b] text-slate-400 text-xs uppercase tracking-wider">
                    <Th>BHK Type</Th>
                    <Th>Super Built-Up</Th>
                    <Th>Built-Up</Th>
                    <Th>Carpet Area</Th>
                    <Th>Base Price</Th>
                  </tr>
                </thead>
                <tbody>
                  {property.configurations.map((cfg, i) => (
                    <tr
                      key={cfg._id || i}
                      className={i % 2 === 0 ? "bg-[#0f172a]" : "bg-[#14213a]"}
                    >
                      <Td bold>{cfg.bhkType || "—"}</Td>
                      <Td>{cfg.superBuiltUpAreaSize ? `${cfg.superBuiltUpAreaSize} sqft` : "—"}</Td>
                      <Td>{cfg.builtUpAreaSize      ? `${cfg.builtUpAreaSize} sqft`      : "—"}</Td>
                      <Td>{cfg.carpetAreaSize       ? `${cfg.carpetAreaSize} sqft`       : "—"}</Td>
                      <Td accent>{cfg.basePrice ? fmt(cfg.basePrice) : "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Towers */}
        {property.towers && property.towers.length > 0 && (
          <section>
            <SectionTitle icon="🏗️" label="Towers & Blocks" />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.towers.map((t, i) => (
                <div
                  key={t._id || i}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#5E6623]/60 transition"
                >
                  <p className="font-bold text-white mb-2">{t.towerName || `Tower ${i + 1}`}</p>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-300 font-semibold">{t.totalFloors || "—"}</span>{" "}
                    Floors
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    <span className="text-slate-300 font-semibold">{t.totalUnitsCount || "—"}</span>{" "}
                    Units
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Amenities */}
        {property.highlights && property.highlights.length > 0 && (
          <section>
            <SectionTitle icon="✨" label="Amenities & Highlights" />
            <div className="mt-4 flex flex-wrap gap-3">
              {property.highlights.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-[#5E6623]/20 border border-[#5E6623]/40 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5E6623] shrink-0" />
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Download card */}
        <section className="bg-gradient-to-r from-[#4A5119]/50 to-[#5E6623]/30 border border-[#5E6623]/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Get the Full Property Brochure</h3>
            <p className="text-sm text-slate-400">
              Download a beautifully formatted PDF containing all project photos, details, unit configurations, towers, and amenities.
            </p>
          </div>
          <a
            href={downloadUrl}
            className="shrink-0 inline-flex items-center gap-2 bg-[#5E6623] hover:bg-[#4A5119] text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-3.5-3.5M12 16l3.5-3.5" />
            </svg>
            Download PDF Brochure
          </a>
        </section>

      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="text-center text-xs text-slate-600 py-8 border-t border-white/5 mt-4">
        Adjective Real Estate &copy; {new Date().getFullYear()} &nbsp;|&nbsp; This brochure is for informational purposes only.
      </footer>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────
function SectionTitle({ icon, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <h2 className="text-base font-bold text-white tracking-wide">{label}</h2>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="text-left px-4 py-3 font-semibold">
      {children}
    </th>
  );
}

function Td({ children, bold, accent }) {
  return (
    <td
      className={`px-4 py-3 border-t border-white/5 ${
        bold   ? "text-white font-semibold"   :
        accent ? "text-[#C9A84C] font-semibold" :
        "text-slate-300"
      }`}
    >
      {children}
    </td>
  );
}
