"use client"
import { ApiErrorResponse } from "@/config/getErrorMessage";
import { handleApiError } from "@/config/handleApiError";
import httpService from "@/config/httpService";
import { showSuccess } from "@/config/toast";
import { URLS } from "@/config/urls";
import { IAuthUser } from "@/types/auth";
// import { IWaitlist } from "@/types/waitlist";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { useFetchData, useUnsecureFetchDataNoCache } from "../useFetchData";
import { PaginatedResponse } from "@/types/pagination";
import { IDataExam, IExam } from "@/types/exam";

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


    const useGetQuestion = () => {
        return useFetchData<any>({
            endpoint: URLS.QUESTION,
            name: [URLS.QUESTION]
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
        useGetSubject,
        setPage,
        page
    };
};

export default useExam;
