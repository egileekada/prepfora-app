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
                <div className="w-full lg:w-[380px] flex-shrink-0 bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-neutral-900 leading-snug">
                            {question.passageTitle}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsPassageCollapsed((prev) => !prev)}
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
                                    isPassageCollapsed ? "rotate-180" : ""
                                }`}
                            >
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        </button>
                    </div>

                    <span className="text-xs font-semibold text-[#059669]">
                        {question.passageCategory || "Reading Comprehension"}
                    </span>

                    {!isPassageCollapsed && (
                        <div className="text-sm text-neutral-700 leading-relaxed max-h-[500px] overflow-y-auto pr-2 space-y-4 font-normal">
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
            <div className="flex-1 flex flex-col w-full">
                {/* Prompt Header */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug max-w-3xl">
                            {question.prompt}
                        </h2>

                        {question.year && (
                            <span className="flex-shrink-0 bg-[#E8FAF3] text-[#059669] text-xs font-bold px-2.5 py-1 rounded-md">
                                {question.year}
                            </span>
                        )}
                    </div>

                    {question.topicSubtitle && (
                        <p className="text-sm font-semibold italic text-neutral-800 mt-1">
                            {question.topicSubtitle}
                        </p>
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
                                    <span
                                        className={`text-sm font-medium ${
                                            isSelected
                                                ? "text-neutral-900 font-semibold"
                                                : "text-neutral-800"
                                        }`}
                                    >
                                        {opt.text}
                                    </span>
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

                {/* Bottom Action Buttons: Previous, Skip for Now, Save and Next */}
                <div className="flex items-center gap-4 flex-wrap pt-2">
                    {/* Previous Button */}
                    <button
                        type="button"
                        onClick={onPrevious}
                        disabled={isFirst}
                        className="px-5 sm:px-6 py-2.5 rounded-xl border border-primary-300 text-primary-300 font-semibold text-sm bg-white hover:bg-primary-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Previous</span>
                    </button>

                    {/* Skip for Now Button */}
                    <button
                        type="button"
                        onClick={onSkip}
                        className="px-5 sm:px-6 py-2.5 rounded-xl border border-[#10B981] text-[#059669] font-semibold text-sm bg-white hover:bg-[#E8FAF3] transition-colors cursor-pointer flex items-center justify-center"
                    >
                        Skip for Now
                    </button>

                    {/* Save and Next Button */}
                    <button
                        type="button"
                        onClick={onSaveAndNext}
                        className="px-5 sm:px-6 py-2.5 rounded-xl bg-primary-300 text-white font-semibold text-sm hover:bg-primary-250 active:scale-[0.98] transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                    >
                        <span>{isLast ? "Submit Exam" : "Save and Next"}</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
