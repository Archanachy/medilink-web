"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUsers } from "@/lib/api/user";
import UsersTable from "./_components/UsersTable";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getUsers();
            if (response.success) {
                setUsers(response.data || []);
            }
        } catch (err: Error | any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-600 mt-2">Total users: {users.length}</p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Create User
                </Link>
            </div>

            {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-6">{error}</div>}

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">Loading users...</div>
            ) : (
                <UsersTable users={users} onUserDeleted={loadUsers} />
            )}
        </div>
    );
}
