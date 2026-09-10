"use client";

import React, { useState, useEffect } from "react";

interface ExamHeaderProps {
    subjectTitle: string;
    initialSeconds?: number;
    onEndSession: () => void;
}

export default function ExamHeader({
    subjectTitle,
    initialSeconds = 40 * 60 + 17, // 40:17 as in mockups
    onEndSession,
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
        <header className="w-full bg-white border-b border-[#E2EAF4] px-6 sm:px-8 py-4 flex items-center justify-between shadow-xs">
            {/* Subject Title */}
            <h1 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                {subjectTitle}
            </h1>

            {/* Right: Timer & End Session */}
            <div className="flex items-center gap-4">
                {/* Timer Badge */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F7ED] text-[#047857] font-semibold text-sm select-none">
                    {/* Stopwatch Icon */}
                    <svg
                        width="16"
                        height="16"
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

                {/* End Session Button */}
                <button
                    type="button"
                    onClick={onEndSession}
                    className="bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white font-semibold text-sm px-4 sm:px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
                >
                    End Session
                </button>
            </div>
        </header>
    );
}
