
"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    MockExamHeader,
    RulesOfEngagementCard,
    MockExamResultModal,
    MockExamResultData,
} from "@/components/feature";
import {
    formatMockSubjectLabel,
    getRealMockExamBreakdown,
    MockExamTypeLabel,
    MockSubjectSelection,
} from "@/components/feature/dashboard/mockExams/mockExamTypes";

function MockExamContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawExam = (searchParams.get("exam") || "JAMB").trim();
    const cleanExamParam = rawExam.replace(/[_-]+/g, " ").toUpperCase();
    const subjectParam = searchParams.get("subject") || "";
    const subjectsParam = searchParams.get("subjects") || "";
    const subjectTitlesParam = searchParams.get("subjectTitles") || "";
    const yearParam = searchParams.get("year") || "2024";

    const validExam: MockExamTypeLabel =
        cleanExamParam === "WAEC" || cleanExamParam === "NECO"
            ? (cleanExamParam as "WAEC" | "NECO")
            : cleanExamParam.includes("POST")
            ? "POST UTME"
            : "JAMB";

    const selectedSubjects: MockSubjectSelection[] = useMemo(() => {
        const slugs = subjectsParam
            ? subjectsParam
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
            : subjectParam
            ? [subjectParam.trim()]
            : [];

        const titles = subjectTitlesParam
            ? subjectTitlesParam.split(",").map((s) => s.trim())
            : [];

        if (slugs.length > 0) {
            return slugs.map((slug, idx) => ({
                name: slug,
                displayName: titles[idx] || formatMockSubjectLabel(slug),
            }));
        }

        if (validExam === "JAMB") {
            return [
                { name: "english", displayName: "Use of English" },
                { name: "mathematics", displayName: "Mathematics" },
                { name: "physics", displayName: "Physics" },
                { name: "chemistry", displayName: "Chemistry" },
            ];
        }

        return [{ name: "english", displayName: "English Language" }];
    }, [subjectsParam, subjectTitlesParam, subjectParam, validExam]);

    const { subjects: breakdownSubjects, totalQuestions, durationMinutes } = useMemo(
        () => getRealMockExamBreakdown(validExam, selectedSubjects),
        [validExam, selectedSubjects]
    );

    const [activeResult, setActiveResult] = useState<MockExamResultData | null>(null);

    const handleStartExam = () => {
        const subjectSlugs = breakdownSubjects.map((s) => s.name.toLowerCase()).join(",");
        const subjectLimits = breakdownSubjects
            .map((s) => `${s.name.toLowerCase()}:${s.questionCount}`)
            .join(",");
        const primarySubject = breakdownSubjects[0]?.name.toLowerCase() || "english";
        const examTypeSlug =
            validExam === "JAMB"
                ? "utme"
                : validExam.toLowerCase().replace(/\s+/g, "-");
        const subjectTitle =
            breakdownSubjects.length > 1
                ? `${validExam} Mock (${breakdownSubjects.map((s) => s.displayName).join(", ")})`
                : `${breakdownSubjects[0]?.displayName || validExam} Mock`;

        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        router.push(
            `/exams?subject=${encodeURIComponent(
                primarySubject
            )}&subjects=${encodeURIComponent(
                subjectSlugs
            )}&subjectLimits=${encodeURIComponent(
                subjectLimits
            )}&subjectTitle=${encodeURIComponent(
                subjectTitle
            )}&type=${encodeURIComponent(
                examTypeSlug
            )}&year=${encodeURIComponent(
                yearParam
            )}&limit=${encodeURIComponent(
                String(totalQuestions)
            )}&hours=${encodeURIComponent(
                String(hours)
            )}&minutes=${encodeURIComponent(
                String(minutes)
            )}&seconds=0&mock=true`
        );
    };

    return (
        <div className="min-h-screen bg-[#EEF3FA] flex flex-col">
            {/* Header */}
            <MockExamHeader
                title={`${validExam} Mock Exam`}
                onStartExam={handleStartExam}
            />

            {/* Rules of Engagement Card Content */}
            <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
                <RulesOfEngagementCard
                    exam={validExam}
                    subjects={breakdownSubjects}
                    year={yearParam}
                    totalQuestions={totalQuestions}
                    durationMinutes={durationMinutes}
                    onStartExam={handleStartExam}
                />

                {/* Optional Result Preview bar for quick inspection of Screenshot 1 modals */}
                <div className="mt-8 flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-neutral-200 px-4 py-2 rounded-2xl text-xs text-neutral-600 shadow-xs">
                    <span className="font-semibold text-neutral-700">Preview 24hr Results:</span>
                    <button
                        type="button"
                        onClick={() =>
                            setActiveResult({
                                status: "positive",
                                examTitle: `${validExam} Exam`,
                                score: 288,
                                totalScore: 400,
                                prepPoints: 120,
                            })
                        }
                        className="text-[#10B981] font-bold hover:underline cursor-pointer"
                    >
                        Passed Result (288/400)
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                        type="button"
                        onClick={() =>
                            setActiveResult({
                                status: "negative",
                                examTitle: `${validExam} Exam`,
                                score: 150,
                                totalScore: 400,
                                prepPoints: 50,
                            })
                        }
                        className="text-[#EF4444] font-bold hover:underline cursor-pointer"
                    >
                        Tried Best Result (150/400)
                    </button>
                </div>
            </main>

            {/* Post-Exam Result Modal (Screenshot 1) */}
            {activeResult && (
                <MockExamResultModal
                    isOpen={Boolean(activeResult)}
                    onClose={() => setActiveResult(null)}
                    result={activeResult}
                />
            )}
        </div>
    );
}

export default function MockExamsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#EEF3FA] flex items-center justify-center">
                    <p className="text-neutral-500 font-medium">Loading simulation...</p>
                </div>
            }
        >
            <MockExamContent />
        </Suspense>
    );
}
