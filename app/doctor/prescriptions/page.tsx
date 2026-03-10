'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { prescriptionApi, Prescription, PrescriptionCreateData, PrescriptionItem } from '@/lib/api/prescription';

export default function DoctorPrescriptionsPage() {
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const data = await prescriptionApi.doctor.getAllPrescriptions();
            setPrescriptions(data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch prescriptions');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading prescriptions...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Prescriptions</h1>
                <button
                    onClick={() => router.push('/doctor/prescriptions/create')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Create New Prescription
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {prescriptions.map((prescription) => (
                    <div
                        key={prescription._id}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">
                                    Prescription #{prescription._id.slice(-6)}
                                </h3>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Date:</span>{' '}
                                        {new Date(prescription.prescription_date).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Patient ID:</span> {prescription.patient_id}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Diagnosis:</span> {prescription.diagnosis}
                                    </p>
                                    {prescription.notes && (
                                        <p>
                                            <span className="font-semibold">Notes:</span> {prescription.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Prescribed Medicines ({prescription.items.length}):</h4>
                                    <div className="space-y-2">
                                        {prescription.items.slice(0, 3).map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 p-2 rounded text-sm"
                                            >
                                                <p className="font-semibold text-blue-600">{item.medicine_name}</p>
                                                <p className="text-gray-600">
                                                    {item.dosage} • {item.frequency} • {item.duration}
                                                </p>
                                            </div>
                                        ))}
                                        {prescription.items.length > 3 && (
                                            <p className="text-sm text-gray-500">
                                                +{prescription.items.length - 3} more medicines
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                                <button
                                    onClick={() => router.push(`/doctor/prescriptions/${prescription._id}`)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => router.push(`/doctor/prescriptions/${prescription._id}/edit`)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {prescriptions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl mb-4">No prescriptions created yet</p>
                    <button
                        onClick={() => router.push('/doctor/prescriptions/create')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Create your first prescription →
                    </button>
                </div>
            )}
        </div>
    );
}
