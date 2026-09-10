"use client";

import React from "react";

export type QuestionStatus = "answered" | "skipped" | "unanswered";

interface QuestionNavigatorProps {
    totalQuestions: number;
    currentIndex: number;
    statuses: Record<number, QuestionStatus>;
    onSelectQuestion: (index: number) => void;
}

export default function QuestionNavigator({
    totalQuestions,
    currentIndex,
    statuses,
    onSelectQuestion,
}: QuestionNavigatorProps) {
    const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);

    return (
        <aside className="w-full lg:w-[260px] flex-shrink-0 bg-white p-5 rounded-2xl border border-[#E2EAF4] shadow-xs flex flex-col gap-4">
            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-neutral-900">
                    Question Navigator
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                    Jump to any question quickly
                </p>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 pt-1 pb-2 text-xs font-medium text-neutral-600">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block" />
                        <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#93C5FD] bg-white inline-block" />
                        <span>Not Answered</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block" />
                    <span>Skipped</span>
                </div>
            </div>

            {/* 5-column Grid of Question Numbers */}
            <div className="grid grid-cols-5 gap-2.5">
                {questionNumbers.map((num, idx) => {
                    const status = statuses[idx] || "unanswered";
                    const isCurrent = currentIndex === idx;

                    // Base style
                    let buttonStyle = "bg-white border border-[#BFDBFE] text-primary-300";

                    if (status === "answered") {
                        buttonStyle = "bg-[#2563EB] text-white border-transparent";
                    } else if (status === "skipped") {
                        buttonStyle = "bg-[#F59E0B] text-white border-transparent";
                    }

                    return (
                        <button
                            key={num}
                            type="button"
                            onClick={() => onSelectQuestion(idx)}
                            className={`relative w-10 h-10 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer hover:opacity-90 ${buttonStyle} ${
                                isCurrent
                                    ? "ring-2 ring-offset-1 ring-primary-300"
                                    : ""
                            }`}
                        >
                            {num}
                            {/* Blue dot indicator for current question as seen in mockups */}
                            {isCurrent && status !== "answered" && (
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
