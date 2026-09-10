

"use client";

import React, { useState } from "react";
import {
    CurriculumCard,
    ExamHistoryTable,
    StartMockExamModal,
    MockExamAnalysisView,
    MOCK_CURRICULUMS,
    MOCK_HISTORY,
    MOCK_ANALYSIS_DATA,
    ExamCurriculum,
    ExamHistoryItem,
    ExamAnalysisData,
} from "@/components/feature";

export default function MockExamsPage() {
    const [selectedCurriculum, setSelectedCurriculum] =
        useState<ExamCurriculum | null>(null);
    const [activeAnalysis, setActiveAnalysis] =
        useState<ExamAnalysisData | null>(null);

    const handleStartExam = (curriculum: ExamCurriculum) => {
        setSelectedCurriculum(curriculum);
    };

    const handleViewAnalysis = (item: ExamHistoryItem) => {
        const analysisData =
            MOCK_ANALYSIS_DATA[item.examCode] || MOCK_ANALYSIS_DATA["JAMB"];
        setActiveAnalysis(analysisData);
    };

    // If an analysis view is active (Screenshots 4 & 5)
    if (activeAnalysis) {
        return (
            <MockExamAnalysisView
                analysis={activeAnalysis}
                onBack={() => setActiveAnalysis(null)}
            />
        );
    }

    // Main Mock Exams View (Screenshot 1)
    return (
        <div className="w-full flex flex-col gap-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn">
            {/* Active Exam Curriculums Section */}
            <section className="w-full flex flex-col gap-4">
                <h2 className="text-xl font-bold text-neutral-900">
                    Active Exam Curriculums
                </h2>

                {/* Grid: 3 columns on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {MOCK_CURRICULUMS.map((curriculum) => (
                        <CurriculumCard
                            key={curriculum.id}
                            curriculum={curriculum}
                            onStartExam={handleStartExam}
                        />
                    ))}
                </div>
            </section>

            {/* Recent Exam History Table */}
            <ExamHistoryTable
                items={MOCK_HISTORY}
                onViewAnalysis={handleViewAnalysis}
            />

            {/* Start Exam Modal (Screenshots 2 & 3) */}
            <StartMockExamModal
                isOpen={Boolean(selectedCurriculum)}
                onClose={() => setSelectedCurriculum(null)}
                curriculum={selectedCurriculum}
            />
        </div>
    );
}