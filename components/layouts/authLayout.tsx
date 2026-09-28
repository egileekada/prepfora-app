"use client"

import { IoIosArrowDropleft } from "react-icons/io";
import { CustomText } from "../ui";
import { useRouter } from "next/navigation";

interface Props {
    children: React.ReactNode;
    title?: string;
    body?: string;
    btnlink?: string,
    btn?: string
}

export default function AuthLayout({ children, title, body, btn, btnlink }: Props) {
    const { back, push } = useRouter();

    return (
        <section className="w-full flex-1 h-full flex py-4 sm:py-6 flex-col lg:justify-center lg:items-center my-auto">
            <div className="max-w-[440px] sm:max-w-[460px] w-full flex flex-col gap-10 sm:gap-8">
                <button
                    type="button"
                    onClick={() => back()}
                    className="flex items-center gap-2 text-neutral-800 hover:text-neutral-900 transition-colors w-fit group cursor-pointer"
                >
                    <IoIosArrowDropleft size={26} className="text-neutral-800 group-hover:scale-105 transition-transform" />
                    <CustomText type="body-md" className="font-medium text-neutral-800">Back</CustomText>
                </button>
                <div className="flex lg:pt-0 pt-8 flex-col gap-1.5 sm:gap-2">
                    <CustomText type="headline-lg" className="font-semibold text-2xl sm:text-3xl text-neutral-900">
                        {title ?? "Create Account"}
                    </CustomText>
                    <div className="flex items-center flex-wrap gap-1 text-sm sm:text-base">
                        <CustomText type="body-md" className="text-neutral-600">
                            {body ?? "Already have an account?"}
                        </CustomText>
                        {btn && (
                            <button
                                type="button"
                                onClick={() => push(btnlink ?? "/")}
                                className="text-secondary-450 font-bold hover:underline cursor-pointer transition-colors"
                            >
                                {btn ?? "Login"}
                            </button>
                        )}
                    </div>
                </div>
                {children}
            </div>
        </section>
    );
}
