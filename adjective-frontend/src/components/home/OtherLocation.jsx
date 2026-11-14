"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { Italianno } from "next/font/google";
import { Lora } from "next/font/google";

const lora = Lora({
  weight: ["400", "500"],
  subsets: ["latin"],
});
const italianno = Italianno({
  subsets: ["latin"],
  weight: "400",
});

const locationGroups = [
  {
    area: "South Kolkata",
    locations: [
      "Tollygunge",
      "New Alipore",
      "Joka",
      "Behala",
      "Kasba",
      "Garia",
      "Gariahat",
      "Dhakuria",
      "Jadavpur",
      "Golf Green",
      "Rabindra Sarobar",
      "Prince Anwar Shah Road",
      "Lake Gardens",
      "Regent Park",
      "Thakurpukur",
    ],
  },

  {
    area: "Central Kolkata",
    locations: [
      "Park Street",
      "Esplanade",
      "Bhowanipore",
      "Alipore",
      "Minto Park",
      "Camac Street",
      "Chowringhee",
      "New Market",
      "Entally",
      "Sealdah",
      "Taltala",
      "Lansdowne",
      "Theatre Road",
      "AJC Bose Road",
      "Elgin",
    ],
  },

  {
    area: "North Kolkata",
    locations: [
      "Shyambazar",
      "Bagbazar",
      "Dum Dum",
      "Dum Dum Cantonment",
      "Belgachia",
      "Kamarhati",
      "Baranagar",
      "Sinthee",
      "Cossipore",
      "Paikpara",
      "Maniktala",
      "Ultadanga",
      "Kankurgachi",
      "Lake Town",
      "Sodepur",
    ],
  },

  {
    area: "East Kolkata",
    locations: [
      "New Town",
      "Rajarhat",
      "Salt Lake",
      "Bidhannagar",
      "Sector V",
      "Sector I",
      "Sector II",
      "Sector III",
      "Sector IV",
      "Tangra",
      "Chingrighata",
      "Science City",
      "EM Bypass",
      "Metropolitan",
      "Topsia",
    ],
  },

  {
    area: "West Kolkata",
    locations: [
      "Howrah Maidan",
      "Shibpur",
      "Santragachi",
      "Andul",
      "Bally",
      "Belur",
      "Liluah",
      "Salkia",
      "Kadamtala",
      "Dasnagar",
      "Dhulagarh",
      "Nischinda",
      "Botanic Garden",
      "Kona",
      "Ramrajatala",
    ],
  },

  {
    area: "Howrah",
    locations: [
      "Howrah",
      "Shibpur",
      "Santragachi",
      "Liluah",
      "Belur",
      "Bally",
      "Salkia",
      "Andul",
      "Dasnagar",
      "Ramrajatala",
      "Dompjur",
      "Kona",
      "Nischinda",
      "Jagacha",
      "Kadamtala",
    ],
  },

  {
    area: "Hooghly",
    locations: [
      "Hooghly",
      "Chinsurah",
      "Chandannagar",
      "Serampore",
      "Rishra",
      "Konnagar",
      "Uttarpara",
      "Bhadreswar",
      "Baidyabati",
      "Dankuni",
      "Tribeni",
      "Mogra",
      "Singur",
      "Tarakeswar",
      "Uttarpara Kotrung",
    ],
  },

  {
    area: "North 24 Parganas",
    locations: [
      "Madhyamgram",
      "Barasat",
      "New Barrackpore",
      "Barrackpore",
      "Naihati",
      "Kanchrapara",
      "Halisahar",
      "Habra",
      "Ashoknagar",
      "Birati",
      "Agarpara",
      "Panihati",
      "Khardaha",
      "Titagarh",
      "Kharda",
    ],
  },

  {
    area: "South 24 Parganas",
    locations: [
      "Sonarpur",
      "Rajpur",
      "Narendrapur",
      "Baruipur",
      "Bishnupur",
      "Maheshtala",
      "Budge Budge",
      "Pailan",
      "Amtala",
      "Thakurpukur",
      "Bakrahat",
      "Bhangar",
      "Canning",
      "Joynagar",
      "Diamond Harbour",
    ],
  },

  {
    area: "Rajarhat & New Town",
    locations: [
      "Rajarhat",
      "New Town",
      "Action Area I",
      "Action Area II",
      "Action Area III",
      "Eco Park",
      "City Centre II",
      "Airport Area",
      "Kaikhali",
      "Baguiati",
      "Kestopur",
      "Chinar Park",
      "Teghoria",
      "Hatiara",
      "Airport 1 No.",
    ],
  },
];

export default function OtherLocations() {
  const [openArea, setOpenArea] = useState(null);

  const toggleArea = (area) => {
    setOpenArea((current) =>
      current === area ? null : area
    );
  };

  return (
    <section className="w-full bg-white text-[#172018] py-14 sm:py-16 lg:py-20">
  <div className="max-w-[1470px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">

        {/* =========================
            HEADER
        ========================== */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8 lg:mb-10">

          <div className="w-full md:col-span-3 md:-translate-y-10">
  <p className="text-center text-[#D99B2B] text-1xl sm:text-sm font-semibold tracking-[0.25em] uppercase mb-3">
    Explore More
  </p>

  <h2
    className={`${italianno.className} text-center text-5xl md:text-6xl tracking-wide text-[#2F7D32]
    [text-shadow:1px_0_0_#2F7D32,-1px_0_0_#2F7D32,0_1px_0_#2F7D32]`}
  >
    Other Locations
  </h2>

  <p
    className={`${lora.className} text-center text-[#5E6623] text-lg mt-4 max-w-2xl mx-auto leading-relaxed`}
  >
    Explore residential properties and projects across
    Kolkata and nearby areas.
  </p>

  {/* Kolkata Landing Page */}
  <div className="flex justify-center">
    <Link
      href="/kolkata"
      className="
        inline-flex
        items-center
        gap-2
        mt-5
        px-5
        py-2.5
        rounded-full
        border
        border border-[#5E6623]
        text-[#5E6623]
        hover:bg-[#5E6623]
        hover:text-white
        text-sm
        font-semibold
        transition-all
        duration-300
      "
    >
      Explore Kolkata
      <ArrowUpRight className="w-4 h-4" />
    </Link>
  </div>
</div>
          {/* <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
            <MapPin className="w-4 h-4" />
            Kolkata & Surroundings
          </div>  */}

        </div>


        {/* =========================
            AREAS
            IMPORTANT: items-start
            prevents other cards from
            stretching when one opens.
        ========================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 items-start">

          {locationGroups.map((group, index) => {

            const isOpen = openArea === group.area;

            return (
              <div
                key={group.area}
                className={`
                  self-start
                  w-full
                  border
                  rounded-xl
                  overflow-hidden
                  bg-white
                  transition-all
                  duration-300
                  ${
                    isOpen
                      ? "border-[#D99B2B]/50 shadow-sm"
                      : "border-gray-200 hover:border-[#D99B2B]/40"
                  }
                `}
              >

                {/* =========================
                    AREA HEADER
                ========================== */}

                <button
                  type="button"
                  onClick={() => toggleArea(group.area)}
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-4
                    py-4
                    text-left
                    cursor-pointer
                    bg-white
                    hover:bg-[#faf9f6]
                    transition-colors
                  "
                >

                  <div className="flex items-center gap-3 min-w-0">

                    {/* Number */}
                    <span className="text-[10px] text-gray-400 font-medium shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Area Name */}
                    <span
                      className={`
                        text-sm
                        font-semibold
                        truncate
                        transition-colors
                        ${
                          isOpen
                            ? "text-[#D99B2B]"
                            : "text-[#172018]"
                        }
                      `}
                    >
                      {group.area}
                    </span>

                  </div>


                  {/* Chevron */}
                  <ChevronDown
                    className={`
                      w-4
                      h-4
                      shrink-0
                      transition-transform
                      duration-300
                      ${
                        isOpen
                          ? "rotate-180 text-[#D99B2B]"
                          : "text-gray-400"
                      }
                    `}
                  />

                </button>


                {/* =========================
                    DROPDOWN CONTENT
                ========================== */}

                <div
                  className={`
                    grid
                    transition-all
                    duration-300
                    ease-in-out
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >

                  <div className="overflow-hidden">

                    <div className="border-t border-gray-100 px-4 pb-5 pt-4">

                      {/* Locations in 2 columns */}
                      <div className="grid grid-cols-2 gap-x-5 gap-y-2">

                        {group.locations.map((location) => (

                          <Link
                            key={location}
                            href={`/projects?location=${encodeURIComponent(
                              location
                            )}`}
                            className="
                              group/location
                              flex
                              items-center
                              gap-1.5
                              min-w-0
                              py-1
                              text-xs
                              text-gray-500
                              hover:text-[#D99B2B]
                              transition-colors
                            "
                          >

                            <MapPin
                              className="
                                w-3
                                h-3
                                shrink-0
                                text-[#D99B2B]/70
                                group-hover/location:text-[#D99B2B]
                              "
                            />

                            <span className="truncate">
                              {location}
                            </span>

                            <ArrowUpRight
                              className="
                                w-3
                                h-3
                                shrink-0
                                opacity-0
                                -translate-x-1
                                group-hover/location:opacity-100
                                group-hover/location:translate-x-0
                                transition-all
                                text-[#D99B2B]
                              "
                            />

                          </Link>

                        ))}

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );

          })}

        </div>

      </div>
    </section>
  );
}