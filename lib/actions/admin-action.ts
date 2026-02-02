"use server";

import { createUser, updateUser, deleteUser } from "@/lib/api/user";
import { CreateUserData, UpdateUserData } from "@/app/(auth)/schema";

export const handleCreateUser = async (formData: FormData) => {
    try {
        const response = await createUser(formData);
        if (response.success) {
            return {
                success: true,
                message: 'User created successfully',
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || 'Create user failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Create user action failed' };
    }
};

export const handleUpdateUser = async (id: string, formData: FormData) => {
    try {
        const response = await updateUser(id, formData);
        if (response.success) {
            return {
                success: true,
                message: 'User updated successfully',
                data: response.data
            };
        }
        return {
            success: false,
            message: response.message || 'Update user failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Update user action failed' };
    }
};

export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUser(id);
        if (response.success) {
            return {
                success: true,
                message: 'User deleted successfully'
            };
        }
        return {
            success: false,
            message: response.message || 'Delete user failed'
        };
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Delete user action failed' };
    }
};
