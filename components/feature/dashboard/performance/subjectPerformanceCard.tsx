"use client";

import React, { useState, useRef, useEffect } from "react";
import { MOCK_SUBJECT_PERFORMANCES, SubjectPerformanceItem } from "./performanceTypes";

const EXAMS = ["WAEC", "JAMB", "NECO", "Post-UTME"];

export default function SubjectPerformanceCard() {
    const [selectedExam, setSelectedExam] = useState("WAEC");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getStatusColor = (item: SubjectPerformanceItem) => {
        if (item.percent === 0) return "text-neutral-400";
        if (item.status === "strong") return "text-[#10B981]";
        if (item.status === "stable") return "text-[#2563EB]";
        return "text-[#EF4444]";
    };

    const getBarColor = (item: SubjectPerformanceItem) => {
        if (item.percent === 0) return "bg-transparent";
        if (item.status === "strong") return "bg-[#10B981]";
        if (item.status === "stable") return "bg-[#2563EB]";
        return "bg-[#EF4444]";
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Subject Performance Box */}
            <div className="w-full bg-white border border-[#E2EAF4] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                        Subject Performance
                    </h3>

                    {/* Exam Selector Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            className="h-9 px-3.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 hover:border-neutral-400 flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                            <span>{selectedExam}</span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                className={`transition-transform duration-200 ${
                                    isDropdownOpen ? "rotate-180" : ""
                                }`}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-1.5 w-32 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20">
                                {EXAMS.map((exam) => (
                                    <button
                                        key={exam}
                                        type="button"
                                        onClick={() => {
                                            setSelectedExam(exam);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${
                                            selectedExam === exam
                                                ? "bg-primary-50 text-primary-300 font-bold"
                                                : "text-neutral-700 hover:bg-neutral-50"
                                        }`}
                                    >
                                        {exam}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-3 text-[11px] text-neutral-600 font-medium">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444] inline-block" />
                        <span>Needs Attention</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981] inline-block" />
                        <span>Strong Performance</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB] inline-block" />
                        <span>Stable</span>
                    </div>
                </div>

                {/* 2x2 Grid of Subjects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {MOCK_SUBJECT_PERFORMANCES.map((subject) => (
                        <div
                            key={subject.id}
                            className="bg-white border border-[#E2EAF4] rounded-2xl p-3.5 flex flex-col gap-2 shadow-2xs hover:border-neutral-300 transition-colors"
                        >
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-neutral-900 truncate">
                                    {subject.name}
                                </span>
                                <span className={`font-bold ${getStatusColor(subject)}`}>
                                    {subject.percent}%
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                                        subject
                                    )}`}
                                    style={{ width: `${subject.percent}%` }}
                                />
                            </div>

                            <div className="text-[10px] sm:text-[11px] text-neutral-400 font-medium truncate">
                                {subject.focus}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Badge Card */}
            <div className="w-full bg-[#DCF3E8] border border-[#BDEBD0] rounded-3xl p-5 flex flex-col gap-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0B4632]">
                        Next Badge
                    </span>

                    {/* Medal Icon */}
                    <div className="w-6 h-6 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            {/* Ribbons */}
                            <path
                                d="M8.5 13.5L5 22L12 18.5L19 22L15.5 13.5"
                                fill="#EA580C"
                                stroke="#C2410C"
                                strokeWidth="0.8"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 18.5L19 22L15.5 13.5L12 14.5"
                                fill="#F97316"
                            />
                            {/* Outer Medal Circle */}
                            <circle
                                cx="12"
                                cy="9"
                                r="7.5"
                                fill="#FBBF24"
                                stroke="#D97706"
                                strokeWidth="1"
                            />
                            {/* Inner Circle */}
                            <circle
                                cx="12"
                                cy="9"
                                r="5.5"
                                fill="#F59E0B"
                            />
                            {/* Star Icon in Medal */}
                            <path
                                d="M12 5.5L13.2 8L16 8.3L13.9 10.1L14.5 12.8L12 11.4L9.5 12.8L10.1 10.1L8 8.3L10.8 8L12 5.5Z"
                                fill="#FFFBEB"
                            />
                        </svg>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#059669] rounded-full transition-all duration-500"
                        style={{ width: "70%" }}
                    />
                </div>

                <p className="text-xs text-[#065F46] font-medium">
                    What the user has to do to get to the next rank
                </p>
            </div>
        </div>
    );
}
