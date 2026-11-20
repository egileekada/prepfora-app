"use client";

import { CustomText } from "@/components/ui";
import Link from "next/link";

interface LeaderboardCardProps {
    rank?: number | string;
    percentile?: string;
}

export default function LeaderboardCard({
    rank = "#42",
    percentile = "Top 0.1% in the country",
}: LeaderboardCardProps) {
    const formattedRank = typeof rank === "number" ? `#${rank}` : rank.startsWith("#") ? rank : `#${rank}`;

    return (
        <section className="flex-1 flex flex-col gap-4">
            <div className="w-full flex justify-between items-center">
                <CustomText type="title-md" className="font-bold text-neutral-900">
                    Leaderboard
                </CustomText>
            </div>

            <Link
                href="/dashboard/performance"
                className="flex-1 min-h-[160px] bg-[#64D2A3] hover:bg-[#5EC79A] transition-colors rounded-2xl p-6 flex items-center gap-4 shadow-sm"
            >
                <div className="bg-[#0A563C] text-white font-bold text-xl sm:text-2xl w-16 h-14 rounded-xl flex items-center justify-center shrink-0 tracking-tight">
                    {formattedRank}
                </div>

                <div className="flex flex-col gap-0.5">
                    <span className="text-base font-bold text-neutral-900 leading-snug">
                        Nationwide Rank
                    </span>
                    <span className="text-xs text-neutral-800 font-medium">
                        {percentile}
                    </span>
                </div>
            </Link>
        </section>
    );
}
