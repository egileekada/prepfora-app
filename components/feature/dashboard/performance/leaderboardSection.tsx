"use client";

import React, { useState } from "react";
import { MOCK_LEADERBOARD_USERS, LeaderboardUser } from "./performanceTypes";

interface LeaderboardSectionProps {
    users?: LeaderboardUser[];
}

function UserAvatar({
    name,
    avatarUrl,
    sizeClasses = "w-10 h-10",
}: {
    name: string;
    avatarUrl?: string;
    sizeClasses?: string;
}) {
    const [imgError, setImgError] = useState(false);
    const fallbackSrc = "/images/landing/hero1.png";

    return (
        <div
            className={`${sizeClasses} rounded-full overflow-hidden bg-neutral-200 relative flex items-center justify-center flex-shrink-0`}
        >
            {!imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={avatarUrl || fallbackSrc}
                    alt={name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400 flex items-center justify-center text-white font-bold text-xs">
                    {name.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    );
}

export default function LeaderboardSection({
    users = MOCK_LEADERBOARD_USERS,
}: LeaderboardSectionProps) {
    const rank1 = users.find((u) => u.rank === 1) || {
        rank: 1,
        name: "Jane",
        points: 4000,
    };
    const rank2 = users.find((u) => u.rank === 2) || {
        rank: 2,
        name: "Jane",
        points: 3500,
    };
    const rank3 = users.find((u) => u.rank === 3) || {
        rank: 3,
        name: "Name",
        points: 2000,
    };

    const remainingUsers = users.filter((u) => u.rank >= 4 && u.rank <= 10);

    return (
        <div className="w-full flex flex-col items-center pt-8 pb-14">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 text-center tracking-tight mb-10">
                Leaderboard – Top 10 PrepChamps
            </h2>

            {/* Podium (Top 3) */}
            <div className="w-full flex items-end justify-center gap-3 sm:gap-4 md:gap-5 px-4">
                {/* Rank 2 (Left) */}
                <div className="flex flex-col items-center">
                    {/* User Info Above Pillar */}
                    <div className="flex flex-col items-center mb-2">
                        <div className="border-2 border-white rounded-full shadow-xs">
                            <UserAvatar
                                name={rank2.name}
                                avatarUrl={rank2.avatarUrl}
                                sizeClasses="w-11 h-11 sm:w-12 sm:h-12"
                            />
                        </div>
                        <span className="text-xs font-semibold text-neutral-700 mt-1">
                            {rank2.name}
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                            {rank2.points} PP
                        </span>
                    </div>

                    {/* Pillar */}
                    <div className="w-20 sm:w-24 md:w-28 h-36 sm:h-40 bg-[#E8C082] rounded-t-2xl flex items-start justify-center pt-3 shadow-xs">
                        <span className="text-2xl sm:text-3xl font-black text-[#5C3F0C]">
                            2
                        </span>
                    </div>
                </div>

                {/* Rank 1 (Center) */}
                <div className="flex flex-col items-center">
                    {/* User Info Above Pillar */}
                    <div className="flex flex-col items-center mb-2">
                        <div className="border-4 border-white rounded-full shadow-md">
                            <UserAvatar
                                name={rank1.name}
                                avatarUrl={rank1.avatarUrl}
                                sizeClasses="w-16 h-16 sm:w-20 sm:h-20"
                            />
                        </div>
                        <span className="text-sm font-bold text-neutral-900 mt-1">
                            {rank1.name}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                            {rank1.points} PP
                        </span>
                    </div>

                    {/* Pillar */}
                    <div className="w-24 sm:w-28 md:w-32 h-52 sm:h-60 bg-[#E59306] rounded-t-2xl flex items-start justify-center pt-3 shadow-xs">
                        <span className="text-3xl sm:text-4xl font-black text-neutral-900">
                            1
                        </span>
                    </div>
                </div>

                {/* Rank 3 (Right) */}
                <div className="flex flex-col items-center">
                    {/* User Info Above Pillar */}
                    <div className="flex flex-col items-center mb-2">
                        <div className="border-2 border-white rounded-full shadow-xs">
                            <UserAvatar
                                name={rank3.name}
                                avatarUrl={rank3.avatarUrl}
                                sizeClasses="w-11 h-11 sm:w-12 sm:h-12"
                            />
                        </div>
                        <span className="text-xs font-semibold text-neutral-700 mt-1">
                            {rank3.name}
                        </span>
                        <span className="text-xs font-bold text-neutral-900">
                            {rank3.points} PP
                        </span>
                    </div>

                    {/* Pillar */}
                    <div className="w-20 sm:w-24 md:w-28 h-28 sm:h-32 bg-[#F5D49D] rounded-t-2xl flex items-start justify-center pt-3 shadow-xs">
                        <span className="text-2xl sm:text-3xl font-black text-[#664614]">
                            3
                        </span>
                    </div>
                </div>
            </div>

            {/* Ranks 4 - 10 List */}
            <div className="w-full max-w-[560px] flex flex-col gap-3 mt-10 px-4">
                {remainingUsers.map((user) => (
                    <div
                        key={user.rank}
                        className="w-full bg-white border border-[#E2EAF4] rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow"
                    >
                        {/* Left: Avatar + Name */}
                        <div className="flex items-center gap-3.5">
                            <UserAvatar
                                name={user.name}
                                avatarUrl={user.avatarUrl}
                                sizeClasses="w-9 h-9 sm:w-10 sm:h-10"
                            />
                            <span className="text-sm font-semibold text-neutral-800">
                                {user.name}
                            </span>
                        </div>

                        {/* Right: Points */}
                        <span className="text-sm font-bold text-neutral-900">
                            {user.points} PP
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
