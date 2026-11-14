"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Italianno } from "next/font/google";
import { Lora } from "next/font/google";

const lora = Lora({
  weight: ["400", "500"],
  subsets: ["latin"],
});

const stars = Array(5).fill(null);
const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
});

const testimonials = [
   {
    quote:
      "Every recommendation was backed by strong local knowledge and genuine care. ADJECTIVE gave us confidence at every stage and made our investment decision feel effortless.",
    name: "Pritam Bose",
    handle: "@pritambose",
    avatar: "/testimonials/pritam-bose1.png",
  },
  {
    quote:
      "ADJECTIVE understood exactly what I was looking for and guided me to a home that exceeded every expectation. Their professionalism, market expertise, and attention to detail made the entire journey seamless.",
    name: "Abhijit Bosak ",
    handle: "@abhijitbosak",
    avatar: "/testimonials/abhijit-bashak1.png",
  },
  {
    quote:
      "From valuation to closing, every detail was handled with remarkable expertise and attention. Their refined approach proves that exceptional real estate is as much an art as it is a transaction.",
    name: "Shubhajit Das",
    handle: "@Shubhajitdas",
    avatar: "/testimonials/shubhajit-das1.png",
  },
  {
    quote:
      "The team made what could have been an overwhelming search feel clear and personal. They listened closely, shortlisted thoughtfully, and helped us find the right home for our family.",
    name: "Amit kumar",
    handle: "@amitkumar",
    avatar:"/testimonials/amit-kumar.png",
  },
 
];

export default function Testimonials() {
  const carouselRef = useRef(null);

  const scrollTestimonials = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.firstElementChild;
    const gap = Number.parseFloat(getComputedStyle(carousel).gap) || 0;
    const distance = (card?.getBoundingClientRect().width || carousel.clientWidth) + gap;

    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section className="py-stack-lg px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1470px] mx-auto">

      {/* Section heading */}
      <div className="text-center mb-stack-lg">
        <span>
        <p className={`${lora.className} text-center text-[#5E6623] text-lg mt-4 max-w-2xl mx-auto leading-relaxed`}
      >
          Testimonial
        </p>
        </span>
         <h2 className={`${italianno.className} text-5xl md:text-6xl tracking-wide text-[#2F7D32] 
  [text-shadow:1px_0_0_#2F7D32,-1px_0_0_#2F7D32,0_1px_0_#2F7D32]`}
> Trusted by Homeowners</h2>
      </div>

      <div className="flex justify-end gap-2 mb-5">
        <button
          type="button"
          onClick={() => scrollTestimonials(-1)}
          aria-label="Show previous testimonials"
          className="w-10 h-10 rounded-full border border-[#4B5320]/30 text-[#4B5320] grid place-items-center hover:bg-[#4B5320] hover:text-white transition cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => scrollTestimonials(1)}
          aria-label="Show next testimonials"
          className="w-10 h-10 rounded-full border border-[#4B5320]/30 text-[#4B5320] grid place-items-center hover:bg-[#4B5320] hover:text-white transition cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ── TESTIMONIAL SLIDER ───────────────────────── */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <div
            key={t.handle}
            className="basis-full shrink-0 snap-start rounded-xl p-8 flex flex-col gap-4 premium-shadow border border-[#4B5320]/20 md:basis-[calc((100%-1.5rem)/2)]"
            style={{ backgroundColor: "#FAF8F2" }}
          >
            {/* Quote mark */}
            <span
              className="material-symbols-outlined text-outline-variant"
              style={{ fontSize: "40px", fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>

            {/* Star rating */}
            <div className="flex" style={{ color: "#5E6623" }}>
              {stars.map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>

            {/* Quote text */}
            <p className="font-body-md text-base text-on-surface flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Avatar + name/handle */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-24 h-24 rounded-full overflow-hidden relative flex-shrink-0">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div>
                <p className="font-title-sm text-sm">{t.name}</p>
                <p className="text-xs text-outline">{t.handle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
