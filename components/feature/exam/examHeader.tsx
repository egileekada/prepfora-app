"use client";

import React, { useState, useEffect } from "react";

interface ExamHeaderProps {
    subjectTitle: string;
    initialSeconds?: number;
    onEndSession: () => void;
    onOpenNavigator?: () => void;
    showCalculator?: boolean;
    isCalculatorOpen?: boolean;
    onToggleCalculator?: () => void;
}

export default function ExamHeader({
    subjectTitle,
    initialSeconds = 40 * 60 + 17, // 40:17 as in mockups
    onEndSession,
    onOpenNavigator,
    showCalculator = false,
    isCalculatorOpen = false,
    onToggleCalculator,
}: ExamHeaderProps) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <header className="w-full bg-white border-b border-[#E2EAF4] px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
            {/* Subject Title (truncated on small screens) */}
            <h1 className="text-sm sm:text-lg font-bold text-neutral-900 tracking-tight truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
                {subjectTitle}
            </h1>

            {/* Right: Timer & End Session & Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                {/* Timer Badge */}
                <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#E0F7ED] text-[#047857] font-semibold text-xs sm:text-sm select-none">
                    {/* Stopwatch Icon */}
                    <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#047857]"
                    >
                        <circle cx="12" cy="13" r="8" />
                        <path d="M12 9v4l2 2" />
                        <path d="M5 3 2 6" />
                        <path d="m22 6-3-3" />
                        <path d="M12 2v2" />
                    </svg>
                    <span>{formatTime(secondsLeft)}</span>
                </div>

                {/* Calculator Toggle Button (Math exams) */}
                {showCalculator && onToggleCalculator && (
                    <button
                        type="button"
                        onClick={onToggleCalculator}
                        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isCalculatorOpen
                                ? "bg-neutral-100 border-neutral-300 text-neutral-800"
                                : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 shadow-xs"
                        }`}
                        title="Toggle Calculator"
                        aria-label="Toggle Calculator"
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="16" height="20" x="4" y="2" rx="2" />
                            <line x1="8" x2="16" y1="6" y2="6" />
                            <line x1="16" x2="16" y1="14" />
                            <line x1="16" x2="16" y1="18" />
                            <line x1="8" x2="8.01" y1="10" />
                            <line x1="12" x2="12.01" y1="10" />
                            <line x1="16" x2="16.01" y1="10" />
                            <line x1="8" x2="8.01" y1="14" />
                            <line x1="12" x2="12.01" y1="14" />
                            <line x1="8" x2="8.01" y1="18" />
                            <line x1="12" x2="12.01" y1="18" />
                        </svg>
                        <span className="hidden sm:inline">Calculator</span>
                    </button>
                )}

                {/* End Session Button */}
                <button
                    type="button"
                    onClick={onEndSession}
                    className="bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
                >
                    End Session
                </button>

                {/* Hamburger Menu Icon (Mobile Only) to open Question Navigator */}
                {onOpenNavigator && (
                    <button
                        type="button"
                        onClick={onOpenNavigator}
                        className="lg:hidden p-1.5 text-neutral-800 hover:text-neutral-950 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer flex items-center justify-center"
                        aria-label="Open question navigator"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                )}
            </div>
        </header>
    );
}
