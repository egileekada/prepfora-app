"use client";

import React, { useState, useEffect } from "react";

interface UserAvatarProps {
    src?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    className?: string;
    textClassName?: string;
    alt?: string;
}

/**
 * Computes uppercase initials from first name and last name.
 * e.g., "Jane", "Doe" -> "JD"
 * e.g., "Jane", ""    -> "J"
 * Fallback is "U" (User)
 */
export function getInitials(
    firstName?: string | null,
    lastName?: string | null
): string {
    const first = firstName?.trim()?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.trim()?.charAt(0)?.toUpperCase() || "";
    const initials = `${first}${last}`.trim();
    return initials || "U";
}

export default function UserAvatar({
    src,
    firstName,
    lastName,
    className = "w-full h-full",
    textClassName = "text-base font-bold",
    alt,
}: UserAvatarProps) {
    const [imgError, setImgError] = useState(false);

    // Reset error state whenever the image source changes
    useEffect(() => {
        setImgError(false);
    }, [src]);

    const initials = getInitials(firstName, lastName);
    const resolvedAlt =
        alt || `${firstName || ""} ${lastName || ""}`.trim() || "User Avatar";

    if (src && !imgError) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={resolvedAlt}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover object-top ${className}`}
            />
        );
    }

    return (
        <div
            className={`w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white select-none ${textClassName} ${className}`}
            aria-label={resolvedAlt}
        >
            <span>{initials}</span>
        </div>
    );
}
