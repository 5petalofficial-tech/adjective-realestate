import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight 
} from "lucide-react";

export default function Footer() {
  const SOCIAL_ICONS = [
    {
      svg: (
        <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.008 3.82.056 1 .046 1.7.21 2.3.44a4.341 4.341 0 011.6 1.05 4.349 4.349 0 011.05 1.6c.23.6.39 1.3.44 2.3.048 1.036.056 1.39.056 3.82 0 2.43-.008 2.784-.056 3.82-.046 1-.21 1.7-.44 2.3a4.396 4.396 0 01-1.05 1.6 4.352 4.352 0 01-1.6 1.05c-.6.23-1.3.39-2.3.44-1.035.048-1.39.056-3.82.056-2.43 0-2.784-.008-3.82-.056-1-.046-1.7-.21-2.3-.44a4.341 4.341 0 01-1.6-1.05 4.349 4.349 0 01-1.05-1.6c-.23-.6-.39-1.3-.44-2.3C2.008 14.784 2 14.43 2 12c0-2.43.008-2.784.056-3.82.046-1 .21-1.7.44-2.3a4.35 4.35 0 011.05-1.6 4.344 4.344 0 011.6-1.05c.6-.23 1.3-.39 2.3-.44C9.216 2.008 9.57 2 12 2h.315zm0 1.8c-2.41 0-2.695.01-3.64.053-.872.04-1.346.187-1.662.3-.418.162-.715.355-.1.67-.329.314-.61.6-.66.67a3.029 3.029 0 00-.73 1.66c-.113.317-.26.79-.3 1.66C6.01 9.3 6 9.585 6 12c0 2.41.01 2.695.053 3.64.04.872.187 1.346.3 1.662.162.418.355.715.67 1.026.314.314.6.533.67.73a3.01 3.01 0 001.66.73c.317.113.79.26 1.66.3C9.3 17.99 9.585 18 12 18c2.41 0 2.695-.01 3.64-.053.872-.04 1.346-.187 1.662-.3.418-.162.715-.355 1.026-.67.314-.314.533-.6.73-1.66.113-.317.26-.79.3-1.66C17.99 14.7 18 14.415 18 12c0-2.41-.01-2.695-.053-3.64-.04-.872-.187-1.346-.3-1.662a3.01 3.01 0 00-.67-1.026c-.314-.314-.6-.533-.67-.73a3.01 3.01 0 00-1.66-.73c-.317-.113-.79-.26-1.66-.3C14.7 6.01 14.415 6 12 6zm0 2.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm0 1.8a1.7 1.7 0 110 3.4 1.7 1.7 0 010-3.4zm5.3-.85a.85.85 0 100-1.7.85.85 0 000 1.7z" />
        </svg>
      ),
      href: "https://www.instagram.com/adjectiverealestate/"
    },
    {
      svg: (
        <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      href: "https://www.facebook.com/profile.php?id=61593312667084"
    },
    {
      svg: (
        <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      href: "https://www.linkedin.com/company/144844132/admin/dashboard/"
    },
    {
      svg: (
        <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      href: "https://www.youtube.com/"
    },
    {
      svg: (
        <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.968 15.644z" />
        </svg>
      ),
      href: "https://x.com/adjectivereales"
    }
  ];

  return (
    <footer className="bg-[#2D3216] text-[#E3D5C5] font-sans border-t border-[#E3D5C5]/10">
      {/* ── MAIN FOOTER CONTENT ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
        
        {/* COLUMN 1: About & Branding */}
        <div className="space-y-8 lg:border-r lg:border-[#E3D5C5]/20 lg:pr-12 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex flex-col items-center text-center">
              <img
                src="/Adjective/Transparent_Logo.png"
                alt="Adjective Logo"
                className="h-[150px] w-auto object-contain -mt-[45px] -mb-[30px]"
              />
            </div>

            {/* Floral Ornament Divider */}
            <div className="flex items-center justify-center gap-3 text-[#E3D5C5]/30">
              <div className="h-[1px] w-8 bg-current"></div>
              <span className="text-xs">❀</span>
              <div className="h-[1px] w-8 bg-current"></div>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-[#E3D5C5]/80 text-justify">
              At ADJECTIVE, we connect discerning buyers with extraordinary homes that inspire and endure. From iconic developments to exclusive residences, we deliver a real estate experience defined by trust, expertise, and elegance.
            </p>
          </div>

          <div className="space-y-5">
            {/* Social Icons */}
            <div className="flex justify-center gap-3 pt-2">
              {SOCIAL_ICONS.map(({ svg, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social media link"
                  className="w-9 h-9 rounded-full border-0 outline-none ring-0 flex items-center justify-center text-[#E3D5C5] hover:bg-[#E3D5C5] hover:text-[#2D3216] transition-all duration-300"
                >
                  {svg}
                </a>
              ))}
            </div>

            {/* Badges */}
            <div className="border-t border-[#E3D5C5]/10 pt-4 flex items-center justify-around text-[10px] tracking-wider uppercase font-semibold text-[#E3D5C5]/70">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C19A5B]" />
                <span>RERA Verified</span>
              </div>
              <div className="h-4 w-[1px] bg-[#E3D5C5]/20"></div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#C19A5B]" />
                <span>Secure Transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Address */}
        <div className="space-y-6 lg:border-r lg:border-[#E3D5C5]/20 lg:px-10">
          <div>
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white">
              Address
            </h3>
            <div className="w-8 h-[2px] bg-[#E3D5C5] mt-1.5 opacity-60"></div>
          </div>

          <div className="space-y-4 text-xs text-[#E3D5C5]/85">
            {/* Office */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full border border-[#E3D5C5]/20 flex items-center justify-center shrink-0 text-[#C19A5B] bg-[#E3D5C5]/5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-[#E3D5C5]">Kolkata Office</h4>
                <p className="text-[#E3D5C5]/70 leading-normal">
                  133, Subhas Sarani Road<br />
                  Kolkata - 700051<br />
                  West Bengal, India
                </p>
              </div>
            </div>

            <div className="border-t border-dashed border-[#E3D5C5]/15 my-2"></div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full border border-[#E3D5C5]/20 flex items-center justify-center shrink-0 text-[#C19A5B] bg-[#E3D5C5]/5">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <a href="tel:+916294374584" className="hover:underline text-[#E3D5C5]/80 font-medium">
                +91 6294374584
              </a>
            </div>

            <div className="border-t border-dashed border-[#E3D5C5]/15 my-2"></div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full border border-[#E3D5C5]/20 flex items-center justify-center shrink-0 text-[#C19A5B] bg-[#E3D5C5]/5">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <a href="mailto:adjectiverealestate@gmail.com" className="hover:underline text-[#E3D5C5]/80 font-medium">
                adjectiverealestate@gmail.com
              </a>
            </div>

            <div className="border-t border-dashed border-[#E3D5C5]/15 my-2"></div>

            {/* Timings */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full border border-[#E3D5C5]/20 flex items-center justify-center shrink-0 text-[#C19A5B] bg-[#E3D5C5]/5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-[#E3D5C5]">Every Day</h4>
                <p className="text-[#E3D5C5]/60 text-[11px]">10:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Company Links */}
        <div className="space-y-6  lg:px-10">
          <div>
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white">
              Company
            </h3>
            <div className="w-8 h-[2px] bg-[#E3D5C5] mt-1.5 opacity-60"></div>
          </div>

          <ul className="text-xs font-medium space-y-1">
            {[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/projects" },
              { label: "Developers", href: "#" },
              { label: "Vastu Compliant", href: "/vastu-compliant" },
              { label: "Goal-Based Search", href: "/#goal-based" },
              { label: "Blogs", href: "/blog" },
              { label: "FAQs", href: "/faqs" },
              { label: "Contact", href: "#" }
            ].map((item, idx) => (
              <li key={idx} className="group">
                <a
                  href={item.href}
                  className="flex items-center gap-1 py-2 text-[#E3D5C5]/85 hover:text-white transition-colors duration-200"
                >
                  <ChevronRight className="w-3 h-3 text-[#C19A5B] group-hover:translate-x-0.5 transition-transform" />
                  <span>{item.label}</span>
                </a>
                {idx < 7 && <div className="border-t border-dashed border-[#E3D5C5]/10 my-0.5"></div>}
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4: Family Brand */}
        {/* <div className="space-y-6 lg:pl-8">
          <div>
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white">
              Our Family Brand
            </h3>
            <div className="w-8 h-[2px] bg-[#E3D5C5] mt-1.5 opacity-60"></div>
          </div>

          <div className="space-y-3">
            <a
              href="https://5petal.in"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative rounded-2xl overflow-hidden group shadow-md border border-[#E3D5C5]/10 hover:border-[#E3D5C5]/20 transition-all duration-300"
            >
              <img
                src="/Adjective/popup.png"
                alt="5Petal Conscious Fashion"
                className="w-full h-auto object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </a>
            <p className="text-[10px] text-center text-[#E3D5C5]/60 italic font-medium">
              Crafted by the creators of <span className="font-semibold text-[#E3D5C5]">ADJECTIVE</span>.
            </p>
          </div>
        </div> */}

      </div>

      {/* ── BOTTOM SUB-FOOTER ───────────────────────────────────────── */}
      <div className="relative bg-[#2D3216] overflow-hidden min-h-[180px] flex items-center">
        {/* Skyline Silhouette Background (Full Width Bleed with Fade-to-Top) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img 
            src="/Kolkata_Illustration.webp" 
            alt="Kolkata Skyline" 
            className="w-full h-full object-cover object-bottom select-none"
          />
          {/* Soft blend overlay fading from footer color to transparent */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D3216] via-[#2D3216]/20 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col items-center justify-center space-y-4 text-center">
          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wide text-[#E3D5C5]/85">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline text-[#E3D5C5]/30">|</span>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <span className="hidden sm:inline text-[#E3D5C5]/30">|</span>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <span className="hidden sm:inline text-[#E3D5C5]/30">|</span>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>

          {/* Copyright & Made With */}
          <div className="space-y-1.5 text-[11px] font-medium tracking-wide text-[#E3D5C5]/60">
            <p>© {new Date().getFullYear()} ADJECTIVE. All rights reserved.</p>
            <p className="flex items-center justify-center gap-1">
              <span>Made with</span>
              <span className="text-[#E4B5B5] text-sm animate-pulse">❤</span>
              <span>in Kolkata</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}