"use client";

import React from "react";
import { CustomText } from "@/components/ui";

interface LastPracticeSummaryProps {
    subject?: string;
    score?: number;
    totalScore?: number;
    prepPoints?: number;
    focusAreas?: string[];
}

export default function LastPracticeSummary({
    subject = "Mathematics",
    score = 280,
    totalScore = 400,
    prepPoints = 20,
    focusAreas = ["Quadratic Equations", "Integration", "Differentiation"],
}: LastPracticeSummaryProps) {
    return (
        <section className="w-full flex flex-col gap-4">
            <CustomText type="headline-sm" className="text-neutral-900 font-bold">
                Last Practice Summary
            </CustomText>

            {/* Emerald Banner Container */}
            <div className="w-full bg-[#52C498] rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-stretch md:items-center gap-6 lg:gap-8 shadow-sm">
                {/* Left Inner Score Card */}
                <div className="w-full md:w-[260px] flex-shrink-0 bg-[#DCF3E8] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                    <span className="font-bold text-base text-neutral-900">
                        {subject}
                    </span>

                    <div className="my-3 flex items-baseline gap-1">
                        <span className="text-3xl sm:text-[34px] font-extrabold text-neutral-900 leading-none">
                            {score}
                        </span>
                        <span className="text-xs font-semibold text-neutral-500">
                            /{totalScore}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        {/* Gold Coin Stack Icon */}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0"
                            aria-hidden="true"
                        >
                            <ellipse cx="12" cy="18" rx="8" ry="3.5" fill="#C98A0C" />
                            <ellipse cx="12" cy="17" rx="8" ry="3.5" fill="#EAB308" />
                            <ellipse cx="12" cy="13" rx="8" ry="3.5" fill="#C98A0C" />
                            <ellipse cx="12" cy="12" rx="8" ry="3.5" fill="#FACC15" />
                            <ellipse cx="12" cy="8" rx="8" ry="3.5" fill="#C98A0C" />
                            <ellipse cx="12" cy="7" rx="8" ry="3.5" fill="#FDE047" />
                        </svg>
                        <span className="text-xs font-semibold text-neutral-800">
                            {prepPoints} PrepPoints earned
                        </span>
                    </div>
                </div>

                {/* Right Focus Areas Content */}
                <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-base sm:text-lg text-neutral-900 mb-2">
                        Focus Areas
                    </h3>
                    <p className="text-sm text-neutral-800 leading-relaxed max-w-xl mb-4 font-normal">
                        Based on your latest practice, we recommend focusing on these topics to improve your score.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {focusAreas.map((topic, index) => (
                            <div key={index} className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 inline-block" />
                                <span>{topic}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
