"use client";

import { AREAS } from "./areaConfig";

export default function AreaFilter({
  selectedArea,
  setSelectedArea,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {Object.keys(AREAS).map((area) => (
        <button
          key={area}
          onClick={() => setSelectedArea(area)}
          className={`px-6 py-3 rounded-full border transition-all duration-300 font-medium ${
            selectedArea === area
              ? "bg-[#5E6623] text-white border-[#5E6623]"
              : "bg-white border-gray-300 text-gray-700 hover:border-[#5E6623]"
          }`}
        >
          {area}
        </button>
      ))}
    </div>
  );
}