"use client"

import { CustomButton, OTPInput } from "@/components/ui";
import useAuth from "@/hooks/auth/useAuth";
import { FormikProvider } from "formik";


export default function VerificationForm() {

    const { formikOtp: formik, isLoading } = useAuth();

    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="w-full p-5 sm:p-6 flex flex-col gap-5 sm:gap-6 rounded-2xl bg-white shadow-sm border border-neutral-100/80">
                <div className="flex flex-col gap-3 w-full justify-center items-center">
                    <OTPInput name="otp" length={6} />
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <CustomButton type="submit" disabled={!formik.isValid} fullWidth loading={formik.isSubmitting} isDisabled={isLoading} variant={!formik.isValid ? "primary" : "disabled"}>
                        Continue
                    </CustomButton>
                </div>
            </form>
        </FormikProvider>
    );
}