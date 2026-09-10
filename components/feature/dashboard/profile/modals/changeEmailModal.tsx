"use client";

import React, { useState, useRef, useEffect } from "react";

interface ChangeEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail: string;
    onSuccess: (newEmail: string) => void;
}

export default function ChangeEmailModal({
    isOpen,
    onClose,
    currentEmail,
    onSuccess,
}: ChangeEmailModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [curEmailInput, setCurEmailInput] = useState("");
    const [newEmailInput, setNewEmailInput] = useState("");
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setCurEmailInput("");
            setNewEmailInput("");
            setOtp(["", "", "", "", "", ""]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEmailInput.trim()) {
            setStep(2);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        // Auto-advance
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuccess(newEmailInput.trim() || currentEmail);
        onClose();
    };

    const isStep1Valid = curEmailInput.trim() !== "" && newEmailInput.trim() !== "";
    const isStep2Valid = otp.every((digit) => digit.trim() !== "");

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[440px] shadow-2xl flex flex-col gap-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#064E3B]">
                        Change Email
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-full border border-neutral-900 flex items-center justify-center text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Step 1: Input Current and New Email */}
                {step === 1 && (
                    <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
                        {/* Current Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-neutral-800">
                                Current Email *
                            </label>
                            <input
                                type="email"
                                placeholder="enter email"
                                value={curEmailInput}
                                onChange={(e) => setCurEmailInput(e.target.value)}
                                required
                                className="w-full h-12 px-4 border border-neutral-300 rounded-2xl text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            />
                        </div>

                        {/* New Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-neutral-800">
                                New Email *
                            </label>
                            <input
                                type="email"
                                placeholder="enter email"
                                value={newEmailInput}
                                onChange={(e) => setNewEmailInput(e.target.value)}
                                required
                                className="w-full h-12 px-4 border border-neutral-300 rounded-2xl text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                            />
                        </div>

                        {/* Update Button */}
                        <button
                            type="submit"
                            disabled={!isStep1Valid}
                            className={`w-full h-12 mt-2 font-semibold text-sm rounded-2xl transition-colors cursor-pointer shadow-xs ${
                                isStep1Valid
                                    ? "bg-[#2563EB] hover:bg-blue-700 text-white"
                                    : "bg-[#8BB2F8] text-white cursor-not-allowed opacity-90"
                            }`}
                        >
                            Update
                        </button>
                    </form>
                )}

                {/* Step 2: 6-Digit OTP Verification */}
                {step === 2 && (
                    <form onSubmit={handleStep2Submit} className="flex flex-col gap-6">
                        <p className="text-sm text-neutral-800 leading-relaxed font-normal">
                            An email with a 6–digit code has been sent to your new email,{" "}
                            <span className="font-semibold text-neutral-900">{newEmailInput || "johndod@gmail.com"}</span>. Enter the code below to change your email.
                        </p>

                        {/* 6 OTP Boxes */}
                        <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={(el) => {
                                        otpRefs.current[idx] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    placeholder={String(idx + 1)}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    className="w-full h-13 sm:h-14 text-center text-base sm:text-lg font-bold border border-neutral-300 rounded-2xl text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                />
                            ))}
                        </div>

                        {/* Update Button */}
                        <button
                            type="submit"
                            className={`w-full h-12 font-semibold text-sm rounded-2xl transition-colors cursor-pointer shadow-xs ${
                                isStep2Valid
                                    ? "bg-[#2563EB] hover:bg-blue-700 text-white"
                                    : "bg-[#8BB2F8] text-white"
                            }`}
                        >
                            Update
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
