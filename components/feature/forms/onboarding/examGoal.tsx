"use client"

import { CustomButton, CustomText } from "@/components/ui";
import { FormikProps, FormikProvider } from "formik";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { IAuthUser } from "@/types/auth";

export default function ExamGoal({ formik, isLoading }: {
    formik: FormikProps<IAuthUser>;
    isLoading: boolean;
}) {

    const router = useRouter();

    const option = [
        {
            label: "Gain admission into my first-choice university",
            value: "Gain admission into my first-choice university"
        },
        {
            label: "Score 250+",
            value: "Score 250+"
        },
        {
            label: "Score 350+",
            value: "Score 350+"
        },
        {
            label: "Improve my previous result",
            value: "Improve my previous result"
        },
    ];

    const handleSubmit = () => {
        if (formik.values.examinations.includes("neco") || formik.values.examinations.includes("waec")) {
            router.push("/onboarding?type=your-goals")
        } else {
            formik.handleSubmit()
        };
    };

    const CustomBox = (
        {
            name,
            isActive,
            onClick,
        }: {
            name: string,
            isActive: boolean,
            onClick?: () => void,
        }
    ) => {
        return (
            <button
                type="button"
                onClick={onClick}
                className={` ${isActive ? " border-secondary-300 bg-secondary-50 " : " border-neutral-100 "} w-full h-[60px] text-neutral-500 flex text-left justify-between items-center rounded-xl border relative px-4 `}
            >
                <CustomText type={isActive ? "body-lg-bold" : "body-lg"} >{name}</CustomText>
                {isActive && (
                    <FaCheckCircle size={24} color="#4DC497" />
                )}
            </button>
        )
    };

    return (
        <FormikProvider value={formik}>
            <form className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white ">
                <div className=" w-full flex flex-col gap-3 " >
                    {option.map((item, index) => {
                        return (
                            <CustomBox
                                key={index}
                                name={item.label}
                                isActive={formik.values?.current_expectation === item.value}
                                onClick={() => formik.setFieldValue("current_expectation", item.value)}
                            />
                        );
                    })}
                </div>
                <div className=" flex flex-col gap-4 w-full " >
                    <CustomButton loading={isLoading} fullWidth onClick={handleSubmit} isDisabled={!formik.values?.current_expectation} variant={formik.values?.current_expectation ? "primary" : "disabled"} >Continue</CustomButton>
                </div>
            </form>
        </FormikProvider>
    );
}
