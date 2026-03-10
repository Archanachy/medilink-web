'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doctorApi, Doctor } from '@/lib/api/doctor';
import { reviewApi, Review } from '@/lib/api/review';

export default function DoctorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const doctorId = params.id as string;

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTab, setSelectedTab] = useState<'about' | 'reviews' | 'availability'>('about');

    useEffect(() => {
        if (doctorId) {
            fetchDoctorDetails();
        }
    }, [doctorId]);

    const fetchDoctorDetails = async () => {
        try {
            setLoading(true);
            const doctorData = await doctorApi.getDoctorById(doctorId);
            setDoctor(doctorData);
            // Fetch reviews for this doctor (would need to add this endpoint)
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch doctor details');
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = () => {
        router.push(`/patient/appointments/book?doctorId=${doctorId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading doctor details...</div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">{error || 'Doctor not found'}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => router.back()}
                className="mb-6 text-blue-600 hover:text-blue-800"
            >
                ← Back to Doctors
            </button>

            {/* Doctor Header */}
            <div className="bg-white shadow rounded-lg p-8 mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {doctor.profileImage && (
                        <img
                            src={doctor.profileImage}
                            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold mb-2">
                            Dr. {doctor.firstName} {doctor.lastName}
                        </h1>
                        <p className="text-xl text-gray-600 mb-3">{doctor.specialization}</p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="flex items-center">
                                <span className="text-yellow-500 text-xl">★</span>
                                <span className="ml-1 font-semibold">{doctor.rating_average.toFixed(1)}</span>
                                <span className="ml-1 text-gray-500">({doctor.rating_count} reviews)</span>
                            </div>
                            <div className="text-gray-600">
                                {doctor.yearsOfExperience} years experience
                            </div>
                            {doctor.verification_status === 'verified' && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    Verified
                                </span>
                            )}
                            {doctor.is_available ? (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    Available
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                    Not Available
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <div className="text-3xl font-bold text-blue-600 mb-4">
                            ${doctor.consultationFee}
                        </div>
                        <button
                            onClick={handleBookAppointment}
                            disabled={!doctor.is_available}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow rounded-lg">
                <div className="border-b">
                    <div className="flex">
                        <button
                            onClick={() => setSelectedTab('about')}
                            className={`px-6 py-3 ${
                                selectedTab === 'about'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => setSelectedTab('reviews')}
                            className={`px-6 py-3 ${
                                selectedTab === 'reviews'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            Reviews
                        </button>
                        <button
                            onClick={() => setSelectedTab('availability')}
                            className={`px-6 py-3 ${
                                selectedTab === 'availability'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                            }`}
                        >
                            Availability
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {selectedTab === 'about' && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">About Dr. {doctor.firstName} {doctor.lastName}</h2>
                            {doctor.bio ? (
                                <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                            ) : (
                                <p className="text-gray-500">No bio available</p>
                            )}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Contact Information</h3>
                                    <p className="text-gray-700">Email: {doctor.email}</p>
                                    {doctor.phone && <p className="text-gray-700">Phone: {doctor.phone}</p>}
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Professional Information</h3>
                                    {doctor.licenseNumber && (
                                        <p className="text-gray-700">License: {doctor.licenseNumber}</p>
                                    )}
                                    <p className="text-gray-700">Consultation Fee: ${doctor.consultationFee}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'reviews' && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Patient Reviews</h2>
                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="border-b pb-4">
                                            <div className="flex items-center mb-2">
                                                <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                                                <span className="ml-2 text-gray-500">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No reviews yet</p>
                            )}
                        </div>
                    )}

                    {selectedTab === 'availability' && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Availability Schedule</h2>
                            {doctor.availability_schedule && doctor.availability_schedule.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {doctor.availability_schedule.map((schedule, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <h3 className="font-semibold mb-2">{schedule.dayOfWeek}</h3>
                                            {schedule.isAvailable ? (
                                                <div className="space-y-1">
                                                    {schedule.timeSlots.map((slot, slotIndex) => (
                                                        <p key={slotIndex} className="text-gray-700">
                                                            {slot.startTime} - {slot.endTime}
                                                        </p>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">Not available</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No availability schedule set</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
