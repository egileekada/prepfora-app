"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    ExamCurriculum,
    MockSubjectSelection,
    getRealMockExamBreakdown,
    REAL_MOCK_EXAM_CONFIGS,
} from "./mockExamTypes";
import useExam from "@/hooks/exam/useExam";

interface StartMockExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    curriculum: ExamCurriculum | null;
}

const YEAR_OPTIONS = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

export default function StartMockExamModal({
    isOpen,
    onClose,
    curriculum,
}: StartMockExamModalProps) {
    const router = useRouter();

    const [selectedYear, setSelectedYear] = useState("2024");
    const [selectedSubjects, setSelectedSubjects] = useState<MockSubjectSelection[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);

    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isSubjectOpen, setIsSubjectOpen] = useState(false);

    const yearRef = useRef<HTMLDivElement>(null);
    const subjectRef = useRef<HTMLDivElement>(null);

    const { useGetSubject } = useExam();
    const { data, isLoading: isSubjectsLoading } = useGetSubject();

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setSelectedYear("2024");
            setSelectedSubjects([]);
            setValidationError(null);
            setIsYearOpen(false);
            setIsSubjectOpen(false);
        }
    }, [isOpen, curriculum?.code]);

    // Outside click dismiss
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
                setIsYearOpen(false);
            }
            if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
                setIsSubjectOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen || !curriculum) return null;

    const examConfig = REAL_MOCK_EXAM_CONFIGS[curriculum.code];
    const requiredCount = examConfig.requiredSubjectCount;
    const isMultiSubject = requiredCount > 1;
    const availableSubjects: MockSubjectSelection[] = data?.data?.subjects || [];

    const hasRequiredYear = Boolean(selectedYear.trim());
    const hasRequiredSubjects = selectedSubjects.length === requiredCount;
    const isFormValid = hasRequiredYear && hasRequiredSubjects;

    const previewBreakdown = getRealMockExamBreakdown(
        curriculum.code,
        selectedSubjects
    );

    const toggleSubject = (sub: MockSubjectSelection) => {
        setValidationError(null);
        if (!isMultiSubject) {
            setSelectedSubjects([sub]);
            setIsSubjectOpen(false);
            return;
        }
        setSelectedSubjects((prev) => {
            const exists = prev.some((item) => item.name === sub.name);
            if (exists) {
                return prev.filter((item) => item.name !== sub.name);
            }
            if (prev.length >= requiredCount) {
                return prev;
            }
            return [...prev, sub];
        });
    };

    const removeSubject = (name: string) => {
        setValidationError(null);
        setSelectedSubjects((prev) => prev.filter((item) => item.name !== name));
    };

    const modalTitle = `${curriculum.title} Mock Exam`;

    const handleContinue = () => {
        if (!hasRequiredYear) {
            setValidationError("Please select an exam year to continue.");
            return;
        }
        if (!hasRequiredSubjects) {
            setValidationError(
                isMultiSubject
                    ? `Please select exactly ${requiredCount} subjects for ${curriculum.title} (${selectedSubjects.length}/${requiredCount} selected).`
                    : `Please select a subject for ${curriculum.title}.`
            );
            return;
        }

        const subjectSlugs = selectedSubjects.map((s) => s.name).join(",");
        const subjectTitles = selectedSubjects.map((s) => s.displayName).join(",");
        const primarySubject = selectedSubjects[0]?.name || "";

        onClose();
        router.push(
            `/exams/mock?subject=${encodeURIComponent(
                primarySubject
            )}&subjects=${encodeURIComponent(
                subjectSlugs
            )}&subjectTitles=${encodeURIComponent(
                subjectTitles
            )}&exam=${encodeURIComponent(
                curriculum.title
            )}&year=${encodeURIComponent(selectedYear)}`
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-all animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-3xl w-full max-w-[460px] p-7 sm:p-8 shadow-2xl relative flex flex-col gap-6">
                {/* Header: Back & Title + Close */}
                <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center gap-1.5 text-neutral-800 hover:text-neutral-600 transition-colors font-medium text-sm cursor-pointer"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
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

                        <span className="text-sm font-semibold text-[#047857]">
                            {modalTitle}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
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

                {/* Modal Body */}
                <div className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold text-neutral-900">
                        Exam Details
                    </h2>

                    {/* Choose Exam Year */}
                    <div className="flex flex-col gap-2 relative" ref={yearRef}>
                        <label className="text-xs font-semibold text-neutral-700">
                            Choose Exam Year *
                        </label>

                        <button
                            type="button"
                            onClick={() => setIsYearOpen((prev) => !prev)}
                            className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-sm font-normal text-neutral-800 hover:border-neutral-400 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                        >
                            <span className={selectedYear ? "text-neutral-900 font-medium" : "text-neutral-400"}>
                                {selectedYear || "year"}
                            </span>
                            <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0 text-neutral-500">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`transition-transform duration-200 ${isYearOpen ? "rotate-180" : ""
                                        }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </button>

                        {isYearOpen && (
                            <div className="absolute top-[72px] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 z-30">
                                {YEAR_OPTIONS.map((y) => (
                                    <button
                                        key={y}
                                        type="button"
                                        onClick={() => {
                                            setSelectedYear(y);
                                            setIsYearOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedYear === y
                                            ? "bg-primary-50 text-primary-300 font-semibold"
                                            : "text-neutral-700 hover:bg-neutral-50"
                                            }`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Choose Subject(s) - Required for all mock exams (4 for JAMB, 1 for WAEC/NECO/POST UTME) */}
                    <div className="flex flex-col gap-2 relative" ref={subjectRef}>
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-neutral-700">
                                {isMultiSubject
                                    ? `Choose ${requiredCount} Subjects *`
                                    : "Choose Subject *"}
                            </label>
                            <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                    hasRequiredSubjects
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-primary-50 text-primary-300"
                                }`}
                            >
                                {selectedSubjects.length}/{requiredCount} selected
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsSubjectOpen((prev) => !prev)}
                            className="w-full min-h-12 px-4 py-2 bg-white border border-neutral-300 rounded-xl text-sm font-normal text-neutral-800 hover:border-neutral-400 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                        >
                            <span
                                className={
                                    selectedSubjects.length > 0
                                        ? "text-neutral-900 font-medium truncate pr-2"
                                        : "text-neutral-400"
                                }
                            >
                                {selectedSubjects.length > 0
                                    ? selectedSubjects.map((s) => s.displayName).join(", ")
                                    : isMultiSubject
                                    ? `Select ${requiredCount} subjects (e.g. English + 3 others)`
                                    : "Select subject"}
                            </span>
                            <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0 text-neutral-500">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`transition-transform duration-200 ${
                                        isSubjectOpen ? "rotate-180" : ""
                                    }`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </button>

                        {isSubjectOpen && (
                            <div className="absolute top-[74px] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-52 overflow-y-auto py-1 z-30">
                                {isSubjectsLoading ? (
                                    <div className="px-4 py-3 text-xs text-neutral-500">
                                        Loading subjects...
                                    </div>
                                ) : availableSubjects.length === 0 ? (
                                    <div className="px-4 py-3 text-xs text-neutral-500">
                                        No subjects available
                                    </div>
                                ) : (
                                    availableSubjects.map((sub) => {
                                        const isSelected = selectedSubjects.some(
                                            (item) => item.name === sub.name
                                        );
                                        const isLimitReached =
                                            isMultiSubject &&
                                            selectedSubjects.length >= requiredCount &&
                                            !isSelected;
                                        return (
                                            <button
                                                key={sub.name}
                                                type="button"
                                                disabled={isLimitReached}
                                                onClick={() => toggleSubject(sub)}
                                                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                                                    isSelected
                                                        ? "bg-primary-50 text-primary-300 font-semibold"
                                                        : isLimitReached
                                                        ? "text-neutral-300 cursor-not-allowed"
                                                        : "text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                                                }`}
                                            >
                                                <span>{sub.displayName}</span>
                                                {isSelected && (
                                                    <span className="text-xs font-bold">
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {selectedSubjects.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {previewBreakdown.subjects.map((sub) => (
                                    <span
                                        key={sub.name}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF3FA] text-neutral-800 text-xs font-medium"
                                    >
                                        <span>
                                            {sub.displayName} ({sub.questionCount} Qs)
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeSubject(sub.name)}
                                            aria-label={`Remove ${sub.displayName}`}
                                            className="text-neutral-400 hover:text-neutral-700 cursor-pointer leading-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Live Mock Exam Preview (Subject(s), Real Questions & Real Time) */}
                    <div className="rounded-xl border border-neutral-200 bg-[#F8FAFC] p-3.5 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                                {curriculum.title} Exam Preview
                            </span>
                            <span className="text-[11px] font-semibold text-primary-300">
                                {selectedYear || "2024"}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white rounded-lg border border-neutral-100 px-3 py-2">
                                <span className="text-neutral-500 block text-[11px]">
                                    Total Questions
                                </span>
                                <span className="font-bold text-neutral-900 text-sm">
                                    {examConfig.totalQuestions} Qs
                                </span>
                            </div>
                            <div className="bg-white rounded-lg border border-neutral-100 px-3 py-2">
                                <span className="text-neutral-500 block text-[11px]">
                                    Real Time Limit
                                </span>
                                <span className="font-bold text-neutral-900 text-sm">
                                    {examConfig.durationMinutes} mins
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-neutral-700">
                            <span className="font-semibold text-neutral-800">
                                Selected Subject{isMultiSubject ? "s" : ""}:{" "}
                            </span>
                            {previewBreakdown.subjects.length > 0 ? (
                                <span>
                                    {previewBreakdown.subjects
                                        .map((s) => `${s.displayName} (${s.questionCount})`)
                                        .join(", ")}
                                </span>
                            ) : (
                                <span className="text-neutral-400">
                                    Select {requiredCount} subject{isMultiSubject ? "s" : ""} above to preview
                                </span>
                            )}
                        </div>
                    </div>

                    {validationError && (
                        <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                            {validationError}
                        </p>
                    )}

                    {/* Continue Button */}
                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        className={`w-full h-12 mt-1 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center shadow-xs ${
                            isFormValid
                                ? "bg-primary-300 hover:bg-primary-400 text-white cursor-pointer active:scale-[0.99]"
                                : "bg-[#8daef5] text-white/90 cursor-not-allowed opacity-75"
                        }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
