import axiosInstance from './axios';
import { API } from './endpoints';

export interface Payment {
    _id: string;
    patient_id: string;
    doctor_id: string;
    appointment_id: string;
    amount: number;
    currency: string;
    payment_method: string;
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    transaction_id?: string;
    payment_intent_id?: string;
    payment_date?: string;
    created_at: string;
    updated_at: string;
}

export interface PaymentIntentData {
    appointment_id: string;
    amount: number;
    currency?: string;
}

export interface PaymentConfirmData {
    payment_intent_id: string;
    payment_method_id: string;
}

export const paymentApi = {
    // Patient endpoints
    patient: {
        // Create payment intent
        createPaymentIntent: async (data: PaymentIntentData): Promise<any> => {
            const response = await axiosInstance.post(API.PAYMENTS.PATIENT.CREATE_INTENT, data);
            return response.data.data;
        },

        // Confirm payment
        confirmPayment: async (data: PaymentConfirmData): Promise<Payment> => {
            const response = await axiosInstance.post(API.PAYMENTS.PATIENT.CONFIRM, data);
            return response.data.data;
        },

        // Get all payments
        getAllPayments: async (): Promise<Payment[]> => {
            const response = await axiosInstance.get(API.PAYMENTS.PATIENT.LIST);
            return response.data.data;
        },

        // Get payment by ID
        getPaymentById: async (id: string): Promise<Payment> => {
            const response = await axiosInstance.get(API.PAYMENTS.PATIENT.BY_ID(id));
            return response.data.data;
        },
    },

    // Doctor endpoints
    doctor: {
        // Get revenue analytics
        getRevenue: async (): Promise<any> => {
            const response = await axiosInstance.get(API.PAYMENTS.DOCTOR.REVENUE);
            return response.data.data;
        },

        // Process refund
        processRefund: async (id: string, reason?: string): Promise<Payment> => {
            const response = await axiosInstance.post(API.PAYMENTS.DOCTOR.REFUND(id), { reason });
            return response.data.data;
        },
    },
};
