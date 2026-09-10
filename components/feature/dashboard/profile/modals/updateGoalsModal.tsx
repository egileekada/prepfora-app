"use client";

import React, { useState } from "react";

interface UpdateGoalsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentWaecGoal: string;
    currentJambGoal: string;
    onUpdate: (waecGoal: string, jambGoal: string) => void;
}

const WAEC_OPTIONS = [
    "Get 9 A's",
    "Get at least 5 A's",
    "Pass all my subjects",
    "Improve my grades",
];

const JAMB_OPTIONS = [
    "Score 350+",
    "Score 300+",
    "Score 250+",
    "Score 200+",
];

export default function UpdateGoalsModal({
    isOpen,
    onClose,
    currentWaecGoal,
    currentJambGoal,
    onUpdate,
}: UpdateGoalsModalProps) {
    const [activeTab, setActiveTab] = useState<"JAMB" | "WAEC">("WAEC");
    const [selectedWaec, setSelectedWaec] = useState(currentWaecGoal || "Get at least 5 A's");
    const [selectedJamb, setSelectedJamb] = useState(currentJambGoal || "Score 350+");

    if (!isOpen) return null;

    const handleUpdate = () => {
        onUpdate(selectedWaec, selectedJamb);
        onClose();
    };

    const currentOptions = activeTab === "WAEC" ? WAEC_OPTIONS : JAMB_OPTIONS;
    const currentSelected = activeTab === "WAEC" ? selectedWaec : selectedJamb;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[420px] shadow-2xl flex flex-col gap-5 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#064E3B]">
                        Update Goals
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-full border border-neutral-900 flex items-center justify-center text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-neutral-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab("JAMB")}
                        className={`pb-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                            activeTab === "JAMB"
                                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                                : "text-neutral-600 hover:text-neutral-900"
                        }`}
                    >
                        JAMB Goals
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("WAEC")}
                        className={`pb-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                            activeTab === "WAEC"
                                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                                : "text-neutral-600 hover:text-neutral-900"
                        }`}
                    >
                        WAEC Goals
                    </button>
                </div>

                {/* Options List */}
                <div className="flex flex-col gap-3 py-1">
                    {currentOptions.map((option) => {
                        const isSelected = currentSelected === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    if (activeTab === "WAEC") {
                                        setSelectedWaec(option);
                                    } else {
                                        setSelectedJamb(option);
                                    }
                                }}
                                className={`w-full text-left p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                                    isSelected
                                        ? "border-2 border-[#10B981] bg-[#ECFDF5] text-neutral-900 font-medium"
                                        : "border border-neutral-300 bg-white text-neutral-800 font-medium hover:border-neutral-400"
                                }`}
                            >
                                <span className="text-sm">{option}</span>

                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0 text-white">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Update Button */}
                <button
                    type="button"
                    onClick={handleUpdate}
                    className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-2xl transition-colors cursor-pointer shadow-xs mt-1"
                >
                    Update
                </button>
            </div>
        </div>
    );
}
