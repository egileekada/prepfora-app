"use client";

import React from "react";

export interface SubjectCardData {
    id: string | number;
    name: string;
    letter?: string;
    percent: number;
    color?: string;
    exam?: string;
    examinationId?: string;
    year?: string;
    totalQuestion?: number;
    totalAnswered?: number;
}

interface PracticeSubjectCardProps {
    subject: SubjectCardData;
    onContinue?: (subject: SubjectCardData) => void;
}

export default function PracticeSubjectCard({
    subject,
    onContinue,
}: PracticeSubjectCardProps) {
    const { name, percent } = subject;
    const letter = subject.letter || name.charAt(0).toUpperCase();

    // Determine color styling based on percentage or custom color
    const getColorTheme = (pct: number, overrideColor?: string) => {
        if (overrideColor) {
            return {
                text: overrideColor,
                bar: overrideColor,
            };
        }
        if (pct === 0) {
            return {
                text: "text-neutral-500",
                bar: "bg-transparent",
            };
        }
        if (pct >= 80) {
            return {
                text: "text-[#10B981]",
                bar: "bg-[#10B981]",
            };
        }
        if (pct >= 50) {
            return {
                text: "text-[#2563EB]",
                bar: "bg-[#2563EB]",
            };
        }
        return {
            text: "text-[#EF4444]",
            bar: "bg-[#EF4444]",
        };
    };

    const colorTheme = getColorTheme(percent, subject.color);

    return (
        <div className="bg-white border border-[#E2EAF4] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-primary-200 transition-all duration-200 group">
            {/* Top Row: Letter Icon Badge & Optional Exam Tag */}
            <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-full bg-[#FCE8D3] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#7A3F14] font-bold text-base select-none">
                        {letter}
                    </span>
                </div>
                {subject.exam && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                        {subject.exam}
                    </span>
                )}
            </div>

            {/* Middle: Subject Name & Percentage */}
            <div className="w-full mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-900 transition-colors">
                        {name}
                    </span>
                    <span className={`text-sm font-bold ${colorTheme.text}`}>
                        {percent}%
                    </span>
                </div>

                {subject.totalQuestion !== undefined && subject.totalAnswered !== undefined && subject.totalQuestion > 0 && (
                    <div className="flex justify-between text-xs text-neutral-400 mb-1.5 font-medium">
                        <span>{subject.totalAnswered} of {subject.totalQuestion} answered</span>
                        {subject.year && <span>({subject.year})</span>}
                    </div>
                )}

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[#EEF2F6] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${colorTheme.bar}`}
                        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                    />
                </div>
            </div>

            {/* Bottom Button */}
            <button
                type="button"
                onClick={() => onContinue?.(subject)}
                className="w-full h-10 rounded-xl border border-primary-300 text-primary-300 font-semibold text-xs sm:text-sm hover:bg-primary-50 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
            >
                {subject.examinationId ? "Resume Practice" : "Continue Practicing"}
            </button>
        </div>
    );
}
