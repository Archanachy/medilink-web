"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema, type ProfileUpdateData } from "@/app/(auth)/schema";
import { useState } from "react";
import ImageUpload from "@/app/(auth)/_components/ImageUpload";
import { handleProfileUpdate } from "@/lib/actions/profile-action";

interface EditProfileFormProps {
    user: any;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function EditProfileForm({ user, onCancel, onSuccess }: EditProfileFormProps) {
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileUpdateData>({
        resolver: zodResolver(profileUpdateSchema),
        mode: "onSubmit",
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phone: user.phone || '',
        }
    });

    const onSubmit = async (data: ProfileUpdateData) => {
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData();
            
            if (data.firstName) formData.append('firstName', data.firstName);
            if (data.lastName) formData.append('lastName', data.lastName);
            if (data.phone) formData.append('phone', data.phone);
            if (image) formData.append('profileImage', image);

            const response = await handleProfileUpdate(user._id, formData);
            
            if (!response.success) {
                throw new Error(response.message);
            }

            setSuccess(true);
            setTimeout(() => onSuccess(), 1500);
        } catch (err: Error | any) {
            setError(err.message || 'Update failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">Profile updated successfully!</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                        type="text"
                        {...register("firstName")}
                        placeholder="Enter first name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                        type="text"
                        {...register("lastName")}
                        placeholder="Enter last name"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                        type="tel"
                        {...register("phone")}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                <div className="md:col-span-2">
                    <ImageUpload onImageChange={setImage} />
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
