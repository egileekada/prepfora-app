

"use client";

import React from "react";
import {
    PerformanceStats,
    PerformanceInsight,
    SubjectPerformanceCard,
    LeaderboardSection,
} from "@/components/feature";

export default function PerformancePage() {
    return (
        <div className="w-full flex flex-col gap-6 max-w-[1400px] mx-auto pb-12 animate-fadeIn">
            {/* 4 Top Metric / Stat Cards */}
            <PerformanceStats />

            {/* Middle 2-Column Section: Insight & Subject Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <PerformanceInsight />
                <SubjectPerformanceCard />
            </div>

            {/* Leaderboard: Top 10 PrepChamps */}
            <LeaderboardSection />
        </div>
    );
}