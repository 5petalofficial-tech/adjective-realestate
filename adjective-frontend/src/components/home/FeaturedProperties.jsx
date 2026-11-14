"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchAndNormalizeProperties } from "@/utils/api";
import BookVisitModal from "@/components/common/BookVisitModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "@/redux/wishlistSlice";
import { Italianno } from "next/font/google";

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
});

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const handleBookVisit = (name) => {
    setSelectedProperty(name);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const allProps = await fetchAndNormalizeProperties();
        const featuredProperties = allProps.filter((p) => p.isFeatured);
        const propertiesToDisplay = featuredProperties.length > 0
          ? featuredProperties
          : allProps;

        const featured = propertiesToDisplay
          .map(p => ({
            id: p.id,
            img: p.image,
            badge: p.isSolo ? "Resale" : "Project",
            badgeClass: p.isSolo ? "bg-[#5E6623] text-white" : "bg-[#FFC85C] text-[#1b1b1d] font-bold",
            location: p.location,
            name: p.name,
            beds: p.beds,
            baths: p.baths,
            sqft: p.sqft,
            price: p.price
          }));
        setProperties(featured);
      } catch (err) {
        console.error("Error loading featured properties", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="text-center py-10" style={{ backgroundColor: "#FAF8F2" }}>Loading featured collections...</div>;

  return (
    <section id="featured-properties" className="py-stack-lg w-full" style={{ backgroundColor: "#FAF8F2" }}>

      {/* ── SECTION HEADER ROW ──────────────────────────────────── */}
     <div
  className="featured-section-header"
  style={{
    width: "100%",
    minHeight: "180px",
    marginBottom: "2rem",
  }} >
    <div
  className="featured-section-title">
          <span className="text-center text-xs font-label-sm-uppercase uppercase tracking-widest px-3 py-2 rounded-full" style={{ backgroundColor: "#5E6623", color: "#ffff" }}>
            Most Viewed
          </span>
          <h2 className={`${italianno.className} text-center text-5xl md:text-6xl tracking-wide text-[#2F7D32] 
  [text-shadow:1px_0_0_#2F7D32,-1px_0_0_#2F7D32,0_1px_0_#2F7D32]`}
>Featured Collections</h2>
        </div>
        {/* Right: View Portfolio */}
        <Link
  href="/projects"
  className="group relative inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#D4AF37] text-[#1b1b1d] font-semibold text-sm shadow-[0_8px_25px_rgba(255,200,92,0.25)] hover:shadow-[0_12px_35px_rgba(255,200,92,0.45)] hover:-translate-y-1 transition-all duration-300"
>
  <span className="tracking-wide">
    View Projects
  </span>
{/* Arrow Circle */}
  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#5E6623] shadow-sm transition-transform duration-300 group-hover:scale-110">
    <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-0.5">
      arrow_forward
    </span>
  </span>
  {/* Small decorative dot */}
  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#5E6623] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</Link>
      </div>

      {/* ── PROPERTY CARDS GRID ────────────────────────────────── */}
      {properties.length === 0 ? (
        <div className="mx-margin-mobile md:mx-margin-desktop rounded-xl border border-dashed border-[#5E6623]/30 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Featured properties will appear here soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop">
          {properties.map((p) => (
          <div
            key={p.name}
            className="group bg-white rounded-xl overflow-hidden border border-outline-variant/10 premium-shadow hover:-translate-y-2 transition-all duration-300"
          >
            {/* ── CARD IMAGE AREA ──────────────────────────────── */}
            <Link href={`/property/${p.id}`} className="relative h-48 overflow-hidden block">
              <Image
                src={p.img}
                alt={p.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />

              <div
                className={`absolute top-4 left-4 ${p.badgeClass} px-3 py-1 rounded-full text-xs font-label-sm-uppercase uppercase tracking-widest`}
              >
                {p.badge}
              </div>
            </Link>

            {/* ── CARD BODY ────────────────────────────────────── */}
            <div className="p-6">
              <p className="text-xs font-label-sm-uppercase uppercase tracking-widest text-outline mb-2">{p.location}</p>

              <h3 className="font-title-lg text-lg mb-4 hover:text-[#5E6623] transition-colors">
                <Link href={`/property/${p.id}`}>{p.name}</Link>
              </h3>

              {/* ── SPECS ROW — beds / baths / sqft ──────────── */}
              <div className="flex items-center gap-4 text-outline border-t border-outline-variant/20 pt-4">

                {/* Bed count with icon */}
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">bed</span>
                  <span className="text-sm font-label-md">{p.beds}</span>
                </div>

                {/* Bath count with icon */}
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">bathtub</span>
                  <span className="text-sm font-label-md">{p.baths}</span>
                </div>

                {/* Square footage with icon */}
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">square_foot</span>
                  <span className="text-sm font-label-md">{p.sqft}</span>
                </div>
              </div>

              {/* PRICE + FAVOURITE BUTTON */}
              <div className="mt-6 flex justify-between items-center gap-3">
                <span className="text-lg font-bold text-primary">{p.price}</span>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBookVisit(p.name)}
                    className="px-3.5 py-2.5 rounded-lg bg-[#5E6623] text-white text-xs font-bold hover:bg-[#4E541E] transition duration-150 shadow-sm cursor-pointer"
                  >
                    Book Visit
                  </button>
                  <button 
                    onClick={() => dispatch(toggleWishlist(p))}
                    aria-label="Toggle Wishlist"
                    className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer ${
                      wishlistItems.some(item => item.id === p.id)
                        ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
                        : "border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${wishlistItems.some(item => item.id === p.id) ? "text-red-500" : ""}`}>
                      favorite
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}
      <BookVisitModal 
        propertyName={selectedProperty} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
