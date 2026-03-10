'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { prescriptionApi, PrescriptionCreateData, PrescriptionItem } from '@/lib/api/prescription';

export default function CreatePrescriptionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        patient_id: '',
        appointment_id: '',
        diagnosis: '',
        notes: '',
    });
    const [items, setItems] = useState<PrescriptionItem[]>([
        { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' },
    ]);

    const handleAddItem = () => {
        setItems([...items, { medicine_name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: keyof PrescriptionItem, value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const prescriptionData: PrescriptionCreateData = {
                ...formData,
                items: items.filter(item => item.medicine_name.trim() !== ''),
            };

            if (prescriptionData.items.length === 0) {
                throw new Error('Please add at least one medicine');
            }

            await prescriptionApi.doctor.createPrescription(prescriptionData);
            router.push('/doctor/prescriptions');
        } catch (err: any) {
            setError(err.message || err.response?.data?.message || 'Failed to create prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Create New Prescription</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-4xl bg-white shadow rounded-lg p-8">
                {/* Patient ID */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Patient ID <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.patient_id}
                        onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                        required
                        placeholder="Enter patient ID"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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

                {/* Diagnosis */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                        required
                        placeholder="Enter diagnosis"
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Notes */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Additional Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional notes for the patient"
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Prescription Items */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Prescribed Medicines</h3>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            + Add Medicine
                        </button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold">Medicine #{index + 1}</h4>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Medicine Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={item.medicine_name}
                                            onChange={(e) => handleItemChange(index, 'medicine_name', e.target.value)}
                                            required
                                            placeholder="e.g., Paracetamol"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Dosage <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={item.dosage}
                                            onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                                            required
                                            placeholder="e.g., 500mg"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Frequency <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={item.frequency}
                                            onChange={(e) => handleItemChange(index, 'frequency', e.target.value)}
                                            required
                                            placeholder="e.g., 2 times a day"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Duration <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={item.duration}
                                            onChange={(e) => handleItemChange(index, 'duration', e.target.value)}
                                            required
                                            placeholder="e.g., 7 days"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 text-sm mb-1">
                                            Instructions
                                        </label>
                                        <input
                                            type="text"
                                            value={item.instructions}
                                            onChange={(e) => handleItemChange(index, 'instructions', e.target.value)}
                                            placeholder="e.g., Take after meals"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'Creating...' : 'Create Prescription'}
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
