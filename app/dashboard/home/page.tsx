"use client";

import { BadgeRosetteIcon, CoinIcon, FlameIcon, StarIcon } from "@/components";
import {
    LatestMockExam,
    LeaderboardCard,
    RecentActivities,
    SubjectPerformance,
} from "@/components/feature";
import { CustomText } from "@/components/ui";
import useUser from "@/hooks/useUser";

export default function DashboardHome() {
    const { useGetProfile } = useUser();
    const { data: profileResponse } = useGetProfile();
    const profile = profileResponse?.data;

    const firstName = profile?.first_name || "Jane";

    const info = [
        {
            name: "Best Score",
            mobileName: "Readiness Score",
            value: profile?.best_score ? String(profile.best_score) : "300",
            mobileValue: "80%",
            unit: "/400",
            mobileUnit: "/100",
            body: profile?.best_score
                ? "Your best all-time score"
                : "Your best all-time score",
            mobileBody: "You have not taken any exams",
            icon: <StarIcon className="w-10 h-10 sm:w-11 sm:h-11" />,
        },
        {
            name: "Practice Streak",
            mobileName: "Practice Streak",
            value: "12",
            mobileValue: "12",
            unit: "days",
            mobileUnit: "days",
            body: "Personal Best: 20 days",
            mobileBody: "Personal Best: 20 days",
            icon: <FlameIcon className="w-10 h-10 sm:w-11 sm:h-11" />,
        },
        {
            name: "PrepPoints",
            mobileName: "PrepPoints",
            value:
                profile?.prep_points !== undefined && profile?.prep_points !== null
                    ? String(profile.prep_points)
                    : "4000",
            mobileValue: "4000",
            unit: "points",
            mobileUnit: "points",
            body: "500 earned this week",
            mobileBody: "500 earned this week",
            icon: <CoinIcon className="w-10 h-10 sm:w-11 sm:h-11" />,
        },
        {
            name: "Recently Earned Badges",
            mobileName: "Recently Earned Badges",
            value: "",
            mobileValue: "",
            unit: "",
            mobileUnit: "",
            body: "1 earned this week",
            mobileBody: "1 earned this week",
            icon: <BadgeRosetteIcon className="w-10 h-10 sm:w-11 sm:h-11" />,
        },
    ];

    return (
        <section className="flex flex-1 flex-col gap-5 sm:gap-6 pb-8 w-full">
            {/* User Greeting (Hidden on mobile, visible on desktop) */}
            <div className="hidden md:block">
                <CustomText type="title-lg" className="font-bold text-neutral-900">
                    Hello {firstName} 👋
                </CustomText>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full">
                {info.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-between h-[145px] sm:h-[155px] bg-white p-3.5 sm:p-5 rounded-2xl shadow-sm border border-neutral-100/60 hover:shadow-md transition-shadow"
                    >
                        <span className="text-xs sm:text-sm font-semibold text-neutral-800">
                            <span className="inline md:hidden">{item.mobileName}</span>
                            <span className="hidden md:inline">{item.name}</span>
                        </span>

                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
                                {item.icon}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl sm:text-2xl font-bold text-neutral-900 leading-none">
                                        <span className="inline md:hidden">{item.mobileValue}</span>
                                        <span className="hidden md:inline">{item.value}</span>
                                    </span>
                                    {(item.mobileUnit || item.unit) && (
                                        <span className="text-[10px] sm:text-xs text-neutral-400 font-normal">
                                            <span className="inline md:hidden">{item.mobileUnit}</span>
                                            <span className="hidden md:inline">{item.unit}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <span className="text-[11px] sm:text-xs text-neutral-400 font-normal leading-tight">
                            <span className="inline md:hidden">{item.mobileBody}</span>
                            <span className="hidden md:inline">{item.body}</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* Row 2: Subject Performance & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-start">
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <SubjectPerformance />
                </div>
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <RecentActivities />
                </div>
            </div>

            {/* Row 3: Latest Mock Exam & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-start">
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <LatestMockExam />
                </div>
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <LeaderboardCard rank="#42" percentile="Top 0.1% in the country" />
                </div>
            </div>
        </section>
    );
}