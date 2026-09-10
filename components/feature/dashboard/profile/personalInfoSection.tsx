"use client";

import React from "react";
import { UserProfileData } from "./profileTypes";

interface PersonalInfoSectionProps {
    profile: UserProfileData;
    onChangeEmail: () => void;
    onChangePhone: () => void;
    onChangeState: () => void;
    onChangeUniversity: () => void;
}

export default function PersonalInfoSection({
    profile,
    onChangeEmail,
    onChangePhone,
    onChangeState,
    onChangeUniversity,
}: PersonalInfoSectionProps) {
    return (
        <section className="w-full flex flex-col gap-3">
            <h3 className="text-lg font-bold text-neutral-900">Personal Info</h3>

            <div className="w-full bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {/* Email Address */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-neutral-900">
                                Email Address
                            </span>
                            <button
                                type="button"
                                onClick={onChangeEmail}
                                className="border border-[#2563EB] text-[#2563EB] text-xs font-semibold px-3 py-0.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                                Change
                            </button>
                        </div>
                        <span className="text-sm text-neutral-600 font-medium mt-1">
                            {profile.email}
                        </span>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-neutral-900">
                                Phone Number
                            </span>
                            <button
                                type="button"
                                onClick={onChangePhone}
                                className="border border-[#2563EB] text-[#2563EB] text-xs font-semibold px-3 py-0.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                                Change
                            </button>
                        </div>
                        <span className="text-sm text-neutral-600 font-medium mt-1">
                            {profile.phone}
                        </span>
                    </div>

                    {/* State of Residence */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-neutral-900">
                                State of Residence
                            </span>
                            <button
                                type="button"
                                onClick={onChangeState}
                                className="border border-[#2563EB] text-[#2563EB] text-xs font-semibold px-3 py-0.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                                Change
                            </button>
                        </div>
                        <span className="text-sm text-neutral-600 font-medium mt-1">
                            {profile.stateOfResidence}
                        </span>
                    </div>

                    {/* University of Interest */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-neutral-900">
                                University of Interest
                            </span>
                            <button
                                type="button"
                                onClick={onChangeUniversity}
                                className="border border-[#2563EB] text-[#2563EB] text-xs font-semibold px-3 py-0.5 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                                Change
                            </button>
                        </div>
                        <span className="text-sm text-neutral-600 font-medium mt-1">
                            {profile.universityOfInterest}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
