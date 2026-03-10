import axiosInstance from './axios';
import { API } from './endpoints';

export interface Doctor {
    _id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    specialization: string;
    licenseNumber?: string;
    yearsOfExperience: number;
    profileImage?: string;
    bio?: string;
    consultationFee: number;
    is_available: boolean;
    availability_schedule?: Array<{
        dayOfWeek: string;
        isAvailable: boolean;
        timeSlots: Array<{ startTime: string; endTime: string }>;
    }>;
    rating_average: number;
    rating_count: number;
    verification_status: 'pending' | 'verified' | 'rejected';
    created_at: string;
    updated_at: string;
}

export const doctorApi = {
    // Get all doctors
    getAllDoctors: async (): Promise<Doctor[]> => {
        const response = await axiosInstance.get(API.DOCTORS.LIST);
        return response.data.data;
    },

    // Get doctor by ID
    getDoctorById: async (id: string): Promise<Doctor> => {
        const response = await axiosInstance.get(API.DOCTORS.BY_ID(id));
        return response.data.data;
    },

    // Get doctors by specialization
    getDoctorsBySpecialization: async (specialization: string): Promise<Doctor[]> => {
        const response = await axiosInstance.get(API.DOCTORS.BY_SPECIALIZATION, {
            params: { specialization },
        });
        return response.data.data;
    },

    // Get doctor availability
    getDoctorAvailability: async (id: string) => {
        const response = await axiosInstance.get(API.DOCTORS.AVAILABILITY(id));
        return response.data.data;
    },

    // Update doctor availability
    updateDoctorAvailability: async (id: string, availability: any) => {
        const response = await axiosInstance.put(API.DOCTORS.AVAILABILITY(id), availability);
        return response.data.data;
    },
};
