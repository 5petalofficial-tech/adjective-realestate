// "use client";

// import { useState } from "react";
// import { Mail, ArrowRight, CheckCircle } from "lucide-react";

// export default function NewsLetter() {
//     const [ email, setEmail ] = useState("");
//     const [ subscribed, setSubscribed ] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!email.trim()) return;

//         setLoading(true);

//         setTimeout(() => {
//             setSubscribed(true);
//             setLoading(false);
//             setEmail("");
//         }, 800);
//     };

//     return (
//         <section className="bg-[#f7f3e9] py-16 md:py-24">
//             <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
//                 <div className="relative overflow-hidden rounded-3xl bg-[#26361d] px-6 py-12 md:px-12 md:py-16 lg:px-20">

//                     <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#c9a63b]/20"/>
//                     <div className="absolute -right-10 -top-10 h-44 2-44 rounded-full border border-[#c9a6]/20"/>

//                     <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

//                         <div>
//                             <p className="text-[#c9a63b] text-xs font-bold uppercase tracking-[0.24em] mb-5">
//                                 Stay Informed
//                             </p>

//                             <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#f7f3e9] leading-tight">
//                                 Stay ahead of the
//                                 <span className="block italic text-[#c9a63b]">
//                                     Property Market

//                                 </span>
//                             </h2>

//                             <p className="mt-5 max-w-xl text-[#f7f3e9]/65 text-sm md:text-base leading-7">
//                                 Get the latest property updates, market insights, new launches,
//                                 and exclusive oppurtunities delivered straight to your inbox.
//                             </p>
//                         </div>

                         
//                     </div>
         
//                 </div>
//             </div>
//         </section>
//     )
// }

"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);

    // Temporary frontend behavior
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail("");
    }, 800);
  };

  return (
    <section className="bg-[#f7f3e9] py-16 md:py-24">
      <div className="max-w-[2280px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="relative overflow-hidden rounded-3xl bg-[#26361d] px-6 py-12 md:px-12 md:py-16 lg:px-20">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#c9a63b]/20" />
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-[#c9a63b]/20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* LEFT CONTENT */}
            <div>
              <p className="text-[#c9a63b] text-xs font-bold uppercase tracking-[0.24em] mb-5">
                Stay Informed
              </p>

              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#f7f3e9] leading-tight">
                Stay ahead of the
                <span className="block italic text-[#c9a63b]">
                  property market.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-[#f7f3e9]/65 text-sm md:text-base leading-7">
                Get the latest property updates, market insights, new launches,
                and exclusive opportunities delivered straight to your inbox.
              </p>
            </div>

            {/* RIGHT FORM */}
            <div>
              {!subscribed ? (
                <form onSubmit={handleSubmit} className="w-full">

                  <label className="block text-xs font-bold uppercase tracking-widest text-[#f7f3e9]/70 mb-3">
                    Email Address
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">

                    {/* EMAIL INPUT */}
                    <div className="flex-1 flex items-center rounded-xl border border-white/15 bg-white/10 px-4 h-14 backdrop-blur-md focus-within:border-[#c9a63b]/60 transition-all">
                      <Mail className="w-5 h-5 text-[#c9a63b] mr-3 shrink-0" />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full bg-transparent outline-none border-none text-[#f7f3e9] placeholder:text-[#f7f3e9]/40 text-sm"
                      />
                    </div>

                    {/* SUBSCRIBE BUTTON */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="h-14 px-6 rounded-xl bg-[#c9a63b] text-[#1c2814] font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {loading ? (
                        "Subscribing..."
                      ) : (
                        <>
                          Subscribe
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                  </div>

                  <p className="mt-4 text-xs text-[#f7f3e9]/40">
                    By subscribing, you agree to receive property updates and
                    market insights. You can unsubscribe anytime.
                  </p>

                </form>
              ) : (
                /* SUCCESS MESSAGE */
                <div className="rounded-2xl border border-[#c9a63b]/30 bg-white/5 p-6 md:p-8">
                  <CheckCircle className="w-8 h-8 text-[#c9a63b] mb-4" />

                  <h3 className="text-xl font-bold text-[#f7f3e9]">
                    You&apos;re subscribed!
                  </h3>

                  <p className="mt-2 text-sm text-[#f7f3e9]/60">
                    Thank you for subscribing. We&apos;ll keep you updated
                    with the latest property opportunities.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}