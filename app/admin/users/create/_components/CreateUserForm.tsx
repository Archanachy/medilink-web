"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserData } from "@/app/(auth)/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/app/(auth)/_components/ImageUpload";
import { handleCreateUser } from "@/lib/actions/admin-action";

export default function CreateUserForm() {
    const router = useRouter();
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateUserData>({
        resolver: zodResolver(createUserSchema),
        mode: "onSubmit",
    });

    const onSubmit = async (data: CreateUserData) => {
        setError(null);

        try {
            const formData = new FormData();
            
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            formData.append('username', data.username);
            formData.append('password', data.password);
            formData.append('confirmPassword', data.confirmPassword);
            formData.append('phone', data.phone);
            formData.append('role', data.role);
            
            if (image) formData.append('profileImage', image);

            const response = await handleCreateUser(formData);
            
            if (!response.success) {
                throw new Error(response.message);
            }

            router.push('/admin/users');
        } catch (err: Error | any) {
            setError(err.message || 'Creation failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                        type="text"
                        {...register("firstName")}
                        placeholder="Enter first name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                        type="text"
                        {...register("lastName")}
                        placeholder="Enter last name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                        type="email"
                        {...register("email")}
                        placeholder="Enter email"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                    <input
                        type="text"
                        {...register("username")}
                        placeholder="Choose username"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <select
                        {...register("role")}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select role</option>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                        type="tel"
                        {...register("phone")}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Create password"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Confirm password"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <ImageUpload onImageChange={setImage} />
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
            </div>
        </form>
    );
}
