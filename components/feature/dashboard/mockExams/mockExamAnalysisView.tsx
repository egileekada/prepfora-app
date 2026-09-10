"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ExamAnalysisData } from "./mockExamTypes";

interface MockExamAnalysisViewProps {
    analysis: ExamAnalysisData;
    onBack: () => void;
}

export default function MockExamAnalysisView({
    analysis,
    onBack,
}: MockExamAnalysisViewProps) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const {
        examTitle,
        totalScore,
        maxScore,
        percentileMessage,
        aiAdvice,
        sections,
        topicGaps,
    } = analysis;

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(
                `Check out my ${examTitle} score: ${totalScore}/${maxScore} on Prepfora!`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleStartPracticing = () => {
        router.push("/dashboard/practice");
    };

    return (
        <div className="w-full flex flex-col gap-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn">
            {/* Top Bar: Back & Exam Title + Share Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBack}
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

                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                        {examTitle}
                    </h2>
                </div>

                <button
                    type="button"
                    onClick={handleShare}
                    className="bg-[#2563EB] hover:bg-primary-250 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-[0.98] self-start sm:self-auto"
                >
                    {copied ? "Copied Link!" : "Share Result with Friends"}
                </button>
            </div>

            {/* Analysis Layout */}
            <div className="w-full flex flex-col lg:flex-row items-start gap-6">
                {/* Left Column: Total Score & AI Strategy Advice */}
                <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-5">
                    {/* Total Score Card (Deep Green) */}
                    <div className="w-full bg-[#067A52] rounded-2xl p-6 text-white shadow-xs flex flex-col justify-between min-h-[160px]">
                        <div>
                            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                                Total Score
                            </span>
                            <div className="my-3 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold tracking-tight">
                                    {totalScore}
                                </span>
                                <span className="text-sm font-semibold text-emerald-200">
                                    /{maxScore}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-emerald-100 leading-relaxed font-normal">
                            {percentileMessage}
                        </p>
                    </div>

                    {/* AI Strategy Advice Card (Warm Amber) */}
                    <div className="w-full bg-[#F6BA6F] rounded-2xl p-6 text-neutral-900 shadow-xs flex flex-col gap-2">
                        <h4 className="text-sm font-bold text-neutral-900">
                            AI Strategy Advice
                        </h4>
                        <p className="text-xs text-neutral-900 leading-relaxed font-normal">
                            {aiAdvice}
                        </p>
                    </div>
                </div>

                {/* Right Column: Section Score Breakdown & Topic Gaps */}
                <div className="flex-1 flex flex-col gap-6 w-full">
                    {/* Section Cards */}
                    <div
                        className={`grid gap-4 w-full ${
                            sections.length <= 2
                                ? "grid-cols-1 sm:grid-cols-2"
                                : "grid-cols-1 sm:grid-cols-2"
                        }`}
                    >
                        {sections.map((sec, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-[#3B82F6] rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-neutral-900">
                                        {sec.title}
                                    </span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className="text-lg font-extrabold text-neutral-900">
                                            {sec.score}
                                        </span>
                                        <span className="text-xs text-neutral-500 font-medium">
                                            /{sec.maxScore}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs text-neutral-500">
                                    {sec.percentile}
                                </p>

                                <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium pt-1">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-neutral-500"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>{sec.timeSpent}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Topic Gaps Section */}
                    <div className="flex flex-col gap-3 mt-2">
                        <h3 className="text-lg font-bold text-neutral-900">
                            Topic Gaps
                        </h3>

                        <div className="w-full bg-white rounded-2xl border border-[#E2EAF4] p-6 shadow-xs flex flex-col divide-y divide-neutral-100">
                            {topicGaps.map((gap) => (
                                <div
                                    key={gap.id}
                                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            {gap.subject && (
                                                <span className="text-sm font-bold text-neutral-900">
                                                    {gap.subject}
                                                </span>
                                            )}
                                            <span className="text-sm font-bold text-neutral-900">
                                                {gap.topic}
                                            </span>
                                        </div>

                                        <p className="text-xs text-neutral-600">
                                            {gap.missedQuestions}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {gap.errorReason}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleStartPracticing}
                                        className="border border-[#10B981] text-[#059669] hover:bg-[#E8FAF3] active:scale-[0.98] font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                                    >
                                        Start Practicing
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
