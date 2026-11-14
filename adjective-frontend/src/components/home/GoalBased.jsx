import { Home, TrendingUp, Umbrella, KeyRound, Palmtree, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Italianno } from "next/font/google";

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
});

const focusAreas = [
  {
    icon: Home,
    title: "First Home",
    goalKey: "first-home",
    description:
      "Step into homeownership with guided support built for first-time buyers, from financing to closing.",
  },
  {
    icon: TrendingUp,
    title: "Investment",
    goalKey: "investment",
    description:
      "Build long-term wealth with properties selected for strong appreciation and market growth.",
  },
  {
    icon: Umbrella,
    title: "Retirement",
    goalKey: "retirement",
    description:
      "Find a peaceful place to settle down, designed for comfort and an easier pace of life.",
  },
  {
    icon: KeyRound,
    title: "Rental Income",
    goalKey: "rental-income",
    description:
      "Discover properties with proven rental demand and steady, reliable monthly returns.",
  },
  {
    icon: Palmtree,
    title: "Vacation Home",
    goalKey: "vacation-home",
    description:
      "Own a getaway you'll return to again and again, in locations made for relaxation.",
  },
];

export default function OurMainFocus() {
  return (
    <section className="bg-[#FAF8F2] py-20 px-6" id="goal-based">
  <div className="max-w-[1470px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 text-center">

    {/* Eyebrow */}
    <span className="relative -top-8 inline-block bg-[#4B5320]/10 text-[#4B5320] text-sm font-semibold px-4 py-1.5 rounded-full mb-1">
      Goal-Based Property Search
    </span>

    {/* Heading */}
    <h2
      className={`${italianno.className} relative -top-6 text-4xl md:text-6xl tracking-wide text-[#2F7D32] -mt-1 mb-4
      [text-shadow:1px_0_0_#2F7D32,-1px_0_0_#2F7D32,0_1px_0_#2F7D32]`}
    >
      Properties Aligned with Your Vision
    </h2>

    {/* Cards */}
    <div className="flex flex-wrap justify-center gap-8">
      {focusAreas.map(({ icon: Icon, title, goalKey, description }) => (
        <div
          key={title}
          className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-[#4B5320]/10 p-10 basis-full sm:basis-[45%] lg:basis-[30%] flex flex-col items-center"
        >

          {/* Icon */}
          <div className="relative w-28 h-28 flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-[#FFC85C]/20 rounded-full" />
            <Icon
              className="relative w-10 h-10 text-[#4B5320]"
              strokeWidth={1.75}
            />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-[#2B2B1F] mb-4">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[#6B6B5C] leading-relaxed mb-6">
            {description}
          </p>

          {/* CTA */}
          <Link
            href={`/projects?goal=${goalKey}`}
            className="group inline-flex items-center gap-2 text-[#4B5320] font-medium transition-colors no-underline"
          >
            Find the Place You Belong
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>

        </div>
      ))}
    </div>

  </div>
</section>
  );
}
