"use client"

import { CustomButton, CustomText } from "@/components/ui";
import { FormikProvider } from "formik";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { FormikProps } from "formik";
import { IAuthUser } from "@/types/auth";

export default function ExamDate({ formik }: {
    formik: FormikProps<IAuthUser>;
}) {
    const router = useRouter();

    const option = [
        {
            label: "Next 6 Months",
            value: "Next 6 Months"
        },
        {
            label: "Next 3 Months",
            value: "Next 3 Months"
        },
        {
            label: "Next 1 Month",
            value: "Next 1 Month"
        },
        {
            label: "Not Sure",
            value: "Not Sure"
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

    const clickHanlder = () => {
        if (formik.values?.examinations?.includes("jamb")) {
            router.push("/onboarding?type=goals")
        } else {
            router.push("/onboarding?type=your-goals")
        }
    }

    return (
        <FormikProvider value={formik}>
            <form className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white ">
                <div className=" w-full flex flex-col gap-3 " >
                    {option.map((item, index) => {
                        return (
                            <CustomBox
                                key={index}
                                name={item.label}
                                isActive={formik.values?.current_examination_date === item.value}
                                onClick={() => formik.setFieldValue("current_examination_date", item.value)}
                            />
                        );
                    })}
                </div>
                <div className=" flex flex-col gap-4 w-full " >
                    <CustomButton fullWidth onClick={clickHanlder} isDisabled={formik.values?.current_examination_date?.length === 0} variant={formik.values?.current_examination_date?.length > 0 ? "primary" : "disabled"} >Continue</CustomButton>
                </div>
            </form>
        </FormikProvider>
    );
}
