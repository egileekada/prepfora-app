"use client"
import { CustomButton } from "@/components/ui";
import { NotificationBing } from "iconsax-reactjs";
import { useEffect, useMemo, useState } from "react";
import { StartPracticeModal, SubjectCardData } from "./practice";
import { useDashboardExam } from "./dashboardContext";
import useUser from "@/hooks/useUser";

const DEFAULT_OPTIONS = [
    {
        name: "JAMB",
        id: "jamb",
    },
    {
        name: "WAEC",
        id: "waec",
    },
    {
        name: "POST UTME",
        id: "post-utme",
    },
    {
        name: "NECO",
        id: "neco",
    },
];

const normalizeExam = (raw: string): { name: string; id: string } => {
    const clean = raw.trim().toLowerCase().replace(/[\s_]+/g, "-");
    if (clean === "jamb") {
        return { name: "JAMB", id: "jamb" };
    }
    if (clean === "waec") {
        return { name: "WAEC", id: "waec" };
    }
    if (clean === "neco") {
        return { name: "NECO", id: "neco" };
    }
    if (clean.includes("post") || clean === "utme" || clean === "post-utme" || clean === "postutme") {
        return { name: "POST UTME", id: "post-utme" };
    }
    return {
        name: raw.toUpperCase(),
        id: clean,
    };
};

export default function DashboardNavbar() {
    const { selectedExam, setSelectedExam } = useDashboardExam();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectCardData | null>(null);

    const { useGetProfile } = useUser();
    const { data: profileResponse, isLoading } = useGetProfile();

    const options = useMemo(() => {
        const userExams = profileResponse?.data?.examinations;
        if (userExams && Array.isArray(userExams) && userExams.length > 0) {
            const map = new Map<string, { name: string; id: string }>();

            userExams.forEach((exam) => {
                if (exam) {
                    const norm = normalizeExam(exam);
                    if (!map.has(norm.id)) {
                        map.set(norm.id, norm);
                    }
                }
            });
            if (map.size > 0) {
                return Array.from(map.values());
            }
        }
        return DEFAULT_OPTIONS;
    }, [profileResponse?.data?.examinations]);

    // Ensure selectedExam aligns with available options from profile
    useEffect(() => {
        if (options.length > 0 && !options.some((item) => item.id === selectedExam)) {
            setSelectedExam(options[0].id);
        }
    }, [options, selectedExam, setSelectedExam]);

    return (
        <div className=" flex items-center h-[100px] bg-[#FFFFFF75] border-b border-[#FFFFFF] justify-center  " >
            {!isLoading && (
                <div className=" flex gap-4 " >
                    {options.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedExam(item.id)}
                            className={`${selectedExam === item.id
                                ? " bg-secondary-50 border-secondary-300 text-secondary-300 font-semibold "
                                : " text-neutral-500 border-transparent hover:text-neutral-700 "
                                } border text-sm rounded-xl w-[112px] h-10 transition-colors cursor-pointer `}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            )}

            <div className=" absolute right-8 flex h-full justify-center gap-6 items-center " >
                <CustomButton onClick={() => setIsModalOpen(true)} >Start Practicing</CustomButton>
                <button className=" text-neutral-450 " >
                    <NotificationBing size={24} />
                </button>
            </div>
            <StartPracticeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subject={selectedSubject}
                initialExamType={options.find((item) => item.id === selectedExam)?.name}
            />
        </div>
    )
}