"use client";

import React from "react";
import { UserProfileData } from "./profileTypes";

interface PersonalInfoSectionProps {
    profile: UserProfileData;
    onEdit: () => void;
}

export default function PersonalInfoSection({
    profile,
    onEdit,
}: PersonalInfoSectionProps) {
    return (
        <section className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900">Personal Info</h3>
                <button
                    type="button"
                    onClick={onEdit}
                    className="border border-[#2563EB] text-[#2563EB] text-xs z-20 font-semibold px-4 py-1 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                >
                    Edit
                </button>
            </div>

            <div className="w-full bg-white border border-[#E2EAF4] rounded-2xl p-6 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {/* Email Address - Not editable */}
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-900">
                            Email Address
                        </span>
                        <span className="text-sm text-neutral-600 font-medium mt-1">
                            {profile.email}
                        </span>
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-900">
                            Phone Number
                        </span>
                        <span className="text-sm text-neutral-600 font-medium mt-1">
                            {profile.phone}
                        </span>
                    </div>

                    {/* State of Residence */}
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-900">
                            State of Residence
                        </span>
                        <span className="text-sm text-neutral-600 font-medium mt-1">
                            {profile.stateOfResidence}
                        </span>
                    </div>

                    {/* University of Interest */}
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-900">
                            University of Interest
                        </span>
                        <span className="text-sm text-neutral-600 font-medium mt-1">
                            {profile.universityOfInterest}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
