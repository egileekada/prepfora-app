"use client";

import React, { useState } from "react";
import { UserProfileData } from "./profileTypes";

interface ProfileHeaderCardProps {
    profile: UserProfileData;
    onEditProfile: () => void;
}

export default function ProfileHeaderCard({
    profile,
    onEditProfile,
}: ProfileHeaderCardProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="w-full bg-white border-2 border-[#93C5FD] rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-2xs">
            {/* Left: Avatar & User Info */}
            <div className="flex items-center gap-4 sm:gap-5">
                {/* Avatar with Teal Border */}
                <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#10B981] relative flex-shrink-0 bg-neutral-100">
                    {!imgError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={profile.avatarUrl || "/images/landing/hero1.png"}
                            alt={`${profile.firstName} ${profile.lastName}`}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover object-top"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-bold text-lg">
                            {profile.firstName.charAt(0)}
                        </div>
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
                className="border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors cursor-pointer flex-shrink-0"
            >
                Edit Profile
            </button>
        </div>
    );
}
