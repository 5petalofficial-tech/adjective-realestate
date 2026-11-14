"use client";

import Image from "next/image";

export default function FounderTalk() {
  return (
    // <section className="relative w-full overflow-hidden bg-[#f7f3e9]">
    //   <div className="grid w-full grid-cols-1 lg:grid-cols-2 lg:min-h-[700px]">

    //     {/* LEFT — VIDEO */}
    //     <div className="relative h-[500px] w-full lg:h-[1100px] mb-10 pl-10 lg:pl-14">
    //       <video
    //         autoPlay
    //         muted
    //         loop
    //         playsInline
    //         preload="auto"
    //         className=" block h-full w-full object-cover"
    //       >
    //         <source src="/videos/Video_Project_3.mp4" type="video/mp4" />
    //       </video>
    //     </div>

    //     {/* RIGHT — CONTENT */}
    //     <div className="flex min-h-[500px] items-center justify-center bg-[#f7f3e9] px-8 py-16 lg:min-h-[700px] lg:px-16 xl:px-24">
    //       <div className="w-full max-w-[520px] text-center">

    //         <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#77765d] md:text-xs">
    //           From the Founder
    //         </p>

    //         <h2 className="font-display text-3xl leading-[1.15] text-[#713434] md:text-4xl lg:text-5xl">
    //           Hi! I am the founder of Adjective
    //           {/* <span className="block italic">
    //             year old namesake.
    //           </span> */}
    //         </h2>

    //         <p className="mx-auto mt-7 max-w-[430px] text-sm leading-7 text-[#55544f] md:text-base">
    //           "Adjective — as individual as you are. Through stories, people
    //           and spaces, we tell stories for beautiful living."
    //         </p>

    //       </div>
    //     </div>

    //   </div>
    // </section>
    <section className="relative w-full overflow-hidden bg-[#f7f3e9] pb-16">
  <div className="grid w-full grid-cols-1 lg:grid-cols-2 lg:min-h-[700px]">

    {/* LEFT — VIDEO */}
    <div className="w-full px-14 lg:px-14">
      <div className="relative aspect-[9/16] w-full bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="block h-full w-full object-contain"
        >
          <source src="/videos/Video_Project_3.mp4" type="video/mp4" />
        </video>
      </div>
    </div>

    {/* RIGHT — CONTENT */}
    <div className="flex min-h-0 items-start justify-center bg-[#f7f3e9] px-8 pt-0 pb-16 lg:min-h-[700px] lg:items-center lg:px-16 lg:py-16 xl:px-24">
      <div className="w-full max-w-[520px] text-center">

        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#5E6623] md:text-xs">
          From the Founder
        </p>

            <h2 className="font-display text-3xl leading-[1.15] text-[#2F7D32] md:text-4xl lg:text-5xl">
              Hi! I am the founder of Adjective
              {/* <span className="block italic">
                year old namesake.
              </span> */}
            </h2>

        <p className="mx-auto mt-7 max-w-[430px] text-sm leading-7 text-[#5E6623] md:text-base">
          &ldquo;Adjective — as individual as you are. Through stories, people
          and spaces, we tell stories for beautiful living.&rdquo;
        </p>
        <Image
          src="/Adjective/nikhill-signature.jpeg"
          alt="Nikhill's signature"
          width={180}
          height={82}
          className="mx-auto mt-7 h-auto w-40 translate-x-30 -rotate-15 mix-blend-multiply"
        />

      </div>
    </div>

  </div>
</section>
  );
}
