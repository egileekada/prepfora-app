"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SubjectCardData } from "./practiceSubjectCard";
import useExam from "@/hooks/exam/useExam";

export interface PracticeConfig {
    subject: SubjectCardData | null;
    subjectName: string;
    subjectDisplayName: string;
    examType: string;
    year: string;
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
    subject?: SubjectCardData | null;
    initialExamType?: string;
    onStartPractice?: (config: PracticeConfig) => void;
}

type ModalStep = "subject" | "school" | "questions" | "time" | "summary";

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

const EXAM_TYPE_OPTIONS = ["UTME", "WAEC", "NECO", "POST-UTME"];
const YEAR_OPTIONS = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"];
const QUESTION_OPTIONS = [10, 20, 30, 50];

export default function StartPracticeModal({
    isOpen,
    onClose,
    subject: propSubject = null,
    initialExamType,
    onStartPractice,
}: StartPracticeModalProps) {
    const router = useRouter();
    const { useGetSubject } = useExam();
    const { data: subjectsData, isLoading: isSubjectsLoading } = useGetSubject();

    const [step, setStep] = useState<ModalStep>("subject");

    // Form states
    const [selectedSubjectName, setSelectedSubjectName] = useState<string>("english");
    const [selectedSubjectDisplayName, setSelectedSubjectDisplayName] = useState<string>("English Language");
    const [selectedExamType, setSelectedExamType] = useState<string>("UTME");
    const [selectedYear, setSelectedYear] = useState<string>("2020");
    const [selectedSchool, setSelectedSchool] = useState<string>("Obafemi Awolowo University");
    const [questionCount, setQuestionCount] = useState<number>(20);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(20);
    const [seconds, setSeconds] = useState<number>(0);
    const [started, setStarted] = useState<boolean>(false);

    // Dropdown open states
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const [isExamTypeDropdownOpen, setIsExamTypeDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

    const subjectDropdownRef = useRef<HTMLDivElement>(null);
    const examTypeDropdownRef = useRef<HTMLDivElement>(null);
    const yearDropdownRef = useRef<HTMLDivElement>(null);
    const schoolDropdownRef = useRef<HTMLDivElement>(null);

    // Subjects list from backend response
    const subjectsList = useMemo(() => {
        return subjectsData?.data?.subjects || [];
    }, [subjectsData]);

    // Synchronize initial selection when modal opens or propSubject changes
    useEffect(() => {
        if (isOpen) {
            setStep("subject");
            setQuestionCount(20);
            setHours(0);
            setMinutes(20);
            setSeconds(0);
            setIsSubjectDropdownOpen(false);
            setIsExamTypeDropdownOpen(false);
            setIsYearDropdownOpen(false);
            setIsSchoolDropdownOpen(false);
            setStarted(false);

            if (propSubject?.name) {
                const cleanName = propSubject.name.trim().toLowerCase();
                const matched = subjectsList.find(
                    (s) =>
                        s.name.toLowerCase() === cleanName ||
                        s.displayName.toLowerCase() === cleanName
                );
                if (matched) {
                    setSelectedSubjectName(matched.name);
                    setSelectedSubjectDisplayName(matched.displayName);
                } else {
                    const slug = cleanName.includes("math")
                        ? "mathematics"
                        : cleanName.includes("eng")
                            ? "english"
                            : cleanName.includes("bio")
                                ? "biology"
                                : cleanName.includes("phy")
                                    ? "physics"
                                    : cleanName.includes("chem")
                                        ? "chemistry"
                                        : cleanName;
                    setSelectedSubjectName(slug);
                    setSelectedSubjectDisplayName(propSubject.name);
                }

                if (propSubject.exam) {
                    const matchedExam = EXAM_TYPE_OPTIONS.find(
                        (e) => e.toLowerCase() === propSubject.exam?.toLowerCase()
                    );
                    if (matchedExam) setSelectedExamType(matchedExam);
                } else if (initialExamType) {
                    const cleanInit = initialExamType.toLowerCase();
                    const matchedExam = EXAM_TYPE_OPTIONS.find(
                        (e) =>
                            e.toLowerCase() === cleanInit ||
                            (cleanInit === "jamb" && e.toLowerCase() === "utme") ||
                            (cleanInit.includes("post") && e.toLowerCase().includes("post"))
                    );
                    if (matchedExam) setSelectedExamType(matchedExam);
                }
            } else if (subjectsList.length > 0) {
                setSelectedSubjectName(subjectsList[0].name);
                setSelectedSubjectDisplayName(subjectsList[0].displayName);

                if (initialExamType) {
                    const cleanInit = initialExamType.toLowerCase();
                    const matchedExam = EXAM_TYPE_OPTIONS.find(
                        (e) =>
                            e.toLowerCase() === cleanInit ||
                            (cleanInit === "jamb" && e.toLowerCase() === "utme") ||
                            (cleanInit.includes("post") && e.toLowerCase().includes("post"))
                    );
                    if (matchedExam) setSelectedExamType(matchedExam);
                }
            }
        }
    }, [isOpen, propSubject, initialExamType, subjectsList]);

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(target)) {
                setIsSubjectDropdownOpen(false);
            }
            if (examTypeDropdownRef.current && !examTypeDropdownRef.current.contains(target)) {
                setIsExamTypeDropdownOpen(false);
            }
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(target)) {
                setIsYearDropdownOpen(false);
            }
            if (schoolDropdownRef.current && !schoolDropdownRef.current.contains(target)) {
                setIsSchoolDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const subjectTitle = `${selectedSubjectDisplayName} Practice`;

    const handleBack = () => {
        if (step === "subject") {
            onClose();
        } else if (step === "school") {
            setStep("subject");
        } else if (step === "questions") {
            setStep("school");
        } else if (step === "time") {
            setStep("questions");
        } else if (step === "summary") {
            setStep("time");
        }
    };

    const handleContinue = () => {
        if (step === "subject") {
            setStep("school");
        } else if (step === "school") {
            setStep("questions");
        } else if (step === "questions") {
            // Adjust default recommended practice time if user has not customized yet
            if (questionCount === 10) {
                setHours(0);
                setMinutes(10);
            } else if (questionCount === 20) {
                setHours(0);
                setMinutes(20);
            } else if (questionCount === 30) {
                setHours(0);
                setMinutes(30);
            } else if (questionCount === 50) {
                setHours(0);
                setMinutes(50);
            }
            setStep("time");
        } else if (step === "time") {
            setStep("summary");
        } else if (step === "summary") {
            setStarted(true);
            const practiceConfig: PracticeConfig = {
                subject: propSubject,
                subjectName: selectedSubjectName,
                subjectDisplayName: selectedSubjectDisplayName,
                examType: selectedExamType,
                year: selectedYear,
                school: selectedSchool,
                questionCount,
                time: { hours, minutes, seconds },
            };

            onStartPractice?.(practiceConfig);

            setTimeout(() => {
                onClose();
                const params = new URLSearchParams({
                    subject: selectedSubjectName,
                    subjectTitle: selectedSubjectDisplayName,
                    type: selectedExamType.toLowerCase(),
                    year: selectedYear,
                    limit: String(questionCount),
                    school: selectedSchool,
                    hours: String(hours),
                    minutes: String(minutes),
                    seconds: String(seconds),
                });
                router.push(`/exams?${params.toString()}`);
            }, 500);
        }
    };

    const formatTimeDisplay = () => {
        const hStr = String(hours).padStart(2, "0");
        const mStr = String(minutes).padStart(2, "0");
        const sStr = String(seconds).padStart(2, "0");
        return { hStr, mStr, sStr };
    };

    const { hStr, mStr, sStr } = formatTimeDisplay();

    const summaryTimeText =
        hours > 0
            ? `${hours} hr${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} mins` : ""}`
            : `${minutes} mins`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-all animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-3xl w-full max-w-[490px] p-7 sm:p-8 shadow-2xl relative flex flex-col transition-all">
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-100">
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

                        <span className="text-sm font-semibold text-[#047857] truncate max-w-[240px]">
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

                {/* Step 1: Choose Subject & Exam Type */}
                {step === "subject" && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">
                                Practice Details
                            </h2>
                            <p className="text-xs text-neutral-500 mt-1">
                                Choose your subject, exam category, and examination year
                            </p>
                        </div>

                        {/* Subject Select Dropdown */}
                        <div className="flex flex-col gap-1.5 relative" ref={subjectDropdownRef}>
                            <label className="text-xs font-semibold text-neutral-700">
                                Select Subject *
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsSubjectDropdownOpen((prev) => !prev)}
                                className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-800 hover:border-neutral-400 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                            >
                                <span className="truncate">
                                    {isSubjectsLoading
                                        ? "Loading subjects..."
                                        : selectedSubjectDisplayName}
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
                                        className={`transition-transform duration-200 ${isSubjectDropdownOpen ? "rotate-180" : ""
                                            }`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </button>

                            {/* Dropdown Options */}
                            {isSubjectDropdownOpen && (
                                <div className="absolute top-[72px] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1.5 z-40">
                                    {subjectsList.length > 0 ? (
                                        subjectsList.map((sub) => (
                                            <button
                                                key={sub.name}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSubjectName(sub.name);
                                                    setSelectedSubjectDisplayName(sub.displayName);
                                                    setIsSubjectDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${selectedSubjectName === sub.name
                                                    ? "bg-primary-50 text-primary-300 font-semibold"
                                                    : "text-neutral-700 hover:bg-neutral-50"
                                                    }`}
                                            >
                                                <span className="truncate">{sub.displayName}</span>
                                                <span className="text-[11px] uppercase tracking-wider text-neutral-400 ml-2">
                                                    {sub.code || sub.category}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-xs text-neutral-500 text-center">
                                            No subjects found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Exam Type & Year Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Exam Type Select */}
                            <div className="flex flex-col gap-1.5 relative" ref={examTypeDropdownRef}>
                                <label className="text-xs font-semibold text-neutral-700">
                                    Exam Type *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsExamTypeDropdownOpen((prev) => !prev)}
                                    className="w-full h-11 px-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-800 hover:border-neutral-400 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                                >
                                    <span className="truncate">{selectedExamType}</span>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`text-neutral-500 transition-transform duration-200 ${isExamTypeDropdownOpen ? "rotate-180" : ""
                                            }`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {isExamTypeDropdownOpen && (
                                    <div className="absolute top-[68px] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 z-30">
                                        {EXAM_TYPE_OPTIONS.map((exam) => (
                                            <button
                                                key={exam}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedExamType(exam);
                                                    setIsExamTypeDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-xs sm:text-sm transition-colors ${selectedExamType === exam
                                                    ? "bg-primary-50 text-primary-300 font-semibold"
                                                    : "text-neutral-700 hover:bg-neutral-50"
                                                    }`}
                                            >
                                                {exam}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Year Select */}
                            <div className="flex flex-col gap-1.5 relative" ref={yearDropdownRef}>
                                <label className="text-xs font-semibold text-neutral-700">
                                    Exam Year *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsYearDropdownOpen((prev) => !prev)}
                                    className="w-full h-11 px-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-800 hover:border-neutral-400 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                                >
                                    <span className="truncate">{selectedYear}</span>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`text-neutral-500 transition-transform duration-200 ${isYearDropdownOpen ? "rotate-180" : ""
                                            }`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {isYearDropdownOpen && (
                                    <div className="absolute top-[68px] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 z-30">
                                        {Array.from({ length: 40 }).map((_, index) => {
                                            const year = (2024 - index).toString();
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedYear(year);
                                                        setIsYearDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm transition-colors ${selectedYear === year
                                                        ? "bg-primary-50 text-primary-300 font-semibold"
                                                        : "text-neutral-700 hover:bg-neutral-50"
                                                        }`}
                                                >
                                                    {year}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
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

                {/* Step 2: Choose your school */}
                {step === "school" && (
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">
                                Choose your school
                            </h2>
                            <p className="text-xs text-neutral-500 mt-1">
                                Select your target university or tertiary institution
                            </p>
                        </div>

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
                                        className={`transition-transform duration-200 ${isSchoolDropdownOpen ? "rotate-180" : ""
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
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedSchool === school
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

                {/* Step 3: Preferred Number of Questions */}
                {step === "questions" && (
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">
                                Preferred Number of Questions
                            </h2>
                            <p className="text-xs text-neutral-500 mt-1">
                                Choose how many questions you want to practice
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {QUESTION_OPTIONS.map((count) => {
                                const isSelected = questionCount === count;
                                return (
                                    <button
                                        key={count}
                                        type="button"
                                        onClick={() => setQuestionCount(count)}
                                        className={`w-full h-13 px-4 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${isSelected
                                            ? "bg-[#E8FAF3] border-[#52C498] text-neutral-900 font-semibold"
                                            : "bg-white border-neutral-200 text-neutral-800 font-medium hover:border-neutral-300"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-semibold">{count}</span>
                                            <span className="text-xs text-neutral-500">questions</span>
                                        </div>

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

                {/* Step 4: Set Time */}
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
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600 cursor-pointer"
                                        title="Decrease hours"
                                    >
                                        -
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHours((h) => Math.min(12, h + 1))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600 cursor-pointer"
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
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600 cursor-pointer"
                                        title="Decrease minutes"
                                    >
                                        -
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMinutes((m) => Math.min(59, m + 5))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600 cursor-pointer"
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
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600 cursor-pointer"
                                        title="Decrease seconds"
                                    >
                                        -
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSeconds((s) => (s <= 45 ? s + 15 : 0))}
                                        className="w-6 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-xs font-bold flex items-center justify-center text-neutral-600 cursor-pointer"
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

                {/* Step 5: Summary */}
                {step === "summary" && (
                    <div className="flex flex-col gap-5">
                        <h2 className="text-xl font-bold text-neutral-900">
                            Summary
                        </h2>

                        <div className="flex flex-col gap-3.5 bg-neutral-50 p-4 rounded-2xl border border-neutral-150">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Subject</span>
                                <span className="text-neutral-900 font-bold">{selectedSubjectDisplayName}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Exam Type & Year</span>
                                <span className="text-neutral-900 font-bold">{selectedExamType} ({selectedYear})</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">School / Institution</span>
                                <span className="text-neutral-900 font-bold truncate max-w-[200px]">{selectedSchool}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Questions</span>
                                <span className="text-neutral-900 font-bold">{questionCount} questions</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Time Limit</span>
                                <span className="text-neutral-900 font-bold">{summaryTimeText}</span>
                            </div>
                        </div>

                        {/* Start Practicing Button */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={started}
                            className="w-full h-12 mt-2 bg-primary-300 hover:bg-primary-250 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs disabled:opacity-75"
                        >
                            {started ? "Starting Practice Session..." : "Start Practicing"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
