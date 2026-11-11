"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SubjectCardData } from "./practiceSubjectCard";
import useExam from "@/hooks/exam/useExam";

export interface SelectedSubjectItem {
    name: string;
    displayName: string;
}

export interface PracticeConfig {
    subject: SubjectCardData | null;
    subjectName: string;
    subjectDisplayName: string;
    subjects: SelectedSubjectItem[];
    examType: string;
    year: string;
    school: string;
    questionCount: number;
    questionsPerSubject?: number;
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
    onStartPractice?: (config: PracticeConfig) => void | Promise<void>;
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
const QUESTION_OPTIONS = [10, 20, 40, 60, 100];

export const getRecommendedTime = (questions: number) => {
    switch (questions) {
        case 10:
            return { hours: 0, minutes: 5, seconds: 0 };
        case 20:
            return { hours: 0, minutes: 10, seconds: 0 };
        case 40:
            return { hours: 0, minutes: 20, seconds: 0 };
        case 60:
            return { hours: 0, minutes: 30, seconds: 0 };
        case 100:
            return { hours: 1, minutes: 0, seconds: 0 };
        default: {
            const totalMinutes = Math.round(questions * 0.5);
            return {
                hours: Math.floor(totalMinutes / 60),
                minutes: totalMinutes % 60,
                seconds: 0,
            };
        }
    }
};

export default function StartPracticeModal({
    isOpen,
    onClose,
    subject: propSubject = null,
    initialExamType,
    onStartPractice,
}: StartPracticeModalProps) {
    const router = useRouter();
    const { useGetSubject, checkMultiSubjectQuestions } = useExam();
    const { data: subjectsData, isLoading: isSubjectsLoading } = useGetSubject();

    const [step, setStep] = useState<ModalStep>("subject");

    // Form states
    const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubjectItem[]>([
        { name: "english", displayName: "English Language" },
    ]);
    const [selectedExamType, setSelectedExamType] = useState<string>("UTME");
    const [selectedYear, setSelectedYear] = useState<string>("2020");
    const [selectedSchool, setSelectedSchool] = useState<string>("Obafemi Awolowo University");
    const [questionCount, setQuestionCount] = useState<number>(20);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(10);
    const [seconds, setSeconds] = useState<number>(0);
    const [timeTab, setTimeTab] = useState<"recommended" | "custom">("recommended");
    const [hoursInput, setHoursInput] = useState<string>("00");
    const [minutesInput, setMinutesInput] = useState<string>("10");
    const [secondsInput, setSecondsInput] = useState<string>("00");
    const [started, setStarted] = useState<boolean>(false);
    const [isCheckingSubmit, setIsCheckingSubmit] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Dropdown open states
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const [isExamTypeDropdownOpen, setIsExamTypeDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);

    const subjectDropdownRef = useRef<HTMLDivElement>(null);
    const examTypeDropdownRef = useRef<HTMLDivElement>(null);
    const yearDropdownRef = useRef<HTMLDivElement>(null);
    const schoolDropdownRef = useRef<HTMLDivElement>(null);
    const wasOpenRef = useRef(false);

    // Subjects list from backend response
    const subjectsList = useMemo(() => {
        return subjectsData?.data?.subjects || [];
    }, [subjectsData?.data?.subjects]);

    const isUtmeExam = selectedExamType.trim().toLowerCase() === "utme";
    const requiredSubjectCount = isUtmeExam ? 4 : 1;
    const hasRequiredSubjects = selectedSubjects.length === requiredSubjectCount;
    const subjectCount = Math.max(1, selectedSubjects.length);
    const totalQuestionCount = questionCount * subjectCount;

    const selectedSubjectName = selectedSubjects[0]?.name || "english";
    const selectedSubjectDisplayName =
        selectedSubjects.length > 0
            ? selectedSubjects.map((s) => s.displayName).join(", ")
            : "Select Subject";

    // Keep input strings synchronized with numeric hours/minutes/seconds
    useEffect(() => {
        setHoursInput(String(hours).padStart(2, "0"));
        setMinutesInput(String(minutes).padStart(2, "0"));
        setSecondsInput(String(seconds).padStart(2, "0"));
    }, [hours, minutes, seconds]);

    // Synchronize initial selection when modal opens
    useEffect(() => {
        if (!isOpen) {
            wasOpenRef.current = false;
            return;
        }

        const isOpening = !wasOpenRef.current;
        wasOpenRef.current = true;

        if (isOpening) {
            setStep("subject");
            setQuestionCount(20);
            const defaultRec = getRecommendedTime(20);
            setHours(defaultRec.hours);
            setMinutes(defaultRec.minutes);
            setSeconds(defaultRec.seconds);
            setTimeTab("recommended");
            setHoursInput(String(defaultRec.hours).padStart(2, "0"));
            setMinutesInput(String(defaultRec.minutes).padStart(2, "0"));
            setSecondsInput(String(defaultRec.seconds).padStart(2, "0"));
            setIsSubjectDropdownOpen(false);
            setIsExamTypeDropdownOpen(false);
            setIsYearDropdownOpen(false);
            setIsSchoolDropdownOpen(false);
            setStarted(false);
            setIsCheckingSubmit(false);
            setSubmitError(null);

            let resolvedExam = "UTME";
            if (propSubject?.exam) {
                const matchedExam = EXAM_TYPE_OPTIONS.find(
                    (e) => e.toLowerCase() === propSubject.exam?.toLowerCase()
                );
                if (matchedExam) resolvedExam = matchedExam;
            } else if (initialExamType) {
                const cleanInit = initialExamType.toLowerCase();
                const matchedExam = EXAM_TYPE_OPTIONS.find(
                    (e) =>
                        e.toLowerCase() === cleanInit ||
                        (cleanInit === "jamb" && e.toLowerCase() === "utme") ||
                        (cleanInit.includes("post") && e.toLowerCase().includes("post"))
                );
                if (matchedExam) resolvedExam = matchedExam;
            }
            setSelectedExamType(resolvedExam);

            if (propSubject?.name) {
                const cleanName = propSubject.name.trim().toLowerCase();
                const matched = subjectsList.find(
                    (s) =>
                        s.name.toLowerCase() === cleanName ||
                        s.displayName.toLowerCase() === cleanName
                );
                if (matched) {
                    setSelectedSubjects([
                        { name: matched.name, displayName: matched.displayName },
                    ]);
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
                    setSelectedSubjects([
                        { name: slug, displayName: propSubject.name },
                    ]);
                }
            } else if (resolvedExam.toLowerCase() === "utme") {
                // For UTME, start empty or with first subject so user explicitly selects 4 subjects
                setSelectedSubjects([]);
            } else if (subjectsList.length > 0) {
                setSelectedSubjects([
                    {
                        name: subjectsList[0].name,
                        displayName: subjectsList[0].displayName,
                    },
                ]);
            }
        } else if (
            !propSubject?.name &&
            selectedSubjects.length === 0 &&
            selectedExamType.toLowerCase() !== "utme" &&
            subjectsList.length > 0
        ) {
            setSelectedSubjects([
                {
                    name: subjectsList[0].name,
                    displayName: subjectsList[0].displayName,
                },
            ]);
        }
    }, [isOpen, propSubject, initialExamType, subjectsList, selectedExamType, selectedSubjects.length]);

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

    const subjectTitle =
        isUtmeExam
            ? `UTME Practice (${selectedSubjects.length}/4)`
            : `${selectedSubjectDisplayName} Practice`;

    const isSchoolRequired = !["waec", "neco", "utme"].includes(selectedExamType.trim().toLowerCase());

    const handleToggleSubject = (sub: { name: string; displayName: string }) => {
        setSubmitError(null);
        if (!isUtmeExam) {
            setSelectedSubjects([{ name: sub.name, displayName: sub.displayName }]);
            setIsSubjectDropdownOpen(false);
            return;
        }

        setSelectedSubjects((prev) => {
            const exists = prev.some((item) => item.name === sub.name);
            if (exists) {
                return prev.filter((item) => item.name !== sub.name);
            }
            if (prev.length >= 4) {
                return prev;
            }
            const next = [...prev, { name: sub.name, displayName: sub.displayName }];
            if (next.length === 4) {
                setIsSubjectDropdownOpen(false);
            }
            return next;
        });
    };

    const handleExamTypeChange = (exam: string) => {
        setSubmitError(null);
        setSelectedExamType(exam);
        setIsExamTypeDropdownOpen(false);
        const nextIsUtme = exam.trim().toLowerCase() === "utme";
        if (!nextIsUtme) {
            setSelectedSubjects((prev) => {
                if (prev.length > 0) return [prev[0]];
                if (subjectsList.length > 0) {
                    return [
                        {
                            name: subjectsList[0].name,
                            displayName: subjectsList[0].displayName,
                        },
                    ];
                }
                return [{ name: "english", displayName: "English Language" }];
            });
        }
    };

    const handleBack = () => {
        setSubmitError(null);
        if (step === "subject") {
            onClose();
        } else if (step === "school") {
            setStep("subject");
        } else if (step === "questions") {
            setStep(isSchoolRequired ? "school" : "subject");
        } else if (step === "time") {
            setStep("questions");
        } else if (step === "summary") {
            setStep("time");
        }
    };

    const verifySubjectsAvailability = async (limitPerSubject: number): Promise<boolean> => {
        setSubmitError(null);
        setIsCheckingSubmit(true);

        try {
            const { hasQuestions, emptySubjects } = await checkMultiSubjectQuestions(
                selectedSubjects.map((s) => s.name),
                limitPerSubject,
                selectedYear,
                selectedExamType.toLowerCase()
            );

            if (!hasQuestions) {
                const missingLabels = emptySubjects.map((slug) => {
                    const found = selectedSubjects.find(
                        (s) => s.name.toLowerCase() === slug.toLowerCase()
                    );
                    return found?.displayName || slug;
                });
                setSubmitError(
                    `No questions available for ${missingLabels.join(", ")} (${selectedExamType} ${selectedYear}). Please choose another subject, exam type, or year.`
                );
                return false;
            }
            return true;
        } catch (err) {
            console.error("Failed to verify questions:", err);
            setSubmitError("Unable to verify questions from the server right now. Please try again.");
            return false;
        } finally {
            setIsCheckingSubmit(false);
        }
    };

    const handleContinue = async () => {
        if (step === "subject") {
            if (!hasRequiredSubjects || isCheckingSubmit) {
                return;
            }
            const available = await verifySubjectsAvailability(1);
            if (!available) {
                return;
            }
            setStep(isSchoolRequired ? "school" : "questions");
        } else if (step === "school") {
            setStep("questions");
        } else if (step === "questions") {
            const rec = getRecommendedTime(totalQuestionCount);
            setHours(rec.hours);
            setMinutes(rec.minutes);
            setSeconds(rec.seconds);
            setTimeTab("recommended");
            setStep("time");
        } else if (step === "time") {
            if (timeTab === "recommended") {
                const rec = getRecommendedTime(totalQuestionCount);
                setHours(rec.hours);
                setMinutes(rec.minutes);
                setSeconds(rec.seconds);
            }
            setSubmitError(null);
            setStep("summary");
        } else if (step === "summary") {
            if (!hasRequiredSubjects || started || isCheckingSubmit) {
                return;
            }

            const available = await verifySubjectsAvailability(questionCount);
            if (!available) {
                return;
            }

            setStarted(true);
            const practiceConfig: PracticeConfig = {
                subject: propSubject,
                subjectName: selectedSubjectName,
                subjectDisplayName: selectedSubjectDisplayName,
                subjects: selectedSubjects,
                examType: selectedExamType,
                year: selectedYear,
                school: isSchoolRequired ? selectedSchool : "",
                questionCount: totalQuestionCount,
                questionsPerSubject: questionCount,
                time: { hours, minutes, seconds },
            };

            if (onStartPractice) {
                try {
                    await onStartPractice(practiceConfig);
                } catch (err) {
                    setStarted(false);
                    setSubmitError("Unable to start practice session right now. Please try again.");
                }
            } else {
                setTimeout(() => {
                    onClose();
                    const params = new URLSearchParams({
                        subject: selectedSubjectName,
                        subjects: selectedSubjects.map((s) => s.name).join(","),
                        subjectTitle: selectedSubjectDisplayName,
                        type: selectedExamType.toLowerCase(),
                        year: selectedYear,
                        limit: String(totalQuestionCount),
                        perSubject: String(questionCount),
                        ...(isSchoolRequired && selectedSchool ? { school: selectedSchool } : {}),
                        hours: String(hours),
                        minutes: String(minutes),
                        seconds: String(seconds),
                    });
                    router.push(`/exams?${params.toString()}`);
                }, 500);
            }
        }
    };

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "");
        setHoursInput(val);
        if (val !== "") {
            const num = Math.min(12, Math.max(0, parseInt(val, 10)));
            setHours(num);
        }
    };

    const handleHoursBlur = () => {
        const num = Math.min(12, Math.max(0, parseInt(hoursInput, 10) || 0));
        setHours(num);
        setHoursInput(String(num).padStart(2, "0"));
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "");
        setMinutesInput(val);
        if (val !== "") {
            const num = Math.min(59, Math.max(0, parseInt(val, 10)));
            setMinutes(num);
        }
    };

    const handleMinutesBlur = () => {
        const num = Math.min(59, Math.max(0, parseInt(minutesInput, 10) || 0));
        setMinutes(num);
        setMinutesInput(String(num).padStart(2, "0"));
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "");
        setSecondsInput(val);
        if (val !== "") {
            const num = Math.min(59, Math.max(0, parseInt(val, 10)));
            setSeconds(num);
        }
    };

    const handleSecondsBlur = () => {
        const num = Math.min(59, Math.max(0, parseInt(secondsInput, 10) || 0));
        setSeconds(num);
        setSecondsInput(String(num).padStart(2, "0"));
    };

    const handleTimeKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        type: "hours" | "minutes" | "seconds"
    ) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (type === "hours") setHours((h) => Math.min(12, h + 1));
            if (type === "minutes") setMinutes((m) => Math.min(59, m + 1));
            if (type === "seconds") setSeconds((s) => (s < 59 ? s + 1 : 0));
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (type === "hours") setHours((h) => Math.max(0, h - 1));
            if (type === "minutes") setMinutes((m) => Math.max(0, m - 1));
            if (type === "seconds") setSeconds((s) => (s > 0 ? s - 1 : 59));
        }
    };

    const recommendedTime = getRecommendedTime(totalQuestionCount);
    const recHStr = String(recommendedTime.hours).padStart(2, "0");
    const recMStr = String(recommendedTime.minutes).padStart(2, "0");
    const recSStr = String(recommendedTime.seconds).padStart(2, "0");

    const summaryTimeText = (() => {
        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
        if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
        if (seconds > 0) parts.push(`${seconds} sec${seconds > 1 ? "s" : ""}`);
        return parts.length > 0 ? parts.join(" ") : "0 mins";
    })();

    if (!isOpen) return null;

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
                                {isUtmeExam
                                    ? "Select 4 subjects, exam category, and examination year for UTME"
                                    : "Choose your subject, exam category, and examination year"}
                            </p>
                        </div>

                        {/* Subject Select Dropdown */}
                        <div className="flex flex-col gap-1.5 relative" ref={subjectDropdownRef}>
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-neutral-700">
                                    {isUtmeExam ? "Select 4 Subjects *" : "Select Subject *"}
                                </label>
                                {isUtmeExam && (
                                    <span
                                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${selectedSubjects.length === 4
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-amber-50 text-amber-700 border border-amber-200"
                                            }`}
                                    >
                                        {selectedSubjects.length}/4 selected
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsSubjectDropdownOpen((prev) => !prev)}
                                className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-800 hover:border-neutral-400 flex items-center justify-between text-left transition-colors cursor-pointer shadow-xs"
                            >
                                <span className="truncate">
                                    {isSubjectsLoading
                                        ? "Loading subjects..."
                                        : isUtmeExam && selectedSubjects.length === 0
                                            ? "Choose 4 subjects..."
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

                            {/* Selected Subjects Chips for UTME */}
                            {isUtmeExam && selectedSubjects.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {selectedSubjects.map((sub) => (
                                        <span
                                            key={sub.name}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-300 border border-primary-100"
                                        >
                                            <span>{sub.displayName}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleSubject(sub)}
                                                className="hover:text-primary-500 cursor-pointer ml-0.5 leading-none font-bold"
                                                aria-label={`Remove ${sub.displayName}`}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Dropdown Options */}
                            {isSubjectDropdownOpen && (
                                <div className="absolute top-[72px] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1.5 z-40">
                                    {subjectsList.length > 0 ? (
                                        subjectsList.map((sub) => {
                                            const isSelected = selectedSubjects.some(
                                                (item) => item.name === sub.name
                                            );
                                            const isMaxReached =
                                                isUtmeExam && !isSelected && selectedSubjects.length >= 4;
                                            return (
                                                <button
                                                    key={sub.name}
                                                    type="button"
                                                    disabled={isMaxReached}
                                                    onClick={() => handleToggleSubject(sub)}
                                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${isSelected
                                                        ? "bg-primary-50 text-primary-300 font-semibold"
                                                        : isMaxReached
                                                            ? "text-neutral-400 opacity-50 cursor-not-allowed"
                                                            : "text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2.5 truncate">
                                                        {isUtmeExam && (
                                                            <span
                                                                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-[10px] ${isSelected
                                                                    ? "bg-primary-300 border-primary-300 text-white"
                                                                    : "border-neutral-300 bg-white"
                                                                    }`}
                                                            >
                                                                {isSelected ? "✓" : ""}
                                                            </span>
                                                        )}
                                                        <span className="truncate">{sub.displayName}</span>
                                                    </span>
                                                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 ml-2">
                                                        {sub.code || sub.category}
                                                    </span>
                                                </button>
                                            );
                                        })
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
                                                onClick={() => handleExamTypeChange(exam)}
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
                                                        setSubmitError(null);
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

                        {/* UTME 4-Subject Validation Feedback */}
                        {isUtmeExam && selectedSubjects.length < 4 && (
                            <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                                Please select {4 - selectedSubjects.length} more subject
                                {4 - selectedSubjects.length > 1 ? "s" : ""} for UTME ({selectedSubjects.length}/4 selected).
                            </p>
                        )}

                        {submitError && (
                            <div
                                role="alert"
                                className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
                            >
                                {submitError}
                            </div>
                        )}

                        {/* Continue Button */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={!hasRequiredSubjects || isCheckingSubmit}
                            className="w-full h-12 mt-1 bg-primary-300 hover:bg-primary-250 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCheckingSubmit ? "Checking Availability..." : "Continue"}
                        </button>
                    </div>
                )}

                {/* Step 2: Choose your school */}
                {step === "school" && isSchoolRequired && (
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
                                {subjectCount > 1
                                    ? `Choose how many questions you want to practice for each subject (${subjectCount} subjects selected)`
                                    : "Choose how many questions you want to practice"}
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
                                            <span className="text-xs text-neutral-500">
                                                {subjectCount > 1
                                                    ? `questions / subject (${count * subjectCount} total)`
                                                    : "questions"}
                                            </span>
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
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
                            Set Time
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm mt-1">
                            Since this is a practice session, you can either go with the recommended time or manually set how long you would like to practice for.
                        </p>

                        {/* Tabs: Recommended Time vs Set Time */}
                        <div className="flex items-center justify-center border-b border-neutral-100 mt-6 mb-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setTimeTab("recommended");
                                    const rec = getRecommendedTime(totalQuestionCount);
                                    setHours(rec.hours);
                                    setMinutes(rec.minutes);
                                    setSeconds(rec.seconds);
                                }}
                                className={`pb-2.5 px-4 sm:px-6 text-sm sm:text-base font-semibold transition-all relative cursor-pointer ${timeTab === "recommended"
                                    ? "text-primary-300"
                                    : "text-neutral-900 hover:text-neutral-600"
                                    }`}
                            >
                                Recommended Time
                                {timeTab === "recommended" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-300 rounded-full" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setTimeTab("custom")}
                                className={`pb-2.5 px-4 sm:px-6 text-sm sm:text-base font-semibold transition-all relative cursor-pointer ${timeTab === "custom"
                                    ? "text-primary-300"
                                    : "text-neutral-900 hover:text-neutral-600"
                                    }`}
                            >
                                Set Time
                                {timeTab === "custom" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-300 rounded-full" />
                                )}
                            </button>
                        </div>

                        {/* Tab Content */}
                        {timeTab === "recommended" ? (
                            /* Recommended Time Display (Image 1): No colons, clean display */
                            <div className="py-8 sm:py-10 flex items-center justify-center gap-4 sm:gap-6 text-neutral-900 select-none">
                                <div className="flex items-baseline">
                                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
                                        {recHStr}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-neutral-700 ml-1.5">
                                        hrs
                                    </span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
                                        {recMStr}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-neutral-700 ml-1.5">
                                        mins
                                    </span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
                                        {recSStr}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-neutral-700 ml-1.5">
                                        secs
                                    </span>
                                </div>
                            </div>
                        ) : (
                            /* Set Time Display (Image 2): Colons, editable inputs with subtle steppers */
                            <div className="py-6 sm:py-7 flex items-center justify-center gap-2 sm:gap-3 text-neutral-900 select-none">
                                {/* Hours */}
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => setHours((h) => Math.min(12, h + 1))}
                                        className="text-neutral-400 hover:text-primary-300 p-0.5 transition-colors cursor-pointer"
                                        title="Increase hours"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="18 15 12 9 6 15" />
                                        </svg>
                                    </button>
                                    <div className="flex items-baseline">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={2}
                                            value={hoursInput}
                                            onChange={handleHoursChange}
                                            onBlur={handleHoursBlur}
                                            onKeyDown={(e) => handleTimeKeyDown(e, "hours")}
                                            onFocus={(e) => e.target.select()}
                                            className="w-13 sm:w-15 text-center text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 bg-neutral-50/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-primary-300 focus:ring-2 focus:ring-primary-100 rounded-xl py-0.5 transition-all outline-none"
                                        />
                                        <span className="text-xs sm:text-sm font-medium text-neutral-700 ml-1">
                                            hrs
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setHours((h) => Math.max(0, h - 1))}
                                        className="text-neutral-400 hover:text-primary-300 p-0.5 transition-colors cursor-pointer"
                                        title="Decrease hours"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                </div>

                                <span className="text-2xl sm:text-3xl font-light text-neutral-900 mx-1 sm:mx-2 -mt-1">
                                    :
                                </span>

                                {/* Minutes */}
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => setMinutes((m) => Math.min(59, m + 1))}
                                        className="text-neutral-400 hover:text-primary-300 p-0.5 transition-colors cursor-pointer"
                                        title="Increase minutes"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="18 15 12 9 6 15" />
                                        </svg>
                                    </button>
                                    <div className="flex items-baseline">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={2}
                                            value={minutesInput}
                                            onChange={handleMinutesChange}
                                            onBlur={handleMinutesBlur}
                                            onKeyDown={(e) => handleTimeKeyDown(e, "minutes")}
                                            onFocus={(e) => e.target.select()}
                                            className="w-13 sm:w-15 text-center text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 bg-neutral-50/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-primary-300 focus:ring-2 focus:ring-primary-100 rounded-xl py-0.5 transition-all outline-none"
                                        />
                                        <span className="text-xs sm:text-sm font-medium text-neutral-700 ml-1">
                                            mins
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setMinutes((m) => Math.max(0, m - 1))}
                                        className="text-neutral-400 hover:text-primary-300 p-0.5 transition-colors cursor-pointer"
                                        title="Decrease minutes"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                </div>

                                <span className="text-2xl sm:text-3xl font-light text-neutral-900 mx-1 sm:mx-2 -mt-1">
                                    :
                                </span>

                                {/* Seconds */}
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => setSeconds((s) => (s < 59 ? s + 1 : 0))}
                                        className="text-neutral-400 hover:text-primary-300 p-0.5 transition-colors cursor-pointer"
                                        title="Increase seconds"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="18 15 12 9 6 15" />
                                        </svg>
                                    </button>
                                    <div className="flex items-baseline">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={2}
                                            value={secondsInput}
                                            onChange={handleSecondsChange}
                                            onBlur={handleSecondsBlur}
                                            onKeyDown={(e) => handleTimeKeyDown(e, "seconds")}
                                            onFocus={(e) => e.target.select()}
                                            className="w-13 sm:w-15 text-center text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 bg-neutral-50/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-primary-300 focus:ring-2 focus:ring-primary-100 rounded-xl py-0.5 transition-all outline-none"
                                        />
                                        <span className="text-xs sm:text-sm font-medium text-neutral-700 ml-1">
                                            secs
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSeconds((s) => (s > 0 ? s - 1 : 59))}
                                        className="text-neutral-400 hover:text-primary-300 p-0.5 transition-colors cursor-pointer"
                                        title="Decrease seconds"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Continue Button */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="w-full h-13 mt-6 bg-primary-300 hover:bg-primary-250 text-white rounded-2xl font-semibold text-base transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs"
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
                            <div className="flex justify-between items-start gap-4 text-sm">
                                <span className="text-neutral-500 font-medium shrink-0">
                                    {isUtmeExam ? "Subjects (4)" : "Subject"}
                                </span>
                                <span className="text-neutral-900 font-bold text-right">
                                    {selectedSubjectDisplayName}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Exam Type & Year</span>
                                <span className="text-neutral-900 font-bold">{selectedExamType} ({selectedYear})</span>
                            </div>

                            {isSchoolRequired && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-500 font-medium">School / Institution</span>
                                    <span className="text-neutral-900 font-bold truncate max-w-[200px]">{selectedSchool}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Questions</span>
                                <span className="text-neutral-900 font-bold text-right">
                                    {subjectCount > 1
                                        ? `${questionCount} / subject (${totalQuestionCount} total)`
                                        : `${questionCount} questions`}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-neutral-500 font-medium">Time Limit</span>
                                <span className="text-neutral-900 font-bold">{summaryTimeText}</span>
                            </div>
                        </div>

                        {submitError && (
                            <div
                                role="alert"
                                className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
                            >
                                {submitError}
                            </div>
                        )}

                        {/* Start Practicing Button */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={started || isCheckingSubmit || !hasRequiredSubjects}
                            className="w-full h-12 mt-2 bg-primary-300 hover:bg-primary-250 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCheckingSubmit
                                ? "Checking Questions..."
                                : started
                                    ? "Starting Practice Session..."
                                    : "Start Practicing"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
