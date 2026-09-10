"use client";

import React from "react";
import { MOCK_PERFORMANCE_STATS, PerformanceStat } from "./performanceTypes";

interface PerformanceStatsProps {
    stats?: PerformanceStat[];
}

export default function PerformanceStats({
    stats = MOCK_PERFORMANCE_STATS,
}: PerformanceStatsProps) {
    const renderIcon = (type: PerformanceStat["iconType"]) => {
        if (type === "rank") {
            return (
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                        <path d="M12 2L9 16L18 20L27 16L24 2H12Z" fill="#F59E0B" />
                        <path d="M12 2L18 20L24 2H12Z" fill="#D97706" />
                        <circle cx="18" cy="24" r="9" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
                        <circle cx="18" cy="24" r="6" fill="#F59E0B" />
                        <path d="M18 20l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" fill="#FEF3C7" />
                    </svg>
                </div>
            );
        }

        if (type === "streak") {
            return (
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                            d="M16 3C16 3 20 8 20 12C20 14.5 18.5 16 17 17C19 17.5 22 19 22 23C22 27 18.5 29 16 29C11 29 9 25 9 20C9 14 14 8 14 8C14 8 13 12 14 14C15 11 16 3 16 3Z"
                            fill="#F97316"
                        />
                        <path
                            d="M16 15C16 15 18 18 18 20C18 21.5 17 22.5 16 22.5C15 22.5 14 21.5 14 20C14 18 16 15 16 15Z"
                            fill="#FDE047"
                        />
                    </svg>
                </div>
            );
        }

        if (type === "points") {
            return (
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                        <ellipse cx="18" cy="26" rx="11" ry="5" fill="#C98A0C" />
                        <ellipse cx="18" cy="24.5" rx="11" ry="5" fill="#EAB308" />
                        <ellipse cx="18" cy="18" rx="11" ry="5" fill="#C98A0C" />
                        <ellipse cx="18" cy="16.5" rx="11" ry="5" fill="#FACC15" />
                        <ellipse cx="18" cy="10" rx="11" ry="5" fill="#C98A0C" />
                        <ellipse cx="18" cy="8.5" rx="11" ry="5" fill="#FDE047" />
                    </svg>
                </div>
            );
        }

        if (type === "badges") {
            return (
                <div className="flex items-center gap-2">
                    {/* Badge 1: Red % badge */}
                    <div className="w-8 h-8 rounded-full bg-[#EF4444] text-white font-extrabold text-xs flex items-center justify-center shadow-xs border border-red-300">
                        %
                    </div>
                    {/* Badge 2: Gold medal */}
                    <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-xs border border-amber-300">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="8" fill="#FDE047" />
                            <path d="M12 7l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z" fill="#D97706" />
                        </svg>
                    </div>
                    {/* Badge 3: NEW starburst badge */}
                    <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white font-extrabold text-[9px] flex items-center justify-center shadow-xs border border-orange-400">
                        NEW
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white border border-[#E2EAF4] rounded-2xl p-5 flex flex-col justify-between shadow-xs min-h-[145px]"
                >
                    <span className="font-bold text-sm text-neutral-800">
                        {stat.title}
                    </span>

                    <div className="flex items-center gap-3 my-2">
                        {renderIcon(stat.iconType)}

                        {stat.value && (
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">
                                    {stat.value}
                                </span>
                                {stat.subUnit && (
                                    <span className="text-xs font-semibold text-neutral-400">
                                        {stat.subUnit}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <span className="text-xs text-neutral-500 font-medium">
                        {stat.footerText}
                    </span>
                </div>
            ))}
        </section>
    );
}
