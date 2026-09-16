"use client";

import { CustomButton, CustomText } from "@/components/ui";
import { FormikProps, FormikProvider } from "formik";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IAuthUser } from "@/types/auth";

interface CustomBoxProps {
    name: string;
    isActive: boolean;
    onClick?: () => void;
}

const CustomBox = ({ name, isActive, onClick }: CustomBoxProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={` ${isActive
                ? " border-secondary-300 bg-secondary-50 "
                : " border-neutral-100 "
                } w-full h-[102px] text-neutral-500 flex justify-center items-center rounded-xl border relative cursor-pointer transition-all `}
        >
            {isActive && (
                <FaCheckCircle
                    size={24}
                    color="#4DC497"
                    className="absolute top-3 right-3"
                />
            )}
            <CustomText type={isActive ? "body-lg-bold" : "body-lg"}>
                {name}
            </CustomText>
        </button>
    );
};

const options = [
    {
        label: "WAEC",
        value: "waec",
    },
    {
        label: "NECO",
        value: "neco",
    },
    {
        label: "JAMB",
        value: "jamb",
    },
    {
        label: "POST-UTME",
        value: "utme",
    },
];

export default function ExamType({
    formik,
    onContinue,
    buttonText = "Continue",
    isLoading = false,
}: {
    formik: FormikProps<IAuthUser>;
    onContinue?: () => void;
    buttonText?: string;
    isLoading?: boolean;
}) {
    const router = useRouter();

    const examinations = formik?.values?.examinations ?? [];
    const hasSelection = examinations.length > 0;

    const toggleSelection = (value: string) => {
        if (!formik) return;
        const current = (formik.values?.examinations ?? []).map((e) => e.toLowerCase());
        const target = value.toLowerCase();
        const next = current.includes(target)
            ? current.filter((item) => item !== target)
            : [...current, target];
        formik.setFieldValue("examinations", next);
    };

    const formContent = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (hasSelection) {
                    if (onContinue) {
                        onContinue();
                    } else {
                        router.push("/onboarding?type=exam-date");
                    }
                }
            }}
            className=" w-full p-6 flex flex-col gap-6 rounded-2xl bg-white "
        >
            <div className=" w-full grid grid-cols-2 gap-3 ">
                {options.map((item) => {
                    const isActive = examinations
                        .map((e) => e.toLowerCase())
                        .includes(item.value.toLowerCase());
                    return (
                        <CustomBox
                            key={item.value}
                            name={item.label}
                            isActive={isActive}
                            onClick={() => toggleSelection(item.value)}
                        />
                    );
                })}
            </div>
            <div className=" flex flex-col gap-4 w-full ">
                <CustomButton
                    fullWidth
                    type="submit"
                    variant={hasSelection ? "primary" : "disabled"}
                    disabled={!hasSelection || isLoading}
                >
                    {isLoading ? "Saving..." : buttonText}
                </CustomButton>
            </div>
        </form>
    );

    if (!formik) {
        return formContent;
    }

    return <FormikProvider value={formik}>{formContent}</FormikProvider>;
}
