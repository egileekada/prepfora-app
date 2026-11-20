"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ExamHeader,
    QuestionNavigator,
    QuestionRenderer,
    ExamSummaryModal,
    ExamCalculator,
    QuestionStatus,
    QuestionResult,
} from "@/components/feature";
import { ExamQuestion, Option } from "@/components/feature/exam/mockExamData";
import type { NavigatorSection } from "@/components/feature/exam/questionNavigator";
import useExam from "@/hooks/exam/useExam";
import useUser from "@/hooks/useUser";
import { ICreateExaminationPayload, IUpdateExaminationPayload } from "@/types/exam";

function ExamContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const existingExaminationId =
        searchParams.get("id") || searchParams.get("examinationId") || null;

    // Backend hooks
    const {
        useGetMultiSubjectQuestions,
        createExamination,
        updateExamination,
        useGetUserExaminations,
        useGetExaminationById,
    } = useExam();
    const { useGetProfile } = useUser();
    const { data: userProfile } = useGetProfile();

    const userId =
        userProfile?.data?.id ||
        (typeof window !== "undefined" ? localStorage.getItem("prepforauserid") : null) ||
        undefined;

    // Fetch existing examination only when resuming an examination session by ID
    const { data: userExaminationsResponse, isLoading: isUserExamsLoading } = useGetUserExaminations(
        {
            user_id: userId,
            limit: 50,
        },
        {
            name: ["user_examinations_exam_page", userId || ""],
            enable: Boolean(existingExaminationId),
        }
    );

    const { data: fallbackExamResponse, isLoading: isFallbackExamLoading } = useGetExaminationById(
        existingExaminationId || undefined
    );

    // Resolve existing examination strictly by existingExaminationId so new sessions never load old progress
    const existingExam = useMemo(() => {
        if (!existingExaminationId) return null;
        const examsList = userExaminationsResponse?.data;
        if (examsList && Array.isArray(examsList)) {
            const found = examsList.find((item) => item.id === existingExaminationId);
            if (found) return found;
        }
        return fallbackExamResponse?.data || null;
    }, [existingExaminationId, userExaminationsResponse?.data, fallbackExamResponse?.data]);

    // Query parameters from StartPracticeModal, URL, or backend examination
    const subjectParam = (
        searchParams.get("subject") ||
        existingExam?.subjects?.[0] ||
        "english"
    ).trim().toLowerCase();

    const subjectsListParam = useMemo(() => {
        const rawSubjects = searchParams.get("subjects");
        if (rawSubjects) {
            const parsed = rawSubjects
                .split(",")
                .map((s) => s.trim().toLowerCase())
                .filter(Boolean);
            if (parsed.length > 0) return parsed;
        }
        if (existingExam?.subjects && existingExam.subjects.length > 0) {
            return existingExam.subjects.map((s) => s.trim().toLowerCase()).filter(Boolean);
        }
        return [subjectParam];
    }, [searchParams, existingExam?.subjects, subjectParam]);

    const formatSubjectLabel = (sub: string) =>
        sub
            .split(/[-_\s]+/)
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");

    const rawSubjectTitle = searchParams.get("subjectTitle") || "";
    const subjectTitleParam =
        rawSubjectTitle ||
        (subjectsListParam.length > 1
            ? `${subjectsListParam.map(formatSubjectLabel).join(", ")} Practice`
            : `${formatSubjectLabel(subjectsListParam[0] || subjectParam)} Practice`);

    const rawTypeParam = (
        searchParams.get("type") ||
        searchParams.get("exam") ||
        existingExam?.exam_type ||
        "utme"
    ).trim().toLowerCase();
    const typeParam = rawTypeParam === "jamb" ? "utme" : rawTypeParam;

    const yearParam =
        searchParams.get("year") ||
        existingExam?.exam_year ||
        "";

    const limitParam =
        searchParams.get("limit") ||
        (existingExam?.total_question
            ? String(existingExam.total_question)
            : "20");

    const subjectLimitsParam = useMemo(() => {
        const raw = searchParams.get("subjectLimits");
        if (!raw) return undefined;
        const parsed: Record<string, number> = {};
        raw.split(",").forEach((entry) => {
            const [rawSubj, rawCount] = entry.split(":");
            const cleanSubj = rawSubj?.trim().toLowerCase();
            const count = Number(rawCount);
            if (cleanSubj && Number.isFinite(count) && count > 0) {
                parsed[cleanSubj] = count;
            }
        });
        return Object.keys(parsed).length > 0 ? parsed : undefined;
    }, [searchParams]);

    const perSubjectParam = searchParams.get("perSubject");
    const questionsPerSubject = perSubjectParam
        ? Math.max(1, Number(perSubjectParam) || 20)
        : Math.max(
              1,
              Math.round((Number(limitParam) || 20) / Math.max(1, subjectsListParam.length))
          );

    const hoursParam = parseInt(searchParams.get("hours") || "0", 10);
    const minutesParam = parseInt(searchParams.get("minutes") || "20", 10);
    const secondsParam = parseInt(searchParams.get("seconds") || "0", 10);

    const initialTotalSeconds = hoursParam * 3600 + minutesParam * 60 + secondsParam || 1200;

    const needsExistingExamSubjects = Boolean(
        existingExaminationId && !searchParams.get("subjects") && !existingExam
    );
    const isResolvingExam = Boolean(
        needsExistingExamSubjects && (isUserExamsLoading || isFallbackExamLoading)
    );

    const {
        questionsBySubject,
        emptySubjects,
        isLoading: isQuestionsLoading,
        isError: isQuestionsError,
        refetchAll: refetchQuestions,
    } = useGetMultiSubjectQuestions(
        subjectsListParam,
        questionsPerSubject,
        yearParam,
        typeParam,
        !isResolvingExam,
        subjectLimitsParam
    );

    // Examination tracking
    const [examinationId, setExaminationId] = useState<string | null>(existingExaminationId);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isCreatingExamRef = useRef(false);
    const hasRestoredRef = useRef<string | null>(null);

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

    // Map fetched backend question items to ExamQuestion[] and group into subject sections
    const { questions, subjectSections } = useMemo(() => {
        if (!questionsBySubject || questionsBySubject.length === 0) {
            return {
                questions: [] as ExamQuestion[],
                subjectSections: [] as {
                    subject: string;
                    label: string;
                    startIndex: number;
                    endIndex: number;
                    count: number;
                }[],
            };
        }

        const mapped: ExamQuestion[] = [];
        const sections: {
            subject: string;
            label: string;
            startIndex: number;
            endIndex: number;
            count: number;
        }[] = [];

        questionsBySubject.forEach(({ subject, items }) => {
            if (!items || items.length === 0) return;

            const subjectDisplay = formatSubjectLabel(subject);
            const startIndex = mapped.length;

            items.forEach((item, index) => {
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

                mapped.push({
                    id: typeof item.id === "number" ? item.id : Number(item.id) || mapped.length + index + 1,
                    type: isComprehension ? "comprehension" : "multiple-choice",
                    subject: subjectDisplay,
                    year: item.examyear || yearParam || undefined,
                    prompt: item.question || "",
                    topicSubtitle: item.section || undefined,
                    options: optionsList.length > 0 ? optionsList : undefined,
                    correctAnswer: (item.answer || "").trim().toUpperCase(),
                    passageTitle: isComprehension ? (item.section || "Reading Comprehension") : undefined,
                    passageCategory: isComprehension ? item.category : undefined,
                    passageContent: isComprehension ? item.section : undefined,
                });
            });

            const endIndex = mapped.length - 1;
            sections.push({
                subject,
                label: subjectDisplay,
                startIndex,
                endIndex,
                count: endIndex - startIndex + 1,
            });
        });

        return { questions: mapped, subjectSections: sections };
    }, [questionsBySubject, yearParam]);

    // Active questions (no random/mock fallback when empty)
    const effectiveQuestions = questions;
    const isMultiSubject = subjectSections.length > 1;

    // Navigation and Exam State
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [draftAnswers, setDraftAnswers] = useState<Record<number, string>>({});
    const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
    const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
    const [flowNotice, setFlowNotice] = useState<{
        type: "warning" | "info" | "success";
        message: string;
    } | null>(null);
    const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
    const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false);

    // Track section completion and enforce sequential subject progression
    const sectionStates = useMemo(() => {
        let firstIncompleteFound = false;
        return subjectSections.map((section, idx) => {
            let answeredCount = 0;
            for (let i = section.startIndex; i <= section.endIndex; i++) {
                if (statuses[i] === "answered") {
                    answeredCount++;
                }
            }
            const isComplete = answeredCount === section.count;
            const isLocked = firstIncompleteFound;
            if (!isComplete) {
                firstIncompleteFound = true;
            }
            return {
                ...section,
                answeredCount,
                isComplete,
                isLocked,
                sectionIndex: idx,
            };
        });
    }, [subjectSections, statuses]);

    const currentSectionState = useMemo(() => {
        if (sectionStates.length === 0) return null;
        return (
            sectionStates.find(
                (s) => currentIndex >= s.startIndex && currentIndex <= s.endIndex
            ) || sectionStates[0]
        );
    }, [sectionStates, currentIndex]);

    const firstIncompleteSection = useMemo(
        () => sectionStates.find((s) => !s.isComplete) || null,
        [sectionStates]
    );

    const navigatorSections: NavigatorSection[] = useMemo(
        () =>
            sectionStates.map((s) => ({
                label: s.label,
                startIndex: s.startIndex,
                endIndex: s.endIndex,
                isLocked: s.isLocked,
                isComplete: s.isComplete,
                answeredCount: s.answeredCount,
            })),
        [sectionStates]
    );

    // Math exam check & On-screen Calculator state
    const isMathSubject = useMemo(() => {
        const hasMathInList = subjectsListParam.some((sub) => {
            const lower = sub.toLowerCase();
            return lower.includes("math") || lower.includes("further");
        });
        const title = (subjectTitleParam || "").toLowerCase();
        return hasMathInList || title.includes("math") || title.includes("further");
    }, [subjectsListParam, subjectTitleParam]);

    const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isMathSubject) {
            setIsCalculatorOpen(true);
        }
    }, [isMathSubject]);

    // Restore existing examination progress & answers from backend (GET /examination) and local storage
    useEffect(() => {
        if (!existingExam || effectiveQuestions.length === 0) return;

        const examData = existingExam;
        const examId = examData.id;
        const restoreKey = `${examId}:${effectiveQuestions.length}`;
        if (hasRestoredRef.current === restoreKey) return;
        hasRestoredRef.current = restoreKey;

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

        effectiveQuestions.forEach((q, idx) => {
            const qIdStr = String(q.id);

            if (correctList.includes(qIdStr)) {
                restoredAnswers[idx] = q.correctAnswer || restoredAnswers[idx] || "A";
                restoredStatuses[idx] = "answered";
            } else if (failedList.includes(qIdStr)) {
                if (!restoredAnswers[idx]) {
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

        setSavedAnswers(restoredAnswers);
        setDraftAnswers(restoredAnswers);
        setStatuses(restoredStatuses);

        // Advance to first unanswered question (automatically respects sequential subject order)
        const firstUnansweredIndex = effectiveQuestions.findIndex(
            (_, i) => restoredStatuses[i] !== "answered"
        );
        const targetIndex =
            firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0;

        setCurrentIndex(Math.max(0, targetIndex));
    }, [existingExam, effectiveQuestions, examinationId]);

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
                subjects: subjectsListParam,
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
                            subject: subjectsListParam[0] || subjectParam,
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
        subjectsListParam,
        subjectTitleParam,
        typeParam,
        yearParam,
        hoursParam,
        minutesParam,
        secondsParam,
        createExamination,
    ]);

    // Compute answered statistics strictly against committed/saved answers
    const computeStats = (updatedAnswers: Record<number, string>) => {
        const answeredIndices = Object.entries(updatedAnswers)
            .filter(([, val]) => (val || "").trim().length > 0)
            .map(([idx]) => Number(idx));
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
            subjects: subjectsListParam,
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
            subject: subjectsListParam[0] || subjectParam,
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

    const displaySubjectTitle = currentQuestion?.subject
        ? `${currentQuestion.subject} Practice`
        : subjectTitleParam;

    const hasUnsavedDraft = useMemo(() => {
        const draft = (draftAnswers[currentIndex] || "").trim();
        const saved = (savedAnswers[currentIndex] || "").trim();
        return Boolean(draft && draft !== saved);
    }, [draftAnswers, savedAnswers, currentIndex]);

    // Selecting an option only updates local draft state; saving happens on Save and Next
    const handleSelectOption = (optionId: string) => {
        setFlowNotice(null);
        setDraftAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
    };

    const handleChangeEssay = (text: string) => {
        setFlowNotice(null);
        setDraftAnswers((prev) => ({ ...prev, [currentIndex]: text }));
    };

    const handleSelectQuestion = (targetIdx: number) => {
        setFlowNotice(null);
        if (isMultiSubject) {
            const targetSection = sectionStates.find(
                (s) => targetIdx >= s.startIndex && targetIdx <= s.endIndex
            );
            if (targetSection?.isLocked) {
                setFlowNotice({
                    type: "warning",
                    message: `Complete all questions in ${
                        firstIncompleteSection?.label || "the current subject"
                    } before moving to ${targetSection.label}.`,
                });
                return;
            }
        }
        setCurrentIndex(targetIdx);
    };

    const handleSelectSection = (sectionIdx: number) => {
        const target = sectionStates[sectionIdx];
        if (!target) return;
        if (target.isLocked) {
            setFlowNotice({
                type: "warning",
                message: `Please finish all questions in ${
                    firstIncompleteSection?.label || "the current subject"
                } before moving to ${target.label}.`,
            });
            return;
        }
        setFlowNotice(null);
        let firstUnanswered = -1;
        for (let i = target.startIndex; i <= target.endIndex; i++) {
            if (statuses[i] !== "answered") {
                firstUnanswered = i;
                break;
            }
        }
        setCurrentIndex(firstUnanswered !== -1 ? firstUnanswered : target.startIndex);
    };

    const handlePrevious = () => {
        setFlowNotice(null);
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleSkip = () => {
        // Revert any unsaved draft selection back to saved state so skipping never saves unconfirmed selection
        setDraftAnswers((prev) => {
            const next = { ...prev };
            if (savedAnswers[currentIndex] !== undefined) {
                next[currentIndex] = savedAnswers[currentIndex];
            } else {
                delete next[currentIndex];
            }
            return next;
        });

        const nextStatuses: Record<number, QuestionStatus> = {
            ...statuses,
            [currentIndex]: statuses[currentIndex] === "answered" ? "answered" : "skipped",
        };
        setStatuses(nextStatuses);

        if (isMultiSubject && currentSectionState) {
            // Stay inside the active subject section when skipping
            if (currentIndex < currentSectionState.endIndex) {
                setFlowNotice(null);
                setCurrentIndex((prev) => prev + 1);
                return;
            }

            let nextUnansweredInSection = -1;
            for (let i = currentSectionState.startIndex; i <= currentSectionState.endIndex; i++) {
                if (i !== currentIndex && nextStatuses[i] !== "answered") {
                    nextUnansweredInSection = i;
                    break;
                }
            }

            if (nextUnansweredInSection !== -1) {
                setFlowNotice({
                    type: "warning",
                    message: `Complete all remaining questions in ${currentSectionState.label} before moving to the next subject.`,
                });
                setCurrentIndex(nextUnansweredInSection);
            } else {
                setFlowNotice({
                    type: "warning",
                    message: `Answer and save this question in ${currentSectionState.label} before moving to the next subject.`,
                });
            }
            return;
        }

        setFlowNotice(null);
        if (currentIndex < effectiveQuestions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleSaveAndNext = () => {
        const draftValue = draftAnswers[currentIndex] || "";
        if (!draftValue.trim()) {
            setFlowNotice({
                type: "warning",
                message: "Please select an answer before clicking Save and Next, or click Skip for Now.",
            });
            return;
        }

        const nextSavedAnswers = { ...savedAnswers, [currentIndex]: draftValue };
        const nextStatuses: Record<number, QuestionStatus> = {
            ...statuses,
            [currentIndex]: "answered",
        };

        setSavedAnswers(nextSavedAnswers);
        setStatuses(nextStatuses);
        setFlowNotice(null);
        persistAnswerToBackend(nextSavedAnswers);

        if (isMultiSubject && currentSectionState) {
            // 1. Continue sequentially within current subject section if next question isn't answered yet
            if (
                currentIndex < currentSectionState.endIndex &&
                nextStatuses[currentIndex + 1] !== "answered"
            ) {
                setCurrentIndex(currentIndex + 1);
                return;
            }

            // 2. Otherwise check if any question in the current subject section still needs an answer
            let remainingInSection = -1;
            let remainingCount = 0;
            for (let i = currentSectionState.startIndex; i <= currentSectionState.endIndex; i++) {
                if (nextStatuses[i] !== "answered") {
                    if (remainingInSection === -1) remainingInSection = i;
                    remainingCount++;
                }
            }

            if (remainingInSection !== -1) {
                setFlowNotice({
                    type: "info",
                    message: `Answer saved! ${remainingCount} question${remainingCount > 1 ? "s" : ""} remaining in ${currentSectionState.label} before moving to the next subject.`,
                });
                setCurrentIndex(remainingInSection);
                return;
            }

            // 3. Current subject is 100% done — move to the next subject section if one exists
            const nextSection = sectionStates[currentSectionState.sectionIndex + 1];
            if (nextSection) {
                let firstUnansweredNext = -1;
                for (let i = nextSection.startIndex; i <= nextSection.endIndex; i++) {
                    if (nextStatuses[i] !== "answered") {
                        firstUnansweredNext = i;
                        break;
                    }
                }
                setFlowNotice({
                    type: "success",
                    message: `${currentSectionState.label} completed! Moving to ${nextSection.label}.`,
                });
                setCurrentIndex(
                    firstUnansweredNext !== -1 ? firstUnansweredNext : nextSection.startIndex
                );
                return;
            }

            // 4. All subjects finished -> open summary
            setIsSummaryOpen(true);
            return;
        }

        if (currentIndex < effectiveQuestions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setIsSummaryOpen(true);
        }
    };

    // Calculate Summary Results strictly from committed/saved answers
    const { totalScore, scoreCount, dynamicResults, calculatedPrepPoints } = useMemo(() => {
        const total = effectiveQuestions.length || 1;
        let correctCount = 0;

        const resultsList: QuestionResult[] = effectiveQuestions.map((q, idx) => {
            const chosen = (savedAnswers[idx] || "").trim().toUpperCase();
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
    }, [effectiveQuestions, savedAnswers, statuses]);

    // Loading State
    if ((isResolvingExam || isQuestionsLoading) && effectiveQuestions.length === 0) {
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

    // Empty State (no questions returned from backend)
    if (!isQuestionsLoading && !isQuestionsError && effectiveQuestions.length === 0) {
        const formattedSubjects = subjectsListParam.map(formatSubjectLabel).join(", ");
        return (
            <div className="min-h-screen bg-[#EEF3FA] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold mb-4">
                    ?
                </div>
                <h2 className="text-lg font-bold text-neutral-800">
                    No Questions Available
                </h2>
                <p className="text-sm text-neutral-600 max-w-md mt-1 mb-5">
                    There are currently no {typeParam.toUpperCase()} questions available for{" "}
                    <span className="font-semibold text-neutral-800">{formattedSubjects}</span>
                    {yearParam ? ` (${yearParam})` : ""}. Please choose another subject, exam type, or year.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/practice")}
                        className="px-6 py-2.5 bg-primary-300 hover:bg-primary-250 text-white rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-colors"
                    >
                        Back to Practice
                    </button>
                    <button
                        type="button"
                        onClick={() => refetchQuestions()}
                        className="px-6 py-2.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-xl text-sm font-semibold shadow-xs cursor-pointer transition-colors"
                    >
                        Retry
                    </button>
                </div>
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
                    showCalculator={isMathSubject}
                    isCalculatorOpen={isCalculatorOpen}
                    onToggleCalculator={() => setIsCalculatorOpen((prev) => !prev)}
                    onEndSession={() => {
                        persistAnswerToBackend(savedAnswers);
                        setIsSummaryOpen(true);
                    }}
                    onOpenNavigator={() => setIsNavigatorOpen(true)}
                />

                {/* Save status badge */}
                {saveStatus !== "idle" && (
                    <div className="absolute right-12 sm:right-48 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700 shadow-xs transition-all animate-fadeIn z-30">
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

            {emptySubjects.length > 0 && (
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs sm:text-sm text-amber-800">
                        No {typeParam.toUpperCase()} questions were found for{" "}
                        <span className="font-semibold">
                            {emptySubjects.map(formatSubjectLabel).join(", ")}
                        </span>
                        {yearParam ? ` (${yearParam})` : ""}. Showing available questions from the remaining subject(s).
                    </div>
                </div>
            )}

            {/* Sequential Multi-Subject Progress Stepper */}
            {isMultiSubject && (
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-white border border-[#E2EAF4] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center gap-2 sm:gap-3">
                        {sectionStates.map((section, idx) => {
                            const isCurrent = currentSectionState?.sectionIndex === idx;
                            return (
                                <button
                                    key={section.subject}
                                    type="button"
                                    onClick={() => handleSelectSection(idx)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                                        section.isLocked
                                            ? "bg-neutral-50 border-neutral-200 text-neutral-400 cursor-not-allowed"
                                            : isCurrent
                                                ? "bg-primary-50 border-primary-300 text-primary-300 cursor-pointer shadow-2xs"
                                                : section.isComplete
                                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 cursor-pointer hover:bg-emerald-100/70"
                                                    : "bg-white border-neutral-200 text-neutral-700 cursor-pointer hover:bg-neutral-50"
                                    }`}
                                >
                                    <span
                                        className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                            section.isComplete
                                                ? "bg-emerald-600 text-white"
                                                : section.isLocked
                                                    ? "bg-neutral-200 text-neutral-500"
                                                    : isCurrent
                                                        ? "bg-primary-300 text-white"
                                                        : "bg-neutral-200 text-neutral-700"
                                        }`}
                                    >
                                        {section.isComplete ? "✓" : idx + 1}
                                    </span>
                                    <span>{section.label}</span>
                                    <span className="text-[11px] opacity-80">
                                        ({section.answeredCount}/{section.count})
                                    </span>
                                    {section.isLocked && (
                                        <span className="text-[10px] uppercase tracking-wider bg-neutral-200/80 text-neutral-500 px-1.5 py-0.5 rounded">
                                            Locked
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Flow / Validation Notices & Unsaved Draft Indicator */}
            {(flowNotice || hasUnsavedDraft) && (
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex flex-col gap-2">
                    {flowNotice && (
                        <div
                            role="status"
                            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium border flex items-center justify-between gap-3 ${
                                flowNotice.type === "warning"
                                    ? "bg-amber-50 border-amber-200 text-amber-800"
                                    : flowNotice.type === "success"
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                        : "bg-blue-50 border-blue-200 text-blue-800"
                            }`}
                        >
                            <span>{flowNotice.message}</span>
                            <button
                                type="button"
                                onClick={() => setFlowNotice(null)}
                                className="text-xs font-bold opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                                aria-label="Dismiss message"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    {hasUnsavedDraft && (
                        <div className="rounded-xl bg-blue-50/80 border border-blue-200 px-4 py-2 text-xs text-blue-800 font-medium">
                            Answer selected — click <span className="font-bold">Save and Next</span> to save this answer.
                        </div>
                    )}
                </div>
            )}

            {/* Main Exam Body */}
            <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 pb-24 sm:pb-8 flex flex-col lg:flex-row gap-6 items-start">
                {/* Question Area (Left / Center) */}
                <QuestionRenderer
                    question={currentQuestion}
                    selectedAnswer={draftAnswers[currentIndex]}
                    essayAnswer={draftAnswers[currentIndex] || ""}
                    onSelectOption={handleSelectOption}
                    onChangeEssay={handleChangeEssay}
                    onPrevious={handlePrevious}
                    onSkip={handleSkip}
                    onSaveAndNext={handleSaveAndNext}
                    isFirst={currentIndex === 0}
                    isLast={
                        isMultiSubject
                            ? effectiveQuestions.every(
                                  (_, idx) => idx === currentIndex || statuses[idx] === "answered"
                              )
                            : currentIndex === effectiveQuestions.length - 1
                    }
                />

                {/* Question Navigator Sidebar (Right) & Mobile Drawer */}
                <QuestionNavigator
                    totalQuestions={effectiveQuestions.length}
                    currentIndex={currentIndex}
                    statuses={statuses}
                    sections={isMultiSubject ? navigatorSections : undefined}
                    onSelectQuestion={handleSelectQuestion}
                    onLockedSelect={(targetLabel) => {
                        setFlowNotice({
                            type: "warning",
                            message: `Complete all questions in ${
                                firstIncompleteSection?.label || "the current subject"
                            } before moving to ${targetLabel}.`,
                        });
                    }}
                    isOpenMobile={isNavigatorOpen}
                    onCloseMobile={() => setIsNavigatorOpen(false)}
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

            {/* On-Screen Calculator for Math exams */}
            {isMathSubject && (
                <ExamCalculator
                    isOpen={isCalculatorOpen}
                    onClose={() => setIsCalculatorOpen(false)}
                />
            )}
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