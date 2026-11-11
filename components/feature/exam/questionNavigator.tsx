"use client";

import React from "react";

export type QuestionStatus = "answered" | "skipped" | "unanswered";

export interface NavigatorSection {
    label: string;
    startIndex: number;
    endIndex: number;
    isLocked: boolean;
    isComplete: boolean;
    answeredCount: number;
}

interface QuestionNavigatorProps {
    totalQuestions: number;
    currentIndex: number;
    statuses: Record<number, QuestionStatus>;
    onSelectQuestion: (index: number) => void;
    sections?: NavigatorSection[];
    onLockedSelect?: (sectionLabel: string) => void;
    isOpenMobile?: boolean;
    onCloseMobile?: () => void;
}

export default function QuestionNavigator({
    totalQuestions,
    currentIndex,
    statuses,
    onSelectQuestion,
    sections,
    onLockedSelect,
    isOpenMobile,
    onCloseMobile,
}: QuestionNavigatorProps) {
    const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
    const hasMultiSections = Boolean(sections && sections.length > 1);

    const renderQuestionButton = (idx: number, isLocked: boolean = false) => {
        const num = idx + 1;
        const status = statuses[idx] || "unanswered";
        const isCurrent = currentIndex === idx;

        let buttonStyle = "bg-[#EEF4FF] border border-[#BFDBFE] text-[#2563EB]";

        if (isLocked) {
            buttonStyle = "bg-neutral-100 border border-neutral-200 text-neutral-400";
        } else if (status === "answered") {
            buttonStyle = "bg-[#2563EB] text-white border-transparent";
        } else if (status === "skipped") {
            buttonStyle = "bg-[#F59E0B] text-white border-transparent";
        }

        return (
            <button
                key={num}
                type="button"
                onClick={() => {
                    if (isLocked) {
                        const targetSection = sections?.find(
                            (s) => idx >= s.startIndex && idx <= s.endIndex
                        );
                        onLockedSelect?.(targetSection?.label || "next subject");
                        return;
                    }
                    onSelectQuestion(idx);
                    onCloseMobile?.();
                }}
                aria-disabled={isLocked}
                className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${
                    isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:opacity-90"
                } ${buttonStyle} ${
                    isCurrent && !isLocked
                        ? "ring-2 ring-offset-1 ring-primary-300 shadow-xs"
                        : ""
                }`}
            >
                {num}
                {isCurrent && !isLocked && status !== "answered" && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                )}
            </button>
        );
    };

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

            {/* Question Numbers Grid (grouped by subject when multi-subject) */}
            {hasMultiSections && sections ? (
                <div className="flex flex-col gap-4">
                    {sections.map((section) => {
                        const count = section.endIndex - section.startIndex + 1;
                        return (
                            <div key={section.label} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2 text-xs">
                                    <span
                                        className={`font-bold truncate ${
                                            section.isLocked ? "text-neutral-400" : "text-neutral-800"
                                        }`}
                                    >
                                        {section.label}
                                    </span>
                                    <span
                                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                            section.isComplete
                                                ? "bg-emerald-50 text-emerald-700"
                                                : section.isLocked
                                                    ? "bg-neutral-100 text-neutral-400"
                                                    : "bg-primary-50 text-primary-300"
                                        }`}
                                    >
                                        {section.isLocked
                                            ? "Locked"
                                            : `${section.answeredCount}/${count}`}
                                    </span>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {Array.from({ length: count }, (_, offset) =>
                                        renderQuestionButton(section.startIndex + offset, section.isLocked)
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-2.5">
                    {questionNumbers.map((_, idx) => renderQuestionButton(idx, false))}
                </div>
            )}
        </>
    );

    return (
        <>
            {/* Desktop Sticky Sidebar */}
            <aside className="hidden lg:flex flex-col w-[260px] flex-shrink-0 bg-white p-5 rounded-2xl border border-[#E2EAF4] shadow-xs gap-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
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
