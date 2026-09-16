"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CustomText } from "@/components/ui";
import { EmptyState } from "@/components/common";
import PracticeSubjectCard, { SubjectCardData } from "./practiceSubjectCard";
import { useDashboardExam } from "../dashboardContext";
import useExam from "@/hooks/exam/useExam";
import useUser from "@/hooks/useUser";

// Mock base subjects matching the visual screenshot
const DEFAULT_SUBJECTS: SubjectCardData[] = [
    // Row 1 (JAMB)
    { id: 1, name: "Mathematics", letter: "M", percent: 0, exam: "JAMB" },
    { id: 2, name: "English Language", letter: "E", percent: 0, exam: "JAMB" },
    { id: 3, name: "Biology", letter: "B", percent: 0, exam: "JAMB" },
    { id: 4, name: "Physics", letter: "P", percent: 0, exam: "JAMB" },

    // Row 2 (WAEC)
    { id: 5, name: "Mathematics", letter: "M", percent: 0, exam: "WAEC" },
    { id: 6, name: "English Language", letter: "E", percent: 0, exam: "WAEC" },
    { id: 7, name: "Biology", letter: "B", percent: 0, exam: "WAEC" },
    { id: 8, name: "Physics", letter: "P", percent: 0, exam: "WAEC" },

    // Row 3 (POST-UTME & NECO)
    { id: 9, name: "Mathematics", letter: "M", percent: 0, exam: "POST-UTME" },
    { id: 10, name: "English Language", letter: "E", percent: 0, exam: "POST-UTME" },
    { id: 11, name: "Biology", letter: "B", percent: 0, exam: "NECO" },
    { id: 12, name: "Physics", letter: "P", percent: 0, exam: "NECO" },
];

const EXAM_OPTIONS = ["All Exams", "JAMB", "WAEC", "POST-UTME", "NECO"];

export interface ActiveExamSession {
    id: string;
    subject: string;
    subjectTitle: string;
    exam_type: string;
    exam_year: string;
    total_question: number;
    total_questions_answered: number;
    total_score: number;
    percent: number;
    updated_at: string;
}

interface PracticeHubProps {
    onStartPractice?: (subject: SubjectCardData) => void;
}

// Helpers for subject and exam matching
const formatSubjectName = (name: string): string => {
    const raw = (name || "").trim().toLowerCase();
    if (raw === "english" || raw === "use-of-english" || raw === "english language") {
        return "English Language";
    }
    if (raw === "mathematics" || raw === "general-mathematics" || raw === "math") {
        return "Mathematics";
    }
    if (raw === "physics") return "Physics";
    if (raw === "chemistry") return "Chemistry";
    if (raw === "biology") return "Biology";
    return name.charAt(0).toUpperCase() + name.slice(1);
};

const normalizeSubjectKey = (name: string): string => {
    const raw = (name || "").trim().toLowerCase();
    if (raw.includes("english")) return "english";
    if (raw.includes("math")) return "mathematics";
    if (raw.includes("bio")) return "biology";
    if (raw.includes("phys")) return "physics";
    if (raw.includes("chem")) return "chemistry";
    return raw;
};

const normalizeExamKey = (exam: string): string => {
    const raw = (exam || "").trim().toLowerCase();
    if (raw === "utme" || raw === "jamb") return "jamb";
    if (raw === "waec") return "waec";
    if (raw === "neco") return "neco";
    if (raw.includes("post")) return "post-utme";
    return raw;
};

export default function PracticeHub({ onStartPractice }: PracticeHubProps = {}) {
    const router = useRouter();
    const { selectedExam: navbarExam, selectedExamName: navbarExamName } = useDashboardExam();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedExam, setSelectedExam] = useState(navbarExamName || "JAMB");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Synchronize local filter with navbar selection so the selected exam is seen first
    useEffect(() => {
        setSelectedExam(navbarExamName);
    }, [navbarExamName]);

    // Fetch user profile and examinations from backend GET /examination
    const { useGetUserExaminations } = useExam();
    const { useGetProfile } = useUser();
    const { data: userProfile } = useGetProfile();

    const userId =
        userProfile?.data?.id ||
        (typeof window !== "undefined" ? localStorage.getItem("prepforauserid") : null) ||
        undefined;

    const {
        data: examinationsResponse,
        isLoading: isExamsLoading,
    } = useGetUserExaminations({
        user_id: userId,
    });

    // Local state for cached recent examinations
    const [localExams, setLocalExams] = useState<ActiveExamSession[]>([]);

    useEffect(() => {
        try {
            const key = "prepfora_recent_examinations";
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setLocalExams(parsed);
                }
            }
        } catch (e) {
            console.error("Failed to load local examinations:", e);
        }
    }, []);

    // Combine backend and local examinations
    const allExaminations = useMemo<ActiveExamSession[]>(() => {
        const examMap = new Map<string, ActiveExamSession>();

        // 1. Add local exams first
        localExams.forEach((item) => {
            if (item && item.id) {
                examMap.set(item.id, {
                    ...item,
                    subjectTitle: item.subjectTitle || formatSubjectName(item.subject),
                });
            }
        });

        // 2. Merge backend API exams (GET /examination)
        const rawData = examinationsResponse?.data;
        const apiList = Array.isArray(rawData)
            ? rawData
            : Array.isArray((rawData as any)?.items)
                ? (rawData as any).items
                : [];

        if (Array.isArray(apiList)) {
            apiList.forEach((item) => {
                if (item && item.id) {
                    const primarySubject = item.subjects?.[0] || "english";
                    const totalQ = item.total_question || 20;
                    const answeredQ = item.total_questions_answered || 0;
                    const pct = totalQ > 0 ? Math.min(100, Math.round((answeredQ / totalQ) * 100)) : 0;
                    const existing = examMap.get(item.id);

                    examMap.set(item.id, {
                        id: item.id,
                        subject: primarySubject,
                        subjectTitle: existing?.subjectTitle || formatSubjectName(primarySubject),
                        exam_type: item.exam_type || "utme",
                        exam_year: item.exam_year || "2024",
                        total_question: totalQ,
                        total_questions_answered: Math.max(answeredQ, existing?.total_questions_answered || 0),
                        total_score: item.total_score ?? existing?.total_score ?? 0,
                        percent: Math.max(pct, existing?.percent || 0),
                        updated_at: item.updated_at || item.created_at || new Date().toISOString(),
                    });
                }
            });
        }

        return Array.from(examMap.values()).sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
    }, [localExams, examinationsResponse]);

    // Sessions filtered specifically for the navbar-selected exam
    const currentExamSessions = useMemo(() => {
        return allExaminations.filter(
            (session) => normalizeExamKey(session.exam_type) === normalizeExamKey(navbarExam)
        );
    }, [allExaminations, navbarExam]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Merge examinations onto default subject cards
    const subjectsWithProgress: SubjectCardData[] = useMemo(() => {
        return DEFAULT_SUBJECTS.map((subject) => {
            const normalizedCardSubject = normalizeSubjectKey(subject.name);
            const normalizedCardExam = normalizeExamKey(subject.exam || "");

            // Look for matching active exam
            const matchingExam = allExaminations.find((ex) => {
                const subMatch = normalizeSubjectKey(ex.subject) === normalizedCardSubject;
                const examMatch = normalizeExamKey(ex.exam_type) === normalizedCardExam;
                return subMatch && examMatch;
            });

            if (matchingExam) {
                return {
                    ...subject,
                    percent: matchingExam.percent,
                    examinationId: matchingExam.id,
                    year: matchingExam.exam_year,
                    totalQuestion: matchingExam.total_question,
                    totalAnswered: matchingExam.total_questions_answered,
                };
            }

            return subject;
        });
    }, [allExaminations]);

    // Sort subjects so that the navbar-selected exam is what they see first
    const sortedSubjects = useMemo(() => {
        return [...subjectsWithProgress].sort((a, b) => {
            const aMatches = normalizeExamKey(a.exam || "") === normalizeExamKey(navbarExam);
            const bMatches = normalizeExamKey(b.exam || "") === normalizeExamKey(navbarExam);
            if (aMatches && !bMatches) return -1;
            if (!aMatches && bMatches) return 1;
            return 0;
        });
    }, [subjectsWithProgress, navbarExam]);

    // Filter logic
    const filteredSubjects = useMemo(() => {
        return sortedSubjects.filter((subject) => {
            const matchesSearch =
                subject.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                (subject.exam && subject.exam.toLowerCase().includes(searchQuery.toLowerCase().trim()));
            const matchesExam =
                selectedExam === "All Exams" ||
                normalizeExamKey(subject.exam || "") === normalizeExamKey(selectedExam);
            return matchesSearch && matchesExam;
        });
    }, [sortedSubjects, searchQuery, selectedExam]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedExam("All Exams");
    };

    // Continue or resume practice handler
    const handleContinuePractice = (subject: SubjectCardData) => {
        if (subject.examinationId) {
            // Directly resume the exam session
            const subName = normalizeSubjectKey(subject.name);
            const examType = (subject.exam || "utme").toLowerCase();
            const year = subject.year || "2024";
            const limit = subject.totalQuestion || 20;

            router.push(
                `/exams?examinationId=${subject.examinationId}&subject=${encodeURIComponent(
                    subName
                )}&subjectTitle=${encodeURIComponent(subject.name)}&type=${encodeURIComponent(
                    examType
                )}&year=${encodeURIComponent(year)}&limit=${limit}`
            );
            return;
        }

        if (onStartPractice) {
            onStartPractice(subject);
        } else {
            router.push(
                `/exams?subject=${encodeURIComponent(
                    normalizeSubjectKey(subject.name)
                )}&subjectTitle=${encodeURIComponent(subject.name)}&type=${encodeURIComponent(
                    (subject.exam || "utme").toLowerCase()
                )}&limit=20`
            );
        }
    };

    const handleResumeDirect = (session: ActiveExamSession) => {
        const subName = normalizeSubjectKey(session.subject);
        const examType = session.exam_type.toLowerCase();
        const year = session.exam_year || "2024";
        const limit = session.total_question || 20;

        router.push(
            `/exams?examinationId=${session.id}&subject=${encodeURIComponent(
                subName
            )}&subjectTitle=${encodeURIComponent(session.subjectTitle)}&type=${encodeURIComponent(
                examType
            )}&year=${encodeURIComponent(year)}&limit=${limit}`
        );
    };

    return (
        <section className="w-full flex flex-col gap-6 mt-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <CustomText type="headline-sm" className="text-neutral-900 font-bold">
                    My Practice Hub
                </CustomText>
                {isExamsLoading && (
                    <span className="text-xs text-neutral-400 animate-pulse">
                        Syncing examinations...
                    </span>
                )}
            </div>

            {/* Exams Done / In-Progress Practice Sessions */}
            {currentExamSessions.length > 0 ? (
                <div className="w-full bg-gradient-to-r from-primary-50/70 via-white to-blue-50/50 border border-primary-100 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse" />
                            <h3 className="font-bold text-base sm:text-lg text-neutral-900">
                                {navbarExamName} Exams Done &amp; In Progress
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-400 text-xs font-bold">
                                {currentExamSessions.length} {currentExamSessions.length === 1 ? "Exam" : "Exams"}
                            </span>
                        </div>
                        <span className="text-xs text-neutral-500 hidden sm:inline-block">
                            Your answered questions and scores are saved in real-time.
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentExamSessions.slice(0, 3).map((session) => (
                            <div
                                key={session.id}
                                className="bg-white border border-[#E2EAF4] hover:border-primary-300 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-xs hover:shadow-sm transition-all duration-200"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#FCE8D3] flex items-center justify-center flex-shrink-0">
                                            <span className="text-[#7A3F14] font-bold text-sm select-none">
                                                {session.subjectTitle.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-neutral-900 line-clamp-1">
                                                {session.subjectTitle}
                                            </span>
                                            <span className="text-xs text-neutral-500 font-medium">
                                                {session.exam_type.toUpperCase()}{" "}
                                                {session.exam_year ? `• ${session.exam_year}` : ""}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="text-xs font-bold text-primary-400 bg-primary-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                                        {session.percent}%
                                    </span>
                                </div>

                                {/* Progress Bar & Answered Stats */}
                                <div className="w-full flex flex-col gap-1.5">
                                    <div className="flex justify-between text-xs text-neutral-500">
                                        <span>
                                            {session.total_questions_answered} of {session.total_question} questions answered
                                        </span>
                                        {session.percent === 100 && (
                                            <span className="text-emerald-600 font-medium text-xs">Completed</span>
                                        )}
                                    </div>
                                    <div className="w-full h-1.5 bg-[#EEF2F6] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary-300 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, Math.max(0, session.percent))}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Continue / Retake Button */}
                                <button
                                    type="button"
                                    onClick={() => handleResumeDirect(session)}
                                    className="w-full h-9 rounded-xl bg-primary-300 hover:bg-primary-400 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
                                >
                                    <span>{session.percent === 100 ? "Retake Practice" : "Resume Practice"}</span>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full bg-white border border-[#E2EAF4] rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col items-center justify-center min-h-[220px]">
                    <EmptyState
                        title={`No ${navbarExamName} exams done yet`}
                        description={`To help Prepfora calculate how well you are doing, start practicing ${navbarExamName} subjects.`}
                        btnText={`Start ${navbarExamName} Practice`}
                        onClick={() => {
                            const firstSub = sortedSubjects.find(
                                (s) => normalizeExamKey(s.exam || "") === normalizeExamKey(navbarExam)
                            ) || sortedSubjects[0];
                            if (firstSub) {
                                handleContinuePractice(firstSub);
                            }
                        }}
                    />
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full sm:w-[320px]">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none flex items-center">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Subjects"
                        className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-[#DCE4F0] rounded-xl placeholder:text-neutral-400 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all shadow-xs"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold cursor-pointer"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Right Controls: Filter by + Dropdown + Clear Filters */}
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <span className="text-sm font-medium text-neutral-600 whitespace-nowrap">
                        Filter by:
                    </span>

                    {/* Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            className="h-10 px-4 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-800 hover:border-neutral-400 transition-colors flex items-center gap-3 cursor-pointer shadow-xs min-w-[130px] justify-between"
                        >
                            <span>{selectedExam}</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`text-neutral-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                                    }`}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-20">
                                {EXAM_OPTIONS.map((exam) => (
                                    <button
                                        key={exam}
                                        type="button"
                                        onClick={() => {
                                            setSelectedExam(exam);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${selectedExam === exam
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

                    {/* Clear Filters */}
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="text-sm font-medium text-primary-300 hover:text-primary-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Subject Cards Grid */}
            {filteredSubjects.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredSubjects.map((subject) => (
                        <PracticeSubjectCard
                            key={`${subject.id}-${subject.exam}`}
                            subject={subject}
                            onContinue={handleContinuePractice}
                        />
                    ))}
                </div>
            ) : (
                <div className="w-full py-12 bg-white border border-[#E2EAF4] rounded-2xl flex flex-col items-center justify-center">
                    <EmptyState
                        title="No subjects found"
                        description="We couldn't find any subjects matching your current search or filter criteria."
                        btnText="Reset Filters"
                        onClick={handleClearFilters}
                    />
                </div>
            )}
        </section>
    );
}

