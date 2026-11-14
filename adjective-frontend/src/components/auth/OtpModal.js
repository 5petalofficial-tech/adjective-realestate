"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { X, ShieldCheck } from "lucide-react";
import { verifyOtp, resendOtp } from "@/redux/authSlice";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * OtpModal — popup OTP verification, used by both SignUp and SignIn.
 * Dispatches Redux thunks (auth/verifyOtp, auth/resendOtp) so the
 * resulting user + isAuthenticated state lands in the store directly —
 * no separate local "did it work" plumbing needed.
 *
 * Props:
 *   isOpen     {boolean}
 *   email      {string}
 *   purpose    {"register"|"login"}
 *   onClose    {function} — dismiss without completing
 *   onVerified {function(user)} — called after a successful verify;
 *              the page decides where to navigate (role-based redirect etc.)
 */
export default function OtpModal({ isOpen, email, purpose, onClose, onVerified }) {
    const dispatch = useDispatch();

    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
    const inputRefs = useRef([]);

    const resetState = useCallback(() => {
        setDigits(Array(OTP_LENGTH).fill(""));
        setError("");
        setSubmitting(false);
        setResending(false);
        setCooldown(RESEND_COOLDOWN_SECONDS);
    }, []);

    useEffect(() => {
        if (isOpen) {
            resetState();
            const t = setTimeout(() => inputRefs.current[0]?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [isOpen, email, resetState]);

    useEffect(() => {
        if (!isOpen || cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [isOpen, cooldown]);

    useEffect(() => {
        if (!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && !submitting) onClose?.();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, submitting, onClose]);

    if (!isOpen) return null;

    const focusInput = (index) => inputRefs.current[index]?.focus();

    const handleChange = (index, value) => {
        const clean = value.replace(/\D/g, "").slice(-1);
        setDigits((prev) => {
            const next = [...prev];
            next[index] = clean;
            return next;
        });
        if (error) setError("");
        if (clean && index < OTP_LENGTH - 1) focusInput(index + 1);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            focusInput(index - 1);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((char, i) => {
            next[i] = char;
        });
        setDigits(next);
        focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = digits.join("");

        if (otp.length !== OTP_LENGTH) {
            setError(`Enter the full ${OTP_LENGTH}-digit code`);
            return;
        }

        setSubmitting(true);
        setError("");
        try {
            const user = await dispatch(verifyOtp({ email, otp, purpose })).unwrap();
            onVerified?.(user);
        } catch (message) {
            // rejectWithValue payload arrives directly here thanks to .unwrap()
            setError(typeof message === "string" ? message : "Verification failed. Please try again.");
            setDigits(Array(OTP_LENGTH).fill(""));
            focusInput(0);
        } finally {
            setSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || resending) return;
        setResending(true);
        setError("");
        try {
            await dispatch(resendOtp({ email, purpose })).unwrap();
            setCooldown(RESEND_COOLDOWN_SECONDS);
            setDigits(Array(OTP_LENGTH).fill(""));
            focusInput(0);
        } catch (message) {
            setError(typeof message === "string" ? message : "Couldn't resend code. Please try again.");
        } finally {
            setResending(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !submitting) onClose?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onMouseDown={handleBackdropClick}>
            <div className="absolute inset-0 bg-[#1F2818]/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]" />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="otp-modal-title"
                className="relative w-full max-w-md bg-[#FAF8F3] rounded-2xl shadow-2xl border border-[#E3DFCF] p-7 sm:p-8 animate-[scaleIn_0.18s_ease-out]"
            >
                {!submitting && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#9C9878] hover:text-[#3A3D2E] hover:bg-[#EFEBDC] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-full bg-[#F4EFDE] flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-[#5C6B3E]" />
                    </div>
                </div>

                <div className="text-center mb-7">
                    <h2 id="otp-modal-title" className="font-serif text-2xl text-[#232B1B] leading-tight">
                        Enter verification code
                    </h2>
                    <p className="text-[#7C7A68] text-sm mt-2">
                        Sent to <span className="font-medium text-[#3A3D2E]">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                maxLength={1}
                                value={digit}
                                disabled={submitting}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-semibold rounded-xl border bg-white text-[#232B1B] focus:outline-none focus:ring-2 focus:ring-[#5C6B3E]/30 focus:border-[#5C6B3E] disabled:opacity-60 transition-colors ${error ? "border-[#D97757]" : "border-[#E3DFCF]"
                                    }`}
                            />
                        ))}
                    </div>

                    {error && <p className="text-xs text-[#C0523B] text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex items-center justify-center gap-2 bg-[#5C6B3E] hover:bg-[#4E5C33] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl py-3.5 transition-colors shadow-sm"
                    >
                        {submitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Verifying…
                            </>
                        ) : (
                            "Verify & Continue"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-[#8B8874] mt-6">
                    Didn't get the code?{" "}
                    {cooldown > 0 ? (
                        <span className="text-[#B3AF95]">Resend in {cooldown}s</span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-[#5C6B3E] font-semibold hover:underline disabled:opacity-60"
                        >
                            {resending ? "Sending…" : "Resend code"}
                        </button>
                    )}
                </p>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.96) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
