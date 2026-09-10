"use client";

import React from "react";

interface RulesOfEngagementCardProps {
    exam: "JAMB" | "WAEC" | "POST UTME" | "NECO";
    onStartExam: () => void;
}

export default function RulesOfEngagementCard({
    exam,
    onStartExam,
}: RulesOfEngagementCardProps) {
    const isWAEC = exam === "WAEC" || exam === "NECO";

    return (
        <div className="w-full max-w-[760px] mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-neutral-150 flex flex-col">
            {/* Exam Emblem / Seal */}
            <div className="flex justify-center mb-1">
                {isWAEC ? (
                    <div className="w-10 h-10 rounded-full bg-[#3B1F54] flex items-center justify-center text-amber-400 font-bold text-sm shadow-xs border border-amber-300">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16.1 7.2 16.6l.9-5.3-3.8-3.7 5.3-.8L12 2z" />
                        </svg>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[#067A52] flex items-center justify-center text-white shadow-xs border border-emerald-300">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="8" fill="#10B981" />
                            <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 text-center mt-2">
                {exam} Simulation: Rules of Engagement
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 text-center max-w-lg mx-auto leading-relaxed mt-1 mb-5">
                Please review the following instructions carefully before initiating the secure examination portal. Once started, you cannot pause the session.
            </p>

            {/* Central Start Exam Button */}
            <button
                type="button"
                onClick={onStartExam}
                className="bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white font-semibold text-sm px-10 py-2.5 rounded-xl shadow-xs mx-auto block mb-8 cursor-pointer transition-all"
            >
                Start Exam
            </button>

            {/* Two-Column Breakdown & Time/System checks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Left Column: Exam Breakdown */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        EXAM BREAKDOWN
                    </span>

                    {/* JAMB: 4 subjects */}
                    {!isWAEC ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#EEF3FA] rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-xs text-neutral-700 font-medium">Use of English</span>
                                <span className="text-base sm:text-lg font-bold text-neutral-900 mt-2">60 Qs</span>
                            </div>
                            <div className="bg-[#EEF3FA] rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-xs text-neutral-700 font-medium">Mathematics</span>
                                <span className="text-base sm:text-lg font-bold text-neutral-900 mt-2">40 Qs</span>
                            </div>
                            <div className="bg-[#EEF3FA] rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-xs text-neutral-700 font-medium">Physics</span>
                                <span className="text-base sm:text-lg font-bold text-neutral-900 mt-2">40 Qs</span>
                            </div>
                            <div className="bg-[#EEF3FA] rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-xs text-neutral-700 font-medium">Chemistry</span>
                                <span className="text-base sm:text-lg font-bold text-neutral-900 mt-2">40 Qs</span>
                            </div>
                        </div>
                    ) : (
                        /* WAEC: Subject, Year, Objective, Theory */
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#EEF3FA] rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-xs text-neutral-500 font-medium">Subject</span>
                                <span className="text-sm font-bold text-neutral-900 mt-2">English Language</span>
                            </div>
                            <div className="bg-[#EEF3FA] rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-xs text-neutral-500 font-medium">Year</span>
                                <span className="text-sm font-bold text-neutral-900 mt-2">2024</span>
                            </div>
                            <div className="bg-[#EEF3FA] rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-xs text-neutral-700 font-medium">Objective</span>
                                <span className="text-base sm:text-lg font-bold text-neutral-900 mt-2">60 Qs</span>
                            </div>
                            <div className="bg-[#EEF3FA] rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-xs text-neutral-700 font-medium">Theory</span>
                                <span className="text-base sm:text-lg font-bold text-neutral-900 mt-2">10 Qs</span>
                            </div>
                        </div>
                    )}

                    {/* Total Questions Blue Banner */}
                    <div className="bg-[#2563EB] text-white rounded-2xl p-4 flex items-center justify-between font-medium text-sm mt-1 shadow-xs">
                        <span>Total Questions</span>
                        <span className="font-extrabold text-xl">
                            {!isWAEC ? 180 : 70}
                        </span>
                    </div>
                </div>

                {/* Right Column: Time Limit & System Check */}
                <div className="flex flex-col gap-4">
                    {/* Time Limit Crimson Card */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            TIME LIMIT
                        </span>

                        <div className="bg-[#991B1B] rounded-2xl p-5 text-white shadow-xs">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                    120
                                </span>
                                <span className="text-sm font-semibold">
                                    minutes
                                </span>
                            </div>
                            <p className="text-xs text-red-100 leading-relaxed mt-2 font-normal">
                                The timer is persistent and will not stop even if you disconnect.
                            </p>
                        </div>
                    </div>

                    {/* System Check */}
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                            SYSTEM CHECK
                        </span>

                        <div className="flex flex-col gap-2.5">
                            <div className="bg-[#E8FAF3] border border-[#52C498]/40 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-xs sm:text-sm font-semibold text-neutral-800 shadow-xs">
                                <div className="w-6 h-6 rounded-lg bg-[#52C498]/20 flex items-center justify-center text-[#059669]">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <span>Make sure your camera is active</span>
                            </div>

                            <div className="bg-[#E8FAF3] border border-[#52C498]/40 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 text-xs sm:text-sm font-semibold text-neutral-800 shadow-xs">
                                <div className="w-6 h-6 rounded-lg bg-[#52C498]/20 flex items-center justify-center text-[#059669]">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                                        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                                        <line x1="12" y1="20" x2="12.01" y2="20" />
                                    </svg>
                                </div>
                                <span>Make sure you have a stable internet</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Dashed Prohibited Actions Box */}
            <div className="border border-dashed border-red-300 rounded-2xl p-5 mt-6 bg-transparent">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-2">
                    PROHIBITED ACTIONS
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-800 leading-relaxed">
                    <p>
                        <span className="font-bold text-neutral-900">No Tab Switching: </span>
                        Moving away from the exam window will trigger an automatic submission.
                    </p>
                    <p>
                        <span className="font-bold text-neutral-900">No External Aids: </span>
                        Use of smartphones is forbidden.
                    </p>
                </div>
            </div>
        </div>
    );
}
