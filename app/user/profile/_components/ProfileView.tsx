"use client";

interface ProfileViewProps {
    user: any;
    onEdit: () => void;
}

export default function ProfileView({ user, onEdit }: ProfileViewProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
                <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Username</label>
                    <p className="text-gray-900">{user.username}</p>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Role</label>
                    <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                    <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
