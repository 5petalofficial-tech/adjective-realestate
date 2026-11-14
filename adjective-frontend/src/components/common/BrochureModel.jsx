"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { apiRequest } from "@/utils/api";
import { Lock } from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function BrochureModal({
  propertyName,
  propertyId,
  isOpen,
  onClose,
  brochureUrl,
}) {
  const [step, setStep] = useState("form"); // "form" | "otp" | "success"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_num, setPhoneNum] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const confirmationResult = useRef(null);
  const recaptchaVerifier = useRef(null);
  const usingPhoneOtp = !email.trim();
  const recaptchaId = useId().replace(/:/g, ""); // Unique ID for reCAPTCHA container
  const recaptchaButtonId = `brochure-phone-submit-${recaptchaId}`;

  // const clearRecaptcha = () => {
  //   if (recaptchaVerifier.current) {
  //     recaptchaVerifier.current.clear();
  //     recaptchaVerifier.current = null;
  //   }
  // };
//   const clearRecaptcha = () => {
//   if (recaptchaVerifier.current) {
//     try {
//       recaptchaVerifier.current.clear();
//     } catch (error) {
//       console.log("reCAPTCHA cleanup:", error);
//     }

//     recaptchaVerifier.current = null;
//   }

// };
const clearRecaptcha = () => {
  if (recaptchaVerifier.current) {
    try {
      recaptchaVerifier.current.clear();
    } catch (error) {
      console.log("reCAPTCHA cleanup error:", error);
    }

    recaptchaVerifier.current = null;
  }

  const container = document.getElementById(
    `brochure-recaptcha-${recaptchaId}`
  );

  if (container) {
    container.innerHTML = "";
  }
};

  useEffect(() => {
  return () => {
    clearRecaptcha();
  };
}, []);


  // const createRecaptcha = () => {
  //   if (typeof window == "undefined") {
  //     return null;
  //   }

  //   if (recaptchaVerifier.current) {
  //     return recaptchaVerifier.current;
  //   }

  //   const container = document.getElementById("brochure-recaptcha");
  //   if(!container) {
  //     throw new Error("reCAPTCHA container not found.");
  //   }

  //   recaptchaVerifier.current = new RecaptchaVerifier(auth, "brochure-recaptcha", {
  //     size: "invisible",
  //     callback: () => {
  //       console.log("reCAPTCHA verified");
  //     },
  //     "expired-callback": () => {
  //       clearRecaptcha();
  //     },
  //   }
  //   );
  //   return recaptchaVerifier.current;
  // };
//   const clearRecaptcha = () => {
//   if (recaptchaVerifier.current) {
//     recaptchaVerifier.current.clear();
//     recaptchaVerifier.current = null;
//   }
// };

const createRecaptcha = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (recaptchaVerifier.current) {
    return recaptchaVerifier.current;
  }

  const submitButton = document.getElementById(recaptchaButtonId);

  if (!submitButton) {
    throw new Error("The phone OTP button was not found.");
  }

  recaptchaVerifier.current = new RecaptchaVerifier(
    auth,
    recaptchaButtonId,
    {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA verified");
      },
      "expired-callback": () => {
        resetRecaptcha();
      },
    }
  );

  return recaptchaVerifier.current;
};

const resetRecaptcha = async () => {
  if (!recaptchaVerifier.current || typeof window === "undefined") return;

  const widgetId = await recaptchaVerifier.current.render();
  window.grecaptcha?.reset(widgetId);
};

  if (!isOpen) return null;

  // const handleClose = () => {
  //   setStep("form");
  //   setName("");
  //   setEmail("");
  //   setPhoneNum("");
  //   setOtp("");
  //   setError("");
  //   setAgreedToTerms(false);
  //   confirmationResult.current = null;
  //   // recaptchaVerifier.current?.clear();
  //   // recaptchaVerifier.current = null;
  //   clearRecaptcha();
  //   onClose();
  // };

  const handleClose = () => {
  clearRecaptcha();

  confirmationResult.current = null;

  setStep("form");
  setName("");
  setEmail("");
  setPhoneNum("");
  setOtp("");
  setError("");
  setAgreedToTerms(false);

  onClose();
};

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (value.trim().startsWith("+")) return `+${digits}`;
    return `+91${digits}`;
  };
     const validatePhone = (phone) => {
      return /^[6-9]\d{9}$/.test(phone);
    };

     const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
  // const handleSendOtp = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");
  //   try {
  //     if (usingPhoneOtp) {
  //       const phoneNumber = formatPhoneNumber(phone_num);
  //       if (!/^\+[1-9]\d{9,14}$/.test(phoneNumber)) {
  //         throw new Error("Enter a valid mobile number, including country code if outside India.");
  //       }
  //       if (!recaptchaVerifier.current) {
  //         recaptchaVerifier.current = new RecaptchaVerifier(auth, "brochure-recaptcha", {
  //           size: "invisible",
  //         });
  //       }
  //       confirmationResult.current = await signInWithPhoneNumber(
  //         auth,
  //         phoneNumber,
  //         recaptchaVerifier.current
  //       );
  //     } else {
  //       await apiRequest("/brochure/send-otp", {
  //         method: "POST",
  //         body: JSON.stringify({ name, email, phone_num }),
  //       });
  //     }
  //     setStep("otp");
  //   } catch (err) {
  //     setError(err.message || "Failed to send OTP. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSendOtp = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    if (usingPhoneOtp) {
      const phoneNumber = formatPhoneNumber(phone_num);

      if (!/^\+[1-9]\d{9,14}$/.test(phoneNumber)) {
        throw new Error(
          "Enter a valid mobile number with country code."
        );
      }

      const appVerifier = await createRecaptcha();

      confirmationResult.current = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
    } else {
      if (!validateEmail(email)) {
        throw new Error("Enter a valid email address.");
      }

      await apiRequest("/brochure/send-otp", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone_num,
        }),
      });
    }

    setStep("otp");
  } catch (err) {
    console.error("Send OTP error:", err);

    await resetRecaptcha();
    confirmationResult.current = null;

    setError(
      err?.message || "Failed to send OTP. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (usingPhoneOtp) {
        if (!confirmationResult.current) throw new Error("Request a new OTP first.");
        const credential = await confirmationResult.current.confirm(otp);
        const firebaseIdToken = await credential.user.getIdToken();
        await apiRequest("/brochure/verify-otp", {
          method: "POST",
          body: JSON.stringify({
            otp,
            name,
            phone: formatPhoneNumber(phone_num),
            propertyName,
            verificationMethod: "phone",
            firebaseIdToken,
          }),
        });
      } else {
        await apiRequest("/brochure/verify-otp", {
          method: "POST",
          body: JSON.stringify({
            email,
            otp,
            name,
            phone: phone_num,
            propertyName,
          }),
        });
      }
      setStep("success");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleResend = async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     if (usingPhoneOtp) {
  //       recaptchaVerifier.current?.clear();
  //       recaptchaVerifier.current = new RecaptchaVerifier(auth, "brochure-recaptcha", {
  //         size: "invisible",
  //       });
  //       confirmationResult.current = await signInWithPhoneNumber(
  //         auth,
  //         formatPhoneNumber(phone_num),
  //         recaptchaVerifier.current
  //       );
  //     } else {
  //       await apiRequest("/brochure/send-otp", {
  //         method: "POST",
  //         body: JSON.stringify({ name, email, phone_num }),
  //       });
  //     }
  //     setError(`A new OTP has been sent to your ${usingPhoneOtp ? "mobile number" : "email"}.`);
  //   } catch (err) {
  //     setError(err.message || "Failed to resend OTP.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   const handleResend = async () => {
//   setLoading(true);
//   setError("");

//   try {
//     if (usingPhoneOtp) {
//       clearRecaptcha();

//       const phoneNumber = formatPhoneNumber(phone_num);

//       if (!/^\+[1-9]\d{9,14}$/.test(phoneNumber)) {
//         throw new Error("Enter a valid mobile number.");
//       }

//       const appVerifier = createRecaptcha();

//       confirmationResult.current = await signInWithPhoneNumber(
//         auth,
//         phoneNumber,
//         appVerifier
//       );
//     } else {
//       await apiRequest("/brochure/send-otp", {
//         method: "POST",
//         body: JSON.stringify({
//           name,
//           email,
//           phone_num,
//         }),
//       });
//     }

//     setError(
//       `A new OTP has been sent to your ${
//         usingPhoneOtp ? "mobile number" : "email"
//       }.`
//     );
//   } catch (err) {
//     console.error("Resend OTP error:", err);

//     clearRecaptcha();
//     confirmationResult.current = null;

//     setError(err?.message || "Failed to resend OTP.");
//   } finally {
//     setLoading(false);
//   }
// };
const handleResend = async () => {
  setLoading(true);
  setError("");

  try {
    if (usingPhoneOtp) {
      const appVerifier = await createRecaptcha();

      await resetRecaptcha();

      confirmationResult.current = await signInWithPhoneNumber(
        auth,
        formatPhoneNumber(phone_num),
        appVerifier
      );
    } else {
      await apiRequest("/brochure/send-otp", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone_num,
        }),
      });
    }

    setError(
      `A new OTP has been sent to your ${
        usingPhoneOtp ? "mobile number" : "email"
      }.`
    );
  } catch (err) {
    console.error("Resend OTP error:", err);

    await resetRecaptcha();
    confirmationResult.current = null;

    setError(err?.message || "Failed to resend OTP.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-gray-100 shadow-2xl p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer border-none bg-transparent"
        >
          ✕
        </button>

        {/* Stage 1: Form */}
        {step === "form" && (
          <>
            <h3 className="text-xl font-bold text-[#1b1b1d] mb-1">
              Download Brochure
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Enter your details to receive the brochure for{" "}
              <span className="font-semibold text-[#5E6623]">
                {propertyName}
              </span>
            </p>
            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#FAF8F2] border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                    type="tel"
                    required
                    value={phone_num}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setPhoneNum(value);
                    }}
                    placeholder="Enter your 10-digit phone number"
                    className="w-full bg-[#FAF8F2] border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                  />

                  {phone_num && !validatePhone(phone_num) && (
                    <p className="text-red-500 text-xs mt-1">
                      Enter a valid 10-digit phone number
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#FAF8F2] border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5E6623]"
                  />

                  {email && !validateEmail(email) && (
                    <p className="text-red-500 text-xs mt-1">
                      Enter a valid email address
                    </p>
                  )}
              </div>

              <div className="flex items-start gap-2 bg-[#FAF8F2] p-3 rounded-lg border border-gray-100">
                <Lock className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Your information is safe with us. We&apos;ll use your details to
                  send the brochure and respond to your property enquiry.
                </p>
              </div>

              <div className="flex items-start gap-2.5 my-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-[#5E6623] focus:ring-[#5E6623] h-3.5 w-3.5 accent-[#5E6623] cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-[11px] text-gray-500 leading-normal cursor-pointer select-none"
                >
                  By continuing, you agree to our{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="text-[#5E6623] underline font-medium hover:text-[#4E541E]"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="/terms-of-use"
                    target="_blank"
                    className="text-[#5E6623] underline font-medium hover:text-[#4E541E]"
                  >
                    Terms of Use
                  </a>
                  .
                </label>
              </div>

              <button
                id={recaptchaButtonId}
                type="submit"
                disabled={!agreedToTerms || loading}
                className="w-full bg-[#5E6623] hover:bg-[#4E541E] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none shadow-md disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : email.trim() ? "Send OTP to Email" : "Send OTP to Mobile"}
              </button>
            </form>
          </>
        )}

        {/* Stage 2: OTP Verification */}
        {step === "otp" && (
          <>
            <h3 className="text-xl font-bold text-[#1b1b1d] mb-1">
              Verify Your {usingPhoneOtp ? "Mobile Number" : "Email"}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Enter the 6-digit OTP sent to{" "}
              <span className="font-semibold text-[#5E6623]">{usingPhoneOtp ? formatPhoneNumber(phone_num) : email}</span>
            </p>
            {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit code"
                  className="w-full bg-[#FAF8F2] border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5E6623] tracking-widest text-center text-lg font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#5E6623] hover:bg-[#4E541E] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none shadow-md disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify & Get Brochure"}
              </button>
              <p className="text-center text-xs text-gray-500">
                Didn&apos;t receive it?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-[#5E6623] font-semibold underline cursor-pointer bg-transparent border-none"
                >
                  Resend OTP
                </button>
              </p>
            </form>
          </>
        )}

        {/* Stage 3: Success */}
        {step === "success" && (
          <div className="py-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-bold text-[#1b1b1d] mb-2">
              {usingPhoneOtp ? "Mobile Number Verified!" : "Email Verified!"}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Your brochure for{" "}
              <span className="font-semibold text-[#5E6623]">
                {propertyName}
              </span>{" "}
              is ready.
            </p>

            {/* View property brochure page — always available */}
            <a
              href={`/brochure-viewer/${propertyId}`}
              className="block w-full text-center bg-[#5E6623] hover:bg-[#4E541E] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md mb-3"
            >
              📄 View &amp; Download Property Brochure
            </a>

            {/* Download original uploaded PDF — only if one is configured */}
            {brochureUrl && (
              <a
                href={brochureUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border border-[#5E6623] text-[#5E6623] hover:bg-[#5E6623] hover:text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition mb-3"
              >
                ⬇ Download Original Brochure PDF
              </a>
            )}

            <button
              onClick={handleClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer border-none"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>

  );
}
