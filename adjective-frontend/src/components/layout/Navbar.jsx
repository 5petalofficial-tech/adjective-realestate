"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Tag,
  Users,
  Mail,
  Menu,
  X,
  ArrowUpRight,
  Heart,
  ChevronDown,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Compass,
  House,
  ShieldCheck,
  ClipboardList,
  Calculator,
  Newspaper,
  CircleHelp,
  Lightbulb,
} from "lucide-react";
import ContactUsModal from "@/components/common/ContactUsModal";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthInitializing,
  logout,
} from "@/redux/authSlice";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeLink, setActiveLink] = useState("buy-property");

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  // Auth state
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authInitializing = useSelector(selectAuthInitializing);

  const userMenuRef = useRef(null);

  // Prevent server/client hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (e) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);

    try {
      await dispatch(logout()).unwrap();
    } catch {
      // Redux state is cleared locally even if API logout fails.
    } finally {
      router.push("/");
    }
  };

  const dashboardHref =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "agent"
        ? "/agent/dashboard"
        : null;

  const navLinks = [
    {
      label: "Buy Property",
      icon: Home,
      href: "/",
    },
    {
      label: "Sell Property",
      icon: Tag,
      href: "/sell-property",
      target: "_blank",
    },
    {
      label: "Why Us",
      icon: Users,
      href: "/why-us",
    },
    {
      label: "Contact Us",
      icon: Mail,
      isContact: true,
    },
  ];

  const drawerLinks = [
    {
      label: "Vastu Compliant Projects",
      href: "/vastu-compliant",
      icon: Compass,
    },
    {
      label: "PMAY Approved Projects",
      href: "/pmay-approved",
      icon: House,
    },
    {
      label: "RERA Approved Projects",
      href: "/rera-approved",
      icon: ShieldCheck,
    },
    {
      label: "Project Lists",
      href: "/projects",
      icon: ClipboardList,
    },
    {
      label: "Loan Calculator",
      href: "/loan-calculator",
      icon: Calculator,
    },
    {
      label: "Blog",
      href: "/blog",
      icon: Newspaper,
    },
    {
      label: "FAQs",
      href: "/faqs",
      icon: CircleHelp,
    },
    {
      label: "Help Us To Improve",
      href: "/help-us-improve",
      icon: Lightbulb,
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-lg border-b border-black/10 shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
            : "shadow-[0_20px_20px_rgba(19,27,46,0.04)]"
        }`}
        style={{
          backgroundColor: scrolled
            ? "rgba(255,255,255,0.85)"
            : "#5E6623",
          animation:
            "fadeInDown 0.7s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <div className="relative flex items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-full">
          {/* LEFT: Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 gap-4 md:gap-6"
          >
            <Image
              src={
                scrolled
                  ? "/Adjective/Logo.png"
                  : "/Adjective/Transparent_Logo.png"
              }
              alt="Adjective Real Estate Logo"
              width={290}
              height={80}
              style={{
                width: "auto",
                height: "auto",
              }}
              className="object-contain transition-opacity duration-300 w-[120px] sm:w-[150px] md:w-[220px] lg:w-[290px] -translate-x-0 md:-translate-x-10 lg:-translate-x-45"
              priority
            />
          </Link>

          {/* CENTER: Nav Links */}
          <nav className="hidden min-[768px]:flex items-center gap-8 min-[1200px]:gap-12 flex-nowrap absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map(
              ({ label, icon: Icon, href, isContact, target }) => {
                const isActive =
                  (href === "/" && pathname === "/") ||
                  (href === "/sell-property" &&
                    pathname === "/sell-property") ||
                  (isContact && contactModalOpen);

                const isWhyUs = label === "Why Us";
                const isContactLink = label === "Contact Us";

                const linkVisibility = isContactLink
                  ? "hidden min-[1200px]:flex"
                  : isWhyUs
                    ? "hidden min-[900px]:flex"
                    : "flex";

                return (
                  <Link
                    key={label}
                    href={href || "#"}
                    target={target}
                    rel={target === "_blank" ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (isContact) {
                        e.preventDefault();
                        setContactModalOpen(true);
                        return;
                      }

                      if (href === "/") {
                        if (pathname === "/") {
                          e.preventDefault();
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        } else {
                          e.preventDefault();
                          router.push("/");
                        }
                        return;
                      }

                      // if (href === "/sell-property") {
                      //   if (pathname === "/sell-property") {
                      //     e.preventDefault();
                      //     window.scrollTo({
                      //       top: 0,
                      //       behavior: "smooth",
                      //     });
                      //   } else {
                      //     e.preventDefault();
                      //     router.push("/sell-property");
                      //   }
                      //   return;
                      // }
                       
                      if (
                        href &&
                        href.startsWith("#") &&
                        href.length > 1
                      ) {
                        e.preventDefault();

                        if (pathname === "/") {
                          const target =
                            document.querySelector(href);

                          if (target) {
                            const offset = 96;

                            const top =
                              target.getBoundingClientRect()
                                .top +
                              window.scrollY -
                              offset;

                            window.scrollTo({
                              top,
                              behavior: "smooth",
                            });
                          }
                        } else {
                          router.push("/" + href);
                        }

                        return;
                      }
                    }}
                    className={`${linkVisibility} items-center gap-2 text-l font-label-md transition-colors duration-300 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? scrolled
                          ? "text-[#5E6623]"
                          : "text-[#FFC85C]"
                        : scrolled
                          ? "text-[#1b1b1d] hover:text-[#5E6623]"
                          : "text-white hover:text-[#FFC85C]"
                    }`}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: scrolled
                          ? "#5E6623"
                          : "#FFC85C",
                      }}
                      strokeWidth={2}
                    />

                    <span
                      className={`relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:transition-all after:duration-300 ${
                        isActive
                          ? "after:w-full " +
                            (scrolled
                              ? "after:bg-[#5E6623]"
                              : "after:bg-[#FFC85C]")
                          : "after:w-0 hover:after:w-full " +
                            (scrolled
                              ? "after:bg-[#5E6623]"
                              : "after:bg-[#FFC85C]")
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                );
              }
            )}
          </nav>
        </div>

        {/* RIGHT GROUP */}
        <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 md:gap-5">
          {/* Login / Sign Up —vs— User menu */}
          <div className="hidden min-[1200px]:flex items-center gap-3">
            {/* 
              Important:
              Before mount, always render the same skeleton.
              This prevents server/client hydration mismatch.
            */}
            {!mounted || authInitializing ? (
              <div className="w-24 h-4" />
            ) : isAuthenticated ? (
              <div
                className="relative"
                ref={userMenuRef}
              >
                <button
                  onClick={() =>
                    setUserMenuOpen((v) => !v)
                  }
                  className={`flex items-center gap-2 text-l font-label-md whitespace-nowrap transition-colors duration-300 ${
                    scrolled
                      ? "text-[#1b1b1d] hover:text-[#5E6623]"
                      : "text-white hover:text-[#FFC85C]"
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{
                      backgroundColor: scrolled
                        ? "#5E6623"
                        : "#FFC85C",
                      color: scrolled
                        ? "#fff"
                        : "#5E6623",
                    }}
                  >
                    {user?.fullName
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </span>

                  <span>
                    {user?.fullName?.split(" ")[0] ||
                      "Account"}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      userMenuOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl border border-black/5 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-black/5">
                      <p className="text-sm font-medium text-[#1b1b1d] truncate">
                        {user?.fullName}
                      </p>

                      <p className="text-xs text-[#7C7A68] truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() =>
                        setUserMenuOpen(false)
                      }
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1b1b1d] hover:bg-[#F4EFDE] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#5E6623]" />
                      My Profile
                    </Link>

                    {dashboardHref && (
                      <Link
                        href={dashboardHref}
                        onClick={() =>
                          setUserMenuOpen(false)
                        }
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1b1b1d] hover:bg-[#F4EFDE] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#5E6623]" />

                        {user?.role === "admin"
                          ? "Admin Dashboard"
                          : "Agent Dashboard"}
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#B3261E] hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className={`text-l font-label-md whitespace-nowrap transition-colors duration-300 ${
                    scrolled
                      ? "text-[#1b1b1d] hover:text-[#5E6623]"
                      : "text-white hover:text-[#FFC85C]"
                  }`}
                >
                  Login
                </Link>

                <div
                  className={`hidden min-[1200px]:block w-px h-6 opacity-40 ${
                    scrolled
                      ? "bg-[#5E6623]"
                      : "bg-[#FFC85C]"
                  }`}
                />

                <Link
                  href="/signup"
                  className={`text-l font-label-md whitespace-nowrap transition-colors duration-300 ${
                    scrolled
                      ? "text-[#1b1b1d] hover:text-[#5E6623]"
                      : "text-white hover:text-[#FFC85C]"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center p-1 hover:opacity-80 transition-opacity duration-200"
          >
            <Menu
              className="w-7 h-7"
              style={{
                color: scrolled
                  ? "#5E6623"
                  : "#FFC85C",
              }}
              strokeWidth={2.2}
            />
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative flex items-center justify-center p-1 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
          >
            <Heart
              className="w-6 h-6"
              style={{
                color: scrolled
                  ? "#5E6623"
                  : "#FFC85C",
              }}
              strokeWidth={2}
            />

            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {wishlistItems.length}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* DRAWER OVERLAY */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[380px] flex flex-col transition-transform duration-400 ease-in-out ${
          drawerOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        style={{
          backgroundColor: "#5E6623",
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/20">
          <Image
            src="/Adjective/Transparent_Logo.png"
            alt="Adjective Real Estate Logo"
            width={145}
            height={60}
            className="object-contain"
          />

          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <X
              className="w-5 h-5 text-white"
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Main header links inside drawer */}
        <div className="px-6 pt-4 pb-2 border-b border-white/10">
          {navLinks.map(
            ({ label, icon: Icon, href, isContact, target }) => (
              <Link
                key={label}
                href={href || "#"}
                target={target}
  rel={target === "_blank" ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  setDrawerOpen(false);

                  if (isContact) {
                    e.preventDefault();
                    setContactModalOpen(true);
                    return;
                  }

                  if (href === "/") {
                    if (pathname === "/") {
                      e.preventDefault();

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    } else {
                      e.preventDefault();
                      router.push("/");
                    }

                    return;
                  }

                  // if (href === "/sell-property") {
                  //   if (
                  //     pathname === "/sell-property"
                  //   ) {
                  //     e.preventDefault();

                  //     window.scrollTo({
                  //       top: 0,
                  //       behavior: "smooth",
                  //     });
                  //   } else {
                  //     e.preventDefault();
                  //     router.push("/sell-property");
                  //   }

                  //   return;
                  // }

                  if (
                    href &&
                    href.startsWith("#") &&
                    href.length > 1
                  ) {
                    e.preventDefault();

                    if (pathname === "/") {
                      const target =
                        document.querySelector(href);

                      if (target) {
                        const offset = 96;

                        const top =
                          target.getBoundingClientRect()
                            .top +
                          window.scrollY -
                          offset;

                        window.scrollTo({
                          top,
                          behavior: "smooth",
                        });
                      }
                    } else {
                      router.push("/" + href);
                    }
                  }
                }}
                className="group flex items-center justify-between py-4 border-b border-white/20 text-white text-base font-medium hover:text-[#FFC85C] transition-colors duration-200 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Icon
                    className="w-4 h-4 text-[#FFC85C]"
                    strokeWidth={2}
                  />

                  {label}
                </span>

                <ArrowUpRight
                  className="w-4 h-4 text-[#FFC85C] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  strokeWidth={2}
                />
              </Link>
            )
          )}
        </div>

        {/* Drawer Links */}
        <nav className="flex flex-col flex-1 px-6 py-4 gap-0 overflow-y-auto">
          {drawerLinks.map(
            ({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href || "#"}
                onClick={(e) => {
                  setDrawerOpen(false);

                  if (href === "/") {
                    if (pathname === "/") {
                      e.preventDefault();

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    } else {
                      e.preventDefault();
                      router.push("/");
                    }
                  }
                }}
                className="group flex items-center justify-between py-4 border-b border-white/20 text-white text-base font-medium hover:text-[#FFC85C] transition-colors duration-200 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Icon
                    className="w-4 h-4 text-[#FFC85C]"
                    strokeWidth={2}
                  />

                  {label}
                </span>

                <ArrowUpRight
                  className="w-4 h-4 text-[#FFC85C] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  strokeWidth={2}
                />
              </Link>
            )
          )}

          {/* Mobile Auth Links */}
          { mounted && 
            !authInitializing &&
            !isAuthenticated && (
              <div className="flex items-center gap-9 pt-4">
                <Link
                  href="/signin"
                  onClick={() =>
                    setDrawerOpen(false)
                  }
                  className="text-white text-sm font-medium hover:text-[#FFC85C] transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </span>
                </Link>

                <Link
                  href="/signup"
                  onClick={() =>
                    setDrawerOpen(false)
                  }
                  className="text-white text-sm font-medium hover:text-[#FFC85C] transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </span>
                </Link>
              </div>
            )}

          { mounted && 
            !authInitializing &&
            isAuthenticated && (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 pt-4 text-white text-sm font-medium hover:text-[#FFC85C] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
        </nav>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-white/20">
          <p className="text-xs text-white/50 text-center">
            © 2026 ADJECTIVE
          </p>
        </div>
      </div>

      {/* Contact Us Modal */}
      <ContactUsModal
        isOpen={contactModalOpen}
        onClose={() =>
          setContactModalOpen(false)
        }
      />
    </>
  );
}