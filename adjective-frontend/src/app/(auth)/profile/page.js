"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    ShieldAlert,
    Bell,
    Camera,
    Heart,
    MessageSquare,
    CalendarCheck,
    Eye,
    LogOut,
    AlertTriangle,
} from "lucide-react";
import {
    selectCurrentUser,
    updateProfile,
    uploadAvatar,
    logout,
} from "@/redux/authSlice";
import { getMyActivity } from "@/lib/userApi";
import DeleteAccountModal from "@/components/profile/DeleteAccountModal";

/**
 * app/profile/page.js — "Account Center"
 *
 * Profile vs Dashboard, deliberately kept separate:
 *   Profile   = manage MY account (who I am, my contact info, my settings)
 *   Dashboard = manage MY business activity (listings, leads, bookings —
 *               role-specific, lives at /agent/dashboard, /admin/dashboard)
 * This page only ever touches the former. It never shows listings,
 * leads, or anything role-specific beyond a link out to the right dashboard.
 */
export default function ProfilePage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector(selectCurrentUser);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        bio: "",
        address: { street: "", city: "", state: "", country: "", postalCode: "" },
        preferences: { notifications: { email: true, sms: false }, language: "en", theme: "system" },
    });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [avatarUploading, setAvatarUploading] = useState(false);
    const avatarInputRef = useRef(null);

    const [activity, setActivity] = useState(null);
    const [activityLoading, setActivityLoading] = useState(true);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Hydrate the form from the Redux user once it's available.
    useEffect(() => {
        if (!user) return;
        setForm({
            fullName: user.fullName || "",
            phone: user.phone || "",
            bio: user.bio || "",
            address: {
                street: user.address?.street || "",
                city: user.address?.city || "",
                state: user.address?.state || "",
                country: user.address?.country || "",
                postalCode: user.address?.postalCode || "",
            },
            preferences: {
                notifications: {
                    email: user.preferences?.notifications?.email ?? true,
                    sms: user.preferences?.notifications?.sms ?? false,
                },
                language: user.preferences?.language || "en",
                theme: user.preferences?.theme || "system",
            },
        });
    }, [user]);

    // Activity summary is page-specific, transient data — kept in local
    // state, not Redux (see authSlice.js comment on why Redux only holds
    // the user object + auth status).
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getMyActivity();
                if (!cancelled) setActivity(data);
            } catch {
                if (!cancelled) setActivity(null);
            } finally {
                if (!cancelled) setActivityLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    if (!user) return null; // AuthInitializer + route guard handle the unauthenticated case

    const handleFieldChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setSaveSuccess(false);
    };

    const handleAddressChange = (field, value) => {
        setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
        setSaveSuccess(false);
    };

    const handlePreferenceChange = (path, value) => {
        setForm((prev) => {
            if (path === "language" || path === "theme") {
                return { ...prev, preferences: { ...prev.preferences, [path]: value } };
            }
            // notifications.email / notifications.sms
            return {
                ...prev,
                preferences: {
                    ...prev.preferences,
                    notifications: { ...prev.preferences.notifications, [path]: value },
                },
            };
        });
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError("");
        try {
            await dispatch(updateProfile(form)).unwrap();
            setSaveSuccess(true);
        } catch (message) {
            setSaveError(typeof message === "string" ? message : "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarClick = () => avatarInputRef.current?.click();

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setSaveError("Only JPEG, PNG, or WEBP images are allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setSaveError("Image must be under 5MB");
            return;
        }

        setAvatarUploading(true);
        setSaveError("");
        try {
            await dispatch(uploadAvatar(file)).unwrap();
        } catch (message) {
            setSaveError(typeof message === "string" ? message : "Failed to upload avatar");
        } finally {
            setAvatarUploading(false);
            e.target.value = "";
        }
    };

    const handleSignOut = async () => {
        await dispatch(logout()).unwrap().catch(() => {});
        router.push("/");
    };

    const handleAccountDeleted = () => {
        setDeleteModalOpen(false);
        router.push("/");
    };

    const dashboardHref =
        user.role === "admin" ? "/admin/dashboard" : user.role === "agent" ? "/agent/dashboard" : null;

    return (
        <div className="min-h-screen bg-[#FAF8F3] pb-20">
            {/* ── Header card ─────────────────────────────────── */}
            <div className="bg-[#2F3A25] pt-28 pb-16 px-6">
                <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center sm:items-end gap-5">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-[#F4EFDE] border-4 border-[#FAF8F3] overflow-hidden flex items-center justify-center">
                            {user.avatar?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.avatar.url} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-serif text-[#5C6B3E]">
                                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleAvatarClick}
                            disabled={avatarUploading}
                            aria-label="Change photo"
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#5C6B3E] hover:bg-[#4E5C33] flex items-center justify-center text-white shadow-md transition-colors disabled:opacity-60"
                        >
                            {avatarUploading ? (
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Camera className="w-3.5 h-3.5" />
                            )}
                        </button>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>

                    <div className="text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <h1 className="font-serif text-2xl text-white">{user.fullName}</h1>
                            <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full bg-[#F4EFDE] text-[#5C6B3E]">
                                {user.role}
                            </span>
                        </div>
                        <p className="text-[#D8D3C0] text-sm mt-1">{user.email}</p>
                        <p className="text-[#9FA588] text-xs mt-1">
                            Member since{" "}
                            {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 -mt-8 space-y-6">
                {/* ── Saved Properties Summary + Recent Activity ──── */}
                <section className="bg-white rounded-2xl border border-[#E3DFCF] shadow-sm p-6">
                    <h2 className="font-serif text-lg text-[#232B1B] mb-4">Your Activity</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "Saved Properties", value: activity?.savedPropertiesCount, icon: Heart },
                            { label: "Inquiries", value: activity?.inquiryCount, icon: MessageSquare },
                            { label: "Appointments", value: activity?.appointmentCount, icon: CalendarCheck },
                            { label: "Recently Viewed", value: activity?.recentlyViewedCount, icon: Eye },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="text-center p-4 rounded-xl bg-[#FAF8F3]">
                                <Icon className="w-5 h-5 text-[#5C6B3E] mx-auto mb-2" />
                                <p className="text-xl font-semibold text-[#232B1B]">
                                    {activityLoading ? "—" : value ?? 0}
                                </p>
                                <p className="text-xs text-[#7C7A68] mt-1">{label}</p>
                            </div>
                        ))}
                    </div>
                    {dashboardHref && (
                        <a
                            href={dashboardHref}
                            className="inline-block mt-4 text-sm text-[#5C6B3E] font-semibold hover:underline"
                        >
                            Go to {user.role === "admin" ? "Admin" : "Agent"} Dashboard →
                        </a>
                    )}
                </section>

                {/* ── Personal Information ────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#E3DFCF] shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <UserIcon className="w-4 h-4 text-[#5C6B3E]" />
                        <h2 className="font-serif text-lg text-[#232B1B]">Personal Information</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Full Name">
                            <input
                                type="text"
                                value={form.fullName}
                                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                                className="input"
                            />
                        </Field>
                        <Field label="Bio" full>
                            <textarea
                                value={form.bio}
                                onChange={(e) => handleFieldChange("bio", e.target.value)}
                                rows={3}
                                maxLength={500}
                                placeholder="Tell us a little about yourself"
                                className="input resize-none"
                            />
                        </Field>
                    </div>
                </section>

                {/* ── Contact Information ─────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#E3DFCF] shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="w-4 h-4 text-[#5C6B3E]" />
                        <h2 className="font-serif text-lg text-[#232B1B]">Contact Information</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Email Address">
                            <div className="flex items-center gap-2">
                                <input type="email" value={user.email} disabled className="input opacity-60 cursor-not-allowed" />
                                {user.isEmailVerified && <ShieldCheck className="w-4 h-4 text-[#5C6B3E] shrink-0" />}
                            </div>
                            <p className="text-xs text-[#B3AF95] mt-1">Email can't be changed — it's tied to your login.</p>
                        </Field>
                        <Field label="Phone Number">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#9C9878] shrink-0" />
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                                    className="input"
                                />
                            </div>
                        </Field>
                    </div>
                </section>

                {/* ── Address ──────────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#E3DFCF] shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-[#5C6B3E]" />
                        <h2 className="font-serif text-lg text-[#232B1B]">Address</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Street"><input className="input" value={form.address.street} onChange={(e) => handleAddressChange("street", e.target.value)} /></Field>
                        <Field label="City"><input className="input" value={form.address.city} onChange={(e) => handleAddressChange("city", e.target.value)} /></Field>
                        <Field label="State"><input className="input" value={form.address.state} onChange={(e) => handleAddressChange("state", e.target.value)} /></Field>
                        <Field label="Country"><input className="input" value={form.address.country} onChange={(e) => handleAddressChange("country", e.target.value)} /></Field>
                        <Field label="Postal Code"><input className="input" value={form.address.postalCode} onChange={(e) => handleAddressChange("postalCode", e.target.value)} /></Field>
                    </div>
                </section>

                {/* Save bar for everything above */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#5C6B3E] hover:bg-[#4E5C33] disabled:opacity-60 text-white text-sm font-medium rounded-xl px-6 py-3 transition-colors"
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                    {saveSuccess && <span className="text-sm text-[#5C6B3E]">Saved ✓</span>}
                    {saveError && <span className="text-sm text-[#C0523B]">{saveError}</span>}
                </div>

                {/* ── Account Status ───────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#E3DFCF] shadow-sm p-6">
                    <h2 className="font-serif text-lg text-[#232B1B] mb-4">Account Status</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <StatusRow
                            label="Email Verification"
                            ok={user.isEmailVerified}
                            okText="Verified"
                            badText="Not verified"
                        />
                        <StatusRow
                            label="Account Standing"
                            ok={user.status === "active"}
                            okText="Active"
                            badText={user.status}
                        />
                        {user.role === "user" && user.agentProfile?.status !== "none" && (
                            <StatusRow
                                label="Agent Application"
                                ok={user.agentProfile?.status === "approved"}
                                okText="Approved"
                                badText={user.agentProfile?.status}
                            />
                        )}
                    </div>
                </section>

                {/* ── Preferences ──────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#E3DFCF] shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="w-4 h-4 text-[#5C6B3E]" />
                        <h2 className="font-serif text-lg text-[#232B1B]">Preferences</h2>
                    </div>
                    <div className="space-y-4">
                        <ToggleRow
                            label="Email notifications"
                            checked={form.preferences.notifications.email}
                            onChange={(v) => handlePreferenceChange("email", v)}
                        />
                        <ToggleRow
                            label="SMS notifications"
                            checked={form.preferences.notifications.sms}
                            onChange={(v) => handlePreferenceChange("sms", v)}
                        />
                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            <Field label="Language">
                                <select
                                    className="input"
                                    value={form.preferences.language}
                                    onChange={(e) => handlePreferenceChange("language", e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="bn">বাংলা</option>
                                </select>
                            </Field>
                            <Field label="Theme">
                                <select
                                    className="input"
                                    value={form.preferences.theme}
                                    onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </Field>
                        </div>
                    </div>
                </section>

                {/* ── Security ─────────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#E3DFCF] shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="w-4 h-4 text-[#5C6B3E]" />
                        <h2 className="font-serif text-lg text-[#232B1B]">Security</h2>
                    </div>
                    <p className="text-sm text-[#7C7A68] mb-4">
                        Your account is passwordless — every sign-in is verified with a one-time
                        code sent to <span className="font-medium text-[#3A3D2E]">{user.email}</span>.
                    </p>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-sm text-[#3A3D2E] font-medium border border-[#E3DFCF] rounded-xl px-4 py-2.5 hover:bg-[#FAF8F3] transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </section>

                {/* ── Danger Zone ──────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <h2 className="font-serif text-lg text-red-700">Danger Zone</h2>
                    </div>
                    <p className="text-sm text-[#7C7A68] mb-4">
                        Deleting your account deactivates it immediately and signs you out of every
                        device. This requires email verification.
                    </p>
                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="text-sm text-red-600 font-semibold border border-red-200 rounded-xl px-4 py-2.5 hover:bg-red-50 transition-colors"
                    >
                        Delete my account
                    </button>
                </section>
            </div>

            <DeleteAccountModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDeleted={handleAccountDeleted}
            />

            <style jsx global>{`
                .input {
                    width: 100%;
                    border-radius: 0.75rem;
                    border: 1px solid #e3dfcf;
                    background: white;
                    padding: 0.65rem 0.9rem;
                    font-size: 0.875rem;
                    color: #232b1b;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .input:focus {
                    border-color: #5c6b3e;
                    box-shadow: 0 0 0 2px rgba(92, 107, 62, 0.15);
                }
            `}</style>
        </div>
    );
}

// --- Small local presentational helpers -----------------------------------

function Field({ label, children, full }) {
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <label className="block text-sm font-medium text-[#3A3D2E] mb-1.5">{label}</label>
            {children}
        </div>
    );
}

function StatusRow({ label, ok, okText, badText }) {
    const Icon = ok ? ShieldCheck : ShieldAlert;
    return (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#FAF8F3]">
            <span className="text-sm text-[#3A3D2E]">{label}</span>
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${ok ? "text-[#5C6B3E]" : "text-amber-600"}`}>
                <Icon className="w-3.5 h-3.5" />
                {ok ? okText : badText}
            </span>
        </div>
    );
}

function ToggleRow({ label, checked, onChange }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-[#3A3D2E]">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-[#5C6B3E]" : "bg-[#E3DFCF]"}`}
            >
                <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        checked ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
            </button>
        </div>
    );
}
