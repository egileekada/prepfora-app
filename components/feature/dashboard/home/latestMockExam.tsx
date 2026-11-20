"use client";

import { CustomButton, CustomText } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface MockExamData {
    title: string;
    score: number;
    date: string;
    examId?: string;
}

const DEFAULT_MOCK_EXAM: MockExamData = {
    title: "JAMB Exam",
    score: 284,
    date: "June 24, 2026",
};

interface LatestMockExamProps {
    mockExam?: MockExamData | null;
    isEmpty?: boolean;
}

export default function LatestMockExam({
    mockExam = DEFAULT_MOCK_EXAM,
    isEmpty = false,
}: LatestMockExamProps) {
    const router = useRouter();

    return (
        <section className="flex-1 flex flex-col gap-4">
            <div className="w-full flex justify-between items-center">
                <CustomText type="title-md" className="font-bold text-neutral-900">
                    Latest Mock Exam
                </CustomText>
            </div>

            {isEmpty || !mockExam ? (
                <div className="flex-1 min-h-[160px] bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-sm border border-neutral-100">
                    <CustomText type="body-lg-bold" className="text-neutral-800">
                        You have not taken any Mock Exam
                    </CustomText>
                    <CustomText type="body-sm" className="text-neutral-400 max-w-xs">
                        To help you better prepare, start by taking a mock exam to see how well you will do
                    </CustomText>
                    <CustomButton
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/dashboard/mock-exams")}
                        className="mt-2 border-primary-500 text-primary-500 font-semibold px-6"
                    >
                        Take Exam
                    </CustomButton>
                </div>
            ) : (
                <div className="flex-1 min-h-[160px] bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-neutral-100/60">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-neutral-900">
                                {mockExam.title}
                            </span>
                            <span className="text-base font-bold text-[#10B981]">
                                {mockExam.score}
                            </span>
                        </div>
                        <span className="text-xs text-neutral-400 font-normal">
                            {mockExam.date}
                        </span>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Link
                            href="/dashboard/performance"
                            className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                        >
                            View Analysis
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
}
