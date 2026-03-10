import axiosInstance from './axios';
import { API } from './endpoints';

export interface Review {
    _id: string;
    patient_id: string;
    doctor_id: string;
    appointment_id?: string;
    rating: number;
    comment?: string;
    created_at: string;
    updated_at: string;
}

export interface ReviewCreateData {
    doctor_id: string;
    appointment_id?: string;
    rating: number;
    comment?: string;
}

export interface ReviewStats {
    total_reviews: number;
    average_rating: number;
    rating_distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export const reviewApi = {
    // Patient endpoints
    patient: {
        // Create review
        createReview: async (data: ReviewCreateData): Promise<Review> => {
            const response = await axiosInstance.post(API.REVIEWS.PATIENT.CREATE, data);
            return response.data.data;
        },

        // Update review
        updateReview: async (id: string, data: Partial<ReviewCreateData>): Promise<Review> => {
            const response = await axiosInstance.put(API.REVIEWS.PATIENT.UPDATE(id), data);
            return response.data.data;
        },

        // Delete review
        deleteReview: async (id: string): Promise<void> => {
            await axiosInstance.delete(API.REVIEWS.PATIENT.DELETE(id));
        },

        // Get all reviews by patient
        getAllReviews: async (): Promise<Review[]> => {
            const response = await axiosInstance.get(API.REVIEWS.PATIENT.LIST);
            return response.data.data;
        },
    },

    // Doctor endpoints
    doctor: {
        // Get all reviews for doctor
        getAllReviews: async (): Promise<Review[]> => {
            const response = await axiosInstance.get(API.REVIEWS.DOCTOR.LIST);
            return response.data.data;
        },

        // Get review statistics
        getReviewStats: async (): Promise<ReviewStats> => {
            const response = await axiosInstance.get(API.REVIEWS.DOCTOR.STATS);
            return response.data.data;
        },
    },
};
