"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export type DashboardExamType = "jamb" | "waec" | "post-utme" | "neco";

interface DashboardExamContextType {
    selectedExam: string;
    selectedExamName: string;
    setSelectedExam: (exam: string) => void;
}

const EXAM_DISPLAY_NAMES: Record<string, string> = {
    jamb: "JAMB",
    waec: "WAEC",
    "post-utme": "POST UTME",
    "post_utme": "POST UTME",
    "post utme": "POST UTME",
    neco: "NECO",
};

const normalizeExamId = (exam: string): string => {
    const clean = (exam || "").trim().toLowerCase().replace(/[\s_]+/g, "-");
    if (clean.includes("post")) return "post-utme";
    if (clean === "jamb" || clean === "utme") return "jamb";
    if (clean === "waec") return "waec";
    if (clean === "neco") return "neco";
    return clean;
};

const DashboardExamContext = createContext<DashboardExamContextType>({
    selectedExam: "jamb",
    selectedExamName: "JAMB",
    setSelectedExam: () => {},
});

export function DashboardExamProvider({ children }: { children: React.ReactNode }) {
    const [selectedExam, setSelectedExamState] = useState<string>("jamb");

    // Initialize from URL search query or localStorage on client mount
    useEffect(() => {
        try {
            const searchParams = new URLSearchParams(window.location.search);
            const fromQuery = searchParams.get("exam")?.toLowerCase();
            if (fromQuery && (fromQuery in EXAM_DISPLAY_NAMES || normalizeExamId(fromQuery) in EXAM_DISPLAY_NAMES)) {
                setSelectedExamState(normalizeExamId(fromQuery));
                return;
            }

            const stored = localStorage.getItem("prepfora_dashboard_exam");
            if (stored && (stored in EXAM_DISPLAY_NAMES || normalizeExamId(stored) in EXAM_DISPLAY_NAMES)) {
                setSelectedExamState(normalizeExamId(stored));
            }
        } catch (e) {
            console.error("Failed to read stored dashboard exam:", e);
        }
    }, []);

    const setSelectedExam = (exam: string) => {
        const normalized = normalizeExamId(exam);
        setSelectedExamState(normalized);
        try {
            localStorage.setItem("prepfora_dashboard_exam", normalized);
            const url = new URL(window.location.href);
            url.searchParams.set("exam", normalized);
            window.history.replaceState({}, "", url.toString());
        } catch (e) {
            console.error("Failed to persist dashboard exam:", e);
        }
    };

    const selectedExamName = useMemo(() => {
        return EXAM_DISPLAY_NAMES[selectedExam] || "JAMB";
    }, [selectedExam]);

    return (
        <DashboardExamContext.Provider
            value={{
                selectedExam,
                selectedExamName,
                setSelectedExam,
            }}
        >
            {children}
        </DashboardExamContext.Provider>
    );
}

export function useDashboardExam() {
    return useContext(DashboardExamContext);
}
