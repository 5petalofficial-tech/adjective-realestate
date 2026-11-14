// "use client";

// import { useEffect, useState, useRef } from "react";
// import Image from "next/image";

// export default function FashionPopup() {
//   const [isVisible, setIsVisible] = useState(false);
//   const isFirstRender = useRef(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }

//     let timer;
//     if (isVisible) {
//       timer = setTimeout(() => {
//         setIsVisible(false);
//       }, 15000);
//     } else {
//       timer = setTimeout(() => {
//         setIsVisible(true);
//       }, 8000);
//     }

//     return () => clearTimeout(timer);
//   }, [isVisible]);

//   return (
//     <div
//       className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 ease-in-out ${
//         isVisible
//           ? "opacity-100 translate-x-0"
//           : "opacity-0 translate-x-8 pointer-events-none"
//       }`}
//     >
//       <div className="relative w-[180px] overflow-hidden rounded-2xl shadow-2xl transition duration-300 hover:scale-[1.02]">

//         {/* Close Button */}
//         <button
//           onClick={() => setIsVisible(false)}
//           className="absolute top-2 right-2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-base text-gray-700 backdrop-blur-md shadow-lg transition hover:scale-110 hover:bg-white"
//         >
//           ✕
//         </button>

//         {/* Poster */}
//         <div className="relative h-[250px] w-full">

//         <Image
//             src="/Adjective/popup.png"
//             alt="5Petal"
//             fill
//             priority
//             className="object-cover"
//         />

//         {/* Dark Gradient */}
//         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

//         {/* Button */}
//         <div className="absolute bottom-2 left-2 right-2">
//             <button
//             onClick={() => window.open("https://5petal.in", "_blank")}
//             className="w-full rounded-lg bg-white/90 py-1.5 text-sm font-medium text-[#5E6623] backdrop-blur-md transition duration-300 hover:bg-white"
//             >
//             Explore 5Petal →
//             </button>
//         </div>

//         </div>

//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function FashionPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    let timer;

    if (!hasOpened) {
      // Website open হওয়ার 2 seconds পরে প্রথমবার popup আসবে
      timer = setTimeout(() => {
        setIsVisible(true);
        setHasOpened(true);
      }, 2000);
    } else if (!isVisible) {
      // Close করার 1 minute পরে আবার popup আসবে
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 60000);
    }

    return () => clearTimeout(timer);
  }, [isVisible, hasOpened]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8 pointer-events-none"
      }`}
    >
      <div className="relative w-[180px] overflow-hidden rounded-2xl shadow-2xl transition duration-300 hover:scale-[1.02]">

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Close popup"
          className="absolute top-2 right-2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-base text-gray-700 backdrop-blur-md shadow-lg transition hover:scale-110 hover:bg-white"
        >
          ✕
        </button>

        {/* Poster */}
        <div className="relative h-[250px] w-full">
          <Image
            src="/Adjective/popup1.png"
            alt="5Petal"
            fill
            sizes="180px"
            priority
            className="object-cover"
          />

          {/* Dark Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Button */}
          <div className="absolute bottom-2 left-2 right-2">
            <button
              onClick={() => window.open("https://5petal.in", "_blank")}
              className="w-full rounded-lg bg-white/90 py-1.5 text-sm font-medium text-[#5E6623] backdrop-blur-md transition duration-300 hover:bg-white"
            >
              Explore 5Petal →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}