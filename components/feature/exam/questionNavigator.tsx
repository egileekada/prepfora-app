"use client";

import React from "react";

export type QuestionStatus = "answered" | "skipped" | "unanswered";

interface QuestionNavigatorProps {
    totalQuestions: number;
    currentIndex: number;
    statuses: Record<number, QuestionStatus>;
    onSelectQuestion: (index: number) => void;
    isOpenMobile?: boolean;
    onCloseMobile?: () => void;
}

export default function QuestionNavigator({
    totalQuestions,
    currentIndex,
    statuses,
    onSelectQuestion,
    isOpenMobile,
    onCloseMobile,
}: QuestionNavigatorProps) {
    const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);

    const renderNavigatorBody = () => (
        <>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-base font-bold text-neutral-900">
                        Question Navigator
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        Jump to any question quickly
                    </p>
                </div>
                {onCloseMobile && (
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="lg:hidden text-neutral-500 hover:text-neutral-800 p-1 -mr-1 transition-colors cursor-pointer"
                        aria-label="Close question navigator"
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
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 pt-1 pb-1 text-xs font-medium text-neutral-600">
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

                    // Base style matching Image 3
                    let buttonStyle = "bg-[#EEF4FF] border border-[#BFDBFE] text-[#2563EB]";

                    if (status === "answered") {
                        buttonStyle = "bg-[#2563EB] text-white border-transparent";
                    } else if (status === "skipped") {
                        buttonStyle = "bg-[#F59E0B] text-white border-transparent";
                    }

                    return (
                        <button
                            key={num}
                            type="button"
                            onClick={() => {
                                onSelectQuestion(idx);
                                onCloseMobile?.();
                            }}
                            className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer hover:opacity-90 ${buttonStyle} ${
                                isCurrent
                                    ? "ring-2 ring-offset-1 ring-primary-300 shadow-xs"
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
        </>
    );

    return (
        <>
            {/* Desktop Sticky Sidebar */}
            <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-white p-5 rounded-2xl border border-[#E2EAF4] shadow-xs gap-4 sticky top-24">
                {renderNavigatorBody()}
            </aside>

            {/* Mobile Slide-Over Drawer matching Image 3 */}
            {isOpenMobile && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity animate-fadeIn"
                        onClick={onCloseMobile}
                    />
                    {/* Drawer */}
                    <aside className="fixed inset-y-0 left-0 w-[82%] max-w-[320px] bg-white h-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl overflow-y-auto z-50 animate-slideInLeft">
                        {renderNavigatorBody()}
                    </aside>
                </div>
            )}
        </>
    );
}
