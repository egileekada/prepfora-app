"use client";

import React from "react";
import { useRouter } from "next/navigation";

export interface MockExamResultData {
    status: "positive" | "negative";
    examTitle: string;
    score: number;
    totalScore: number;
    prepPoints: number;
}

interface MockExamResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: MockExamResultData;
}

export default function MockExamResultModal({
    isOpen,
    onClose,
    result,
}: MockExamResultModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const isPositive = result.status === "positive";

    const handleViewAnalysis = () => {
        onClose();
        router.push("/dashboard/mock-exams");
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] transition-all animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-3xl w-full max-w-[420px] p-7 sm:p-8 shadow-2xl relative flex flex-col items-center text-center">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                </button>

                {/* Illustration */}
                <div className="w-36 h-36 flex items-center justify-center my-2">
                    {isPositive ? (
                        /* Party Popper Confetti Vector Illustration */
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                            {/* Confetti particles */}
                            <circle cx="35" cy="40" r="3.5" fill="#EF4444" />
                            <circle cx="50" cy="25" r="4" fill="#2563EB" />
                            <circle cx="70" cy="35" r="3" fill="#F59E0B" />
                            <circle cx="80" cy="50" r="3.5" fill="#10B981" />
                            <circle cx="65" cy="55" r="4" fill="#8B5CF6" />
                            {/* Gold Star */}
                            <path
                                d="M72 44l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5z"
                                fill="#FACC15"
                            />
                            {/* Party Popper Cone */}
                            <g transform="translate(15, 30) rotate(-15)">
                                <path
                                    d="M20 70 L65 15 L78 35 Z"
                                    fill="#F97316"
                                    stroke="#EA580C"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M35 52 L68 25 L73 35 L42 62 Z"
                                    fill="#FBBF24"
                                />
                                <path
                                    d="M50 35 L74 20 L76 25 L55 42 Z"
                                    fill="#FCD34D"
                                />
                                <ellipse cx="72" cy="25" rx="14" ry="7" fill="#FDE047" />
                            </g>
                        </svg>
                    ) : (
                        /* Sad Yellow Cute Character Illustration */
                        <svg width="110" height="120" viewBox="0 0 110 120" fill="none">
                            {/* Body */}
                            <path
                                d="M20 50 C20 22 90 22 90 50 L90 95 C90 102 85 106 78 106 L72 106 L72 98 L38 98 L38 106 L32 106 C25 106 20 102 20 95 Z"
                                fill="#FEE082"
                            />
                            {/* Arms */}
                            <rect x="15" y="65" width="10" height="20" rx="5" fill="#F5C050" />
                            <rect x="85" y="65" width="10" height="20" rx="5" fill="#F5C050" />
                            {/* Dark round eyes */}
                            <circle cx="43" cy="52" r="4.5" fill="#374151" />
                            <circle cx="67" cy="52" r="4.5" fill="#374151" />
                            {/* Frown mouth */}
                            <path
                                d="M47 70 C51 64 59 64 63 70"
                                stroke="#A16207"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl font-bold text-neutral-900 mt-2">
                    {isPositive ? "Congratulations!!!" : "Your Result is in!"}
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                    {isPositive
                        ? `You passed your ${result.examTitle || "JAMB Exam"}`
                        : "You tried your best"}
                </p>

                {/* Score Line */}
                <div className="flex items-baseline justify-center gap-1 mt-5 mb-2">
                    <span className="text-sm font-medium text-neutral-600">
                        Your Result:
                    </span>
                    <span
                        className={`text-2xl sm:text-3xl font-extrabold ml-1 leading-none ${
                            isPositive ? "text-[#10B981]" : "text-[#EF4444]"
                        }`}
                    >
                        {result.score}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500">
                        /{result.totalScore}
                    </span>
                </div>

                {/* PrepPoints Earned Line */}
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-700 mb-6">
                    <span>PrepPoint Earned:</span>
                    {/* Coin stack icon */}
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="flex-shrink-0"
                    >
                        <ellipse cx="12" cy="18" rx="7" ry="3" fill="#C98A0C" />
                        <ellipse cx="12" cy="17" rx="7" ry="3" fill="#EAB308" />
                        <ellipse cx="12" cy="13" rx="7" ry="3" fill="#C98A0C" />
                        <ellipse cx="12" cy="12" rx="7" ry="3" fill="#FACC15" />
                        <ellipse cx="12" cy="8" rx="7" ry="3" fill="#C98A0C" />
                        <ellipse cx="12" cy="7" rx="7" ry="3" fill="#FDE047" />
                    </svg>
                    <span className="font-bold text-neutral-900">
                        {result.prepPoints}
                    </span>
                </div>

                {/* View Analysis Button */}
                <button
                    type="button"
                    onClick={handleViewAnalysis}
                    className="w-full h-12 bg-[#2563EB] hover:bg-primary-250 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer active:scale-[0.99] flex items-center justify-center shadow-xs"
                >
                    View Analysis
                </button>
            </div>
        </div>
    );
}
