"use client";

import { useEffect, useRef, useState } from "react";
import { CustomButton, CustomText } from "../ui";
import useAuth from "@/hooks/auth/useAuth";
import { showError } from "@/config/toast";

declare global {
    interface Window {
        google?: any;
    }
}

function parseJwt(token: string) {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return null;
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export default function GoogleBtn() {
    const { googleAuth, isGoogleLoading } = useAuth();
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // Load Google Identity Services script
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (window.google?.accounts?.id) {
            setScriptLoaded(true);
            return;
        }

        const existingScript = document.getElementById("google-gsi-client");
        if (existingScript) {
            existingScript.addEventListener("load", () => setScriptLoaded(true));
            return;
        }

        const script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);
    }, []);

    // Initialize Google Identity Services
    useEffect(() => {
        if (!scriptLoaded || !window.google?.accounts?.id || !clientId) return;

        try {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response: { credential?: string }) => {
                    if (!response?.credential) {
                        showError("Failed to obtain Google credentials");
                        return;
                    }

                    const decoded = parseJwt(response.credential);
                    const email = decoded?.email || null;
                    const firstName = decoded?.given_name || decoded?.name?.split(" ")?.[0] || null;
                    const lastName = decoded?.family_name || decoded?.name?.split(" ")?.slice(1)?.join(" ") || null;

                    googleAuth.mutate({
                        id_token: response.credential,
                        email,
                        first_name: firstName,
                        last_name: lastName,
                    });
                },
            });

            if (googleButtonRef.current) {
                googleButtonRef.current.innerHTML = "";
                window.google.accounts.id.renderButton(googleButtonRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    width: 380,
                });
            }
        } catch (error) {
            console.error("Error initializing Google Identity Services:", error);
        }
    }, [scriptLoaded, clientId, googleAuth]);

    const handleClick = () => {
        if (!clientId) {
            showError("Google Client ID is missing. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env file.");
            return;
        }

        if (window.google?.accounts?.id) {
            window.google.accounts.id.prompt();
        } else {
            showError("Google Sign-In is still loading. Please try again in a moment.");
        }
    };

    return (
        <div className="relative w-full">
            <CustomButton
                type="button"
                variant="outline"
                fullWidth
                loading={isGoogleLoading}
                disabled={isGoogleLoading}
                onClick={handleClick}
                className="w-full border-primary-300 relative overflow-hidden flex items-center justify-center gap-2"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1374_7673)">
                        <path d="M23.766 12.2765C23.766 11.4608 23.6999 10.6406 23.5588 9.83813H12.24V14.4591H18.7217C18.4528 15.9495 17.5885 17.2679 16.323 18.1056V21.104H20.19C22.4608 19.014 23.766 15.9274 23.766 12.2765Z" fill="#4285F4" />
                        <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.2444 19.252C9.11376 19.252 6.45934 17.1399 5.50693 14.3003H1.51648V17.3912C3.55359 21.4434 7.70278 24.0008 12.24 24.0008Z" fill="#34A853" />
                        <path d="M5.50253 14.3002C4.99987 12.8099 4.99987 11.196 5.50253 9.70569V6.61475H1.51649C-0.18551 10.0055 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3002Z" fill="#FBBC04" />
                        <path d="M12.24 4.74966C13.9508 4.7232 15.6043 5.36697 16.8433 6.54867L20.2694 3.12262C18.1 1.0855 15.2207 -0.034466 12.24 0.000808666C7.70277 0.000808666 3.55359 2.55822 1.51648 6.61481L5.50252 9.70575C6.45052 6.86173 9.10935 4.74966 12.24 4.74966Z" fill="#EA4335" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1374_7673">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                <CustomText type="label-lg" className="text-semibold ml-1 text-primary-300">Google</CustomText>
            </CustomButton>

            {/* Hidden native Google button container that receives user clicks directly when rendered */}
            {clientId && !isGoogleLoading && (
                <div
                    ref={googleButtonRef}
                    className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden pointer-events-auto flex items-center justify-center scale-150"
                    aria-hidden="true"
                />
            )}
        </div>
    );
}