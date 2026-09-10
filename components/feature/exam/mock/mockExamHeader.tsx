"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface MockExamHeaderProps {
    title: string;
    onStartExam: () => void;
}

export default function MockExamHeader({
    title,
    onStartExam,
}: MockExamHeaderProps) {
    const router = useRouter();

    return (
        <header className="w-full bg-white border-b border-[#E2EAF4] px-6 sm:px-8 py-4 flex items-center justify-between shadow-xs">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/mock-exams")}
                    className="flex items-center gap-1.5 text-neutral-800 hover:text-neutral-600 transition-colors font-semibold text-sm cursor-pointer"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-neutral-800"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 8 8 12 12 16" />
                        <line x1="16" y1="12" x2="8" y2="12" />
                    </svg>
                    <span>Back</span>
                </button>

                <h1 className="text-base sm:text-lg font-bold text-neutral-900">
                    {title}
                </h1>
            </div>

            {/* Right: Timer & Start Exam */}
            <div className="flex items-center gap-4">
                {/* 2-hour persistent timer badge */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F7ED] text-[#047857] font-semibold text-sm select-none">
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
                    <span>02:00:00</span>
                </div>

                <button
                    type="button"
                    onClick={onStartExam}
                    className="bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
                >
                    Start Exam
                </button>
            </div>
        </header>
    );
}
