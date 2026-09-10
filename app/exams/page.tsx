

"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    ExamHeader,
    QuestionNavigator,
    QuestionRenderer,
    ExamSummaryModal,
    MOCK_EXAM_QUESTIONS,
    QuestionStatus,
} from "@/components/feature";

function ExamContent() {
    const searchParams = useSearchParams();
    const subjectParam = searchParams.get("subject") || "Mathematics";

    const questions = MOCK_EXAM_QUESTIONS;

    // Start at question 7 (index 6) to match the screenshots, or default to 0
    const [currentIndex, setCurrentIndex] = useState<number>(6);

    // Initial answers map
    const [answers, setAnswers] = useState<Record<number, string>>({
        0: "C",
        1: "A",
        2: "B",
        3: "A",
        // index 6 has option B selected in Screenshot 3
        6: "B",
    });

    // Initial statuses matching mockups (1-4 answered, 5-6 skipped, 7 current)
    const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({
        0: "answered",
        1: "answered",
        2: "answered",
        3: "answered",
        4: "skipped",
        5: "skipped",
        6: "answered",
    });

    const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

    const currentQuestion = questions[currentIndex] || questions[0];

    // Determine subject display title
    const displaySubjectTitle =
        currentQuestion.type === "comprehension" || currentQuestion.type === "essay"
            ? "English Language Practice"
            : `${subjectParam} Practice`;

    const handleSelectOption = (optionId: string) => {
        setAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
        setStatuses((prev) => ({ ...prev, [currentIndex]: "answered" }));
    };

    const handleChangeEssay = (text: string) => {
        setAnswers((prev) => ({ ...prev, [currentIndex]: text }));
        setStatuses((prev) => ({
            ...prev,
            [currentIndex]: text.trim() ? "answered" : "unanswered",
        }));
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSkip = () => {
        setStatuses((prev) => ({ ...prev, [currentIndex]: "skipped" }));
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleSaveAndNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setIsSummaryOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#EEF3FA] flex flex-col">
            {/* Exam Header */}
            <ExamHeader
                subjectTitle={displaySubjectTitle}
                initialSeconds={40 * 60 + 17}
                onEndSession={() => setIsSummaryOpen(true)}
            />

            {/* Main Exam Body */}
            <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start">
                {/* Question Area (Left / Center) */}
                <QuestionRenderer
                    question={currentQuestion}
                    selectedAnswer={answers[currentIndex]}
                    essayAnswer={answers[currentIndex] || ""}
                    onSelectOption={handleSelectOption}
                    onChangeEssay={handleChangeEssay}
                    onPrevious={handlePrevious}
                    onSkip={handleSkip}
                    onSaveAndNext={handleSaveAndNext}
                    isFirst={currentIndex === 0}
                    isLast={currentIndex === questions.length - 1}
                />

                {/* Question Navigator Sidebar (Right) */}
                <QuestionNavigator
                    totalQuestions={questions.length}
                    currentIndex={currentIndex}
                    statuses={statuses}
                    onSelectQuestion={(idx) => setCurrentIndex(idx)}
                />
            </main>

            {/* End Session Summary Modal */}
            <ExamSummaryModal
                isOpen={isSummaryOpen}
                onClose={() => setIsSummaryOpen(false)}
                subjectTitle={subjectParam || "Mathematics"}
                score={72}
                totalScore={100}
                prepPoints={20}
            />
        </div>
    );
}

export default function ExamPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#EEF3FA] flex items-center justify-center">
                    <p className="text-neutral-500 font-medium">Loading practice session...</p>
                </div>
            }
        >
            <ExamContent />
        </Suspense>
    );
}