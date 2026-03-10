'use client';

import { useState, useEffect } from 'react';
import { reviewApi, ReviewStats } from '@/lib/api/review';

export default function DoctorReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviewsAndStats();
    }, []);

    const fetchReviewsAndStats = async () => {
        try {
            setLoading(true);
            const [reviewsData, statsData] = await Promise.all([
                reviewApi.doctor.getAllReviews(),
                reviewApi.doctor.getReviewStats(),
            ]);
            setReviews(reviewsData);
            setStats(statsData);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch reviews');
        } finally {
            setLoading(false);
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
            <h1 className="text-3xl font-bold mb-8">Patient Reviews</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Statistics */}
            {stats && (
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Review Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600">{stats.average_rating.toFixed(1)}</div>
                            <div className="text-gray-600 mt-1">Average Rating</div>
                            <div className="flex justify-center text-yellow-500 text-2xl mt-2">
                                {'★'.repeat(Math.round(stats.average_rating))}
                                {'☆'.repeat(5 - Math.round(stats.average_rating))}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600">{stats.total_reviews}</div>
                            <div className="text-gray-600 mt-1">Total Reviews</div>
                        </div>
                        <div className="border-l pl-6">
                            <div className="text-lg font-semibold mb-2">Rating Distribution</div>
                            <div className="space-y-1">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="w-12">{rating} ★</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full"
                                                style={{
                                                    width: `${(stats.rating_distribution[rating as keyof typeof stats.rating_distribution] / stats.total_reviews) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="w-8 text-right text-sm text-gray-600">
                                            {stats.rating_distribution[rating as keyof typeof stats.rating_distribution]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
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
                                <span className="font-semibold">Patient ID:</span> {review.patient_id}
                            </p>
                            {review.appointment_id && (
                                <p>
                                    <span className="font-semibold">Appointment ID:</span> {review.appointment_id}
                                </p>
                            )}
                            {review.comment && (
                                <p className="mt-3 text-gray-800 italic border-l-4 border-blue-500 pl-4">
                                    "{review.comment}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No reviews yet</p>
                </div>
            )}
        </div>
    );
}
