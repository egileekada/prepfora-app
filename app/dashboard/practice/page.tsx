

"use client";

import React, { useState } from "react";
import {
    LastPracticeSummary,
    PracticeHub,
    StartPracticeModal,
    SubjectCardData,
} from "@/components/feature";

export default function Practice() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<SubjectCardData | null>(null);

    const handleStartPractice = (subject: SubjectCardData) => {
        setSelectedSubject(subject);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full flex flex-col gap-6 max-w-[1400px] mx-auto pb-10">
            <LastPracticeSummary />
            <PracticeHub onStartPractice={handleStartPractice} />

            <StartPracticeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                subject={selectedSubject}
            />
        </div>
    );
}


