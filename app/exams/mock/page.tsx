
"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    MockExamHeader,
    RulesOfEngagementCard,
    MockExamResultModal,
    MockExamResultData,
} from "@/components/feature";
import useExam from "@/hooks/exam/useExam";

function MockExamContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const examParam = (searchParams.get("exam") || "JAMB").toUpperCase();
    const subjectParam = searchParams.get("subject") || "English Language";
    const yearParam = searchParams.get("year") || "2024";

    const { useGetQuestion } = useExam()

    const { data } = useGetQuestion(subjectParam, "50", yearParam, examParam)

    console.log(data)

    const validExam =
        examParam === "WAEC" || examParam === "NECO" || examParam === "POST UTME"
            ? examParam
            : "JAMB";

    const [activeResult, setActiveResult] = useState<MockExamResultData | null>(null);

    const handleStartExam = () => {
        // Navigate to the actual exam questions session
        router.push(`/exams?subject=${encodeURIComponent(validExam === "WAEC" ? "English Language" : "Mathematics")}&exam=${encodeURIComponent(validExam)}&mock=true`);
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
