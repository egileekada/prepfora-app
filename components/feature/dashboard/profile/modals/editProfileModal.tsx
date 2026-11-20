"use client";

import React, { useEffect, useRef, useState } from "react";
import { FormikField } from "@/components/ui";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { UserAvatar } from "@/components/common";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialFirstName: string;
    initialLastName: string;
    initialPhone?: string;
    initialState?: string;
    initialUniversity?: string;
    stateOptions?: { label: string; value: string }[];
    universityOptions?: { label: string; value: string }[];
    avatarUrl?: string;
    isLoading?: boolean;
    onUploadAvatar?: (file: File) => Promise<string | undefined> | Promise<any>;
    onUpdate: (data: {
        first_name: string;
        last_name: string;
        phone?: string;
        state?: string;
        university?: string;
        profile_picture?: string;
    }) => void;
}

export default function EditProfileModal({
    isOpen,
    onClose,
    initialFirstName,
    initialLastName,
    initialPhone = "",
    initialState = "",
    initialUniversity = "",
    stateOptions = [],
    universityOptions = [],
    avatarUrl = "",
    isLoading = false,
    onUploadAvatar,
    onUpdate,
}: EditProfileModalProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(avatarUrl);
    const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false);

    const formik = useFormik({
        initialValues: {
            first_name: initialFirstName || "",
            last_name: initialLastName || "",
            phone: initialPhone || "",
            state: initialState || "",
            university: initialUniversity || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            first_name: Yup.string().required("First name is required"),
            last_name: Yup.string().required("Last name is required"),
            phone: Yup.string(),
            state: Yup.string(),
            university: Yup.string(),
        }),
        onSubmit: (values) => {
            onUpdate({
                ...values,
                ...(uploadedUrl ? { profile_picture: uploadedUrl } : {}),
            });
            onClose();
        },
    });

    useEffect(() => {
        if (isOpen) {
            setPreviewUrl(avatarUrl);
            setUploadedUrl(undefined);
            formik.resetForm({
                values: {
                    first_name: initialFirstName || "",
                    last_name: initialLastName || "",
                    phone: initialPhone || "",
                    state: initialState || "",
                    university: initialUniversity || "",
                },
            });
        }
    }, [isOpen, initialFirstName, initialLastName, initialPhone, initialState, initialUniversity, avatarUrl]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Instant local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        if (onUploadAvatar) {
            try {
                setIsUploading(true);
                const result = await onUploadAvatar(file);
                if (typeof result === "string") {
                    setUploadedUrl(result);
                }
            } catch (err) {
                console.error("Failed to upload avatar:", err);
            } finally {
                setIsUploading(false);
            }
        }
        e.target.value = "";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#064E3B]">
                        Edit Profile
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

                {/* Avatar with Teal Border and Camera Icon */}
                <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#10B981] bg-neutral-100 relative">
                        <UserAvatar
                            src={previewUrl || avatarUrl}
                            firstName={formik.values.first_name}
                            lastName={formik.values.last_name}
                            textClassName="text-2xl sm:text-3xl font-bold"
                        />
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center z-10">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Camera Badge */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-neutral-900 shadow-sm flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors disabled:opacity-50"
                        title="Change photo"
                        aria-label="Change photo"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                    />
                </div>

                {/* Formik Form */}
                <FormikProvider value={formik}>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormikField
                                name="first_name"
                                label="First Name*"
                                placeholder="First Name"
                            />
                            <FormikField
                                name="last_name"
                                label="Last Name*"
                                placeholder="Last Name"
                            />
                        </div>

                        <FormikField
                            name="phone"
                            label="Phone Number"
                            placeholder="080XXXXXXXX"
                        />

                        {stateOptions.length > 0 && (
                            <FormikField
                                as="select"
                                name="state"
                                label="State of Residence"
                                placeholder="Select State"
                                options={stateOptions}
                            />
                        )}

                        {universityOptions.length > 0 && (
                            <FormikField
                                as="select"
                                name="university"
                                label="University of Interest"
                                placeholder="Select University"
                                options={universityOptions}
                            />
                        )}

                        {/* Update Button */}
                        <button
                            type="submit"
                            disabled={isLoading || formik.isSubmitting || isUploading}
                            className="w-full h-12 mt-2 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-2xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                        >
                            {isLoading || formik.isSubmitting || isUploading ? "Updating..." : "Update Profile"}
                        </button>
                    </form>
                </FormikProvider>
            </div>
        </div>
    );
}
