"use client"
import {
    Book,
    ChartSquare,
    Element4,
    Like,
    Monitor,
    Profile2User,
    ShieldSecurity,
    Sms,
    TrendUp,
} from "iconsax-reactjs";
import { Logo } from "../icons";
import { CustomText } from "../ui";
import { usePathname, useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { textLimit } from "@/config/textlimit";

export default function Sidebar() {

    const pathname = usePathname()
    const { push } = useRouter()

    const { useGetProfile } = useUser()
    const { data } = useGetProfile()
    console.log(data, "data");


    const sidebar_link = [
        {
            name: "Dashboard",
            link: "/dashboard/home",
            icon: Element4,
            disable: false
        },
        {
            name: "Practice",
            link: "/dashboard/practice",
            icon: TrendUp,
            disable: false
        },
        {
            name: "Mock Exams",
            link: "/dashboard/mock-exams",
            icon: Monitor,
            disable: false
        },
        {
            name: "Performance",
            link: "/dashboard/performance",
            icon: ChartSquare,
            disable: false
        }
    ];

    return (
        <div className=" w-fit h-screen ">
            <div className=" w-[263px] h-screen bg-primary-300 py-10 items-start flex flex-col px-6 ">
                <div className=" ">
                    <Logo color="white" width={150} />
                </div>
                <div className=" w-full flex-col flex pt-10 gap-2 ">
                    {sidebar_link?.map((item, index) => {
                        return (
                            <button
                                key={index}
                                disabled={item?.disable}
                                onClick={() => push(item.link)}
                                className={` ${pathname === item?.link ? " bg-primary-550 " : ""} cursor-pointer  px-3 gap-4 flex items-center text-white w-full h-[50px] rounded-lg `}
                            >
                                <item.icon size={24} />
                                <CustomText type="body-lg">
                                    {item?.name}
                                </CustomText>
                            </button>
                        );
                    })}
                </div>
                <button
                    type="button"
                    onClick={() => push("/dashboard/profile")}
                    className={`p-4 w-full rounded-2xl bg-primary-350 flex items-center gap-4 mt-auto text-white cursor-pointer hover:bg-primary-550 transition-colors text-left ${
                        pathname === "/dashboard/profile" ? "ring-2 ring-white/50" : ""
                    }`}
                >
                    <div className="w-fit">
                        <div className="border border-white rounded-full w-10 h-10 bg-white overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/landing/hero1.png"
                                alt="Avatar"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    </div>
                    <div>
                        <CustomText type="body-lg">
                            {data?.data?.first_name
                                ? textLimit(`${data?.data?.first_name} ${data?.data?.last_name}`, 12)
                                : "Jane Doe"}
                        </CustomText>
                        <CustomText type="body-sm">Current Badge</CustomText>
                    </div>
                </button>
            </div>
        </div>
    );
}
