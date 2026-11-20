"use client";

import React, { useEffect } from "react";
import { FormikField } from "@/components/ui";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

interface EditPersonalInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialEmail: string;
    initialPhone: string;
    initialState: string;
    initialUniversity: string;
    stateOptions?: { label: string; value: string }[];
    universityOptions?: { label: string; value: string }[];
    isLoading?: boolean;
    onUpdate: (data: {
        phone?: string;
        state?: string;
        university?: string;
    }) => void;
}

export default function EditPersonalInfoModal({
    isOpen,
    onClose,
    initialEmail,
    initialPhone = "",
    initialState = "",
    initialUniversity = "",
    stateOptions = [],
    universityOptions = [],
    isLoading = false,
    onUpdate,
}: EditPersonalInfoModalProps) {
    const formik = useFormik({
        initialValues: {
            email: initialEmail || "",
            phone: initialPhone || "",
            state: initialState || "",
            university: initialUniversity || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            phone: Yup.string(),
            state: Yup.string(),
            university: Yup.string(),
        }),
        onSubmit: (values) => {
            onUpdate({
                phone: values.phone,
                state: values.state,
                university: values.university,
            });
            onClose();
        },
    });

    useEffect(() => {
        if (isOpen) {
            formik.resetForm({
                values: {
                    email: initialEmail || "",
                    phone: initialPhone || "",
                    state: initialState || "",
                    university: initialUniversity || "",
                },
            });
        }
    }, [isOpen, initialEmail, initialPhone, initialState, initialUniversity]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">
                            Edit Personal Info
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                            Update your personal and educational information.
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

                {/* Formik Form */}
                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        {/* Email Address - Non-editable */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-neutral-700">
                                Email Address
                            </label>
                            <div className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-100/90 text-neutral-600 flex items-center justify-between text-sm select-none cursor-not-allowed">
                                <span className="truncate font-medium">{initialEmail}</span>
                                <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-200/80 px-2 py-0.5 rounded-md flex-shrink-0">
                                    Not editable
                                </span>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <FormikField
                            name="phone"
                            label="Phone Number"
                            placeholder="080XXXXXXXX"
                        />

                        {/* State of Residence */}
                        {stateOptions.length > 0 && (
                            <FormikField
                                as="select"
                                name="state"
                                label="State of Residence"
                                placeholder="Select State"
                                options={stateOptions}
                            />
                        )}

                        {/* University of Interest */}
                        {universityOptions.length > 0 && (
                            <FormikField
                                as="select"
                                name="university"
                                label="University of Interest"
                                placeholder="Select University"
                                options={universityOptions}
                            />
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || formik.isSubmitting}
                            className="w-full h-12 mt-2 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-2xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                        >
                            {isLoading || formik.isSubmitting ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                </FormikProvider>
            </div>
        </div>
    );
}
