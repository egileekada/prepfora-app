"use client";

import React from "react";
import { UserProfileData } from "./profileTypes";

interface BadgesSectionProps {
    badges: UserProfileData["badges"];
}

export default function BadgesSection({ badges }: BadgesSectionProps) {
    const renderBadgeIcon = (type: "percent" | "medal" | "faded") => {
        if (type === "faded") {
            return (
                <div className="w-12 h-12 flex items-center justify-center">
                    <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                        {/* Soft pink scalloped badge */}
                        <path
                            d="M24 3L28.5 7.5L34.5 6L36.5 12L42.5 14L41.5 20.5L46 24L41.5 27.5L42.5 34L36.5 36L34.5 42L28.5 40.5L24 45L19.5 40.5L13.5 42L11.5 36L5.5 34L6.5 27.5L2 24L6.5 20.5L5.5 14L11.5 12L13.5 6L19.5 7.5L24 3Z"
                            fill="#FCE7F3"
                        />
                        {/* Percentage Sign */}
                        <text
                            x="24"
                            y="29"
                            textAnchor="middle"
                            fill="#F472B6"
                            fontSize="16"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                        >
                            %
                        </text>
                    </svg>
                </div>
            );
        }

        // Default: Red % rosette badge
        return (
            <div className="w-12 h-12 flex items-center justify-center">
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                    {/* Red scalloped rosette badge */}
                    <path
                        d="M24 3L28.5 7.5L34.5 6L36.5 12L42.5 14L41.5 20.5L46 24L41.5 27.5L42.5 34L36.5 36L34.5 42L28.5 40.5L24 45L19.5 40.5L13.5 42L11.5 36L5.5 34L6.5 27.5L2 24L6.5 20.5L5.5 14L11.5 12L13.5 6L19.5 7.5L24 3Z"
                        fill="#EF4444"
                    />
                    {/* Percentage Sign */}
                    <text
                        x="24"
                        y="29"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="16"
                        fontWeight="900"
                        fontFamily="sans-serif"
                    >
                        %
                    </text>
                </svg>
            </div>
        );
    };

    return (
        <section className="w-full flex flex-col gap-3">
            <h3 className="text-lg font-bold text-neutral-900">Badges</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className="bg-white border border-[#E2EAF4] rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs transition-shadow"
                    >
                        {renderBadgeIcon(badge.type)}
                        <span className="text-xs font-bold text-neutral-800 mt-3">
                            {badge.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
