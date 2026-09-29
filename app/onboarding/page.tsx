"use client";

import { ExamDate, ExamGoal, ExamType, ProfileForm, YourGoal } from "@/components/feature/forms/onboarding";
import { CustomText } from "@/components/ui";
import { tokenStorage } from "@/config/httpService";
import useUser from "@/hooks/useUser";
import { IUniversity } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { IoIosArrowDropleft } from "react-icons/io";


export default function OnboardingPage() {

    const searchParams = useSearchParams()
    const query = searchParams.get("type")
    const { formik, useGetUniversity, isLoading } = useUser();

    const { data } = useGetUniversity();
    const { push } = useRouter();

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
            push("/onboarding");
        }
    })

    return (
        <section className=" flex-1 flex lg:py-6 flex-col lg:justify-center lg:items-center ">
            {/* <button
                type="button"
                onClick={() => back()}
                className="flex items-center gap-2 text-neutral-800 hover:text-neutral-900 transition-colors mr-auto w-fit group cursor-pointer"
            >
                <IoIosArrowDropleft size={26} className="text-neutral-800 group-hover:scale-105 transition-transform" />
                <CustomText type="body-md" className="font-medium text-neutral-800">Back</CustomText>
            </button> */}
            <div className=" max-w-[460px] w-full flex flex-col lg:pt-0 pt-8 gap-8 ">
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