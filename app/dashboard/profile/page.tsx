"use client";

import React, { useState, useMemo } from "react";
import {
    ProfileHeaderCard,
    WalletSection,
    PersonalInfoSection,
    PreferencesSection,
    BadgesSection,
    EditProfileModal,
    EditPersonalInfoModal,
    EditExamTypeModal,
    UpdateGoalsModal,
    GenericEditModal,
    INITIAL_USER_PROFILE,
    UserProfileData,
} from "@/components/feature";
import useUser from "@/hooks/useUser";
import { IUniversity } from "@/types/auth";

export default function ProfilePage() {
    const { useGetProfile, useGetUniversity, updateProfile } = useUser();
    const { data: profileResponse } = useGetProfile();
    const { data: universityResponse } = useGetUniversity();

    // Modal Visibility States
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isEditPersonalInfoOpen, setIsEditPersonalInfoOpen] = useState(false);
    const [isEditExamTypeOpen, setIsEditExamTypeOpen] = useState(false);
    const [isUpdateGoalsOpen, setIsUpdateGoalsOpen] = useState(false);
    const [genericModal, setGenericModal] = useState<{
        isOpen: boolean;
        title: string;
        label: string;
        field: keyof UserProfileData;
        value: string;
        as?: "input" | "select" | "textarea";
        options?: { label: string; value: string }[];
    } | null>(null);

    // University & State Options for Formik Selects
    const stateOptions = useMemo(() => {
        const universities = universityResponse?.data?.universities;
        if (!universities?.length) return [];

        const stateSet = new Set<string>();
        universities.forEach((item: IUniversity) => {
            const trimmed = item.state?.trim();
            if (trimmed) {
                stateSet.add(trimmed);
            }
        });

        return Array.from(stateSet)
            .sort((a, b) => a.localeCompare(b))
            .map((state) => ({
                label: state,
                value: state,
            }));
    }, [universityResponse?.data?.universities]);

    const universityOptions = useMemo(() => {
        const universities = universityResponse?.data?.universities;
        if (!universities?.length) return [];

        const nameSet = new Set<string>();
        universities.forEach((item: IUniversity) => {
            const trimmed = item.name?.trim();
            if (trimmed) {
                nameSet.add(trimmed);
            }
        });

        return Array.from(nameSet)
            .sort((a, b) => a.localeCompare(b))
            .map((name) => ({
                label: name,
                value: name,
            }));
    }, [universityResponse?.data?.universities]);

    // Construct User Profile with API data
    const user = profileResponse?.data;

    const profile: UserProfileData = useMemo(() => {
        const exams = user?.examinations?.length
            ? user.examinations.map((e) => e.toUpperCase())
            : INITIAL_USER_PROFILE.examTypes;

        const currentGoal = user?.current_expectation || "Score 350+";

        return {
            firstName: user?.first_name || "Jane",
            lastName: user?.last_name || "Doe",
            handle: user?.email ? `@${user.email.split("@")[0]}` : "@jane123",
            email: user?.email || "jan****@gmail.com",
            phone: user?.phone || "+2348066641977",
            stateOfResidence: user?.state || "Lagos State",
            universityOfInterest: user?.university || "Obafemi Awolowo University",
            walletBalance: user?.prep_points ?? 4000,
            currentBadge: user?.best_score ? `${user.best_score}% Top Score` : "Current Badge",
            avatarUrl: "/images/landing/hero1.png",
            examTypes: exams,
            goals: [
                {
                    exam: "WAEC",
                    goal: user?.current_expectation?.includes("WAEC")
                        ? currentGoal
                        : "Get at least 5 A's",
                },
                {
                    exam: "JAMB",
                    goal:
                        user?.current_expectation?.includes("JAMB") ||
                        !user?.current_expectation?.includes("WAEC")
                            ? currentGoal
                            : "Score 350+",
                },
            ],
            badges: INITIAL_USER_PROFILE.badges,
        };
    }, [user]);

    // Handlers using PATCH /auth/me
    const handleUpdateGoals = (waecGoal: string, jambGoal: string) => {
        updateProfile.mutate({
            current_expectation: `${waecGoal}; ${jambGoal}`,
        });
    };

    return (
        <div className="w-full flex flex-col gap-6 max-w-[1400px] mx-auto pb-16 animate-fadeIn">
            {/* Top Profile Header Card */}
            <ProfileHeaderCard
                profile={profile}
                onEditProfile={() => setIsEditProfileOpen(true)}
            />

            {/* My Wallet Section */}
            <WalletSection
                balance={profile.walletBalance}
                onAddMoney={() =>
                    setGenericModal({
                        isOpen: true,
                        title: "Add PrepPoints",
                        label: "Amount (PP)",
                        field: "walletBalance",
                        value: "1000",
                        as: "input",
                    })
                }
            />

            {/* Personal Info Section - Single Edit Action, Email Not Editable */}
            <PersonalInfoSection
                profile={profile}
                onEdit={() => setIsEditPersonalInfoOpen(true)}
            />

            {/* Preferences Section */}
            <PreferencesSection
                profile={profile}
                onEditExamType={() => setIsEditExamTypeOpen(true)}
                onEditGoals={() => setIsUpdateGoalsOpen(true)}
            />

            {/* Badges Section */}
            <BadgesSection badges={profile.badges} />

            {/* Edit Personal Info Modal (One modal for Personal Section, Email Not Editable) */}
            <EditPersonalInfoModal
                isOpen={isEditPersonalInfoOpen}
                onClose={() => setIsEditPersonalInfoOpen(false)}
                initialEmail={profile.email}
                initialPhone={profile.phone}
                initialState={profile.stateOfResidence}
                initialUniversity={profile.universityOfInterest}
                stateOptions={stateOptions}
                universityOptions={universityOptions}
                isLoading={updateProfile.isPending}
                onUpdate={(data) => {
                    updateProfile.mutate({
                        phone: data.phone,
                        state: data.state,
                        university: data.university,
                    });
                }}
            />

            {/* Edit Exam Type Modal (Uses Onboarding ExamType Component with Formik) */}
            <EditExamTypeModal
                isOpen={isEditExamTypeOpen}
                onClose={() => setIsEditExamTypeOpen(false)}
                currentExaminations={profile.examTypes}
                isLoading={updateProfile.isPending}
                onUpdate={(examinations) => {
                    updateProfile.mutate({
                        examinations,
                    });
                }}
            />

            {/* Formik Edit Profile Modal (Header Card) */}
            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                initialFirstName={profile.firstName}
                initialLastName={profile.lastName}
                initialPhone={profile.phone}
                initialState={profile.stateOfResidence}
                initialUniversity={profile.universityOfInterest}
                stateOptions={stateOptions}
                universityOptions={universityOptions}
                avatarUrl={profile.avatarUrl}
                isLoading={updateProfile.isPending}
                onUpdate={(data) => {
                    updateProfile.mutate({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        phone: data.phone,
                        state: data.state,
                        university: data.university,
                    });
                }}
            />

            {/* Goals Modal */}
            <UpdateGoalsModal
                isOpen={isUpdateGoalsOpen}
                onClose={() => setIsUpdateGoalsOpen(false)}
                currentWaecGoal={
                    profile.goals.find((g) => g.exam === "WAEC")?.goal || ""
                }
                currentJambGoal={
                    profile.goals.find((g) => g.exam === "JAMB")?.goal || ""
                }
                onUpdate={handleUpdateGoals}
            />

            {/* Generic Edit Modal (e.g. Wallet) */}
            {genericModal && (
                <GenericEditModal
                    isOpen={genericModal.isOpen}
                    onClose={() => setGenericModal(null)}
                    title={genericModal.title}
                    label={genericModal.label}
                    initialValue={genericModal.value}
                    as={genericModal.as}
                    options={genericModal.options}
                    isLoading={updateProfile.isPending}
                    onUpdate={() => {
                        setGenericModal(null);
                    }}
                />
            )}
        </div>
    );
}