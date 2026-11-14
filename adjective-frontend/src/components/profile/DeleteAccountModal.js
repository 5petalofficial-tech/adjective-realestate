"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AlertTriangle, X } from "lucide-react";
import { requestAccountDeletion, confirmAccountDeletion } from "@/redux/authSlice";

const OTP_LENGTH = 6;

/**
 * components/profile/DeleteAccountModal.js
 *
 * Two steps, matching the backend's two-endpoint design:
 *   1. "reason" screen  → dispatch(requestAccountDeletion) → OTP emailed
 *   2. "otp" screen      → dispatch(confirmAccountDeletion) → account
 *      soft-deleted server-side, session cleared here too
 *
 * This is intentionally a separate component from OtpModal — that one
 * is coupled to the register/login session-issuing flow. Deletion
 * doesn't issue a session, it ends one, so the success handling differs
 * enough to not be worth forcing into one shared component.
 */
export default function DeleteAccountModal({ isOpen, onClose, onDeleted }) {
    const dispatch = useDispatch();
    const [step, setStep] = useState("reason"); // "reason" | "otp"
    const [reason, setReason] = useState("");
    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (isOpen) {
            setStep("reason");
            setReason("");
            setDigits(Array(OTP_LENGTH).fill(""));
            setError("");
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = original; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleRequestOtp = async () => {
        setSubmitting(true);
        setError("");
        try {
            await dispatch(requestAccountDeletion({ reason })).unwrap();
            setStep("otp");
            setTimeout(() => inputRefs.current[0]?.focus(), 50);
        } catch (message) {
            setError(typeof message === "string" ? message : "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const focusInput = (i) => inputRefs.current[i]?.focus();

    const handleDigitChange = (index, value) => {
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
        if (e.key === "Backspace" && !digits[index] && index > 0) focusInput(index - 1);
    };

    const handleConfirmDelete = async () => {
        const otp = digits.join("");
        if (otp.length !== OTP_LENGTH) {
            setError(`Enter the full ${OTP_LENGTH}-digit code`);
            return;
        }

        setSubmitting(true);
        setError("");
        try {
            await dispatch(confirmAccountDeletion({ otp, reason })).unwrap();
            onDeleted?.();
        } catch (message) {
            setError(typeof message === "string" ? message : "Verification failed.");
            setDigits(Array(OTP_LENGTH).fill(""));
            focusInput(0);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#1F2818]/60 backdrop-blur-sm"
                onClick={() => !submitting && onClose?.()}
            />

            <div className="relative w-full max-w-md bg-[#FAF8F3] rounded-2xl shadow-2xl border border-[#E3DFCF] p-7 sm:p-8">
                {!submitting && (
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#9C9878] hover:text-[#3A3D2E] hover:bg-[#EFEBDC] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                </div>

                {step === "reason" ? (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="font-serif text-2xl text-[#232B1B]">Delete your account?</h2>
                            <p className="text-[#7C7A68] text-sm mt-2">
                                This deactivates your account and signs you out everywhere. You can
                                contact support to restore it within a limited window.
                            </p>
                        </div>

                        <label className="block text-sm font-medium text-[#3A3D2E] mb-1.5">
                            Tell us why (optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            maxLength={300}
                            placeholder="Helps us improve — totally optional"
                            className="w-full rounded-xl border border-[#E3DFCF] bg-white px-4 py-3 text-sm text-[#232B1B] placeholder:text-[#B3AF95] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-colors resize-none"
                        />

                        {error && <p className="text-xs text-[#C0523B] mt-2">{error}</p>}

                        <button
                            onClick={handleRequestOtp}
                            disabled={submitting}
                            className="w-full mt-6 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-xl py-3.5 transition-colors"
                        >
                            {submitting ? "Sending code…" : "Send verification code"}
                        </button>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="font-serif text-2xl text-[#232B1B]">Confirm deletion</h2>
                            <p className="text-[#7C7A68] text-sm mt-2">Enter the code we just emailed you</p>
                        </div>

                        <div className="flex justify-center gap-2 sm:gap-2.5">
                            {digits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    disabled={submitting}
                                    onChange={(e) => handleDigitChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-semibold rounded-xl border bg-white text-[#232B1B] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 disabled:opacity-60 transition-colors ${
                                        error ? "border-[#D97757]" : "border-[#E3DFCF]"
                                    }`}
                                />
                            ))}
                        </div>

                        {error && <p className="text-xs text-[#C0523B] text-center mt-3">{error}</p>}

                        <button
                            onClick={handleConfirmDelete}
                            disabled={submitting}
                            className="w-full mt-6 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium text-sm rounded-xl py-3.5 transition-colors"
                        >
                            {submitting ? "Deleting…" : "Permanently delete account"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
