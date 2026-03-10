import axiosInstance from './axios';
import { API } from './endpoints';

export interface AdminStats {
    totalUsers: number;
    totalDoctors: number;
    totalPatients: number;
    totalAppointments: number;
    totalRevenue: number;
    recentAppointments?: any[];
    recentUsers?: any[];
}

export interface AdminAppointment {
    _id: string;
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    payment_status: string;
    payment_amount?: number;
}

export const adminApi = {
    // Analytics
    getStats: async (): Promise<AdminStats> => {
        const response = await axiosInstance.get('/api/admin/analytics/stats');
        return response.data.data;
    },

    // User Management
    getAllUsers: async (params?: { page?: number; limit?: number; role?: string }) => {
        const response = await axiosInstance.get(API.ADMIN.USERS, { params });
        return response.data;
    },

    getUserById: async (id: string) => {
        const response = await axiosInstance.get(API.ADMIN.USER_BY_ID(id));
        return response.data.data;
    },

    createUser: async (userData: any) => {
        const response = await axiosInstance.post(API.ADMIN.CREATE_USER, userData);
        return response.data;
    },

    updateUser: async (id: string, userData: any) => {
        const response = await axiosInstance.put(API.ADMIN.USER_BY_ID(id), userData);
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await axiosInstance.delete(API.ADMIN.USER_BY_ID(id));
        return response.data;
    },

    // Appointment Management
    getAllAppointments: async (params?: { page?: number; limit?: number; status?: string }) => {
        const response = await axiosInstance.get('/api/admin/appointments', { params });
        return response.data;
    },

    getAppointmentById: async (id: string) => {
        const response = await axiosInstance.get(`/api/admin/appointments/${id}`);
        return response.data.data;
    },

    updateAppointment: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/api/admin/appointments/${id}`, data);
        return response.data;
    },

    deleteAppointment: async (id: string) => {
        const response = await axiosInstance.delete(`/api/admin/appointments/${id}`);
        return response.data;
    },

    // Doctor Management
    getAllDoctors: async (params?: { page?: number; limit?: number }) => {
        const response = await axiosInstance.get('/api/admin/doctors', { params });
        return response.data;
    },

    verifyDoctor: async (id: string, status: 'verified' | 'rejected', notes?: string) => {
        const response = await axiosInstance.put(`/api/admin/doctors/${id}/verify`, { 
            verificationStatus: status, 
            verificationNotes: notes 
        });
        return response.data;
    },

    // Payment Management
    getAllPayments: async (params?: { page?: number; limit?: number }) => {
        const response = await axiosInstance.get('/api/admin/payments', { params });
        return response.data;
    },
};
