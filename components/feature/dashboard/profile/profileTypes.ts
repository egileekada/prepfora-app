export interface UserProfileData {
    firstName: string;
    lastName: string;
    handle: string;
    email: string;
    phone: string;
    stateOfResidence: string;
    universityOfInterest: string;
    walletBalance: number;
    currentBadge: string;
    avatarUrl?: string;
    examTypes: string[];
    goals: {
        exam: string;
        goal: string;
    }[];
    badges: {
        id: string;
        name: string;
        type: "percent" | "medal" | "faded";
    }[];
}

export const INITIAL_USER_PROFILE: UserProfileData = {
    firstName: "Jane",
    lastName: "Doe",
    handle: "@jane123",
    email: "jan****@gmail.com",
    phone: "+2348066641977",
    stateOfResidence: "Lagos State",
    universityOfInterest: "Obafemi Awolowo University",
    walletBalance: 4000,
    currentBadge: "Current Badge",
    avatarUrl: "/images/landing/hero1.png",
    examTypes: ["WAEC", "JAMB"],
    goals: [
        { exam: "WAEC", goal: "Get at least 5 A's" },
        { exam: "JAMB", goal: "Score 350+" },
    ],
    badges: [
        { id: "1", name: "Badge Name", type: "percent" },
        { id: "2", name: "Badge Name", type: "percent" },
        { id: "3", name: "Badge Name", type: "faded" },
    ],
};
