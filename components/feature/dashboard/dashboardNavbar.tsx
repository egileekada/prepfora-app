"use client"
import { CustomButton } from "@/components/ui";
import { NotificationBing } from "iconsax-reactjs";
import { useState } from "react";

export default function DashboardNavbar() {


    const option = [
        {
            name: "JAMB",
            id: 1,
        },
        {
            name: "WAEC",
            id: 2,
        },
        {
            name: "POST UTME",
            id: 3,
        },
        {
            name: "NECO",
            id: 4,
        }
    ]
    const [isSidebarOpen, setIsSidebarOpen] = useState(1);

    return (
        <div className=" flex items-center h-[100px] bg-[#FFFFFF75] border-b border-[#FFFFFF] justify-center  " >
            <div className=" flex gap-4 " >
                {option.map((item) => (
                    <button key={item.id} onClick={() => setIsSidebarOpen(item.id)} className={`${isSidebarOpen === item.id ? " bg-secondary-50 border-secondary-300 text-secondary-300 font-semibold " : " text-neutral-500 border-transparent "} border text-sm rounded-xl w-[112px] h-10 `}>
                        {item.name}
                    </button>
                ))}
            </div>
            <div className=" absolute right-8 flex h-full justify-center gap-6 items-center " >
                <CustomButton>Continue Practicing</CustomButton>
                <button className=" text-neutral-450 " >
                    <NotificationBing size={24} />
                </button>
            </div>
        </div>
    )
}