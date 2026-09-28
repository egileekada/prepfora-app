import { DashboardNavbar, DashboardExamProvider } from "@/components/feature";
import { Sidebar, MobileBottomNav } from "@/components/common";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardExamProvider>
            <section className=" w-full h-screen overflow-hidden flex bg-primary-50 relative " >
                <Sidebar />
                <div className=" flex-1 flex flex-col h-full overflow-hidden " >
                    <DashboardNavbar />
                    <div className=" pt-4 px-4 pb-24 md:pt-8 md:px-6 md:pb-8 overflow-y-auto flex-1 " >
                        {children}
                    </div>
                </div>
                <MobileBottomNav />
            </section>
        </DashboardExamProvider>
    );
}