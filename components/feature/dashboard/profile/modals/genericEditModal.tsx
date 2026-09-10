"use client";

import React, { useState, useEffect } from "react";

interface GenericEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    label: string;
    initialValue: string;
    onUpdate: (value: string) => void;
}

export default function GenericEditModal({
    isOpen,
    onClose,
    title,
    label,
    initialValue,
    onUpdate,
}: GenericEditModalProps) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(value.trim() || initialValue);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div
                className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-[420px] shadow-2xl flex flex-col gap-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#064E3B]">{title}</h3>
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-neutral-800">
                            {label} *
                        </label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            required
                            className="w-full h-12 px-4 border border-neutral-300 rounded-2xl text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 mt-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-2xl transition-colors cursor-pointer shadow-xs"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
}
