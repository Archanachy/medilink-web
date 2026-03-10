'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reviewApi, ReviewCreateData } from '@/lib/api/review';
import { doctorApi, Doctor } from '@/lib/api/doctor';

export default function CreateReviewPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<ReviewCreateData>({
        doctor_id: '',
        appointment_id: '',
        rating: 5,
        comment: '',
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await doctorApi.getAllDoctors();
            setDoctors(data);
        } catch (err: any) {
            console.error('Failed to fetch doctors:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await reviewApi.patient.createReview(formData);
            router.push('/patient/reviews');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Write a Review</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl bg-white shadow rounded-lg p-8">
                {/* Select Doctor */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Select Doctor <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.doctor_id}
                        onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor._id} value={doctor._id}>
                                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Appointment ID (Optional) */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Appointment ID (Optional)
                    </label>
                    <input
                        type="text"
                        value={formData.appointment_id}
                        onChange={(e) => setFormData({ ...formData, appointment_id: e.target.value })}
                        placeholder="Enter appointment ID if applicable"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Rating */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFormData({ ...formData, rating: star })}
                                className={`text-4xl ${
                                    star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'
                                } hover:text-yellow-500 transition-colors`}
                            >
                                ★
                            </button>
                        ))}
                        <span className="ml-4 text-gray-700 text-lg">{formData.rating} / 5</span>
                    </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Your Review
                    </label>
                    <textarea
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="Share your experience with this doctor..."
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
