"use client";

import React from "react";
import { ExamHistoryItem } from "./mockExamTypes";

interface ExamHistoryTableProps {
    items: ExamHistoryItem[];
    onViewAnalysis: (item: ExamHistoryItem) => void;
}

export default function ExamHistoryTable({
    items,
    onViewAnalysis,
}: ExamHistoryTableProps) {
    return (
        <section className="w-full flex flex-col gap-4 mt-8 pb-10">
            <h3 className="text-xl font-bold text-neutral-900">
                Recent Exam History
            </h3>

            <div className="w-full bg-white rounded-2xl border border-[#E2EAF4] shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-neutral-150">
                            <th className="py-4 px-6 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                EXAM TITLE
                            </th>
                            <th className="py-4 px-6 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                DATE
                            </th>
                            <th className="py-4 px-6 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                SCORE
                            </th>
                            <th className="py-4 px-6 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                                <td className="py-4 px-6 text-sm font-bold text-neutral-900">
                                    {item.examTitle}
                                </td>
                                <td className="py-4 px-6 text-sm text-neutral-600 font-normal">
                                    {item.date}
                                </td>
                                <td className="py-4 px-6 text-sm font-bold">
                                    <span
                                        className={
                                            item.scoreColor === "green"
                                                ? "text-[#10B981]"
                                                : "text-[#EF4444]"
                                        }
                                    >
                                        {item.score}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-sm">
                                    <button
                                        type="button"
                                        onClick={() => onViewAnalysis(item)}
                                        className="text-[#2563EB] font-semibold hover:underline cursor-pointer transition-colors"
                                    >
                                        View Analysis
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
