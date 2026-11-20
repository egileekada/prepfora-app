"use client";

import React, { useRef } from "react";
import { UserProfileData } from "./profileTypes";
import { UserAvatar } from "@/components/common";

interface ProfileHeaderCardProps {
    profile: UserProfileData;
    onEditProfile: () => void;
    onUploadAvatar?: (file: File) => Promise<any> | void;
    isUploadingAvatar?: boolean;
}

export default function ProfileHeaderCard({
    profile,
    onEditProfile,
    onUploadAvatar,
    isUploadingAvatar = false,
}: ProfileHeaderCardProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUploadAvatar) return;
        try {
            await onUploadAvatar(file);
        } finally {
            e.target.value = "";
        }
    };

    return (
        <div className="w-full bg-white border-2 border-[#93C5FD] rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-2xs">
            {/* Left: Avatar & User Info */}
            <div className="flex items-center gap-4 sm:gap-5">
                {/* Avatar with Teal Border & Camera Upload Action */}
                <div className="relative flex-shrink-0 group">
                    <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#10B981] relative bg-neutral-100 shadow-xs">
                        <UserAvatar
                            src={profile.avatarUrl}
                            firstName={profile.firstName}
                            lastName={profile.lastName}
                            textClassName="text-xl sm:text-2xl font-bold"
                        />
                        {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center z-10">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Camera Badge Button */}
                    {onUploadAvatar && (
                        <>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                aria-label="Upload profile picture"
                                title="Upload profile picture"
                                className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-neutral-300 shadow-md flex items-center justify-center cursor-pointer hover:bg-neutral-50 active:scale-95 transition-all text-neutral-700 disabled:opacity-50"
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className="hidden"
                            />
                        </>
                    )}
                </div>

                {/* Name & Badge */}
                <div className="flex flex-col">
                    <div className="flex items-baseline flex-wrap gap-x-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                            {profile.firstName} {profile.lastName}
                        </h2>
                        <span className="text-xs sm:text-sm text-neutral-400 font-medium">
                            {profile.handle}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5">
                        {/* Medal Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M8.5 13.5L5 22L12 18.5L19 22L15.5 13.5"
                                fill="#EA580C"
                                stroke="#C2410C"
                                strokeWidth="0.8"
                                strokeLinejoin="round"
                            />
                            <circle
                                cx="12"
                                cy="9"
                                r="6.5"
                                fill="#FBBF24"
                                stroke="#D97706"
                                strokeWidth="1"
                            />
                            <circle cx="12" cy="9" r="4.5" fill="#F59E0B" />
                        </svg>
                        <span className="text-xs text-neutral-600 font-medium">
                            {profile.currentBadge}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Edit Profile Button */}
            <button
                type="button"
                onClick={onEditProfile}
                className="border border-[#2563EB] relative z-20 text-[#2563EB] hover:bg-blue-50 font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors cursor-pointer flex-shrink-0"
            >
                Edit Profile
            </button>
        </div>
    );
}
