import axiosInstance from './axios';
import { API } from './endpoints';

export interface Appointment {
    _id: string;
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    reason?: string;
    notes?: string;
    consultation_type: 'in-person' | 'video';
    payment_status: 'pending' | 'completed' | 'refunded';
    payment_amount?: number;
    created_at: string;
    updated_at: string;
}

export interface AppointmentCreateData {
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
    notes?: string;
    consultation_type: 'in-person' | 'video';
}

export interface AvailableSlot {
    date: string;
    slots: string[];
}

export const appointmentApi = {
    // Get all appointments (admin only)
    getAllAppointments: async (): Promise<Appointment[]> => {
        const response = await axiosInstance.get(API.APPOINTMENTS.LIST);
        return response.data.data;
    },

    // Get appointment by ID
    getAppointmentById: async (id: string): Promise<Appointment> => {
        const response = await axiosInstance.get(API.APPOINTMENTS.BY_ID(id));
        return response.data.data;
    },

    // Get appointments by patient
    getAppointmentsByPatient: async (patientId: string): Promise<Appointment[]> => {
        const response = await axiosInstance.get(API.APPOINTMENTS.BY_PATIENT(patientId));
        return response.data.data;
    },

    // Get appointments by doctor
    getAppointmentsByDoctor: async (doctorId: string): Promise<Appointment[]> => {
        const response = await axiosInstance.get(API.APPOINTMENTS.BY_DOCTOR(doctorId));
        return response.data.data;
    },

    // Get available slots
    getAvailableSlots: async (doctorId: string, date: string): Promise<AvailableSlot[]> => {
        const response = await axiosInstance.get(API.APPOINTMENTS.AVAILABLE_SLOTS, {
            params: { doctorId, date },
        });
        return response.data.data;
    },

    // Create appointment
    createAppointment: async (data: AppointmentCreateData): Promise<Appointment> => {
        const response = await axiosInstance.post(API.APPOINTMENTS.CREATE, data);
        return response.data.data;
    },

    // Update appointment
    updateAppointment: async (id: string, data: Partial<AppointmentCreateData>): Promise<Appointment> => {
        const response = await axiosInstance.put(API.APPOINTMENTS.UPDATE(id), data);
        return response.data.data;
    },

    // Cancel appointment
    cancelAppointment: async (id: string, reason?: string): Promise<Appointment> => {
        const response = await axiosInstance.patch(API.APPOINTMENTS.CANCEL(id), { reason });
        return response.data.data;
    },

    // Delete appointment (admin only)
    deleteAppointment: async (id: string): Promise<void> => {
        await axiosInstance.delete(API.APPOINTMENTS.DELETE(id));
    },
};
