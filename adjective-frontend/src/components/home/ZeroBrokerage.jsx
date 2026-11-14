
"use client";

import Link from "next/link";

const stats = [
    { value: "12,000+", label: "Happy Buyers" },
    { value: "₹0", label: "Brokerage Fees" },
    { value: "18 Yrs", label: "Trusted Experience" },
    { value: "840+", label: "Active Listings" },
];

export default function ZeroBrokerage() {
    return (
        <section className="bg-[#26361d] py-16 md:py-24">
            <div
                className="
                    max-w-[1280px]
                    mx-auto
                    px-margin-mobile md:px-margin-desktop
                    grid
                    grid-cols-1
                    lg:grid-cols-[1fr_auto_1fr]
                    gap-10
                    lg:gap-12
                    items-center
                "
            >
                {/* LEFT SIDE */}
                <div>
                    <p className="text-[#c9a63b] text-xs font-bold uppercase tracking-[0.24em] mb-6">
                        Our Promise
                    </p>

                    <h2 className="font-display text-5xl md:text-7xl text-[#f7f3e9] leading-none">
                        100% Zero
                        <span className="block italic text-[#c9a63b]">
                            Brokerage
                        </span>
                    </h2>

                    <p className="mt-6 max-w-md text-[#f7f3e9]/65 leading-7">
                        We earn only when you get the best deal. No hidden
                        charges, no brokerage fees - just complete transparency
                        from first visit to final handover.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/projects"
                            className="rounded-xl bg-[#c9a63b] px-7 py-4 text-sm font-bold text-[#1c2814]"
                        >
                            Get Started Free
                        </Link>

                        <Link
                            href="/why-us"
                            className="rounded-xl border border-[#f7f3e9]/25 px-7 py-4 text-sm font-bold text-[#f7f3e9]"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* ZERO-BROKERAGE PROMISE BADGE */}
                <div className="relative mx-auto flex h-64 w-64 shrink-0 items-center justify-center sm:h-72 sm:w-72">
                    <div className="absolute inset-0 rounded-full bg-[#c9a63b]/15 blur-2xl" />

                    <div className="absolute inset-1 rounded-full border border-[#e6cb70]/35" />
                    <div className="absolute inset-4 rounded-full border border-dashed border-[#c9a63b]/55" />
                    <div className="absolute inset-8 rounded-full border border-[#f7f3e9]/15 bg-[#172111]/55 shadow-[inset_0_1px_18px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.24)]" />

                    <span className="absolute left-5 top-10 h-2.5 w-2.5 rounded-full bg-[#e6cb70] shadow-[0_0_12px_#e6cb70]" />
                    <span className="absolute bottom-12 right-4 h-1.5 w-1.5 rounded-full bg-[#f7f3e9]" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#e6cb70]/35 bg-[#c9a63b]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#f3d878]">
                            <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
                                <path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            No commission
                        </span>

                        <span className="font-display bg-gradient-to-br from-[#fff6c7] via-[#e7c452] to-[#b8871d] bg-clip-text text-8xl leading-none text-transparent drop-shadow-[0_5px_14px_rgba(0,0,0,0.35)] sm:text-9xl">
                            0%
                        </span>

                        <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#f7f3e9]/65">
                            Brokerage fee
                        </span>
                    </div>
                </div>

                {/* RIGHT SIDE - 4 STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="
                                rounded-2xl
                                border border-white/10
                                bg-white/5
                                px-6 py-5
                                min-h-[110px]
                                flex
                                flex-col
                                justify-center
                            "
                        >
                            <p className="font-display text-3xl text-[#c9a63b]">
                                {stat.value}
                            </p>

                            <p className="mt-1 text-sm text-[#f7f3e9]/55">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
