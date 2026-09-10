export interface PerformanceStat {
    title: string;
    value: string;
    subUnit?: string;
    footerText: string;
    iconType: "rank" | "streak" | "points" | "badges";
}

export type IntensityLevel = "low" | "mid" | "high";

export interface SubjectPerformanceItem {
    id: string;
    name: string;
    percent: number;
    status: "needs-attention" | "strong" | "stable";
    focus: string;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    points: number;
    avatarUrl?: string;
}

export const MOCK_PERFORMANCE_STATS: PerformanceStat[] = [
    {
        title: "National Rank",
        value: "#12",
        subUnit: "/30,000 Students",
        footerText: "Up from #40",
        iconType: "rank",
    },
    {
        title: "Practice Streak",
        value: "12",
        subUnit: "days",
        footerText: "Personal Best: 20 days",
        iconType: "streak",
    },
    {
        title: "PrepPoints",
        value: "4000",
        subUnit: "points",
        footerText: "500 earned this week",
        iconType: "points",
    },
    {
        title: "Recently Earned Badges",
        value: "",
        footerText: "1 earned this week",
        iconType: "badges",
    },
];

export const MOCK_SUBJECT_PERFORMANCES: SubjectPerformanceItem[] = [
    {
        id: "eng",
        name: "English Language",
        percent: 60,
        status: "stable",
        focus: "Focus on: Calculus & Geometry",
    },
    {
        id: "math",
        name: "Mathematics",
        percent: 0,
        status: "needs-attention",
        focus: "Focus on: Calculus & Geometry",
    },
    {
        id: "bio",
        name: "Biology",
        percent: 95,
        status: "strong",
        focus: "Focus on: Calculus & Geometry",
    },
    {
        id: "phy",
        name: "Physics",
        percent: 35,
        status: "needs-attention",
        focus: "Focus on: Calculus & Geometry",
    },
];

export const MOCK_LEADERBOARD_USERS: LeaderboardUser[] = [
    { rank: 1, name: "Jane", points: 4000 },
    { rank: 2, name: "Jane", points: 3500 },
    { rank: 3, name: "Name", points: 2000 },
    { rank: 4, name: "Jane Doe", points: 1800 },
    { rank: 5, name: "Jane Doe", points: 1700 },
    { rank: 6, name: "Jane Doe", points: 1600 },
    { rank: 7, name: "Jane Doe", points: 1500 },
    { rank: 8, name: "Jane Doe", points: 1400 },
    { rank: 9, name: "Jane Doe", points: 1300 },
    { rank: 10, name: "Jane Doe", points: 1200 },
];
