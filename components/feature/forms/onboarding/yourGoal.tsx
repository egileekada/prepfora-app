"use client"

import { CustomButton, CustomText } from "@/components/ui";
import { FormikProps, FormikProvider } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IAuthUser } from "@/types/auth";

export default function YourGoal({ formik, isLoading }: {
    formik: FormikProps<IAuthUser>,
    isLoading: boolean
}) {

    const router = useRouter();

    const option = [
        {
            label: "Get 9 A's",
            value: "Get 9 A's"
        },
        {
            label: "Get at least 5 A's",
            value: "Get at least 5 A's"
        },
        {
            label: "Pass all my subjects",
            value: "Pass all my subjects"
        },
        {
            label: "Improve my grades",
            value: "Improve my grades"
        },
    ];

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
                className={` ${isActive ? " border-secondary-300 bg-secondary-50 " : " border-neutral-100 "} w-full h-[60px] text-neutral-500 flex justify-between items-center rounded-xl border relative px-4 `}
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
            <form onSubmit={formik.handleSubmit} className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white ">
                <div className=" w-full flex flex-col gap-3 " >
                    {option.map((item, index) => {
                        return (
                            <CustomBox
                                key={index}
                                name={item.label}
                                isActive={formik.values?.current_expectation.includes(item.value)}
                                onClick={() => formik.setFieldValue("current_expectation", item.value)}
                            />
                        );
                    })}
                </div>
                <div className=" flex flex-col gap-4 w-full " >
                    <CustomButton fullWidth loading={isLoading} disabled={formik.values?.current_expectation.length === 0} type="submit" variant={formik.values?.current_expectation.length > 0 ? "primary" : "disabled"} >Go to Dashboard</CustomButton>
                </div>
            </form>
        </FormikProvider>
    );
}
