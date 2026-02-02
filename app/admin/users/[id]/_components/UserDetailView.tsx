"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmDialog from "@/app/(auth)/_components/ConfirmDialog";
import { handleDeleteUser } from "@/lib/actions/admin-action";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";

interface UserDetailViewProps {
    user: any;
}

const roleColors: Record<string, { bg: string; text: string; badge: string }> = {
    admin: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
    doctor: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
    patient: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800' },
};

function formatPhoneNumber(phone: string | null | undefined): string {
    if (!phone) return '-';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
}

function copyToClipboard(text: string, label: string, addToast: any) {
    navigator.clipboard.writeText(text);
    addToast(`${label} copied to clipboard`, 'success');
}

export default function UserDetailView({ user }: UserDetailViewProps) {
    const router = useRouter();
    const { addToast } = useToast();
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await handleDeleteUser(user._id);
            if (response.success) {
                addToast(`User ${user.firstName} ${user.lastName} deleted successfully`, 'success');
                setTimeout(() => router.push('/admin/users'), 500);
            } else {
                addToast('Failed to delete user', 'error');
            }
        } catch (error: any) {
            addToast(error.message || 'Failed to delete user', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const colors = roleColors[user.role] || roleColors.patient;
    const isActive = user.isActive !== false; // Default to active if not specified

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-6">
                        {/* Profile Photo */}
                        <div className="shrink-0 relative">
                            {user.profileImage && !imageError ? (
                                <>
                                    <img
                                        src={`http://localhost:5050/auth/uploads/profile-images/${user._id}-profileImage.png`}
                                        alt={`${user.firstName} ${user.lastName} profile`}
                                        className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                                        onError={() => setImageError(true)}
                                        aria-label="User profile photo"
                                    />
                                </>
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center border-2 border-gray-200"
                                    aria-label="User avatar with initials"
                                >
                                    <span className="text-white text-2xl font-bold">
                                        {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user.firstName} {user.lastName}
                                </h1>
                                {/* Status Badge */}
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                    aria-label={`User status: ${isActive ? 'Active' : 'Inactive'}`}
                                >
                                    {isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/admin/users/${user._id}/edit`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            aria-label="Edit user details"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => setDeleteConfirm(true)}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            aria-label="Delete user"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email with Copy Button */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-semibold">Email</label>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-900 flex-1">{user.email}</p>
                            <button
                                onClick={() => copyToClipboard(user.email, 'Email', addToast)}
                                className="text-blue-600 hover:text-blue-700 text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                aria-label="Copy email to clipboard"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    {/* Username with Copy Button */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-semibold">Username</label>
                        <div className="flex items-center gap-2">
                            <p className="text-gray-900 flex-1">{user.username}</p>
                            <button
                                onClick={() => copyToClipboard(user.username, 'Username', addToast)}
                                className="text-blue-600 hover:text-blue-700 text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                                aria-label="Copy username to clipboard"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    {/* Role Badge */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-semibold">Role</label>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}
                            aria-label={`User role: ${user.role}`}
                        >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-semibold">Phone</label>
                        <p className="text-gray-900">{formatPhoneNumber(user.phone)}</p>
                    </div>

                    {/* Created Date */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-semibold">Created</label>
                        <p className="text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* Last Updated Date */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-semibold">Last Updated</label>
                        <p className="text-gray-900">
                            {new Date(user.updatedAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteConfirm}
                title="Delete User"
                message={`Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm(false)}
                isLoading={isDeleting}
            />
        </>
    );
}
