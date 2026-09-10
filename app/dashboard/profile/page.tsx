

"use client";

import React, { useState } from "react";
import {
    ProfileHeaderCard,
    WalletSection,
    PersonalInfoSection,
    PreferencesSection,
    BadgesSection,
    EditProfileModal,
    UpdateGoalsModal,
    ChangeEmailModal,
    GenericEditModal,
    INITIAL_USER_PROFILE,
    UserProfileData,
} from "@/components/feature";

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfileData>(INITIAL_USER_PROFILE);

    // Modal Visibility States
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isUpdateGoalsOpen, setIsUpdateGoalsOpen] = useState(false);
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
    const [genericModal, setGenericModal] = useState<{
        isOpen: boolean;
        title: string;
        label: string;
        field: keyof UserProfileData;
        value: string;
    } | null>(null);

    // Handlers
    const handleUpdateName = (firstName: string, lastName: string) => {
        setProfile((prev) => ({ ...prev, firstName, lastName }));
    };

    const handleUpdateGoals = (waecGoal: string, jambGoal: string) => {
        setProfile((prev) => ({
            ...prev,
            goals: [
                { exam: "WAEC", goal: waecGoal },
                { exam: "JAMB", goal: jambGoal },
            ],
        }));
    };

    const handleUpdateEmail = (newEmail: string) => {
        setProfile((prev) => ({ ...prev, email: newEmail }));
    };

    const handleGenericUpdate = (val: string) => {
        if (!genericModal) return;
        setProfile((prev) => ({ ...prev, [genericModal.field]: val }));
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
                    })
                }
            />

            {/* Personal Info Section */}
            <PersonalInfoSection
                profile={profile}
                onChangeEmail={() => setIsChangeEmailOpen(true)}
                onChangePhone={() =>
                    setGenericModal({
                        isOpen: true,
                        title: "Change Phone Number",
                        label: "Phone Number",
                        field: "phone",
                        value: profile.phone,
                    })
                }
                onChangeState={() =>
                    setGenericModal({
                        isOpen: true,
                        title: "Change State of Residence",
                        label: "State",
                        field: "stateOfResidence",
                        value: profile.stateOfResidence,
                    })
                }
                onChangeUniversity={() =>
                    setGenericModal({
                        isOpen: true,
                        title: "Change University of Interest",
                        label: "University",
                        field: "universityOfInterest",
                        value: profile.universityOfInterest,
                    })
                }
            />

            {/* Preferences Section */}
            <PreferencesSection
                profile={profile}
                onEditExamType={() =>
                    setGenericModal({
                        isOpen: true,
                        title: "Edit Exam Types",
                        label: "Exam Types (comma separated)",
                        field: "examTypes",
                        value: profile.examTypes.join(", "),
                    })
                }
                onEditGoals={() => setIsUpdateGoalsOpen(true)}
            />

            {/* Badges Section */}
            <BadgesSection badges={profile.badges} />

            {/* Modals */}
            <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                initialFirstName={profile.firstName}
                initialLastName={profile.lastName}
                avatarUrl={profile.avatarUrl}
                onUpdate={handleUpdateName}
            />

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

            <ChangeEmailModal
                isOpen={isChangeEmailOpen}
                onClose={() => setIsChangeEmailOpen(false)}
                currentEmail={profile.email}
                onSuccess={handleUpdateEmail}
            />

            {genericModal && (
                <GenericEditModal
                    isOpen={genericModal.isOpen}
                    onClose={() => setGenericModal(null)}
                    title={genericModal.title}
                    label={genericModal.label}
                    initialValue={genericModal.value}
                    onUpdate={(val) => {
                        if (genericModal.field === "examTypes") {
                            setProfile((prev) => ({
                                ...prev,
                                examTypes: val.split(",").map((s) => s.trim()).filter(Boolean),
                            }));
                        } else if (genericModal.field === "walletBalance") {
                            setProfile((prev) => ({
                                ...prev,
                                walletBalance: prev.walletBalance + (parseInt(val) || 0),
                            }));
                        } else {
                            handleGenericUpdate(val);
                        }
                    }}
                />
            )}
        </div>
    );
}