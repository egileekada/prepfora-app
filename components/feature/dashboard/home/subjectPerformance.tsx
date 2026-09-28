"use client";

import { CustomButton, CustomText } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface SubjectItem {
    name: string;
    percent: number;
    focus: string;
    color: string;
    textColor: string;
}

const DEFAULT_SUBJECTS: SubjectItem[] = [
    {
        name: "English Language",
        percent: 60,
        focus: "Focus on: Calculus & Geometry",
        color: "bg-[#3B82F6]",
        textColor: "text-[#3B82F6]",
    },
    {
        name: "Mathematics",
        percent: 0,
        focus: "Focus on: Calculus & Geometry",
        color: "bg-neutral-300",
        textColor: "text-neutral-400",
    },
    {
        name: "Biology",
        percent: 95,
        focus: "Focus on: Calculus & Geometry",
        color: "bg-[#10B981]",
        textColor: "text-[#10B981]",
    },
    {
        name: "Physics",
        percent: 35,
        focus: "Focus on: Calculus & Geometry",
        color: "bg-[#EF4444]",
        textColor: "text-[#EF4444]",
    },
];

interface SubjectPerformanceProps {
    subjects?: SubjectItem[];
    isEmpty?: boolean;
}

export default function SubjectPerformance({
    subjects = DEFAULT_SUBJECTS,
    isEmpty = false,
}: SubjectPerformanceProps) {
    const router = useRouter();

    return (
        <section className="flex-1 flex flex-col gap-4">
            <div className="w-full flex justify-between items-center">
                <CustomText type="title-md" className="font-bold text-neutral-900">
                    Subject Performance
                </CustomText>
                {!isEmpty && (
                    <Link
                        href="/dashboard/performance"
                        className="hidden md:block text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        View All
                    </Link>
                )}
            </div>

            {isEmpty ? (
                <div className="flex-1 min-h-[220px] bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-sm border border-neutral-100">
                    <CustomText type="body-lg-bold" className="text-neutral-800">
                        No subject performance to show
                    </CustomText>
                    <CustomText type="body-sm" className="text-neutral-400 max-w-xs">
                        To help Prepfora calculate how well you are doing, start practicing
                    </CustomText>
                    <CustomButton
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/dashboard/practice")}
                        className="mt-2 border-primary-500 text-primary-500 font-semibold px-6"
                    >
                        Start Practicing
                    </CustomButton>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                    {subjects.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-between gap-3 p-4 bg-white border border-[#DCE6F8] rounded-2xl shadow-sm hover:border-primary-300 transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <CustomText type="body-sm-bold" className="text-neutral-800 font-semibold">
                                    {item.name}
                                </CustomText>
                                <span className={`text-sm font-bold ${item.textColor}`}>
                                    {item.percent}%
                                </span>
                            </div>

                            {/* Thin Progress bar */}
                            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                <div
                                    style={{ width: `${item.percent}%` }}
                                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                                />
                            </div>

                            <CustomText type="body-sm" className="text-neutral-500 text-xs">
                                {item.focus}
                            </CustomText>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}