"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    Calendar,
    ChartSquare,
    Element4,
    Monitor,
    TrendUp,
} from "iconsax-reactjs";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        {
            name: "Dashboard",
            link: "/dashboard/home",
            icon: Element4,
        },
        {
            name: "Practice",
            link: "/dashboard/practice",
            icon: TrendUp,
        },
        {
            name: "Mock Exams",
            link: "/dashboard/mock-exams",
            icon: Monitor,
        },
        {
            name: "Performance",
            link: "/dashboard/performance",
            icon: ChartSquare,
        },
        {
            name: "Schedule",
            link: "/dashboard/profile",
            icon: Calendar,
        },
    ];

    return (
        <nav
            aria-label="Mobile Navigation"
            className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-primary-500 border-t border-primary-600 px-3 py-2 flex items-center justify-around shadow-2xl"
        >
            {navItems.map((item) => {
                const isActive = pathname === item.link;
                const Icon = item.icon;

                if (isActive) {
                    return (
                        <button
                            key={item.link}
                            type="button"
                            onClick={() => router.push(item.link)}
                            className="bg-[#0B1E48] text-white px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-inner transition-transform active:scale-95"
                        >
                            <Icon size={18} variant="Bold" />
                            <span>{item.name}</span>
                        </button>
                    );
                }

                return (
                    <button
                        key={item.link}
                        type="button"
                        onClick={() => router.push(item.link)}
                        className="text-white/80 hover:text-white p-2 rounded-lg transition-colors active:scale-90 flex items-center justify-center"
                        aria-label={item.name}
                    >
                        <Icon size={22} variant="Linear" />
                    </button>
                );
            })}
        </nav>
    );
}
