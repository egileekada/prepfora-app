import { DashboardNavbar, DashboardExamProvider } from "@/components/feature";
import { Sidebar } from "@/components/common";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardExamProvider>
            <section className=" w-full h-screen overflow-hidden flex bg-primary-50 " >
                <Sidebar />
                <div className=" flex-1 flex flex-col " >
                    <DashboardNavbar />
                    <div className=" pt-10 px-6 overflow-y-auto flex-1 " >
                        {children}
                    </div>
                </div>
            </section>
        </DashboardExamProvider>
    );
}