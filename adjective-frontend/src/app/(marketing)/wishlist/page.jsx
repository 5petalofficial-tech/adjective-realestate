"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/redux/wishlistSlice";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookVisitModal from "@/components/common/BookVisitModal";
import { Heart, MapPin, ArrowUpRight, BedDouble, Bath, Maximize2, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBookVisit = (propertyName) => {
    setSelectedProperty(propertyName);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
      <Navbar />
      <div className="h-24"></div>

      {/* Hero Banner */}
      <section className="py-12 bg-[#5E6623] text-white">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FFC85C] font-bold px-3 py-1 rounded-full bg-white/10 inline-flex items-center gap-1.5 mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#FFC85C]" />
              Saved Collection
            </span>
            <h1 className="font-display text-3xl md:text-5xl text-white">Your Wishlist</h1>
            <p className="text-white/80 text-sm mt-2 font-medium">
              Manage your saved luxury properties and schedule private viewings.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
          {!mounted ? (
            <div className="text-center py-20 text-[#5E6623] font-medium">Loading wishlist...</div>
          ) : wishlistItems.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl p-12 text-center border border-black/5 shadow-sm max-w-lg mx-auto my-8">
              <div className="w-20 h-20 rounded-full bg-[#FAF8F2] text-[#5E6623] flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10" />
              </div>
              <h2 className="font-display text-2xl text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 text-xs md:text-sm mb-6 leading-relaxed">
                Explore our curated properties and click the love icon on any property to save it here for quick access later.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#5E6623] hover:bg-[#4E541E] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Properties
              </Link>
            </div>
          ) : (
            /* Wishlist Items Grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {wishlistItems.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl overflow-hidden border border-outline-variant/10 shadow-md flex flex-col justify-between group hover:-translate-y-1 transition duration-300"
                >
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={p.image || p.img || "/Projects/One10.webp"}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      unoptimized
                    />
                    <button
                      onClick={() => dispatch(removeFromWishlist(p.id))}
                      aria-label="Remove from wishlist"
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 flex items-center justify-center shadow-md transition duration-200 cursor-pointer border-none"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-outline font-bold uppercase tracking-widest mb-2">
                        <MapPin className="w-3.5 h-3.5 text-[#5E6623]" />
                        <span>{p.location}</span>
                      </div>
                      <h3 className="font-title-lg text-lg text-gray-900 font-bold mb-2 hover:text-[#5E6623] transition-colors">
                        <Link href={`/property/${p.id}`}>{p.name}</Link>
                      </h3>

                      {/* Specs */}
                      <div className="flex items-center gap-4 text-gray-500 text-xs py-3 border-t border-b border-gray-100 my-4">
                        {p.beds && (
                          <div className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4 text-[#5E6623]" />
                            <span>{p.beds} Beds</span>
                          </div>
                        )}
                        {p.baths && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4 text-[#5E6623]" />
                            <span>{p.baths} Baths</span>
                          </div>
                        )}
                        {(p.sqft || p.area) && (
                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-4 h-4 text-[#5E6623]" />
                            <span>{p.sqft || p.area}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <span className="text-lg font-extrabold text-[#5E6623]">{p.price}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBookVisit(p.name)}
                          className="px-3 py-2 rounded bg-[#5E6623] hover:bg-[#4E541E] text-white text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer"
                        >
                          Book Visit
                        </button>
                        <Link
                          href={`/property/${p.id}`}
                          className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition flex items-center justify-center"
                          title="View Details"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <BookVisitModal
        propertyName={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}