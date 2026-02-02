"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmDialog from "@/app/(auth)/_components/ConfirmDialog";
import { handleDeleteUser } from "@/lib/actions/admin-action";
import { useToast } from "@/app/context/ToastContext";

interface UsersTableProps {
    users: any[];
    onUserDeleted: () => void;
}

const roleStyles = {
    admin: 'bg-red-100 text-red-800 border border-red-200',
    doctor: 'bg-blue-100 text-blue-800 border border-blue-200',
    patient: 'bg-green-100 text-green-800 border border-green-200',
};

const statusStyles = {
    active: 'bg-green-100 text-green-800 border border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border border-gray-200',
};

export default function UsersTable({ users, onUserDeleted }: UsersTableProps) {
    const { addToast } = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        
        setIsDeleting(true);
        try {
            const response = await handleDeleteUser(deleteConfirm.id);
            if (response.success) {
                addToast(`User ${deleteConfirm.name} deleted successfully`, 'success');
                setDeleteConfirm(null);
                onUserDeleted();
            } else {
                addToast('Failed to delete user', 'error');
            }
        } catch (error: any) {
            addToast(error.message || 'Failed to delete user', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    if (users.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="mb-4 text-5xl">📭</div>
                <p className="text-gray-600 font-medium">No users found</p>
                <p className="text-gray-500 text-sm mt-1">Start by creating a new user</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Username</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => {
                                const isActive = user.isActive !== false;
                                const roleStyle = roleStyles[user.role as keyof typeof roleStyles] || roleStyles.patient;
                                const statusStyle = isActive ? statusStyles.active : statusStyles.inactive;
                                
                                return (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleStyle}`}
                                                aria-label={`User role: ${user.role}`}
                                            >
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}
                                                aria-label={`User status: ${isActive ? 'Active' : 'Inactive'}`}
                                            >
                                                {isActive ? '✓ Active' : '○ Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/admin/users/${user._id}`}
                                                    className="inline-block text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
                                                    aria-label={`View details for ${user.firstName} ${user.lastName}`}
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/admin/users/${user._id}/edit`}
                                                    className="inline-block text-amber-600 hover:text-amber-700 hover:underline font-semibold transition-colors"
                                                    aria-label={`Edit details for ${user.firstName} ${user.lastName}`}
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteConfirm({id: user._id, name: `${user.firstName} ${user.lastName}`})}
                                                    className="text-red-600 hover:text-red-700 hover:underline font-semibold transition-colors"
                                                    aria-label={`Delete user ${user.firstName} ${user.lastName}`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                title="Delete User"
                message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm(null)}
                isLoading={isDeleting}
            />
        </>
    );
}
