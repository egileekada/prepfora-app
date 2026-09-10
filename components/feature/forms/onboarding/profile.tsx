"use client"

import { useMemo } from "react";
import { CustomButton, FormikField } from "@/components/ui";
import useUser from "@/hooks/useUser";
import { IAuthUser, IUniversity } from "@/types/auth";
import { FormikProps, FormikProvider } from "formik";
import { useRouter } from "next/navigation";

export default function ProfileForm(
    { stateOptions, universityOptions, formik }: {
        stateOptions: { label: string; value: string }[];
        universityOptions: { label: string; value: string }[];
        formik: FormikProps<IAuthUser>
    }
) {
    const router = useRouter();

    const submit = () => {
        if (formik.values.university && formik.values.state && formik.values.first_name && formik.values.last_name) {
            router.push("/onboarding?type=exam-type")
        } else {
            formik.handleSubmit()
        }
    }

    return (
        <FormikProvider value={formik}>
            <form className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white ">
                <FormikField placeholder="Jane" name="first_name" label="First Name*" />
                <FormikField placeholder="Doe" name="last_name" label="Last Name*" />
                <FormikField placeholder="080XXXXXX" name="phone" label="Phone Number*" />
                <FormikField as="select" options={stateOptions} placeholder="Lagos" name="state" label="State of Residence*" />
                <FormikField as="select" options={universityOptions} placeholder="Obafemi Awolowo University" name="university" label="University of Interest*" />
                <div className=" flex flex-col gap-4 w-full " >
                    <CustomButton fullWidth onClick={submit} variant="disabled" >Continue</CustomButton>
                </div>
            </form>
        </FormikProvider>
    );
}
