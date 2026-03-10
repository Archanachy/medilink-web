'use client';

import { useState, useEffect } from 'react';
import { doctorApi, Doctor } from '@/lib/api/doctor';
import { useRouter } from 'next/navigation';

export default function DoctorsPage() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const data = await doctorApi.getAllDoctors();
            setDoctors(data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    const specializations = Array.from(
        new Set(doctors.map(doctor => doctor.specialization).filter(Boolean))
    );

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = 
            doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
        return matchesSearch && matchesSpecialization;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading doctors...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Find a Doctor</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Search and Filter */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Search doctors by name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Specializations</option>
                    {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                            {spec}
                        </option>
                    ))}
                </select>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                    <div
                        key={doctor._id}
                        className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => router.push(`/patient/doctors/${doctor._id}`)}
                    >
                        {doctor.profileImage && (
                            <img
                                src={doctor.profileImage}
                                alt={`${doctor.firstName} ${doctor.lastName}`}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                            />
                        )}
                        <h3 className="text-xl font-semibold text-center">
                            Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-gray-600 text-center mt-2">{doctor.specialization}</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-center">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1">{doctor.rating_average.toFixed(1)}</span>
                                <span className="ml-1 text-gray-500">({doctor.rating_count} reviews)</span>
                            </div>
                            <p className="text-center text-gray-700">
                                ${doctor.consultationFee} per consultation
                            </p>
                            <p className="text-center text-sm text-gray-500">
                                {doctor.yearsOfExperience} years experience
                            </p>
                            {doctor.is_available ? (
                                <span className="block text-center text-green-600 text-sm">Available</span>
                            ) : (
                                <span className="block text-center text-red-600 text-sm">Not Available</span>
                            )}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/patient/doctors/${doctor._id}`);
                            }}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No doctors found matching your criteria.
                </div>
            )}
        </div>
    );
}
