import axiosInstance from './axios';
import { API } from './endpoints';

export interface PrescriptionItem {
    medicine_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

export interface Prescription {
    _id: string;
    patient_id: string;
    doctor_id: string;
    appointment_id?: string;
    diagnosis: string;
    notes?: string;
    prescription_date: string;
    items: PrescriptionItem[];
    created_at: string;
    updated_at: string;
}

export interface PrescriptionCreateData {
    patient_id: string;
    appointment_id?: string;
    diagnosis: string;
    notes?: string;
    items: PrescriptionItem[];
}

export const prescriptionApi = {
    // Doctor endpoints
    doctor: {
        // Create prescription
        createPrescription: async (data: PrescriptionCreateData): Promise<Prescription> => {
            const response = await axiosInstance.post(API.PRESCRIPTIONS.DOCTOR.CREATE, data);
            return response.data.data;
        },

        // Get all prescriptions by doctor
        getAllPrescriptions: async (): Promise<Prescription[]> => {
            const response = await axiosInstance.get(API.PRESCRIPTIONS.DOCTOR.LIST);
            return response.data.data;
        },

        // Get prescription by ID
        getPrescriptionById: async (id: string): Promise<Prescription> => {
            const response = await axiosInstance.get(API.PRESCRIPTIONS.DOCTOR.BY_ID(id));
            return response.data.data;
        },

        // Update prescription
        updatePrescription: async (id: string, data: Partial<PrescriptionCreateData>): Promise<Prescription> => {
            const response = await axiosInstance.put(API.PRESCRIPTIONS.DOCTOR.UPDATE(id), data);
            return response.data.data;
        },

        // Update prescription items
        updatePrescriptionItems: async (id: string, items: PrescriptionItem[]): Promise<Prescription> => {
            const response = await axiosInstance.put(API.PRESCRIPTIONS.DOCTOR.UPDATE_ITEMS(id), { items });
            return response.data.data;
        },
    },

    // Patient endpoints
    patient: {
        // Get all prescriptions for patient
        getAllPrescriptions: async (): Promise<Prescription[]> => {
            const response = await axiosInstance.get(API.PRESCRIPTIONS.PATIENT.LIST);
            return response.data.data;
        },

        // Get prescription by ID
        getPrescriptionById: async (id: string): Promise<Prescription> => {
            const response = await axiosInstance.get(API.PRESCRIPTIONS.PATIENT.BY_ID(id));
            return response.data.data;
        },

        // Download prescription as PDF
        downloadPrescription: async (id: string): Promise<Blob> => {
            const response = await axiosInstance.get(API.PRESCRIPTIONS.PATIENT.DOWNLOAD(id), {
                responseType: 'blob',
            });
            return response.data;
        },
    },
};
