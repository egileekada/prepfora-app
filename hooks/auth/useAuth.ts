"use client"
import { ApiErrorResponse } from "@/config/getErrorMessage";
import { handleApiError } from "@/config/handleApiError";
import { tokenStorage, unsecureHttpService } from "@/config/httpService";
import { showError, showSuccess } from "@/config/toast";
import { URLS } from "@/config/urls";
import { IAuth, IAuthOtp, IGoogleAuthPayload } from "@/types/auth";
// import { IWaitlist } from "@/types/waitlist";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const useAuth = () => {

    const [isOpen, setOpen] = useState(false)
    const router = useRouter()

    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email")
            .required("Email is required"),
    });

    const validationSchemaRegister = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email")
            .required("Email is required"),
        confirm_email: Yup.string()
            .email("Please enter a valid email")
            .required("Email is required")
            .oneOf([Yup.ref("email")], "Email addresses do not match"),
    });

    const validationSchemaOtp = Yup.object({
        email: Yup.string()
            .email("Please enter a valid email")
            .required("Email is required"),
        otp: Yup.string()
            .required("OTP is required"),
    });

    const login = useMutation({
        mutationFn: (data: IAuth) =>
            unsecureHttpService.post(URLS.LOGIN, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {
            showSuccess(data?.data?.message)
            router.push(`/auth/verify?email=${formik.values.email}`)
        },
    });

    const register = useMutation({
        mutationFn: (data: IAuth) =>
            unsecureHttpService.post(URLS.REGISTER, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {
            showSuccess(data?.data?.message)
            router.push(`/auth/verify?email=${formikRegister.values.email}`)
        },
    });

    const otp = useMutation({
        mutationFn: (data: IAuthOtp) =>
            unsecureHttpService.post(URLS.OTP, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {

            tokenStorage.setAccess(data?.data?.data?.tokens.access_token)
            tokenStorage.setRefresh(data?.data?.data?.tokens.refresh_token)

            showSuccess(data?.data?.message)

            if (data?.data?.data?.user?.first_name) {
                router.push("/dashboard/home")
            } else {
                router.push("/onboarding")
            }
        },
    });

    const googleAuth = useMutation({
        mutationFn: (data: IGoogleAuthPayload) =>
            unsecureHttpService.post(URLS.GOOGLE, data),
        onError: (error: AxiosError<ApiErrorResponse>) => handleApiError(error),
        onSuccess: (data) => {
            if (data?.data?.success === false) {
                showError(data?.data?.message || "Google authentication failed");
                return;
            }

            const responseData = data?.data?.data;
            const tokens = responseData?.tokens;
            const user = responseData?.user;

            if (tokens?.access_token) {
                tokenStorage.setAccess(tokens.access_token);
            }
            if (tokens?.refresh_token) {
                tokenStorage.setRefresh(tokens.refresh_token);
            }

            showSuccess(data?.data?.message || "Authenticated successfully");

            const hasFilledUserInfo = Boolean(
                user?.first_name &&
                user?.state &&
                user?.university
            );

            if (hasFilledUserInfo) {
                router.replace("/dashboard/home");
            } else {
                router.replace("/onboarding");
            }
        },
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: (data) => {
            login.mutate(data)
        },
    });

    const formikRegister = useFormik({
        initialValues: {
            email: "",
            confirm_email: ""
        },
        validationSchema: validationSchemaRegister,
        onSubmit: (data) => {
            register.mutate({
                email: data.email
            })
        },
    });

    const formikOtp = useFormik({
        initialValues: {
            email: email || "",
            otp: ""
        },
        validationSchema: validationSchemaOtp,
        onSubmit: (data) => {
            otp.mutate({
                ...data,
                email: email as string,
            })
        },
    });

    const isLoading = login.isPending || register.isPending || otp.isPending || googleAuth.isPending;

    return {
        formik,
        formikRegister,
        formikOtp,
        googleAuth,
        isGoogleLoading: googleAuth.isPending,
        isOpen,
        setOpen,
        isLoading,
    };
};

export default useAuth;
