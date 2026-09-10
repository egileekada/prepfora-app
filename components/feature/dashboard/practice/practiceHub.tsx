"use client";

import React, { useState, useRef, useEffect } from "react";
import { CustomText } from "@/components/ui";
import PracticeSubjectCard, { SubjectCardData } from "./practiceSubjectCard";

// Mock subjects matching the visual screenshot
const DEFAULT_SUBJECTS: SubjectCardData[] = [
    // Row 1 (exact mockup)
    { id: 1, name: "Mathematics", letter: "M", percent: 0, exam: "JAMB" },
    { id: 2, name: "English Language", letter: "E", percent: 60, exam: "JAMB" },
    { id: 3, name: "Biology", letter: "B", percent: 95, exam: "JAMB" },
    { id: 4, name: "Physics", letter: "P", percent: 35, exam: "JAMB" },

    // Row 2 (exact mockup repetition)
    { id: 5, name: "Mathematics", letter: "M", percent: 0, exam: "WAEC" },
    { id: 6, name: "English Language", letter: "E", percent: 60, exam: "WAEC" },
    { id: 7, name: "Biology", letter: "B", percent: 95, exam: "WAEC" },
    { id: 8, name: "Physics", letter: "P", percent: 35, exam: "WAEC" },

    // Row 3 (continuation)
    { id: 9, name: "Mathematics", letter: "M", percent: 0, exam: "POST-UTME" },
    { id: 10, name: "English Language", letter: "E", percent: 60, exam: "POST-UTME" },
    { id: 11, name: "Biology", letter: "B", percent: 95, exam: "NECO" },
    { id: 12, name: "Physics", letter: "P", percent: 35, exam: "NECO" },
];

const EXAM_OPTIONS = ["All Exams", "JAMB", "WAEC", "POST-UTME", "NECO"];

interface PracticeHubProps {
    onStartPractice?: (subject: SubjectCardData) => void;
}

export default function PracticeHub({ onStartPractice }: PracticeHubProps = {}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedExam, setSelectedExam] = useState("All Exams");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter logic
    const filteredSubjects = DEFAULT_SUBJECTS.filter((subject) => {
        const matchesSearch = subject.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim());
        const matchesExam =
            selectedExam === "All Exams" || subject.exam === selectedExam;
        return matchesSearch && matchesExam;
    });

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedExam("All Exams");
    };

    const handleContinue = (subject: SubjectCardData) => {
        if (onStartPractice) {
            onStartPractice(subject);
        }
    };

    return (
        <section className="w-full flex flex-col gap-6 mt-6 pb-12">
            {/* Title */}
            <CustomText type="headline-sm" className="text-neutral-900 font-bold">
                My Practice Hub
            </CustomText>

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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
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
                                className={`text-neutral-500 transition-transform duration-200 ${
                                    isDropdownOpen ? "rotate-180" : ""
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
                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                                            selectedExam === exam
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
                            key={subject.id}
                            subject={subject}
                            onContinue={handleContinue}
                        />
                    ))}
                </div>
            ) : (
                <div className="w-full py-16 bg-white border border-[#E2EAF4] rounded-2xl flex flex-col items-center justify-center gap-3 text-center px-4">
                    <p className="text-base font-semibold text-neutral-800">
                        No subjects found
                    </p>
                    <p className="text-sm text-neutral-500 max-w-sm">
                        We couldn&apos;t find any subjects matching your current search or filter criteria.
                    </p>
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="mt-2 text-sm font-semibold text-primary-300 hover:underline cursor-pointer"
                    >
                        Reset filters
                    </button>
                </div>
            )}
        </section>
    );
}
