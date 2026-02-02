"use server";

import { updateProfile } from "@/lib/api/user";
import { setUserData } from "../cookie";

export const handleProfileUpdate = async (id: string, formData: FormData) => {
    try {
        const response = await updateProfile(id, formData);
        if (response.success) {
            await setUserData(response.data);
            return {
                success: true,
                message: 'Profile updated successfully',
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || 'Update profile failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Update profile action failed' };
    }
};
