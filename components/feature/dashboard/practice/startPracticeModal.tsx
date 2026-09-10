"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SubjectCardData } from "./practiceSubjectCard";

export interface PracticeConfig {
    subject: SubjectCardData | null;
    school: string;
    questionCount: number;
    time: {
        hours: number;
        minutes: number;
        seconds: number;
    };
}

interface StartPracticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: SubjectCardData | null;
    onStartPractice?: (config: PracticeConfig) => void;
}

type ModalStep = "school" | "questions" | "time" | "summary";

const SCHOOL_OPTIONS = [
    "Obafemi Awolowo University",
    "University of Lagos",
    "University of Ibadan",
    "Ahmadu Bello University",
    "University of Benin",
    "University of Nigeria, Nsukka",
    "Lagos State University",
    "Covenant University",
    "Federal University of Technology, Akure",
    "University of Ilorin",
];

const QUESTION_OPTIONS = [20, 50, 100];

export default function StartPracticeModal({
    isOpen,
    onClose,
    subject,
    onStartPractice,
}: StartPracticeModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<ModalStep>("school");
    const [selectedSchool, setSelectedSchool] = useState("Obafemi Awolowo University");
    const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
    const [questionCount, setQuestionCount] = useState<number>(20);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(20);
    const [seconds, setSeconds] = useState<number>(0);
    const [started, setStarted] = useState(false);

    const schoolDropdownRef = useRef<HTMLDivElement>(null);

    // Reset state when opening modal
    useEffect(() => {
        if (isOpen) {
            setStep("school");
            setQuestionCount(20);
            setHours(0);
            setMinutes(20);
            setSeconds(0);
            setIsSchoolDropdownOpen(false);
            setStarted(false);
        }
    }, [isOpen]);

    // Close school dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                schoolDropdownRef.current &&
                !schoolDropdownRef.current.contains(event.target as Node)
            ) {
                setIsSchoolDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const subjectTitle = subject ? `${subject.name} Practice` : "English Language Practice";

    const handleBack = () => {
        if (step === "school") {
            onClose();
        } else if (step === "questions") {
            setStep("school");
        } else if (step === "time") {
            setStep("questions");
        } else if (step === "summary") {
            setStep("time");
        }
    };

    const handleContinue = () => {
        if (step === "school") {
            setStep("questions");
        } else if (step === "questions") {
            // Set default time based on questions if untouched
            if (questionCount === 20) {
                setMinutes(20);
            } else if (questionCount === 50) {
                setMinutes(50);
            } else if (questionCount === 100) {
                setHours(1);
                setMinutes(40);
            }
            setStep("time");
        } else if (step === "time") {
            setStep("summary");
        } else if (step === "summary") {
            setStarted(true);
            onStartPractice?.({
                subject,
                school: selectedSchool,
                questionCount,
                time: { hours, minutes, seconds },
            });
            setTimeout(() => {
                onClose();
                const subjQuery = encodeURIComponent(subject?.name || "English Language");
                router.push(`/exams?subject=${subjQuery}`);
            }, 600);
        }
    };

    const formatTimeDisplay = () => {
        const hStr = String(hours).padStart(2, "0");
        const mStr = String(minutes).padStart(2, "0");
        const sStr = String(seconds).padStart(2, "0");
        return { hStr, mStr, sStr };
    };

    const { hStr, mStr, sStr } = formatTimeDisplay();

    // Summary time text
    const summaryTimeText = hours > 0
        ? `${hours} hr${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} mins` : ""}`
        : `${minutes} mins`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-all animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-3xl w-full max-w-[480px] p-7 sm:p-8 shadow-2xl relative flex flex-col transition-all">
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-6 pb-2">
                    {/* Back button & Subject Practice Title */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleBack}
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
                            {subjectTitle}
                        </span>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
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

                {/* Step 1: Choose your school */}
                {step === "school" && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-xl font-bold text-neutral-900">
                            Choose your school
                        </h2>

                        <div className="flex flex-col gap-2 relative" ref={schoolDropdownRef}>
                            <label className="text-xs font-semibold text-neutral-700">
                                Choose School *
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsSchoolDropdownOpen((prev) => !prev)}
                                className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-800 hover:border-neutral-400 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                            >
                                <span className="truncate">{selectedSchool}</span>
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
                                            isSchoolDropdownOpen ? "rotate-180" : ""
                                        }`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </button>

                            {/* Dropdown Options */}
                            {isSchoolDropdownOpen && (
                                <div className="absolute top-[72px] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1.5 z-30">
                                    {SCHOOL_OPTIONS.map((school) => (
                                        <button
                                            key={school}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSchool(school);
                                                setIsSchoolDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                selectedSchool === school
                                                    ? "bg-primary-50 text-primary-300 font-semibold"
                                                    : "text-neutral-700 hover:bg-neutral-50"
                                            }`}
                                        >
                                            {school}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Continue Button */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="w-full h-12 mt-2 bg-primary-300 hover:bg-primary-250 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Preferred Number of Questions */}
                {step === "questions" && (
                    <div className="flex flex-col gap-6">
                        <h2 className="text-xl font-bold text-neutral-900">
                            Preferred Number of Questions
                        </h2>

                        <div className="flex flex-col gap-3">
                            {QUESTION_OPTIONS.map((count) => {
                                const isSelected = questionCount === count;
                                return (
                                    <button
                                        key={count}
                                        type="button"
                                        onClick={() => setQuestionCount(count)}
                                        className={`w-full h-13 px-4 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                                            isSelected
                                                ? "bg-[#E8FAF3] border-[#52C498] text-neutral-900 font-semibold"
                                                : "bg-white border-neutral-200 text-neutral-800 font-medium hover:border-neutral-300"
                                        }`}
                                    >
                                        <span className="text-base">{count}</span>

                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center text-white flex-shrink-0">
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Continue Button */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="w-full h-12 mt-2 bg-primary-300 hover:bg-primary-250 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 3: Set Time */}
                {step === "time" && (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-neutral-900">
                            Set Time
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm mb-4">
                            Since this is a practice session, you are allowed to set how long you would like to practice for
                        </p>

                        {/* Time Display with interactive stepper controls */}
                        <div className="py-6 flex items-center justify-center gap-2 sm:gap-3 text-neutral-900">
                            {/* Hours */}
                            <div className="flex flex-col items-center">
                                <div className="flex items-baseline">
                                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                        {hStr}
                                    </span>
                                    <span className="text-xs font-semibold text-neutral-600 ml-1">
                                        hrs
                                    </span>
                                </div>
                                <div className="flex gap-1.5 mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setHours((h) => Math.max(0, h - 1))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600"
                                        title="Decrease hours"
                                    >
                                        -
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHours((h) => Math.min(12, h + 1))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600"
                                        title="Increase hours"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <span className="text-2xl sm:text-3xl font-bold text-neutral-400 -mt-6">
                                :
                            </span>

                            {/* Minutes */}
                            <div className="flex flex-col items-center">
                                <div className="flex items-baseline">
                                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                        {mStr}
                                    </span>
                                    <span className="text-xs font-semibold text-neutral-600 ml-1">
                                        mins
                                    </span>
                                </div>
                                <div className="flex gap-1.5 mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setMinutes((m) => Math.max(5, m - 5))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600"
                                        title="Decrease minutes"
                                    >
                                        -
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMinutes((m) => Math.min(59, m + 5))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600"
                                        title="Increase minutes"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <span className="text-2xl sm:text-3xl font-bold text-neutral-400 -mt-6">
                                :
                            </span>

                            {/* Seconds */}
                            <div className="flex flex-col items-center">
                                <div className="flex items-baseline">
                                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                        {sStr}
                                    </span>
                                    <span className="text-xs font-semibold text-neutral-600 ml-1">
                                        secs
                                    </span>
                                </div>
                                <div className="flex gap-1.5 mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setSeconds((s) => (s >= 15 ? s - 15 : 0))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600"
                                        title="Decrease seconds"
                                    >
                                        -
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSeconds((s) => (s <= 45 ? s + 15 : 0))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600"
                                        title="Increase seconds"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="w-full h-12 mt-4 bg-primary-300 hover:bg-primary-250 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 4: Summary */}
                {step === "summary" && (
                    <div className="flex flex-col gap-5">
                        <h2 className="text-xl font-bold text-neutral-900">
                            Summary
                        </h2>

                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-sm font-medium text-neutral-600 mb-1">
                                    Preferred Number of Questions
                                </p>
                                <p className="text-base font-bold text-neutral-900">
                                    {questionCount}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-neutral-600 mb-1">
                                    Time Set
                                </p>
                                <p className="text-base font-bold text-neutral-900">
                                    {summaryTimeText}
                                </p>
                            </div>
                        </div>

                        {/* Start Practicing Button */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={started}
                            className="w-full h-12 mt-4 bg-primary-300 hover:bg-primary-250 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs disabled:opacity-75"
                        >
                            {started ? "Starting Practice Session..." : "Start Practicing"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
