"use client";

import { CustomButton } from "@/components/ui";
import { ArrowDown2, NotificationBing } from "iconsax-reactjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { StartPracticeModal, SubjectCardData, PracticeConfig } from "./practice";
import { useDashboardExam } from "./dashboardContext";
import useExam from "@/hooks/exam/useExam";
import useUser from "@/hooks/useUser";
import { ICreateExaminationPayload } from "@/types/exam";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEFAULT_OPTIONS = [
    {
        name: "JAMB",
        id: "jamb",
    },
];

const normalizeExam = (raw: string): { name: string; id: string } => {
    const clean = (raw || "").trim().toLowerCase().replace(/[\s_]+/g, "-");
    if (clean === "jamb" || clean === "utme") {
        return { name: "JAMB", id: "jamb" };
    }
    if (clean === "waec") {
        return { name: "WAEC", id: "waec" };
    }
    if (clean === "neco") {
        return { name: "NECO", id: "neco" };
    }
    if (clean.includes("post") || clean === "post-utme" || clean === "postutme") {
        return { name: "POST UTME", id: "post-utme" };
    }
    return {
        name: (raw || "").toUpperCase(),
        id: clean,
    };
};

export default function DashboardNavbar() {
    const { selectedExam, setSelectedExam } = useDashboardExam();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectCardData | null>(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!showMobileMenu) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setShowMobileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMobileMenu]);

    const { useGetUserExaminations, createExamination } = useExam();
    const { useGetProfile } = useUser();
    const { data: userProfile } = useGetProfile();

    const userId =
        userProfile?.data?.id ||
        (typeof window !== "undefined" ? localStorage.getItem("prepforauserid") : null) ||
        undefined;

    // Fetch user examinations using GET /examination (get_user_examinations_examination_get)
    const { data: examinationsResponse } = useGetUserExaminations(
        { user_id: userId, limit: 100 },
        { name: ["user_examinations_navbar"] }
    );

    const options = useMemo(() => {
        const examsList = examinationsResponse?.data;
        if (examsList && Array.isArray(examsList) && examsList.length > 0) {
            const map = new Map<string, { name: string; id: string }>();

            examsList.forEach((item) => {
                if (item?.exam_type) {
                    const norm = normalizeExam(item.exam_type);
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
    }, [examinationsResponse?.data]);

    // Ensure selectedExam aligns with available options
    useEffect(() => {
        if (options.length > 0 && !options.some((item) => item.id === selectedExam)) {
            setSelectedExam(options[0].id);
        }
    }, [options, selectedExam, setSelectedExam]);

    const currentExamName = options.find((item) => item.id === selectedExam)?.name || "JAMB";

    // Create examination using POST /examination (create_examination_examination_post)
    const handleStartPractice = async (config: PracticeConfig) => {
        const effectiveUserId =
            userId || "c90c74fb-300c-43f1-b847-fcfbebf50ddb"; // Fallback guest ID

        const examType =
            config.examType.toLowerCase() === "jamb"
                ? "utme"
                : config.examType.toLowerCase();

        const subjectNames =
            config.subjects && config.subjects.length > 0
                ? config.subjects.map((s) => s.name)
                : [config.subjectName || "english"];

        const timeString = `${config.time.hours * 60 + config.time.minutes}:${String(config.time.seconds).padStart(2, "0")}`;

        const payload: ICreateExaminationPayload = {
            user_id: effectiveUserId,
            type: "practice",
            subjects: subjectNames,
            exam_year: config.year || "2024",
            exam_type: examType,
            total_question: config.questionCount || 20,
            time: timeString,
        };

        const buildExamUrl = (createdId?: string) => {
            const perSubjectCount =
                config.questionsPerSubject ||
                Math.max(1, Math.round((config.questionCount || 20) / Math.max(1, subjectNames.length)));
            const params = new URLSearchParams({
                ...(createdId ? { id: createdId, examinationId: createdId } : {}),
                subject: subjectNames[0],
                subjects: subjectNames.join(","),
                subjectTitle: config.subjectDisplayName,
                type: examType,
                year: config.year,
                limit: String(config.questionCount),
                perSubject: String(perSubjectCount),
                ...(config.school ? { school: config.school } : {}),
                hours: String(config.time.hours),
                minutes: String(config.time.minutes),
                seconds: String(config.time.seconds),
            });
            return `/exams?${params.toString()}`;
        };

        try {
            const res = await createExamination.mutateAsync(payload);
            setIsModalOpen(false);
            router.push(buildExamUrl(res?.data?.id));
        } catch (error) {
            console.error("Failed to create examination:", error);
            setIsModalOpen(false);
            router.push(buildExamUrl());
        }
    };

    return (
        <>
            {/* Mobile & Tablet Navbar */}
            <header className="flex lg:hidden min-h-14 sm:min-h-16 bg-white/95 backdrop-blur-sm border-b border-neutral-100 px-2.5 sm:px-5 py-2 items-center justify-between gap-2 w-full z-30 shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                    <Link href="/dashboard/home" className="shrink-0 flex items-center">
                        <Logo width={84} className="w-[84px] sm:w-[105px] h-auto" />
                    </Link>

                    {/* Exam dropdown pill */}
                    <div className="relative shrink-0" ref={mobileMenuRef}>
                        <button
                            type="button"
                            onClick={() => options.length > 1 && setShowMobileMenu((prev) => !prev)}
                            className="bg-white border border-neutral-300 rounded-full px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-bold text-neutral-800 flex items-center gap-1 sm:gap-1.5 shadow-2xs hover:border-neutral-400 transition-colors cursor-pointer"
                        >
                            <span>{currentExamName}</span>
                            {options.length > 1 && (
                                <ArrowDown2
                                    size={12}
                                    variant="Bold"
                                    className={`transition-transform duration-200 ${showMobileMenu ? "rotate-180" : ""}`}
                                />
                            )}
                        </button>

                        {showMobileMenu && options.length > 1 && (
                            <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-neutral-100 py-1.5 w-36 z-50">
                                {options.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedExam(item.id);
                                            setShowMobileMenu(false);
                                        }}
                                        className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 transition-colors cursor-pointer ${selectedExam === item.id
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
                </div>

                {/* Right Actions: Start Practice, Notifications, Avatar */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedSubject(null);
                            setIsModalOpen(true);
                        }}
                        disabled={createExamination.isPending}
                        className="bg-primary-300 hover:bg-primary-250 active:scale-[0.98] text-white font-semibold text-[11px] sm:text-xs px-2.5 sm:px-4 h-8 sm:h-9 rounded-xl transition-all shadow-xs whitespace-nowrap cursor-pointer disabled:opacity-60"
                    >
                        {createExamination.isPending ? "Loading..." : "Start Practice"}
                    </button>

                    <button
                        type="button"
                        className="text-neutral-600 hover:text-neutral-900 transition-colors p-1 shrink-0 cursor-pointer"
                        aria-label="Notifications"
                    >
                        <NotificationBing size={19} className="sm:w-[20px] sm:h-[20px]" />
                    </button>

                    <Link
                        href="/dashboard/profile"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-neutral-200 block shrink-0"
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

            {/* Desktop Navbar */}
            <header className="hidden lg:flex xl:grid xl:grid-cols-[1fr_auto_1fr] items-center justify-between gap-4 h-20 xl:h-[100px] bg-[#FFFFFF75] border-b border-[#FFFFFF] px-6 xl:px-8 w-full shrink-0">
                <div className="hidden xl:block" aria-hidden="true" />

                <div className="flex items-center gap-3 xl:gap-4 flex-wrap">
                    {options.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedExam(item.id)}
                            className={`${selectedExam === item.id
                                ? "bg-secondary-50 border-secondary-300 text-secondary-300 font-semibold"
                                : "text-neutral-500 border-transparent hover:text-neutral-700"
                                } border text-sm rounded-xl px-5 min-w-[100px] xl:min-w-[112px] h-10 transition-colors cursor-pointer whitespace-nowrap`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-4 xl:gap-6 items-center shrink-0">
                    <CustomButton
                        onClick={() => {
                            setSelectedSubject(null);
                            setIsModalOpen(true);
                        }}
                        loading={createExamination.isPending}
                    >
                        Start Practicing
                    </CustomButton>
                    <button
                        type="button"
                        className="text-neutral-450 hover:text-neutral-700 transition-colors cursor-pointer"
                        aria-label="Notifications"
                    >
                        <NotificationBing size={24} />
                    </button>
                </div>
            </header>

            <StartPracticeModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedSubject(null);
                }}
                subject={selectedSubject}
                initialExamType={options.find((item) => item.id === selectedExam)?.name}
                onStartPractice={handleStartPractice}
            />
        </>
    );
}