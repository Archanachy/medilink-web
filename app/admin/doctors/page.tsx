'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';

export default function AdminDoctorsPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllDoctors();
            const doctorsData = response.data || response;
            setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyDoctor = async (id: string, status: 'verified' | 'rejected') => {
        const notes = prompt(`Enter notes for ${status}:`);
        if (notes === null) return;

        try {
            await adminApi.verifyDoctor(id, status, notes);
            fetchDoctors();
            alert(`Doctor ${status} successfully`);
        } catch (err: any) {
            alert(err.response?.data?.message || `Failed to ${status} doctor`);
        }
    };

    const filteredDoctors = doctors.filter((doctor) => {
        if (filter === 'all') return true;
        return doctor.verification_status === filter || doctor.verificationStatus === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading doctors...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Doctor Management</h1>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 border-b">
                {(['all', 'pending', 'verified', 'rejected'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 capitalize ${
                            filter === status
                                ? 'border-b-2 border-red-600 text-red-600 font-semibold'
                                : 'text-gray-600'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white shadow rounded-lg p-6">
                        {doctor.profileImage && (
                            <img
                                src={doctor.profileImage}
                                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                            />
                        )}
                        <h3 className="text-xl font-semibold text-center mb-2">
                            Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-gray-600 text-center mb-4">{doctor.specialization}</p>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-center">
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(doctor.verification_status || doctor.verificationStatus)}`}>
                                    {doctor.verification_status || doctor.verificationStatus}
                                </span>
                            </div>
                            <p className="text-center text-sm text-gray-600">
                                Experience: {doctor.yearsOfExperience} years
                            </p>
                            <p className="text-center text-sm text-gray-600">
                                Fee: ${doctor.consultationFee}
                            </p>
                            {doctor.licenseNumber && (
                                <p className="text-center text-sm text-gray-600">
                                    License: {doctor.licenseNumber}
                                </p>
                            )}
                        </div>

                        {(doctor.verification_status === 'pending' || doctor.verificationStatus === 'pending') && (
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleVerifyDoctor(doctor._id, 'verified')}
                                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                                >
                                    Verify
                                </button>
                                <button
                                    onClick={() => handleVerifyDoctor(doctor._id, 'rejected')}
                                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => router.push(`/admin/doctors/${doctor._id}`)}
                            className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No {filter !== 'all' ? filter : ''} doctors found</p>
                </div>
            )}
        </div>
    );
}
