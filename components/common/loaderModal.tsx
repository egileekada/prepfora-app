"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface LoaderModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    subtext?: string;
    icon?: React.ReactNode;
}

export default function LoaderModal({
    isOpen,
    title = "Signing You In",
    description = "Please wait a moment while we set up your session...",
    subtext = "Please do not close or refresh this window",
    icon,
}: LoaderModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="loader-modal-title"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 flex flex-col items-center text-center relative overflow-hidden"
                    >
                        {/* Decorative top accent gradient */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary-250 via-primary-300 to-secondary-350" />

                        {/* Centered icon with ambient pulsing halo */}
                        <div className="relative mb-5 flex items-center justify-center">
                            <div className="absolute w-20 h-20 rounded-full bg-primary-100/50 animate-ping opacity-40" />
                            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 shadow-sm flex items-center justify-center relative z-10 text-primary-300">
                                {icon || (
                                    <div className="w-8 h-8 rounded-full border-3 border-primary-100 border-t-primary-300 animate-spin" />
                                )}
                            </div>
                        </div>

                        {/* Title with animated bouncing dots */}
                        <h3 id="loader-modal-title" className="flex items-center gap-1 text-lg sm:text-xl font-semibold text-neutral-900 mb-1.5">
                            <span>{title}</span>
                            <span className="flex">
                                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                            </span>
                        </h3>

                        {/* Subtitle / Description */}
                        {description && (
                            <p className="text-sm text-neutral-500 mb-5 leading-relaxed">
                                {description}
                            </p>
                        )}

                        {/* Animated infinite loading progress bar */}
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden mb-4 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary-250 to-primary-300 rounded-full"
                                animate={{
                                    x: ["-100%", "150%"],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.2,
                                    ease: "easeInOut",
                                }}
                                style={{ width: "50%" }}
                            />
                        </div>

                        {/* Reassurance text */}
                        {subtext && (
                            <span className="text-xs text-neutral-400 font-medium">
                                {subtext}
                            </span>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
