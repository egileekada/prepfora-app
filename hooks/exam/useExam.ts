"use client"
import { ApiErrorResponse } from "@/config/getErrorMessage";
import { handleApiError } from "@/config/handleApiError";
import httpService from "@/config/httpService";
import { showSuccess } from "@/config/toast";
import { URLS } from "@/config/urls";
import { IAuthUser } from "@/types/auth";
// import { IWaitlist } from "@/types/waitlist";
import { fetchUnsecureData } from "@/config/api";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { useFetchData, useUnsecureFetchDataNoCache } from "../useFetchData";
import { PaginatedResponse } from "@/types/pagination";
import { 
    IDataExam, 
    IExam, 
    ICreateExaminationPayload, 
    IUpdateExaminationPayload, 
    IExaminationReturn,
    IQuestionMultipleResponse 
} from "@/types/exam";

const useExam = () => {

    const router = useRouter()

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .required("First name is required"),
        last_name: Yup.string()
            .required("Last name is required"),
        state: Yup.string()
            .required("State is required"),
        university: Yup.string()
            .required("University is required"),
        examinations: Yup.array()
            .required("Examinations is required"),
        current_expectation: Yup.string()
            .required("Current expectation is required"),
        phone: Yup.string()
            .required("Phone is required"),
        current_examination_date: Yup.string()
            .required("Current examination date is required"),
    });

    const updateUser = useMutation({
        mutationFn: (data: IAuthUser) =>
            httpService.patch(URLS.USER_PROFILE, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {
            showSuccess(data?.data?.message)
            router.push(`/dashboard/home`)
        },
    });

    const [page, setPage] = useState(1)

    const useGetSubject = () => {
        return useUnsecureFetchDataNoCache<PaginatedResponse<IDataExam>>({
            endpoint: URLS.SUBJECT,
            name: [URLS.SUBJECT]
        });
    };

    const useGetQuestion = (
        subject?: string, 
        limit?: string | number, 
        year?: string, 
        type?: string
    ) => {
        const cleanParams: Record<string, unknown> = {
            subject: subject ? subject.toLowerCase() : "english",
            limit: limit ? Number(limit) : 20,
        };
        if (type && type.trim()) {
            cleanParams.type = type.toLowerCase();
        }
        if (year && year.trim()) {
            cleanParams.year = year;
        }

        return useUnsecureFetchDataNoCache<{
            success: boolean;
            message: string;
            data: IQuestionMultipleResponse;
        }>({
            endpoint: URLS.QUESTION,
            name: [URLS.QUESTION],
            params: cleanParams
        });
    };

    const buildMultiSubjectQuestionSpecs = (
        subjects: string[],
        questionsPerSubject: number = 20,
        year?: string,
        type?: string,
        subjectLimits?: Record<string, number>
    ) => {
        const cleanSubjects =
            subjects.length > 0
                ? subjects.map((s) => s.trim().toLowerCase()).filter(Boolean)
                : [];
        const defaultSubjLimit = Math.min(100, Math.max(1, questionsPerSubject));

        return cleanSubjects.map((subj) => {
            const customLimit = subjectLimits?.[subj];
            const subjLimit = customLimit
                ? Math.min(100, Math.max(1, customLimit))
                : defaultSubjLimit;
            const cleanParams: Record<string, unknown> = {
                subject: subj,
                limit: subjLimit,
            };
            if (type && type.trim()) {
                const normalizedType = type.trim().toLowerCase();
                cleanParams.type = normalizedType === "jamb" ? "utme" : normalizedType;
            }
            if (year && year.trim()) {
                cleanParams.year = year.trim();
            }

            return {
                subject: subj,
                subjLimit,
                cleanParams,
            };
        });
    };

    const useGetMultiSubjectQuestions = (
        subjects: string[],
        questionsPerSubject: number = 20,
        year?: string,
        type?: string,
        enabled: boolean = true,
        subjectLimits?: Record<string, number>
    ) => {
        const specs = buildMultiSubjectQuestionSpecs(
            subjects,
            questionsPerSubject,
            year,
            type,
            subjectLimits
        );

        const queries = useQueries({
            queries: specs.map(({ subject: subj, subjLimit, cleanParams }) => ({
                queryKey: [
                    URLS.QUESTION,
                    "multi",
                    subj,
                    subjLimit,
                    year || "",
                    type || "",
                ],
                queryFn: () =>
                    fetchUnsecureData<{
                        success: boolean;
                        message: string;
                        data: IQuestionMultipleResponse;
                    }>(URLS.QUESTION, cleanParams),
                enabled: enabled && Boolean(subj),
                staleTime: 0,
            })),
        });

        const isLoading = queries.some((q) => q.isLoading);
        const isError = queries.length > 0 && queries.every((q) => q.isError);

        const questionsBySubject = specs.map(({ subject: subj }, idx) => {
            const items = queries[idx]?.data?.data?.data || [];
            const queryDone = queries[idx]?.status === "success" && !queries[idx]?.isFetching;
            return {
                subject: subj,
                items,
                isEmpty: Boolean(queryDone && items.length === 0),
            };
        });

        const emptySubjects = questionsBySubject
            .filter((entry) => entry.isEmpty)
            .map((entry) => entry.subject);

        const refetchAll = () => {
            queries.forEach((q) => q.refetch());
        };

        return {
            questionsBySubject,
            emptySubjects,
            isLoading,
            isError,
            refetchAll,
        };
    };

    /** Checks question availability from GET /questions for each subject before starting an exam. */
    const checkMultiSubjectQuestions = async (
        subjects: string[],
        questionsPerSubject: number = 20,
        year?: string,
        type?: string
    ): Promise<{
        hasQuestions: boolean;
        emptySubjects: string[];
    }> => {
        const specs = buildMultiSubjectQuestionSpecs(subjects, questionsPerSubject, year, type);
        if (specs.length === 0) {
            return { hasQuestions: false, emptySubjects: [] };
        }

        const results = await Promise.all(
            specs.map(async ({ subject: subj, cleanParams }) => {
                const res = await fetchUnsecureData<{
                    success: boolean;
                    message: string;
                    data: IQuestionMultipleResponse;
                }>(URLS.QUESTION, cleanParams);
                const items = res?.data?.data;
                return {
                    subject: subj,
                    hasItems: Array.isArray(items) && items.length > 0,
                };
            })
        );

        const emptySubjects = results
            .filter((entry) => !entry.hasItems)
            .map((entry) => entry.subject);

        return {
            hasQuestions: emptySubjects.length === 0,
            emptySubjects,
        };
    };

    const createExamination = useMutation({
        mutationFn: async (data: ICreateExaminationPayload) => {
            const response = await httpService.post<{
                success: boolean;
                message: string;
                data: IExaminationReturn;
            }>(URLS.EXAMINATION, data);
            return response.data;
        },
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
    });

    const updateExamination = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: IUpdateExaminationPayload;
        }) => {
            const response = await httpService.put<{
                success: boolean;
                message: string;
                data: IExaminationReturn;
            }>(`${URLS.EXAMINATION}/${id}`, data);
            return response.data;
        },
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
    });

    const useGetUserExaminations = (
        params?: {
            user_id?: string;
            subject?: string;
            exam_type?: string;
            year?: string;
            type?: string;
            page?: number;
            limit?: number;
        },
        options?: {
            name?: string[];
            enable?: boolean;
            pagination?: boolean;
        }
    ) => {
        const cleanParams: Record<string, unknown> = {};
        if (params) {
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined && val !== null && val !== "") {
                    cleanParams[key] = val;
                }
            });
        }

        return useUnsecureFetchDataNoCache<PaginatedResponse<IExaminationReturn[]>>({
            endpoint: URLS.EXAMINATION,
            name: options?.name ?? [URLS.EXAMINATION],
            params: cleanParams,
            pagination: options?.pagination ?? true,
            enable: options?.enable ?? true,
        });
    };

    const useGetExaminationById = (id?: string) => {
        return useUnsecureFetchDataNoCache<{
            success: boolean;
            message: string;
            data: IExaminationReturn;
        }>({
            endpoint: `${URLS.EXAMINATION}/${id}`,
            name: id ? [URLS.EXAMINATION, id] : [URLS.EXAMINATION],
            enable: Boolean(id),
        });
    };


    const formik = useFormik<IAuthUser>({
        initialValues: {
            first_name: "",
            last_name: "",
            state: "",
            university: "",
            phone: "",
            current_examination_date: "",
            examinations: [],
            current_expectation: ""
        },
        validationSchema: validationSchema,
        onSubmit: (data) => {
            const convertToDate = () => {
                if (!data?.current_examination_date) return "";
                if (data.current_examination_date === "Next 6 Months") {
                    const date = new Date();
                    date.setDate(date.getDate() + 180);
                    return date.toISOString();
                } else if (data.current_examination_date === "Next 3 Months") {
                    const date = new Date();
                    date.setDate(date.getDate() + 90);
                    return date.toISOString();
                } else if (data.current_examination_date === "Next 1 Month") {
                    const date = new Date();
                    date.setDate(date.getDate() + 30);
                    return date.toISOString();
                } else if (data.current_examination_date === "Not Sure") {
                    const date = new Date();
                    date.setDate(date.getDate() + 365);
                    return date.toISOString();
                } else if (!isNaN(Date.parse(data.current_examination_date))) {
                    return new Date(data.current_examination_date).toISOString();
                } else {
                    const date = new Date();
                    date.setDate(date.getDate() + 365);
                    return date.toISOString();
                }
            };

            updateUser.mutate({
                ...data,
                current_examination_date: convertToDate()
            })
        },
    });

    const isLoading = updateUser.isPending

    return {
        formik,
        isLoading,
        useGetQuestion,
        useGetMultiSubjectQuestions,
        checkMultiSubjectQuestions,
        useGetSubject,
        useGetUserExaminations,
        useGetExaminationById,
        createExamination,
        updateExamination,
        setPage,
        page
    };
};

export default useExam;
