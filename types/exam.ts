

export interface IExam {
    name: string,
    displayName: string,
    code: string,
    category: string,
    aliases: string[],
    questionCount: number,
    features: {
        hasPassages: boolean,
        hasEquations: boolean,
        hasDiagrams: boolean
    },
    examTypes: string[],
    yearRange: {
        min: number,
        max: number
    }
}

export interface IDataExam {
    subjects: IExam[];
}

export interface IQuestionOption {
    a?: string | null;
    b?: string | null;
    c?: string | null;
    d?: string | null;
    e?: string | null;
    [key: string]: string | null | undefined;
}

export interface IQuestionItem {
    id: number | string;
    question: string;
    option?: IQuestionOption | null;
    section?: string;
    image?: string;
    answer?: string;
    solution?: string;
    examtype?: string;
    examyear?: string;
    hasPassage?: number | boolean | null;
    category?: string;
}

export interface IQuestionMultipleResponse {
    subject?: string | null;
    status?: number | null;
    data: IQuestionItem[];
}

export interface ICreateExaminationPayload {
    user_id: string;
    type: "practice" | "mock" | string;
    subjects: string[];
    total_question?: number | null;
    total_score?: number | null;
    time?: string | null;
    total_questions_answered?: number;
    total_questions_failed?: number;
    questions_ids?: number[] | null;
    correct_questions?: string[] | null;
    failed_questions?: string[] | null;
    exam_year: string;
    exam_type: "waec" | "utme" | "neco" | "post-utme" | string;
}

export interface IUpdateExaminationPayload {
    type?: "practice" | "mock" | string | null;
    subjects?: string[] | null;
    total_question?: number | null;
    total_score?: number | null;
    time?: string | null;
    total_questions_answered?: number | null;
    total_questions_failed?: number | null;
    questions_ids?: number[] | null;
    correct_questions?: string[] | null;
    failed_questions?: string[] | null;
    exam_year?: string | null;
    exam_type?: "waec" | "utme" | "neco" | "post-utme" | string | null;
}

export interface IExaminationReturn {
    id: string;
    user_id: string;
    type: string;
    subjects: string[];
    total_question?: number | null;
    total_score?: number | null;
    time?: string | null;
    total_questions_answered: number;
    total_questions_failed: number;
    questions_ids?: number[] | null;
    correct_questions?: string[] | null;
    failed_questions?: string[] | null;
    exam_year: string;
    exam_type: string;
    created_at?: string;
    updated_at?: string;
    isDeleted?: boolean;
}