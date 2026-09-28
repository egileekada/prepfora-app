"use client";

import React, { useState } from "react";
import { ExamQuestion } from "./mockExamData";

interface QuestionRendererProps {
    question: ExamQuestion;
    selectedAnswer?: string;
    essayAnswer?: string;
    onSelectOption: (optionId: string) => void;
    onChangeEssay: (text: string) => void;
    onPrevious: () => void;
    onSkip: () => void;
    onSaveAndNext: () => void;
    isFirst: boolean;
    isLast: boolean;
}

export default function QuestionRenderer({
    question,
    selectedAnswer,
    essayAnswer = "",
    onSelectOption,
    onChangeEssay,
    onPrevious,
    onSkip,
    onSaveAndNext,
    isFirst,
    isLast,
}: QuestionRendererProps) {
    const [isPassageCollapsed, setIsPassageCollapsed] = useState(false);
    const [isInstructionCollapsed, setIsInstructionCollapsed] = useState(false);

    // Toolbar formatting helpers for essay editor
    const handleFormat = (command: string) => {
        console.log("Format:", command);
    };

    return (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start w-full">
            {/* Left Panel for Comprehension Passage */}
            {question.type === "comprehension" && question.passageContent && (
                <div className="w-full lg:w-[380px] flex-shrink-0 bg-white border border-[#E2EAF4] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-2.5 sm:gap-3">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                            {question.passageTitle}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsPassageCollapsed((prev) => !prev)}
                            className="w-7 h-7 rounded-full border border-neutral-300 hover:border-neutral-400 flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors p-1 flex-shrink-0 cursor-pointer"
                            aria-label="Toggle passage"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ${
                                    isPassageCollapsed ? "rotate-180" : ""
                                }`}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>

                    <span className="text-xs font-semibold text-[#059669]">
                        {question.passageCategory || "Reading Comprehension"}
                    </span>

                    {!isPassageCollapsed && (
                        <div className="text-sm text-neutral-700 leading-relaxed max-h-[350px] sm:max-h-[500px] overflow-y-auto pr-2 space-y-3 font-normal">
                            {question.passageContent.split("\n\n").map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Left Panel for Essay Instructions */}
            {question.type === "essay" && (
                <div className="w-full lg:w-[340px] flex-shrink-0 bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-neutral-900">
                            {question.essayInstructionTitle || "Essay Instructions"}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsInstructionCollapsed((prev) => !prev)}
                            className="text-neutral-500 hover:text-neutral-800 transition-colors p-1"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ${
                                    isInstructionCollapsed ? "rotate-180" : ""
                                }`}
                            >
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        </button>
                    </div>

                    <span className="text-xs font-semibold text-[#059669]">
                        {question.essayInstructionTopic || "Essay Writing"}
                    </span>

                    {!isInstructionCollapsed && (
                        <div className="space-y-3 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                            {question.essayInstructions?.map((inst, i) => (
                                <p key={i} className={i === 1 ? "font-bold italic" : ""}>
                                    {inst}
                                </p>
                            ))}
                        </div>
                    )}

                    {question.wordLimit && (
                        <div className="mt-2 border border-red-200 bg-red-50 text-red-600 font-semibold text-xs px-3.5 py-1.5 rounded-full w-fit">
                            {question.wordLimit}
                        </div>
                    )}
                </div>
            )}

            {/* Main Center Area: Question Prompt & Options/Editor */}
            <div className="flex-1 flex flex-col w-full pb-20 sm:pb-0">
                {/* Prompt Header */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        {/<[a-z][\s\S]*>/i.test(question.prompt) ? (
                            <h2
                                className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug max-w-3xl"
                                dangerouslySetInnerHTML={{ __html: question.prompt }}
                            />
                        ) : (
                            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug max-w-3xl">
                                {question.prompt}
                            </h2>
                        )}

                        {question.year && (
                            <span className="flex-shrink-0 bg-[#E8FAF3] text-[#059669] text-xs font-bold px-2.5 py-1 rounded-md">
                                {question.year}
                            </span>
                        )}
                    </div>

                    {question.topicSubtitle && (
                        /<[a-z][\s\S]*>/i.test(question.topicSubtitle) ? (
                            <div
                                className="text-sm font-semibold italic text-neutral-800 mt-1"
                                dangerouslySetInnerHTML={{ __html: question.topicSubtitle }}
                            />
                        ) : (
                            <p className="text-sm font-semibold italic text-neutral-800 mt-1">
                                {question.topicSubtitle}
                            </p>
                        )
                    )}
                </div>

                {/* Multiple Choice Options */}
                {question.type !== "essay" && question.options && (
                    <div className="flex flex-col gap-3.5 mb-8 w-full max-w-2xl">
                        {question.options.map((opt) => {
                            const isSelected = selectedAnswer === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => onSelectOption(opt.id)}
                                    className={`w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all cursor-pointer border ${
                                        isSelected
                                            ? "bg-[#C7D9FA] border-primary-300 shadow-xs"
                                            : "bg-white border-[#E2EAF4] hover:border-neutral-300"
                                    }`}
                                >
                                    {/* Option Letter Badge */}
                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                                            isSelected
                                                ? "bg-primary-300 text-white"
                                                : "bg-primary-50 text-primary-300"
                                        }`}
                                    >
                                        {opt.id}
                                    </div>

                                    {/* Option Text */}
                                    {/<[a-z][\s\S]*>/i.test(opt.text) ? (
                                        <span
                                            className={`text-sm font-medium ${
                                                isSelected
                                                    ? "text-neutral-900 font-semibold"
                                                    : "text-neutral-800"
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: opt.text }}
                                        />
                                    ) : (
                                        <span
                                            className={`text-sm font-medium ${
                                                isSelected
                                                    ? "text-neutral-900 font-semibold"
                                                    : "text-neutral-800"
                                            }`}
                                        >
                                            {opt.text}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Essay Rich Editor */}
                {question.type === "essay" && (
                    <div className="w-full max-w-2xl bg-white border border-[#E2EAF4] rounded-2xl p-4 shadow-xs mb-8 flex flex-col gap-3">
                        {/* Toolbar */}
                        <div className="flex items-center gap-3 pb-3 border-b border-neutral-150 text-neutral-600 flex-wrap">
                            {/* List Bullet */}
                            <button
                                type="button"
                                onClick={() => handleFormat("bullet")}
                                className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-xs font-bold"
                                title="Bullet List"
                            >
                                •≡
                            </button>
                            {/* List Numbered */}
                            <button
                                type="button"
                                onClick={() => handleFormat("number")}
                                className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-xs font-bold"
                                title="Numbered List"
                            >
                                1≡
                            </button>
                            {/* Italic */}
                            <button
                                type="button"
                                onClick={() => handleFormat("italic")}
                                className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-sm font-serif italic"
                                title="Italic"
                            >
                                I
                            </button>
                            {/* Bold */}
                            <button
                                type="button"
                                onClick={() => handleFormat("bold")}
                                className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-sm font-bold"
                                title="Bold"
                            >
                                B
                            </button>
                            {/* Underline */}
                            <button
                                type="button"
                                onClick={() => handleFormat("underline")}
                                className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-sm underline"
                                title="Underline"
                            >
                                U
                            </button>
                            <span className="h-4 w-px bg-neutral-200" />
                            {/* Align Left */}
                            <button
                                type="button"
                                onClick={() => handleFormat("align-left")}
                                className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-xs"
                                title="Align Left"
                            >
                                ≡
                            </button>
                            {/* Align Center */}
                            <button
                                type="button"
                                onClick={() => handleFormat("align-center")}
                                className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-xs"
                                title="Align Center"
                            >
                                =
                            </button>
                            {/* Align Right */}
                            <button
                                type="button"
                                onClick={() => handleFormat("align-right")}
                                className="p-1.5 hover:bg-neutral-100 rounded transition-colors text-xs"
                                title="Align Right"
                            >
                                ≢
                            </button>
                        </div>

                        {/* Text Area */}
                        <textarea
                            rows={10}
                            value={essayAnswer}
                            onChange={(e) => onChangeEssay(e.target.value)}
                            placeholder="Start Typing..."
                            className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none resize-y"
                        />
                    </div>
                )}

                {/* Bottom Action Buttons: Mobile Sticky Dock & Desktop Row */}
                <div className="fixed sm:static bottom-0 left-0 right-0 z-20 bg-white/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t sm:border-t-0 border-[#E2EAF4] px-4 py-3 sm:p-0 sm:pt-4 flex items-center justify-between sm:justify-start gap-3 sm:gap-4 shadow-lg sm:shadow-none">
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={onPrevious}
                        disabled={isFirst}
                        className="px-4 sm:px-6 py-2.5 rounded-xl border border-primary-300 text-primary-300 font-semibold text-xs sm:text-sm bg-white hover:bg-primary-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                        <span>←</span>
                        <span>Previous</span>
                    </button>

                    {/* Skip for Now Button (Icon on mobile matching Image 2, Text on desktop) */}
                    <button
                        type="button"
                        onClick={onSkip}
                        className="w-11 h-11 sm:w-auto sm:px-6 sm:py-2.5 rounded-xl border border-[#10B981] text-[#059669] font-semibold text-xs sm:text-sm bg-white hover:bg-[#E8FAF3] transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
                        title="Skip for Now"
                        aria-label="Skip question"
                    >
                        {/* Mobile Icon (up arrow matching Image 2) */}
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="sm:hidden"
                        >
                            <line x1="12" y1="19" x2="12" y2="5" />
                            <polyline points="5 12 12 5 19 12" />
                        </svg>
                        {/* Desktop Text */}
                        <span className="hidden sm:inline">Skip for Now</span>
                    </button>

                    {/* Save and Next Button */}
                    <button
                        type="button"
                        onClick={onSaveAndNext}
                        className="px-5 sm:px-6 py-2.5 rounded-xl bg-primary-300 text-white font-semibold text-xs sm:text-sm hover:bg-primary-250 active:scale-[0.98] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs flex-1 sm:flex-initial"
                    >
                        <span className="sm:hidden">{isLast ? "Submit" : "Next"}</span>
                        <span className="hidden sm:inline">{isLast ? "Submit Exam" : "Save and Next"}</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
