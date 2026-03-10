'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reviewApi, Review } from '@/lib/api/review';

export default function PatientReviewsPage() {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewApi.patient.getAllReviews();
            setReviews(data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            await reviewApi.patient.deleteReview(id);
            fetchReviews();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete review');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Reviews</h1>
                <button
                    onClick={() => router.push('/patient/reviews/create')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Write a Review
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <div className="flex text-yellow-500 text-xl">
                                        {'★'.repeat(review.rating)}
                                        {'☆'.repeat(5 - review.rating)}
                                    </div>
                                    <span className="ml-3 text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Doctor ID:</span> {review.doctor_id}
                                    </p>
                                    {review.appointment_id && (
                                        <p>
                                            <span className="font-semibold">Appointment ID:</span> {review.appointment_id}
                                        </p>
                                    )}
                                    {review.comment && (
                                        <p className="mt-3 text-gray-800">{review.comment}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                                <button
                                    onClick={() => router.push(`/patient/reviews/${review._id}/edit`)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteReview(review._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl mb-4">You haven't written any reviews yet</p>
                    <button
                        onClick={() => router.push('/patient/reviews/create')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Write your first review →
                    </button>
                </div>
            )}
        </div>
    );
}
