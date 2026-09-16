"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    ExamHeader,
    QuestionNavigator,
    QuestionRenderer,
    ExamSummaryModal,
    MOCK_EXAM_QUESTIONS,
    QuestionStatus,
    QuestionResult,
} from "@/components/feature";
import { ExamQuestion, Option } from "@/components/feature/exam/mockExamData";
import useExam from "@/hooks/exam/useExam";
import useUser from "@/hooks/useUser";
import { ICreateExaminationPayload, IUpdateExaminationPayload } from "@/types/exam";

function ExamContent() {
    const searchParams = useSearchParams();

    const existingExaminationId =
        searchParams.get("id") || searchParams.get("examinationId") || null;

    // Backend hooks
    const { useGetQuestion, createExamination, updateExamination, useGetExaminationById } = useExam();
    const { useGetProfile } = useUser();
    const { data: userProfile } = useGetProfile();

    const { data: existingExamResponse } = useGetExaminationById(
        existingExaminationId || undefined
    );

    // Query parameters from StartPracticeModal, URL, or backend examination
    const subjectParam = (
        searchParams.get("subject") ||
        existingExamResponse?.data?.subjects?.[0] ||
        "english"
    ).trim().toLowerCase();

    const rawSubjectTitle = searchParams.get("subjectTitle") || "";
    const subjectTitleParam =
        rawSubjectTitle ||
        `${subjectParam.charAt(0).toUpperCase() + subjectParam.slice(1)} Practice`;

    const typeParam = (
        searchParams.get("type") ||
        searchParams.get("exam") ||
        existingExamResponse?.data?.exam_type ||
        "utme"
    ).trim().toLowerCase();

    const yearParam =
        searchParams.get("year") ||
        existingExamResponse?.data?.exam_year ||
        "";

    const limitParam =
        searchParams.get("limit") ||
        (existingExamResponse?.data?.total_question
            ? String(existingExamResponse.data.total_question)
            : "20");

    const hoursParam = parseInt(searchParams.get("hours") || "0", 10);
    const minutesParam = parseInt(searchParams.get("minutes") || "20", 10);
    const secondsParam = parseInt(searchParams.get("seconds") || "0", 10);

    const initialTotalSeconds = hoursParam * 3600 + minutesParam * 60 + secondsParam || 1200;

    const {
        data: questionsResponse,
        isLoading: isQuestionsLoading,
        isError: isQuestionsError,
        refetch: refetchQuestions,
    } = useGetQuestion(subjectParam, limitParam, yearParam, typeParam);

    // Examination tracking
    const [examinationId, setExaminationId] = useState<string | null>(existingExaminationId);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isCreatingExamRef = useRef(false);

    // Helper to persist exam info for practice hub continuation
    const saveExamToStorage = (examData: {
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
    }) => {
        if (typeof window === "undefined") return;
        try {
            const key = "prepfora_recent_examinations";
            const stored = localStorage.getItem(key);
            const list = stored ? JSON.parse(stored) : [];
            const filtered = list.filter((item: any) => item.id !== examData.id);
            filtered.unshift(examData);
            localStorage.setItem(key, JSON.stringify(filtered.slice(0, 20)));
        } catch (e) {
            console.error("Failed to store recent exam:", e);
        }
    };

    // Map fetched backend question items to ExamQuestion[]
    const questions: ExamQuestion[] = useMemo(() => {
        const rawList = questionsResponse?.data?.data;
        if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
            return [];
        }

        return rawList.map((item, index) => {
            const optionsList: Option[] = [];
            if (item.option && typeof item.option === "object") {
                const optionKeys = ["a", "b", "c", "d", "e"] as const;
                optionKeys.forEach((key) => {
                    const val = item.option?.[key];
                    if (val && typeof val === "string" && val.trim()) {
                        optionsList.push({
                            id: key.toUpperCase() as "A" | "B" | "C" | "D",
                            text: val.trim(),
                        });
                    }
                });
            }

            const isComprehension = Boolean(item.hasPassage);

            return {
                id: typeof item.id === "number" ? item.id : Number(item.id) || index + 1,
                type: isComprehension ? "comprehension" : "multiple-choice",
                subject: subjectTitleParam,
                year: item.examyear || yearParam || undefined,
                prompt: item.question || "",
                topicSubtitle: item.section || undefined,
                options: optionsList.length > 0 ? optionsList : undefined,
                correctAnswer: (item.answer || "").trim().toUpperCase(),
                passageTitle: isComprehension ? (item.section || "Reading Comprehension") : undefined,
                passageCategory: isComprehension ? item.category : undefined,
                passageContent: isComprehension ? item.section : undefined,
            };
        });
    }, [questionsResponse, subjectTitleParam, yearParam]);

    // Active questions (fallback to MOCK if empty after load or error)
    const effectiveQuestions = useMemo(() => {
        if (questions.length > 0) return questions;
        if (!isQuestionsLoading) return MOCK_EXAM_QUESTIONS;
        return [];
    }, [questions, isQuestionsLoading]);

    // Navigation and Exam State
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
    const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

    // Restore existing examination progress & answers from backend (GET /examination/{id}) and local storage
    useEffect(() => {
        if (!existingExamResponse?.data) return;

        const examData = existingExamResponse.data;
        const examId = examData.id;

        if (examId && !examinationId) {
            setExaminationId(examId);
        }

        // 1. Read locally cached answers if available
        let restoredAnswers: Record<number, string> = {};
        if (typeof window !== "undefined" && examId) {
            try {
                const stored = localStorage.getItem(`prepfora_exam_answers_${examId}`);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && typeof parsed === "object") {
                        restoredAnswers = { ...parsed };
                    }
                }
            } catch (e) {
                console.error("Failed to parse cached exam answers:", e);
            }
        }

        // 2. Reconcile with backend data: correct_questions, failed_questions, total_questions_answered
        const correctList = (examData.correct_questions || []).map(String);
        const failedList = (examData.failed_questions || []).map(String);
        const restoredStatuses: Record<number, QuestionStatus> = {};

        if (effectiveQuestions.length > 0) {
            effectiveQuestions.forEach((q, idx) => {
                const qIdStr = String(q.id);

                if (correctList.includes(qIdStr)) {
                    // Was answered correctly
                    restoredAnswers[idx] = q.correctAnswer || restoredAnswers[idx] || "A";
                    restoredStatuses[idx] = "answered";
                } else if (failedList.includes(qIdStr)) {
                    // Was answered, but incorrect
                    if (!restoredAnswers[idx]) {
                        // Pick first option that is not correct answer so it's visibly marked as answered
                        const wrongOption =
                            q.options?.find(
                                (opt) =>
                                    opt.id.toUpperCase() !== (q.correctAnswer || "").toUpperCase()
                            )?.id || "A";
                        restoredAnswers[idx] = wrongOption;
                    }
                    restoredStatuses[idx] = "answered";
                } else if (restoredAnswers[idx]) {
                    restoredStatuses[idx] = "answered";
                } else if (idx < (examData.total_questions_answered || 0)) {
                    restoredStatuses[idx] = "answered";
                }
            });

            setAnswers((prev) => ({ ...prev, ...restoredAnswers }));
            setStatuses((prev) => ({ ...prev, ...restoredStatuses }));

            // Advance to first unanswered question
            const firstUnansweredIndex = effectiveQuestions.findIndex(
                (_, i) => !restoredAnswers[i]
            );
            const answeredCount = examData.total_questions_answered || 0;
            const targetIndex =
                firstUnansweredIndex !== -1
                    ? firstUnansweredIndex
                    : Math.min(answeredCount, effectiveQuestions.length - 1);

            setCurrentIndex(Math.max(0, targetIndex));
        } else {
            const answeredCount = examData.total_questions_answered || 0;
            if (answeredCount > 0) {
                for (let i = 0; i < answeredCount; i++) {
                    restoredStatuses[i] = "answered";
                }
                setStatuses((prev) => ({ ...restoredStatuses, ...prev }));
                setCurrentIndex(Math.min(answeredCount, (examData.total_question || 20) - 1));
            }
        }
    }, [existingExamResponse, effectiveQuestions, examinationId]);

    // Initialize examination session on the backend (only for new exam sessions)
    useEffect(() => {
        if (
            effectiveQuestions.length > 0 &&
            !examinationId &&
            !existingExaminationId &&
            !isCreatingExamRef.current
        ) {
            isCreatingExamRef.current = true;

            const userId =
                userProfile?.data?.id ||
                (typeof window !== "undefined" ? localStorage.getItem("prepforauserid") : null) ||
                "c90c74fb-300c-43f1-b847-fcfbebf50ddb"; // Fallback guest ID

            const examPayload: ICreateExaminationPayload = {
                user_id: userId,
                type: "practice",
                subjects: [subjectParam],
                total_question: effectiveQuestions.length,
                exam_year: yearParam || "2024",
                exam_type: typeParam || "utme",
                time: `${hoursParam * 60 + minutesParam}:${String(secondsParam).padStart(2, "0")}`,
                questions_ids: effectiveQuestions.map((q) => Number(q.id)),
            };

            createExamination
                .mutateAsync(examPayload)
                .then((res) => {
                    if (res?.data?.id) {
                        setExaminationId(res.data.id);
                        saveExamToStorage({
                            id: res.data.id,
                            subject: subjectParam,
                            subjectTitle: subjectTitleParam,
                            exam_type: typeParam || "utme",
                            exam_year: yearParam || "2024",
                            total_question: effectiveQuestions.length,
                            total_questions_answered: 0,
                            total_score: 0,
                            percent: 0,
                            updated_at: new Date().toISOString(),
                        });
                    }
                })
                .catch((err) => {
                    console.error("Failed to initialize examination session:", err);
                })
                .finally(() => {
                    isCreatingExamRef.current = false;
                });
        }
    }, [
        effectiveQuestions,
        examinationId,
        userProfile,
        subjectParam,
        typeParam,
        yearParam,
        hoursParam,
        minutesParam,
        secondsParam,
        createExamination,
    ]);

    // Compute answered statistics against correct answers
    const computeStats = (updatedAnswers: Record<number, string>) => {
        const answeredIndices = Object.keys(updatedAnswers).map(Number);
        const correctQuestionIds: string[] = [];
        const failedQuestionIds: string[] = [];

        answeredIndices.forEach((idx) => {
            const q = effectiveQuestions[idx];
            const chosen = (updatedAnswers[idx] || "").trim().toUpperCase();
            if (q) {
                const correct = (q.correctAnswer || "").trim().toUpperCase();
                if (correct) {
                    if (chosen === correct) {
                        correctQuestionIds.push(String(q.id));
                    } else {
                        failedQuestionIds.push(String(q.id));
                    }
                }
            }
        });

        return {
            total_questions_answered: answeredIndices.length,
            total_questions_failed: failedQuestionIds.length,
            total_score: correctQuestionIds.length,
            correct_questions: correctQuestionIds,
            failed_questions: failedQuestionIds,
            questions_ids: effectiveQuestions.map((q) => Number(q.id)),
        };
    };

    // Save answered question using PUT /examination/{id} (update_examination_examination__id__put)
    const persistAnswerToBackend = (updatedAnswers: Record<number, string>) => {
        if (!examinationId) return;

        // Persist answers locally for instant retrieval when resuming
        if (typeof window !== "undefined") {
            try {
                localStorage.setItem(
                    `prepfora_exam_answers_${examinationId}`,
                    JSON.stringify(updatedAnswers)
                );
            } catch (e) {
                console.error("Failed to store answers to localStorage:", e);
            }
        }

        const stats = computeStats(updatedAnswers);
        const updatePayload: IUpdateExaminationPayload = {
            type: "practice",
            subjects: [subjectParam],
            total_question: effectiveQuestions.length,
            total_questions_answered: stats.total_questions_answered,
            total_questions_failed: stats.total_questions_failed,
            total_score: stats.total_score,
            correct_questions: stats.correct_questions,
            failed_questions: stats.failed_questions,
            questions_ids: stats.questions_ids,
            exam_year: yearParam || "2024",
            exam_type: typeParam || "utme",
        };

        const pct = effectiveQuestions.length > 0
            ? Math.round((stats.total_questions_answered / effectiveQuestions.length) * 100)
            : 0;
        saveExamToStorage({
            id: examinationId,
            subject: subjectParam,
            subjectTitle: subjectTitleParam,
            exam_type: typeParam || "utme",
            exam_year: yearParam || "2024",
            total_question: effectiveQuestions.length,
            total_questions_answered: stats.total_questions_answered,
            total_score: stats.total_score,
            percent: pct,
            updated_at: new Date().toISOString(),
        });

        setSaveStatus("saving");
        updateExamination
            .mutateAsync({ id: examinationId, data: updatePayload })
            .then(() => {
                setSaveStatus("saved");
                if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
                saveTimerRef.current = setTimeout(() => {
                    setSaveStatus("idle");
                }, 2000);
            })
            .catch((err) => {
                console.error("Failed to update examination progress:", err);
                setSaveStatus("idle");
            });
    };

    const currentQuestion = effectiveQuestions[currentIndex] || effectiveQuestions[0];

    const displaySubjectTitle =
        currentQuestion?.type === "comprehension" || currentQuestion?.type === "essay"
            ? "English Language Practice"
            : subjectTitleParam;

    const handleSelectOption = (optionId: string) => {
        const updatedAnswers = { ...answers, [currentIndex]: optionId };
        setAnswers(updatedAnswers);
        setStatuses((prev) => ({ ...prev, [currentIndex]: "answered" }));
        persistAnswerToBackend(updatedAnswers);
    };

    const handleChangeEssay = (text: string) => {
        const updatedAnswers = { ...answers, [currentIndex]: text };
        setAnswers(updatedAnswers);
        setStatuses((prev) => ({
            ...prev,
            [currentIndex]: text.trim() ? "answered" : "unanswered",
        }));
        persistAnswerToBackend(updatedAnswers);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSkip = () => {
        setStatuses((prev) => ({ ...prev, [currentIndex]: "skipped" }));
        if (currentIndex < effectiveQuestions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleSaveAndNext = () => {
        persistAnswerToBackend(answers);
        if (currentIndex < effectiveQuestions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setIsSummaryOpen(true);
        }
    };

    // Calculate Summary Results
    const { totalScore, scoreCount, dynamicResults, calculatedPrepPoints } = useMemo(() => {
        const total = effectiveQuestions.length || 1;
        let correctCount = 0;

        const resultsList: QuestionResult[] = effectiveQuestions.map((q, idx) => {
            const chosen = (answers[idx] || "").trim().toUpperCase();
            const correct = (q.correctAnswer || "").trim().toUpperCase();

            let status: "correct" | "incorrect" | "skipped" = "skipped";
            if (statuses[idx] === "skipped" || !chosen) {
                status = "skipped";
            } else if (correct && chosen === correct) {
                status = "correct";
                correctCount++;
            } else {
                status = "incorrect";
            }

            return {
                number: idx + 1,
                status,
            };
        });

        const points = Math.round((correctCount / total) * 50);

        return {
            totalScore: effectiveQuestions.length,
            scoreCount: correctCount,
            dynamicResults: resultsList,
            calculatedPrepPoints: points,
        };
    }, [effectiveQuestions, answers, statuses]);

    // Loading State
    if (isQuestionsLoading && effectiveQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-[#EEF3FA] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full border-3 border-primary-100 border-t-primary-300 animate-spin mb-4" />
                <h2 className="text-lg font-bold text-neutral-800">
                    Loading {subjectTitleParam} Questions...
                </h2>
                <p className="text-sm text-neutral-500 max-w-sm mt-1">
                    Fetching practice questions from {typeParam.toUpperCase()} database.
                </p>
            </div>
        );
    }

    // Error State
    if (isQuestionsError && effectiveQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-[#EEF3FA] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mb-4">
                    !
                </div>
                <h2 className="text-lg font-bold text-neutral-800">
                    Unable to Load Questions
                </h2>
                <p className="text-sm text-neutral-500 max-w-sm mt-1 mb-4">
                    There was an issue retrieving questions for this subject. Please retry.
                </p>
                <button
                    type="button"
                    onClick={() => refetchQuestions()}
                    className="px-6 py-2.5 bg-primary-300 hover:bg-primary-250 text-white rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-colors"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EEF3FA] flex flex-col">
            {/* Exam Header */}
            <div className="relative">
                <ExamHeader
                    subjectTitle={displaySubjectTitle}
                    initialSeconds={initialTotalSeconds}
                    onEndSession={() => {
                        persistAnswerToBackend(answers);
                        setIsSummaryOpen(true);
                    }}
                />

                {/* Save status badge */}
                {saveStatus !== "idle" && (
                    <div className="absolute right-6 sm:right-48 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700 shadow-xs transition-all animate-fadeIn">
                        {saveStatus === "saving" ? (
                            <>
                                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                <span>Saving answer...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span className="text-[#047857]">Answer saved</span>
                            </>
                        )}
                    </div>
                )}
            </div>

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
                    isLast={currentIndex === effectiveQuestions.length - 1}
                />

                {/* Question Navigator Sidebar (Right) */}
                <QuestionNavigator
                    totalQuestions={effectiveQuestions.length}
                    currentIndex={currentIndex}
                    statuses={statuses}
                    onSelectQuestion={(idx) => setCurrentIndex(idx)}
                />
            </main>

            {/* End Session Summary Modal */}
            <ExamSummaryModal
                isOpen={isSummaryOpen}
                onClose={() => setIsSummaryOpen(false)}
                subjectTitle={subjectTitleParam}
                score={scoreCount}
                totalScore={totalScore}
                prepPoints={calculatedPrepPoints}
                results={dynamicResults}
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