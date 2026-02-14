import axiosInstance from './axios';
import { API } from './endpoints';

// Admin API - Create User (uses MULTER endpoint)
export const createUser = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post(
            API.ADMIN.USERS,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Create user failed');
    }
};

// Admin API - Get All Users
export const getUsers = async (params?: { page?: number; limit?: number; search?: string; sort?: string }) => {
    try {
        const query = new URLSearchParams();
        if (params?.page) query.set('page', String(params.page));
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.search) query.set('search', params.search);
        if (params?.sort) query.set('sort', params.sort);

        const url = query.toString() ? `${API.ADMIN.USERS}?${query.toString()}` : API.ADMIN.USERS;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Fetch users failed');
    }
};

// Admin API - Get User by ID
export const getUserById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.USER_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Fetch user failed');
    }
};

// Admin API - Update User
export const updateUser = async (id: string, formData: FormData) => {
    try {
        const response = await axiosInstance.put(
            API.ADMIN.USER_BY_ID(id),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Update user failed');
    }
};

// Admin API - Delete User
export const deleteUser = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.USER_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Delete user failed');
    }
};

// User API - Update Profile
export const updateProfile = async (id: string, formData: FormData) => {
    try {
        const response = await axiosInstance.put(
            `${API.AUTH.UPDATE_PROFILE}/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Update profile failed');
    }
};
