'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { prescriptionApi, Prescription } from '@/lib/api/prescription';

export default function PatientPrescriptionsPage() {
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const data = await prescriptionApi.patient.getAllPrescriptions();
            setPrescriptions(data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id: string) => {
        try {
            const blob = await prescriptionApi.patient.downloadPrescription(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `prescription-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to download prescription');
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
            <h1 className="text-3xl font-bold mb-8">My Prescriptions</h1>

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
                                        <span className="font-semibold">Diagnosis:</span> {prescription.diagnosis}
                                    </p>
                                    {prescription.notes && (
                                        <p>
                                            <span className="font-semibold">Notes:</span> {prescription.notes}
                                        </p>
                                    )}
                                </div>

                                {/* Medicines List */}
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Prescribed Medicines:</h4>
                                    <div className="space-y-2">
                                        {prescription.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 p-3 rounded border border-gray-200"
                                            >
                                                <p className="font-semibold text-blue-600">{item.medicine_name}</p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1 text-sm text-gray-600">
                                                    <p>
                                                        <span className="font-semibold">Dosage:</span> {item.dosage}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Frequency:</span> {item.frequency}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold">Duration:</span> {item.duration}
                                                    </p>
                                                    {item.instructions && (
                                                        <p className="col-span-2 md:col-span-3">
                                                            <span className="font-semibold">Instructions:</span>{' '}
                                                            {item.instructions}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                                <button
                                    onClick={() => router.push(`/patient/prescriptions/${prescription._id}`)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleDownload(prescription._id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {prescriptions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No prescriptions found</p>
                </div>
            )}
        </div>
    );
}
