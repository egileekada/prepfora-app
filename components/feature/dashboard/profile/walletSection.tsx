"use client";

import React from "react";

interface WalletSectionProps {
    balance: number;
    onAddMoney?: () => void;
}

export default function WalletSection({
    balance,
    onAddMoney,
}: WalletSectionProps) {
    return (
        <section className="w-full flex flex-col gap-3">
            <h3 className="text-lg font-bold text-neutral-900">My Wallet</h3>

            <div className="w-full bg-white border border-[#E2EAF4] rounded-2xl p-5 shadow-xs flex items-center justify-between">
                {/* Left: Balance Info */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-neutral-800">
                        Wallet Balance
                    </span>

                    <div className="bg-[#F8FAFC] border border-neutral-200/80 rounded-lg px-3 py-1.5 flex items-center gap-2 w-fit">
                        {/* Gold Coin Icon */}
                        <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
                            <ellipse cx="18" cy="26" rx="11" ry="5" fill="#C98A0C" />
                            <ellipse cx="18" cy="24.5" rx="11" ry="5" fill="#EAB308" />
                            <ellipse cx="18" cy="18" rx="11" ry="5" fill="#C98A0C" />
                            <ellipse cx="18" cy="16.5" rx="11" ry="5" fill="#FACC15" />
                            <ellipse cx="18" cy="10" rx="11" ry="5" fill="#C98A0C" />
                            <ellipse cx="18" cy="8.5" rx="11" ry="5" fill="#FDE047" />
                        </svg>
                        <span className="text-sm font-bold text-neutral-900">
                            {balance} PP
                        </span>
                    </div>
                </div>

                {/* Right: Add Money Button */}
                <button
                    type="button"
                    onClick={onAddMoney}
                    className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                    Add Money
                </button>
            </div>
        </section>
    );
}
