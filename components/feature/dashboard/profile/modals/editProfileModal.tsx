"use client";

import React, { useState, useEffect } from "react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialFirstName: string;
    initialLastName: string;
    avatarUrl?: string;
    onUpdate: (firstName: string, lastName: string) => void;
}

export default function EditProfileModal({
    isOpen,
    onClose,
    initialFirstName,
    initialLastName,
    avatarUrl = "/images/landing/hero1.png",
    onUpdate,
}: EditProfileModalProps) {
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);

    useEffect(() => {
        setFirstName(initialFirstName);
        setLastName(initialLastName);
    }, [initialFirstName, initialLastName, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(firstName.trim() || initialFirstName, lastName.trim() || initialLastName);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[420px] shadow-2xl flex flex-col gap-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#064E3B]">
                        Edit Profile
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

                {/* Avatar with Teal Border and Camera Icon */}
                <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#10B981] bg-neutral-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>

                    {/* Camera Badge */}
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-neutral-900 shadow-sm flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors"
                        title="Change photo"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* First Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-neutral-800">
                            First Name *
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full h-12 px-4 border border-[#1E3A8A] rounded-2xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-neutral-800">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full h-12 px-4 border border-[#1E3A8A] rounded-2xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        />
                    </div>

                    {/* Update Button */}
                    <button
                        type="submit"
                        className="w-full h-12 mt-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-2xl transition-colors cursor-pointer shadow-xs"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
}
