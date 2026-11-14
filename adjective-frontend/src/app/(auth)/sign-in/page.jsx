"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Mail, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { login } from "@/redux/authSlice";
import OtpModal from "@/components/auth/OtpModal";

export default function SignInPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    const validate = () => {
        if (!email.trim()) {
            setError("Email address is required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email address");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await dispatch(login({ email })).unwrap();

            // Backend always returns the same generic success message here
            // (enumeration-safe) — so we always open the OTP popup next.
            setOtpModalOpen(true);
        } catch (message) {
            setError(typeof message === "string" ? message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Called by OtpModal once the code is verified — Redux store already
    // has the user + isAuthenticated=true at this point.
    const handleVerified = (user) => {
        setOtpModalOpen(false);
        if (user.role === "admin") router.push("/admin/dashboard");
        else if (user.role === "agent") router.push("/agent/dashboard");
        else router.push("/");
    };

    return (
        <div className="min-h-screen w-full flex bg-[#FAF8F3]">
            {/* LEFT — brand / visual panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2F3A25]">
                <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
                    alt="Modern residence"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2818] via-[#2F3A25]/70 to-[#2F3A25]/30" />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/Adjective/Transparent_Logo.png"
                            alt="Adjective Real Estate"
                            width={280}
                            height={95}
                            style={{ width: "auto", height: "auto" }}
                            className="h-20 sm:h-24 w-auto object-contain"
                            priority
                        />
                    </Link>

                    <div className="space-y-6">
                        <h1 className="font-serif text-4xl xl:text-[42px] leading-[1.15] text-[#F8F6EF]">
                            Welcome back to
                            <br />
                            your <span className="text-[#C7B466] italic">next home.</span>
                        </h1>
                        <p className="text-[#D8D3C0] text-sm max-w-sm leading-relaxed">
                            Sign in to pick up where you left off — saved listings,
                            scheduled visits, and your personalized matches.
                        </p>

                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-5 py-4 max-w-sm">
                            <ShieldCheck className="w-5 h-5 text-[#C7B466] shrink-0" />
                            <div>
                                <p className="text-[#F8F6EF] text-sm font-medium">
                                    No passwords, ever
                                </p>
                                <p className="text-[#C9C4B0] text-xs mt-0.5">
                                    We verify you with a one-time code sent to your email.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-[#9FA588] text-xs">
                        © {new Date().getFullYear()} Adjective Real Estate
                    </p>
                </div>
            </div>

            {/* RIGHT — form panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
                <div className="w-full max-w-md">
                    {/* Back to Homepage */}
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#7C7A68] hover:text-[#5C6B3E] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Homepage
                        </Link>
                    </div>

                    {/* Mobile-only brand mark */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/">
                            <Image
                                src="/Adjective/Transparent_Logo.png"
                                alt="Adjective Real Estate"
                                width={240}
                                height={80}
                                style={{ width: "auto" }}
                                className="h-16 sm:h-20 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-serif text-[28px] sm:text-3xl text-[#232B1B] leading-tight">
                            Sign in to{" "}
                            <span className="text-[#5C6B3E]">Adjective</span>
                        </h2>
                        <p className="text-[#7C7A68] text-sm mt-2">
                            Enter your email and we'll send you a one-time code.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-[#3A3D2E] mb-1.5"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C9878]" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                    autoFocus
                                    className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm text-[#232B1B] placeholder:text-[#B3AF95] focus:outline-none focus:ring-2 focus:ring-[#5C6B3E]/30 focus:border-[#5C6B3E] transition-colors ${error ? "border-[#D97757]" : "border-[#E3DFCF]"
                                        }`}
                                />
                            </div>
                            {error && (
                                <p className="text-xs text-[#C0523B] mt-1.5">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 bg-[#5C6B3E] hover:bg-[#4E5C33] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl py-3.5 transition-colors shadow-sm"
                        >
                            {submitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Sending code…
                                </>
                            ) : (
                                <>
                                    Send Verification Code
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-[#8B8874] mt-7">
                        New to Adjective?{" "}
                        <Link href="/sign-up" className="text-[#5C6B3E] font-semibold hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>

            <OtpModal
                isOpen={otpModalOpen}
                email={email}
                purpose="login"
                onClose={() => setOtpModalOpen(false)}
                onVerified={handleVerified}
            />
        </div>
    );
}
