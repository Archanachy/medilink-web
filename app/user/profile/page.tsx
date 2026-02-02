"use client";

import { useState, useEffect } from "react";
import { getUserData } from "@/lib/cookie";
import ProfileView from "./_components/ProfileView";
import EditProfileForm from "./_components/EditProfileForm";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await getUserData();
            setUser(userData);
            setLoading(false);
        };
        loadUser();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center text-red-600">User data not found</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
            
            {isEditing ? (
                <EditProfileForm user={user} onCancel={() => setIsEditing(false)} onSuccess={() => {
                    setIsEditing(false);
                    location.reload();
                }} />
            ) : (
                <ProfileView user={user} onEdit={() => setIsEditing(true)} />
            )}
        </div>
    );
}
