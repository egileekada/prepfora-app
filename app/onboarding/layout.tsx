import { CustomImage } from "@/components/ui";
import { Suspense } from "react";


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense>
            <div className="w-full min-h-screen flex bg-primary-50">
                {/* Hero image for large screens */}
                <div className="hidden lg:block lg:w-1/2 relative h-screen top-0">
                    <CustomImage src={"/images/auth.png"} alt="auth" layout="fill" objectFit="cover" priority />
                </div>

                {/* Auth form container - full width on mobile/tablet, half on desktop */}
                <div className="w-full lg:w-1/2 min-h-screen overflow-y-auto py-8 sm:py-10 px-4 sm:px-6 md:px-8 flex lg:justify-center lg:items-center lg:bg-accent/70">
                    {children}
                </div>
            </div>
        </Suspense>
    );
}