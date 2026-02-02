"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { getUserById } from "@/lib/api/user";
import EditUserForm from "./_components/EditUserForm";
import { useToast } from "@/app/context/ToastContext";
import Breadcrumb from "@/app/components/Breadcrumb";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { addToast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getUserById(resolvedParams.id);
                if (response.success) {
                    setUser(response.data);
                } else {
                    const errorMsg = 'User not found';
                    setError(errorMsg);
                    addToast(errorMsg, 'error');
                }
            } catch (err: Error | any) {
                const errorMsg = err.message || 'Failed to load user';
                setError(errorMsg);
                addToast(errorMsg, 'error');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [resolvedParams.id, addToast]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading user details...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="text-center py-12">
                <div className="mb-4 text-5xl">⚠️</div>
                <p className="text-red-600 mb-6 text-lg font-semibold">{error || 'User not found'}</p>
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-colors"
                >
                    ← Back to Users
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Users', href: '/admin/users' },
                    { label: `${user.firstName} ${user.lastName}`, href: `/admin/users/${resolvedParams.id}` },
                    { label: 'Edit' },
                ]}
            />

            <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit User</h1>
                <EditUserForm user={user} />
            </div>
        </div>
    );
}
