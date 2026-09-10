"use client";

import { ExamDate, ExamGoal, ExamType, ProfileForm, YourGoal } from "@/components/feature/forms/onboarding";
import { CustomText } from "@/components/ui";
import { tokenStorage } from "@/config/httpService";
import useUser from "@/hooks/useUser";
import { IUniversity } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";


export default function OnboardingPage() {

    const searchParams = useSearchParams()
    const query = searchParams.get("type")
    const { formik, useGetUniversity, isLoading } = useUser();

    const { data } = useGetUniversity();

    const router = useRouter();

    console.log(tokenStorage.getAccess());


    const stateOptions = useMemo(() => {
        const universities = data?.data?.universities;
        if (!universities?.length) return [];

        const stateSet = new Set<string>();
        universities.forEach((item: IUniversity) => {
            const trimmed = item.state?.trim();
            if (trimmed) {
                stateSet.add(trimmed);
            }
        });

        return Array.from(stateSet)
            .sort((a, b) => a.localeCompare(b))
            .map((state) => ({
                label: state,
                value: state,
            }));
    }, [data?.data?.universities]);

    const universityOptions = useMemo(() => {
        const universities = data?.data?.universities;
        if (!universities?.length) return [];

        const nameSet = new Set<string>();
        universities.forEach((item: IUniversity) => {
            const trimmed = item.name?.trim();
            if (trimmed) {
                nameSet.add(trimmed);
            }
        });

        return Array.from(nameSet)
            .sort((a, b) => a.localeCompare(b))
            .map((name) => ({
                label: name,
                value: name,
            }));
    }, [data?.data?.universities]);


    useEffect(() => {
        if (!formik.values.first_name && query) {
            router.push("/onboarding");
        }
    })

    console.log(formik.values);
    console.log(formik.errors);



    return (
        <section className=" flex-1 flex py-6 flex-col justify-center items-center ">
            <div className=" max-w-[460px] w-full flex flex-col gap-8 ">
                <div className=" flex flex-col gap-2 mt-4 ">
                    <CustomText type="headline-md" className=" font-semibold ">
                        {!query ? "Complete Your Profile" : query === "exam-type" ? "Choose the type of exam you want to focus on" : query === "exam-date" ? "Choose your closest exam date" : query === "goals" ? "What's your goal?" : "What's your goal?"}
                    </CustomText>
                </div>
                {!query && <ProfileForm formik={formik} stateOptions={stateOptions} universityOptions={universityOptions} />}
                {query === "exam-type" && <ExamType formik={formik} />}
                {query === "exam-date" && <ExamDate formik={formik} />}
                {query === "goals" && <ExamGoal isLoading={isLoading} formik={formik} />}
                {query === "your-goals" && <YourGoal isLoading={isLoading} formik={formik} />}
            </div>
        </section>
    )
}