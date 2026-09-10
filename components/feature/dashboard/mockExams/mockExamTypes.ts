export type ExamCurriculumCode = "JAMB" | "WAEC" | "POST UTME" | "NECO";

export interface ExamCurriculum {
    id: string;
    code: ExamCurriculumCode;
    title: string;
    description: string;
    metricLabel: "Best Score" | "Average Grade";
    metricValue: string;
    metricTotal?: string;
    availableMocks: string;
    lastAttempt: string;
    iconType: "jamb" | "waec" | "post-utme" | "neco";
}

export interface ExamHistoryItem {
    id: string;
    examTitle: string;
    date: string;
    score: string;
    scoreColor: "green" | "red";
    examCode: ExamCurriculumCode;
}

export interface SectionScore {
    title: string;
    score: number;
    maxScore: number;
    percentile: string;
    timeSpent: string;
}

export interface TopicGap {
    id: string;
    subject?: string;
    topic: string;
    missedQuestions: string;
    errorReason: string;
}

export interface ExamAnalysisData {
    examCode: ExamCurriculumCode;
    examTitle: string;
    totalScore: number;
    maxScore: number;
    percentileMessage: string;
    aiAdvice: string;
    sections: SectionScore[];
    topicGaps: TopicGap[];
}

export const MOCK_CURRICULUMS: ExamCurriculum[] = [
    {
        id: "jamb",
        code: "JAMB",
        title: "JAMB",
        description: "Comprehensive computer-based simulation for all 4 subjects.",
        metricLabel: "Best Score",
        metricValue: "320",
        metricTotal: "/400",
        availableMocks: "1999 – 2025",
        lastAttempt: "10 days ago",
        iconType: "jamb",
    },
    {
        id: "waec",
        code: "WAEC",
        title: "WAEC",
        description: "Comprehensive computer-based simulation for all 4 subjects.",
        metricLabel: "Average Grade",
        metricValue: "B2",
        availableMocks: "1999 – 2025",
        lastAttempt: "10 days ago",
        iconType: "waec",
    },
    {
        id: "post-utme",
        code: "POST UTME",
        title: "POST UTME",
        description: "Comprehensive computer-based simulation for all 4 subjects.",
        metricLabel: "Best Score",
        metricValue: "300",
        metricTotal: "/400",
        availableMocks: "1999 – 2025",
        lastAttempt: "10 days ago",
        iconType: "post-utme",
    },
    {
        id: "neco",
        code: "NECO",
        title: "NECO",
        description: "Comprehensive computer-based simulation for all 4 subjects.",
        metricLabel: "Average Grade",
        metricValue: "B2",
        availableMocks: "1999 – 2025",
        lastAttempt: "10 days ago",
        iconType: "neco",
    },
];

export const MOCK_HISTORY: ExamHistoryItem[] = [
    {
        id: "hist-1",
        examTitle: "JAMB Exam",
        date: "June 24, 2026",
        score: "284",
        scoreColor: "green",
        examCode: "JAMB",
    },
    {
        id: "hist-2",
        examTitle: "WAEC Physics",
        date: "June 8, 2026",
        score: "A1",
        scoreColor: "green",
        examCode: "WAEC",
    },
    {
        id: "hist-3",
        examTitle: "NECO Mathematics",
        date: "May 20, 2026",
        score: "D",
        scoreColor: "red",
        examCode: "NECO",
    },
];

export const MOCK_ANALYSIS_DATA: Record<ExamCurriculumCode, ExamAnalysisData> = {
    JAMB: {
        examCode: "JAMB",
        examTitle: "JAMB Mock Exam Analysis",
        totalScore: 288,
        maxScore: 400,
        percentileMessage:
            "This performance puts you in the top 15% of candidates. You are on track!",
        aiAdvice:
            '"You are losing most points in the final 30 minutes, specifically in Physics calculations. Focus on pacing early in the exam to leave buffer time."',
        sections: [
            {
                title: "Use of English",
                score: 48,
                maxScore: 60,
                percentile: "You are in the 76th percentile",
                timeSpent: "42 mins spent",
            },
            {
                title: "Mathematics",
                score: 48,
                maxScore: 60,
                percentile: "You are in the 76th percentile",
                timeSpent: "42 mins spent",
            },
            {
                title: "Physics",
                score: 48,
                maxScore: 60,
                percentile: "You are in the 76th percentile",
                timeSpent: "42 mins spent",
            },
            {
                title: "Biology",
                score: 48,
                maxScore: 60,
                percentile: "You are in the 76th percentile",
                timeSpent: "42 mins spent",
            },
        ],
        topicGaps: [
            {
                id: "gap-1",
                subject: "Physics",
                topic: "Topic",
                missedQuestions: "Missed 4 out of 5 questions.",
                errorReason: "Formulas incorrectly applied.",
            },
            {
                id: "gap-2",
                subject: "Physics",
                topic: "Topic",
                missedQuestions: "Missed 4 out of 5 questions.",
                errorReason: "Formulas incorrectly applied.",
            },
            {
                id: "gap-3",
                subject: "Physics",
                topic: "Topic",
                missedQuestions: "Missed 4 out of 5 questions.",
                errorReason: "Formulas incorrectly applied.",
            },
        ],
    },
    WAEC: {
        examCode: "WAEC",
        examTitle: "WAEC Mock Exam Analysis",
        totalScore: 78,
        maxScore: 100,
        percentileMessage:
            "This performance puts you in the top 15% of candidates. You are on track!",
        aiAdvice:
            '"You are losing most points in the final 30 minutes, specifically in Physics calculations. Focus on pacing early in the exam to leave buffer time."',
        sections: [
            {
                title: "Objective",
                score: 40,
                maxScore: 60,
                percentile: "You are in the 76th percentile",
                timeSpent: "42 mins spent",
            },
            {
                title: "Theory",
                score: 5,
                maxScore: 10,
                percentile: "You are in the 76th percentile",
                timeSpent: "42 mins spent",
            },
        ],
        topicGaps: [
            {
                id: "gap-w1",
                topic: "Topic",
                missedQuestions: "Missed 4 out of 5 questions.",
                errorReason: "Formulas incorrectly applied.",
            },
            {
                id: "gap-w2",
                topic: "Topic",
                missedQuestions: "Missed 4 out of 5 questions.",
                errorReason: "Formulas incorrectly applied.",
            },
            {
                id: "gap-w3",
                topic: "Topic",
                missedQuestions: "Missed 4 out of 5 questions.",
                errorReason: "Formulas incorrectly applied.",
            },
        ],
    },
    NECO: {
        examCode: "NECO",
        examTitle: "NECO Mock Exam Analysis",
        totalScore: 65,
        maxScore: 100,
        percentileMessage:
            "This performance puts you in the top 25% of candidates. Good progress!",
        aiAdvice:
            '"Focus on reviewing past question papers for Mathematics theory questions."',
        sections: [
            {
                title: "Objective",
                score: 35,
                maxScore: 50,
                percentile: "You are in the 70th percentile",
                timeSpent: "40 mins spent",
            },
            {
                title: "Theory",
                score: 30,
                maxScore: 50,
                percentile: "You are in the 65th percentile",
                timeSpent: "45 mins spent",
            },
        ],
        topicGaps: [
            {
                id: "gap-n1",
                topic: "Topic",
                missedQuestions: "Missed 3 out of 5 questions.",
                errorReason: "Arithmetic step errors.",
            },
        ],
    },
    "POST UTME": {
        examCode: "POST UTME",
        examTitle: "POST UTME Mock Exam Analysis",
        totalScore: 260,
        maxScore: 400,
        percentileMessage:
            "This performance puts you in the top 20% of applicants. Strong foundation!",
        aiAdvice:
            '"Speed and accuracy are critical for institutional entrance exams. Practice time-boxed sprints."',
        sections: [
            {
                title: "General Paper",
                score: 65,
                maxScore: 100,
                percentile: "You are in the 80th percentile",
                timeSpent: "35 mins spent",
            },
            {
                title: "Subject Paper",
                score: 195,
                maxScore: 300,
                percentile: "You are in the 75th percentile",
                timeSpent: "50 mins spent",
            },
        ],
        topicGaps: [
            {
                id: "gap-p1",
                topic: "Topic",
                missedQuestions: "Missed 3 out of 5 questions.",
                errorReason: "Formulas incorrectly applied.",
            },
        ],
    },
};
