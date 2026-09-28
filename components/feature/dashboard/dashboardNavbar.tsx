"use client";

import { CustomButton } from "@/components/ui";
import { ArrowDown2, NotificationBing } from "iconsax-reactjs";
import { useEffect, useMemo, useState } from "react";
import { StartPracticeModal, SubjectCardData } from "./practice";
import { useDashboardExam } from "./dashboardContext";
import useUser from "@/hooks/useUser";
import { Logo } from "@/components/icons";
import Link from "next/link";

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
    const [showMobileMenu, setShowMobileMenu] = useState(false);

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

    const currentExamName = options.find((item) => item.id === selectedExam)?.name || "WAEC";

    return (
        <>
            {/* Mobile Header (Image 1) */}
            <header className="flex lg:hidden h-14 sm:h-16 bg-white/95 backdrop-blur-sm border-b border-neutral-100 px-4 items-center justify-between w-full z-30 shrink-0">
                <div className="flex items-center">
                    <Logo width={105} />
                </div>

                {/* Exam dropdown pill */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="bg-white border border-neutral-300 rounded-full px-3.5 py-1 text-xs font-bold text-neutral-800 flex items-center gap-1.5 shadow-2xs hover:border-neutral-400 transition-colors"
                    >
                        <span>{currentExamName}</span>
                        <ArrowDown2
                            size={12}
                            variant="Bold"
                            className={`transition-transform duration-200 ${showMobileMenu ? "rotate-180" : ""}`}
                        />
                    </button>

                    {showMobileMenu && (
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-neutral-100 py-1.5 w-32 z-50">
                            {options.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedExam(item.id);
                                        setShowMobileMenu(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 transition-colors ${
                                        selectedExam === item.id
                                            ? "text-primary-500 font-bold bg-primary-50/60"
                                            : "text-neutral-700"
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notification and User Avatar */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="text-neutral-600 hover:text-neutral-900 transition-colors p-1"
                        aria-label="Notifications"
                    >
                        <NotificationBing size={20} />
                    </button>

                    <Link
                        href="/dashboard/profile"
                        className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 block shrink-0"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/landing/hero1.png"
                            alt="Avatar"
                            className="w-full h-full object-cover object-top"
                        />
                    </Link>
                </div>
            </header>

            {/* Desktop Navbar (Image 2) */}
            <div className="hidden lg:flex items-center h-[100px] bg-[#FFFFFF75] border-b border-[#FFFFFF] justify-center relative w-full shrink-0">
                {!isLoading && (
                    <div className="flex gap-4">
                        {options.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedExam(item.id)}
                                className={`${
                                    selectedExam === item.id
                                        ? "bg-secondary-50 border-secondary-300 text-secondary-300 font-semibold"
                                        : "text-neutral-500 border-transparent hover:text-neutral-700"
                                } border text-sm rounded-xl w-[112px] h-10 transition-colors cursor-pointer`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                )}

                <div className="absolute right-8 flex h-full justify-center gap-6 items-center">
                    <CustomButton onClick={() => setIsModalOpen(true)}>Start Practicing</CustomButton>
                    <button type="button" className="text-neutral-450 hover:text-neutral-700 transition-colors">
                        <NotificationBing size={24} />
                    </button>
                </div>
            </div>

            <StartPracticeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subject={selectedSubject}
                initialExamType={options.find((item) => item.id === selectedExam)?.name}
            />
        </>
    );
}