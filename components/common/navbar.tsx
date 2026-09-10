"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Dropdown, Label } from "@heroui/react";
import { HamburgerMenu } from "iconsax-reactjs";
import { Logo } from "@/components/icons";
import { CustomButton } from "@/components/ui";
import WaitlistBtn from "./waitlistBtn";

const NAV_ITEMS = [
    { label: "How it works", href: "/about" },
    // { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {(!pathname?.includes("auth") && !pathname?.includes("onboarding") && !pathname?.includes("dashboard") && !pathname?.includes("exams")) && (
                <div className=" sticky bg-[#EAEFFA] top-0 z-30 w-full h-20 lg:h-[100px] ">
                    <motion.nav
                        className="sticky top-0 z-40 w-full bg-white backdrop-blur-lg"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <header className="mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-4 px-6 lg:h-25">
                            <NextLink
                                className="flex items-center gap-1"
                                href="/"
                            >
                                <Logo width={129} />
                            </NextLink>

                            <div className="hidden items-center gap-6 lg:flex">
                                {NAV_ITEMS.map((item) => {
                                    const isActive = item.href === pathname;
                                    return (
                                        <NextLink
                                            key={item.href}
                                            href={item.href}
                                            className={`relative py-1 ${isActive ? "text-primary-300" : ""}`}
                                        >
                                            {item.label}
                                            {isActive && (
                                                <motion.span
                                                    layoutId="navbar-underline"
                                                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-primary-300 rounded-full"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 380,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}
                                        </NextLink>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <WaitlistBtn />
                                </motion.div>

                                <div className="flex lg:hidden">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <motion.button
                                                aria-label="Open menu"
                                                type="button"
                                                whileTap={{
                                                    scale: 0.85,
                                                    rotate: 90,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <HamburgerMenu size={25} />
                                            </motion.button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Popover>
                                            <Dropdown.Menu
                                                onAction={(key) => {
                                                    const item = NAV_ITEMS.find(
                                                        (i) => i.href === key,
                                                    );
                                                    if (item)
                                                        router.push(item.href);
                                                }}
                                            >
                                                {NAV_ITEMS.map((item) => (
                                                    <Dropdown.Item
                                                        key={item.href}
                                                        id={item.href}
                                                        textValue={item.label}
                                                        className={
                                                            item.href ===
                                                                pathname
                                                                ? "text-primary-300"
                                                                : ""
                                                        }
                                                    >
                                                        <Label>
                                                            {item.label}
                                                        </Label>
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown>
                                </div>
                            </div>
                        </header>
                    </motion.nav>
                </div>
            )}
        </>
    );
}
