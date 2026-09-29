"use client";

import { useEffect, useRef, useState } from "react";
import { CustomButton, CustomText } from "../ui";
import useAuth from "@/hooks/auth/useAuth";
import { showError } from "@/config/toast";
import LoaderModal from "./loaderModal";

declare global {
    interface Window {
        google?: any;
    }
}

function GoogleIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    );
}

export default function GoogleBtn() {
    const { googleAuth, isGoogleLoading } = useAuth();
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isPopupOpening, setIsPopupOpening] = useState(false);
    const tokenClientRef = useRef<any>(null);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const mutateRef = useRef(googleAuth.mutate);
    mutateRef.current = googleAuth.mutate;

    // Load Google Identity Services script
    useEffect(() => {
        if (typeof window === "undefined") return;

        let isMounted = true;

        const checkGoogleLoaded = () => {
            if (window.google?.accounts?.oauth2) {
                if (isMounted) setScriptLoaded(true);
                return true;
            }
            return false;
        };

        if (checkGoogleLoaded()) return;

        const existingScript = document.getElementById("google-gsi-client") as HTMLScriptElement | null;
        if (existingScript) {
            const checkInterval = setInterval(() => {
                if (checkGoogleLoaded()) {
                    clearInterval(checkInterval);
                }
            }, 100);

            existingScript.addEventListener("load", () => {
                if (isMounted) checkGoogleLoaded();
            });

            return () => {
                isMounted = false;
                clearInterval(checkInterval);
            };
        }

        const script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (isMounted) checkGoogleLoaded();
        };
        script.onerror = () => {
            console.error("Failed to load Google Identity Services script");
        };
        document.body.appendChild(script);

        return () => {
            isMounted = false;
        };
    }, []);

    // Initialize Google OAuth2 Token Client
    useEffect(() => {
        if (!scriptLoaded || !window.google?.accounts?.oauth2 || !clientId) return;

        try {
            tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: "openid email profile",
                callback: async (tokenResponse: any) => {
                    setIsPopupOpening(false);

                    if (tokenResponse?.error) {
                        showError("Google Sign-In was cancelled or failed");
                        setIsAuthenticating(false);
                        return;
                    }

                    if (!tokenResponse?.access_token) {
                        showError("Failed to obtain authentication token from Google");
                        setIsAuthenticating(false);
                        return;
                    }

                    setIsAuthenticating(true);

                    try {
                        // Fetch verified profile from Google UserInfo endpoint
                        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                            headers: {
                                Authorization: `Bearer ${tokenResponse.access_token}`,
                            },
                        });

                        if (!userInfoResponse.ok) {
                            throw new Error("Unable to retrieve Google user profile");
                        }

                        const userInfo = await userInfoResponse.json();

                        mutateRef.current(
                            {
                                id_token: tokenResponse.access_token,
                                email: userInfo.email,
                                first_name: userInfo.given_name || userInfo.name?.split(" ")?.[0] || null,
                                last_name: userInfo.family_name || userInfo.name?.split(" ")?.slice(1)?.join(" ") || null,
                            },
                            {
                                onError: () => {
                                    setIsAuthenticating(false);
                                },
                                onSuccess: (data) => {
                                    if (data?.data?.success === false) {
                                        setIsAuthenticating(false);
                                    }
                                    // Modal stays open while navigating to dashboard/onboarding
                                },
                            }
                        );
                    } catch (err: any) {
                        showError(err?.message || "Google authentication failed");
                        setIsAuthenticating(false);
                    }
                },
                error_callback: (err: any) => {
                    console.error("Google OAuth error:", err);
                    setIsPopupOpening(false);
                    setIsAuthenticating(false);
                    if (err?.type !== "popup_closed") {
                        showError("Google Sign-In window encountered an error");
                    }
                },
            });
        } catch (error) {
            console.error("Error initializing Google OAuth2 client:", error);
        }
    }, [scriptLoaded, clientId]);

    const handleClick = () => {
        if (!clientId || clientId.includes("YOUR_CLIENT_ID")) {
            showError("Google Client ID is missing. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env file.");
            return;
        }

        if (!clientId.includes(".apps.googleusercontent.com")) {
            showError("Invalid Google Client ID. It must end with .apps.googleusercontent.com from your Firebase/Google console.");
            return;
        }

        if (tokenClientRef.current) {
            setIsPopupOpening(true);
            tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
        } else if (window.google?.accounts?.oauth2) {
            try {
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: "openid email profile",
                    callback: async (tokenResponse: any) => {
                        setIsPopupOpening(false);
                        if (!tokenResponse?.access_token) {
                            setIsAuthenticating(false);
                            return;
                        }
                        setIsAuthenticating(true);
                        try {
                            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                            });
                            const userInfo = await res.json();
                            mutateRef.current(
                                {
                                    id_token: tokenResponse.access_token,
                                    email: userInfo.email,
                                    first_name: userInfo.given_name || userInfo.name?.split(" ")?.[0] || null,
                                    last_name: userInfo.family_name || userInfo.name?.split(" ")?.slice(1)?.join(" ") || null,
                                },
                                {
                                    onError: () => setIsAuthenticating(false),
                                    onSuccess: (data) => {
                                        if (data?.data?.success === false) setIsAuthenticating(false);
                                    },
                                }
                            );
                        } catch {
                            setIsAuthenticating(false);
                        }
                    },
                });
                tokenClientRef.current = client;
                setIsPopupOpening(true);
                client.requestAccessToken({ prompt: "select_account" });
            } catch (e) {
                console.error(e);
                showError("Could not launch Google Sign-In");
            }
        } else {
            showError("Google Sign-In is still loading. Please try again in a moment.");
        }
    };

    const isBusy = isGoogleLoading || isAuthenticating || isPopupOpening;

    return (
        <div className="w-full relative z-20 overflow-hidden rounded-xl">
            <CustomButton
                type="button"
                variant="outline"
                fullWidth
                loading={isBusy}
                disabled={isBusy}
                onClick={handleClick}
            >
                <GoogleIcon />
                <CustomText type="label-lg" className="text-semibold ml-1 text-primary-300">
                    Google
                </CustomText>
            </CustomButton>

            {/* Reusable Loader Modal during authentication & redirect */}
            <LoaderModal
                isOpen={isGoogleLoading || isAuthenticating}
                title="Signing You In"
                description="Verifying your Google account and preparing your dashboard..."
                subtext="Please do not close or refresh this window"
                icon={<GoogleIcon className="w-8 h-8" />}
            />
        </div>
    );
}