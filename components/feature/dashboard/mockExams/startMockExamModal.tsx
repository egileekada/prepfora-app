"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ExamCurriculum } from "./mockExamTypes";
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

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isSubjectOpen, setIsSubjectOpen] = useState(false);

    const yearRef = useRef<HTMLDivElement>(null);
    const subjectRef = useRef<HTMLDivElement>(null);

    const { useGetSubject } = useExam()

    const { data } = useGetSubject()

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setSelectedYear("");
            setSelectedSubject("");
            setIsYearOpen(false);
            setIsSubjectOpen(false);
        }
    }, [isOpen]);

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

    // WAEC and NECO require subject selection
    const requiresSubject =
        curriculum.code === "waec" || curriculum.code === "neco";

    const modalTitle = `${curriculum.title} Mock Exam`;

    const handleContinue = () => {
        const yearVal = selectedYear || "2024";
        const subjectVal = requiresSubject
            ? selectedSubject || "Physics"
            : curriculum.code === "jamb"
                ? "Mathematics"
                : "English Language";

        onClose();
        router.push(
            `/exams/mock?subject=${encodeURIComponent(subjectVal)}&exam=${encodeURIComponent(
                curriculum.title
            )}&year=${encodeURIComponent(yearVal)}`
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

                    {/* Choose Subject (For WAEC & NECO) */}
                    {requiresSubject && (
                        <div className="flex flex-col gap-2 relative" ref={subjectRef}>
                            <label className="text-xs font-semibold text-neutral-700">
                                Choose Subject *
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsSubjectOpen((prev) => !prev)}
                                className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-sm font-normal text-neutral-800 hover:border-neutral-400 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                            >
                                <span className={selectedSubject ? "text-neutral-900 font-medium" : "text-neutral-400"}>
                                    {selectedSubject || "subject"}
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
                                        className={`transition-transform duration-200 ${isSubjectOpen ? "rotate-180" : ""
                                            }`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </button>

                            {isSubjectOpen && (
                                <div className="absolute top-[72px] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 z-30">
                                    {data?.data?.subjects.map((sub, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSubject(sub.name);
                                                setIsSubjectOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedSubject === sub.name
                                                ? "bg-primary-50 text-primary-300 font-semibold"
                                                : "text-neutral-700 hover:bg-neutral-50"
                                                }`}
                                        >
                                            {sub.displayName}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Continue Button */}
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full h-12 mt-2 bg-[#8daef5] hover:bg-primary-300 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
