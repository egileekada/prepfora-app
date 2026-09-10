"use client";

import React from "react";
import { ExamCurriculum } from "./mockExamTypes";

interface CurriculumCardProps {
    curriculum: ExamCurriculum;
    onStartExam: (curriculum: ExamCurriculum) => void;
}

export default function CurriculumCard({
    curriculum,
    onStartExam,
}: CurriculumCardProps) {
    const {
        code,
        title,
        description,
        metricLabel,
        metricValue,
        metricTotal,
        availableMocks,
        lastAttempt,
        iconType,
    } = curriculum;

    // Render crest/logo
    const renderIcon = () => {
        if (iconType === "waec") {
            return (
                <div className="w-8 h-8 rounded-full bg-[#3B1F54] flex items-center justify-center text-amber-400 font-bold text-xs shadow-xs border border-amber-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16.1 7.2 16.6l.9-5.3-3.8-3.7 5.3-.8L12 2z" />
                    </svg>
                </div>
            );
        }
        if (iconType === "neco") {
            return (
                <div className="w-8 h-8 rounded-full bg-[#0F5132] flex items-center justify-center text-white font-bold text-[10px] shadow-xs border border-emerald-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M9 12l2 2 4-4" />
                    </svg>
                </div>
            );
        }
        // JAMB or POST-UTME green seal
        return (
            <div className="w-8 h-8 rounded-full bg-[#067A52] flex items-center justify-center text-white shadow-xs border border-emerald-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="8" fill="#10B981" />
                    <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        );
    };

    return (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
                {/* Top Row: Crest + Performance Metric */}
                <div className="flex items-center justify-between mb-4">
                    {renderIcon()}

                    <div className="flex items-baseline gap-1 text-xs text-neutral-500 font-medium">
                        <span>{metricLabel}:</span>
                        <span className="font-bold text-neutral-900 text-sm">
                            {metricValue}
                        </span>
                        {metricTotal && (
                            <span className="text-[11px] text-neutral-400 font-normal">
                                {metricTotal}
                            </span>
                        )}
                    </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-neutral-900 mb-1.5">
                    {title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                    {description}
                </p>

                {/* Info Row: Available Mocks & Last Attempt */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div className="flex flex-col">
                        <span className="text-[11px] text-neutral-400 font-medium">
                            Available mocks
                        </span>
                        <span className="text-xs font-bold text-neutral-800 mt-0.5">
                            {availableMocks}
                        </span>
                    </div>

                    <div className="flex flex-col text-right">
                        <span className="text-[11px] text-neutral-400 font-medium">
                            Last Attempt
                        </span>
                        <span className="text-xs font-bold text-neutral-800 mt-0.5">
                            {lastAttempt}
                        </span>
                    </div>
                </div>
            </div>

            {/* Start Exam Button */}
            <button
                type="button"
                onClick={() => onStartExam(curriculum)}
                className="w-full mt-6 py-2.5 px-4 rounded-xl border border-primary-300 text-primary-300 font-semibold text-xs sm:text-sm hover:bg-primary-50 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
            >
                Start Exam
            </button>
        </div>
    );
}
