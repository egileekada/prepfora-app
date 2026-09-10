"use client";

import React from "react";
import { useRouter } from "next/navigation";

export interface QuestionResult {
    number: number;
    status: "correct" | "incorrect" | "skipped";
}

interface ExamSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjectTitle?: string;
    score?: number;
    totalScore?: number;
    prepPoints?: number;
    results?: QuestionResult[];
    focusAreas?: string[];
}

const DEFAULT_RESULTS: QuestionResult[] = [
    { number: 1, status: "correct" },
    { number: 2, status: "correct" },
    { number: 3, status: "correct" },
    { number: 4, status: "correct" },
    { number: 5, status: "skipped" },
    { number: 6, status: "skipped" },
    { number: 7, status: "correct" },
    { number: 8, status: "correct" },
    { number: 9, status: "incorrect" },
    { number: 10, status: "correct" },
    { number: 11, status: "correct" },
    { number: 12, status: "incorrect" },
    { number: 13, status: "incorrect" },
    { number: 14, status: "correct" },
    { number: 15, status: "incorrect" },
    { number: 16, status: "correct" },
    { number: 17, status: "skipped" },
    { number: 18, status: "correct" },
    { number: 19, status: "correct" },
    { number: 20, status: "correct" },
];

export default function ExamSummaryModal({
    isOpen,
    onClose,
    subjectTitle = "Mathematics",
    score = 72,
    totalScore = 100,
    prepPoints = 20,
    results = DEFAULT_RESULTS,
    focusAreas = ["Quadratic Equations", "Integration", "Differentiation"],
}: ExamSummaryModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handlePracticeMore = () => {
        onClose();
        router.push("/dashboard/practice");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-[2px] transition-all animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-3xl w-full max-w-[760px] p-6 sm:p-8 shadow-2xl relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                {/* Header with Title and Close Button */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                            Practice Summary
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                            You can always view this summary in the performance tab
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                        aria-label="Close summary modal"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </button>
                </div>

                {/* Section 1: Question Review */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                        Question Review
                    </h3>

                    {/* Review Legend */}
                    <div className="flex items-center gap-4 text-xs font-medium text-neutral-600">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                            <span>Correct</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                            <span>Incorrect</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                            <span>Skipped</span>
                        </div>
                    </div>

                    {/* Question Numbers Review Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {results.map((res) => {
                            let badgeBg = "bg-[#10B981]";
                            if (res.status === "incorrect") badgeBg = "bg-[#EF4444]";
                            if (res.status === "skipped") badgeBg = "bg-[#F59E0B]";

                            return (
                                <div
                                    key={res.number}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs select-none ${badgeBg}`}
                                >
                                    {res.number}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Practice Summary Banner */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                        Practice Summary
                    </h3>

                    {/* Emerald Banner */}
                    <div className="w-full bg-[#52C498] rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-stretch md:items-center gap-6 shadow-sm">
                        {/* Left Inner Score Card */}
                        <div className="w-full md:w-[220px] flex-shrink-0 bg-[#DCF3E8] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                            <span className="font-bold text-sm sm:text-base text-neutral-900">
                                {subjectTitle}
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
                                    width="18"
                                    height="18"
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

                        {/* Right Content: Focus Areas & Action */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-sm sm:text-base text-neutral-900 mb-1.5">
                                    Focus Areas
                                </h4>
                                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed max-w-md mb-3 font-normal">
                                    Based on your latest practice, we recommend focusing on these topics to improve your score.
                                </p>

                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
                                    {focusAreas.map((topic, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-1.5 text-neutral-900 font-bold text-xs sm:text-sm"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 inline-block" />
                                            <span>{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button on Bottom Right */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handlePracticeMore}
                                    className="bg-[#2563EB] hover:bg-primary-250 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center"
                                >
                                    Practice More Questions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
