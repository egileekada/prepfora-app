"use client";

import React, { useState, useRef, useEffect } from "react";
import { IntensityLevel } from "./performanceTypes";

const TIMELINE_BLOCKS: IntensityLevel[][] = [
    // Row 1 (7 days)
    ["low", "mid", "low", "mid", "low", "mid", "high"],
    // Row 2 (7 days)
    ["high", "high", "mid", "mid", "high", "mid", "high"],
];

const TIME_RANGES = ["Last 14 days", "Last 30 days", "Last 90 days"];

export default function PerformanceInsight() {
    const [selectedRange, setSelectedRange] = useState("Last 14 days");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getIntensityColor = (level: IntensityLevel) => {
        if (level === "low") return "bg-[#C7D9FA]";
        if (level === "mid") return "bg-[#4F82F1]";
        return "bg-[#0B2564]"; // high intensity dark navy
    };

    return (
        <div className="w-full bg-white border border-[#E2EAF4] rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                    Performance Insight
                </h3>

                {/* Time Range Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="h-9 px-3.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 hover:border-neutral-400 flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                        <span>{selectedRange}</span>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            className={`transition-transform duration-200 ${
                                isDropdownOpen ? "rotate-180" : ""
                            }`}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-1.5 w-36 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20">
                            {TIME_RANGES.map((range) => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => {
                                        setSelectedRange(range);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${
                                        selectedRange === range
                                            ? "bg-primary-50 text-primary-300 font-bold"
                                            : "text-neutral-700 hover:bg-neutral-50"
                                    }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Insight Pills Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current Pace Pill */}
                <div className="bg-[#EDF3FD] rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold text-primary-300">
                            Current Pace
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900 mt-1">
                            Gaining Momentum
                        </h4>
                        <p className="text-xs text-neutral-600 leading-relaxed mt-1">
                            You are studying 12% more than last week. Keep this pace to reach your 85% goal faster.
                        </p>
                    </div>
                </div>

                {/* Daily Habit Pill */}
                <div className="bg-[#E8FAF3] rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold text-[#059669]">
                            Daily Habit
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900 mt-1">
                            Consistent
                        </h4>
                        <p className="text-xs text-neutral-600 leading-relaxed mt-1">
                            8-day practice streak
                        </p>
                    </div>
                </div>
            </div>

            {/* Practice Intensity Timeline */}
            <div className="flex flex-col gap-2.5 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-neutral-900">
                        Practice Intensity timeline
                    </span>

                    {/* Legend */}
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#C7D9FA] inline-block" />
                            <span>Low Intensity</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#4F82F1] inline-block" />
                            <span>Mid Intensity</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#0B2564] inline-block" />
                            <span>High Intensity</span>
                        </div>
                    </div>
                </div>

                {/* Heatmap 14 Blocks (7 x 2) */}
                <div className="flex flex-col gap-2 my-1">
                    {TIMELINE_BLOCKS.map((row, rIdx) => (
                        <div key={rIdx} className="grid grid-cols-7 gap-2.5">
                            {row.map((level, cIdx) => (
                                <div
                                    key={cIdx}
                                    className={`h-9 rounded-xl transition-transform hover:scale-105 ${getIntensityColor(
                                        level
                                    )}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Footer Labels */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                    <span>Darker blocks represent higher practice volume.</span>
                    <span>Each block represents each day</span>
                </div>
            </div>
        </div>
    );
}
