"use client"

import { GoogleBtn } from "@/components/common";
import { CustomButton, FormikField } from "@/components/ui";
import useAuth from "@/hooks/auth/useAuth";
import { FormikProvider } from "formik";

export default function RegistrationForm() {

    const { formikRegister: formik } = useAuth();

    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="w-full p-5 sm:p-6 flex flex-col gap-5 sm:gap-6 rounded-2xl bg-white shadow-sm border border-neutral-100/80">
                <div className="flex flex-col gap-3 w-full">
                    <FormikField placeholder="janedoe@mail.com" name="email" label="Email*" />
                    <FormikField placeholder="janedoe@mail.com" name="confirm_email" label="Confirm Email*" />
                </div>
                <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
                    <CustomButton fullWidth type="submit" disabled={!formik.isValid} variant={!formik.isValid ? "primary" : "disabled"}>
                        Continue
                    </CustomButton>
                    <GoogleBtn />
                </div>
            </form>
        </FormikProvider>
    );
}
