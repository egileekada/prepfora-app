"use client";

import React from "react";
import { UserProfileData } from "./profileTypes";

interface PreferencesSectionProps {
    profile: UserProfileData;
    onEditExamType: () => void;
    onEditGoals: () => void;
}

export default function PreferencesSection({
    profile,
    onEditExamType,
    onEditGoals,
}: PreferencesSectionProps) {
    return (
        <section className="w-full flex flex-col gap-3">
            <h3 className="text-lg font-bold text-neutral-900">Preferences</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Exam Type Card */}
                <div className="bg-white border border-[#E2EAF4] rounded-2xl p-5 shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-neutral-900">
                            Exam Type
                        </span>
                        <button
                            type="button"
                            onClick={onEditExamType}
                            className="border border-[#2563EB] text-[#2563EB] text-xs font-semibold px-3 py-0.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {profile.examTypes.map((exam) => (
                            <span
                                key={exam}
                                className="text-sm text-neutral-600 font-medium"
                            >
                                {exam}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Goals Card */}
                <div className="bg-white border border-[#E2EAF4] rounded-2xl p-5 shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-neutral-900">
                            Goals
                        </span>
                        <button
                            type="button"
                            onClick={onEditGoals}
                            className="border border-[#2563EB] text-[#2563EB] text-xs font-semibold px-3 py-0.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {profile.goals.map((g) => (
                            <div key={g.exam} className="flex flex-col">
                                <span className="text-sm font-bold text-neutral-900">
                                    {g.exam}
                                </span>
                                <span className="text-sm text-neutral-600 font-medium">
                                    {g.goal}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
