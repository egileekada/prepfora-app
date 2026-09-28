"use client";

import { CustomButton, CustomText } from "@/components/ui";
import { useRouter } from "next/navigation";

export interface ActivityItem {
    name: string;
    body: string;
    time: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
    {
        name: "Earned 500 PrepPoints",
        body: "Completed Physics Mock Exam with 82% score.",
        time: "2h ago",
    },
    {
        name: 'Unlocked "Early Bird" Badge',
        body: "Practiced English Grammar before 6:00 AM.",
        time: "6h ago",
    },
    {
        name: "Rank Up: Nationwide #42",
        body: "You moved up 4 places in the JAMB leaderboard!",
        time: "Yesterday",
    },
];

interface RecentActivitiesProps {
    activities?: ActivityItem[];
    isEmpty?: boolean;
}

export default function RecentActivities({
    activities = DEFAULT_ACTIVITIES,
    isEmpty = false,
}: RecentActivitiesProps) {
    const router = useRouter();

    return (
        <section className="flex-1 flex flex-col gap-4">
            <div className="w-full flex justify-between items-center">
                <CustomText type="title-md" className="font-bold text-neutral-900">
                    Recent Activities
                </CustomText>
            </div>

            {isEmpty ? (
                <div className="flex-1 min-h-[220px] bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-sm border border-neutral-100">
                    <CustomText type="body-lg-bold" className="text-neutral-800">
                        No activities yet
                    </CustomText>
                    <CustomText type="body-sm" className="text-neutral-400 max-w-xs">
                        Start practicing to have your activities show up here
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
                <div className="flex w-full gap-5 flex-col p-6 rounded-2xl bg-white shadow-sm border border-neutral-100/60 justify-between flex-1">
                    {activities.map((item, index) => (
                        <div
                            key={index}
                            className={`flex w-full flex-col gap-1.5 ${
                                index !== activities.length - 1 ? "pb-4 border-b border-neutral-100" : ""
                            }`}
                        >
                            <div className="flex w-full justify-between items-center">
                                <CustomText type="body-sm-bold" className="text-neutral-900 font-bold text-sm">
                                    {item.name}
                                </CustomText>
                                <span className="text-xs text-neutral-400 font-normal">
                                    {item.time}
                                </span>
                            </div>
                            <CustomText type="body-sm" className="text-neutral-500 text-xs leading-relaxed">
                                {item.body}
                            </CustomText>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}