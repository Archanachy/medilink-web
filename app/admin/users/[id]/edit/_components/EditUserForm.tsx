"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, type UpdateUserData } from "@/app/(auth)/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/app/(auth)/_components/ImageUpload";
import { handleUpdateUser } from "@/lib/actions/admin-action";
import { useToast } from "@/app/context/ToastContext";

interface EditUserFormProps {
    user: any;
}

export default function EditUserForm({ user }: EditUserFormProps) {
    const router = useRouter();
    const { addToast } = useToast();
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<UpdateUserData>({
        resolver: zodResolver(updateUserSchema),
        mode: "onChange", // Real-time validation
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            username: user.username || '',
            phone: user.phone || '',
            role: user.role || 'patient',
            password: '',
            confirmPassword: '',
        }
    });

    const password = watch('password');

    const onSubmit = async (data: UpdateUserData) => {
        setError(null);

        try {
            const formData = new FormData();
            
            formData.append('firstName', data.firstName || '');
            formData.append('lastName', data.lastName || '');
            formData.append('email', data.email || '');
            formData.append('username', data.username || '');
            formData.append('phone', data.phone || '');
            formData.append('role', data.role || '');
            
            if (data.password) {
                formData.append('password', data.password);
                formData.append('confirmPassword', data.confirmPassword || '');
            }
            
            if (image) formData.append('profileImage', image);

            const response = await handleUpdateUser(user._id, formData);
            
            if (!response.success) {
                throw new Error(response.message);
            }

            addToast(`User ${data.firstName} ${data.lastName} updated successfully`, 'success');
            setTimeout(() => router.push(`/admin/users/${user._id}`), 500);
        } catch (err: Error | any) {
            const errorMsg = err.message || 'Update failed';
            setError(errorMsg);
            addToast(errorMsg, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {error && (
                <div className="flex items-start gap-3 text-sm bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg" role="alert">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("firstName")}
                        aria-label="First name"
                        aria-invalid={!!errors.firstName}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errors.firstName 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    />
                    {errors.firstName && <p className="text-sm text-red-600 mt-1" role="alert">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("lastName")}
                        aria-label="Last name"
                        aria-invalid={!!errors.lastName}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errors.lastName 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    />
                    {errors.lastName && <p className="text-sm text-red-600 mt-1" role="alert">{errors.lastName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        aria-label="Email address"
                        aria-invalid={!!errors.email}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errors.email 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1" role="alert">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("username")}
                        aria-label="Username"
                        aria-invalid={!!errors.username}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errors.username 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    />
                    {errors.username && <p className="text-sm text-red-600 mt-1" role="alert">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role <span className="text-red-600">*</span>
                    </label>
                    <select
                        {...register("role")}
                        aria-label="User role"
                        aria-invalid={!!errors.role}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errors.role 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="text-sm text-red-600 mt-1" role="alert">{errors.role.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                        type="tel"
                        placeholder="e.g., +1234567890"
                        {...register("phone")}
                        aria-label="Phone number"
                        aria-invalid={!!errors.phone}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errors.phone 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1" role="alert">{errors.phone.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password (Optional)</h3>
                    <p className="text-sm text-gray-600 mb-4">Leave blank to keep the current password</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Leave blank to keep current password"
                        aria-label="New password"
                        aria-invalid={!!errors.password}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                            errors.password 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    />
                    {errors.password && <p className="text-sm text-red-600 mt-1" role="alert">{errors.password.message}</p>}
                    {password && password.length > 0 && password.length < 8 && (
                        <p className="text-sm text-yellow-600 mt-1">⚠️ Password must be at least 8 characters</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Confirm new password"
                        disabled={!password || password.length === 0}
                        aria-label="Confirm password"
                        aria-invalid={!!errors.confirmPassword}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors.confirmPassword 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 focus:ring-blue-500'
                        }`}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-600 mt-1" role="alert">{errors.confirmPassword.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <ImageUpload onImageChange={setImage} currentImage={user.profileImage} />
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    aria-label="Cancel and go back"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    aria-label="Update user information"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="inline-block animate-spin">⟳</span>
                            Updating...
                        </span>
                    ) : 'Update User'}
                </button>
            </div>
        </form>
    );
}
