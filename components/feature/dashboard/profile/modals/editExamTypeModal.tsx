"use client";

import React, { useEffect } from "react";
import { ExamType } from "@/components/feature/forms/onboarding";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IAuthUser } from "@/types/auth";

interface EditExamTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentExaminations: string[];
    isLoading?: boolean;
    onUpdate: (examinations: string[]) => void;
}

export default function EditExamTypeModal({
    isOpen,
    onClose,
    currentExaminations = [],
    isLoading = false,
    onUpdate,
}: EditExamTypeModalProps) {
    const formik = useFormik<IAuthUser>({
        initialValues: {
            first_name: "",
            last_name: "",
            state: "",
            university: "",
            phone: "",
            current_examination_date: "",
            current_expectation: "",
            examinations: (currentExaminations || []).map((e) => e.toLowerCase()),
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            examinations: Yup.array().min(1, "Please select at least one examination"),
        }),
        onSubmit: (values) => {
            onUpdate(values.examinations);
            onClose();
        },
    });

    useEffect(() => {
        if (isOpen) {
            formik.resetForm({
                values: {
                    first_name: "",
                    last_name: "",
                    state: "",
                    university: "",
                    phone: "",
                    current_examination_date: "",
                    current_expectation: "",
                    examinations: (currentExaminations || []).map((e) => e.toLowerCase()),
                },
            });
        }
    }, [isOpen, currentExaminations]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">
                            Edit Exam Types
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Select the examinations you are currently preparing for.
                        </p>
                    </div>
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

                {/* ExamType Formik Component */}
                <div className="w-full">
                    <ExamType
                        formik={formik}
                        onContinue={() => formik.handleSubmit()}
                        buttonText="Save Exam Types"
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}
