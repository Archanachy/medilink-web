'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { appointmentApi, AppointmentCreateData } from '@/lib/api/appointment';
import { doctorApi, Doctor } from '@/lib/api/doctor';
import { getAuthToken } from '@/lib/cookie';

export default function BookAppointmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const doctorIdParam = searchParams.get('doctorId');

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string>(doctorIdParam || '');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [consultationType, setConsultationType] = useState<'in-person' | 'video'>('in-person');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (selectedDoctor && appointmentDate) {
            fetchAvailableSlots();
        }
    }, [selectedDoctor, appointmentDate]);

    const fetchDoctors = async () => {
        try {
            const data = await doctorApi.getAllDoctors();
            setDoctors(data.filter(d => d.is_available));
        } catch (err: any) {
            setError('Failed to fetch doctors');
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const slots = await appointmentApi.getAvailableSlots(selectedDoctor, appointmentDate);
            if (slots.length > 0) {
                setAvailableSlots(slots[0].slots || []);
            } else {
                setAvailableSlots([]);
            }
        } catch (err: any) {
            console.error('Failed to fetch available slots:', err);
            setAvailableSlots([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const appointmentData: AppointmentCreateData = {
                doctor_id: selectedDoctor,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
                reason,
                notes,
                consultation_type: consultationType,
            };

            await appointmentApi.createAppointment(appointmentData);
            setSuccess(true);
            setTimeout(() => {
                router.push('/patient/appointments');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setLoading(false);
        }
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded">
                    Appointment booked successfully! Redirecting...
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Book an Appointment</h1>

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
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
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

                {/* Consultation Type */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Consultation Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="in-person"
                                checked={consultationType === 'in-person'}
                                onChange={(e) => setConsultationType(e.target.value as 'in-person')}
                                className="mr-2"
                            />
                            In-Person
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="video"
                                checked={consultationType === 'video'}
                                onChange={(e) => setConsultationType(e.target.value as 'video')}
                                className="mr-2"
                            />
                            Video Consultation
                        </label>
                    </div>
                </div>

                {/* Appointment Date */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={getTomorrowDate()}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Appointment Time */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Appointment Time <span className="text-red-500">*</span>
                    </label>
                    {availableSlots.length > 0 ? (
                        <select
                            value={appointmentTime}
                            onChange={(e) => setAppointmentTime(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Choose a time slot</option>
                            {availableSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div>
                            <input
                                type="time"
                                value={appointmentTime}
                                onChange={(e) => setAppointmentTime(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {selectedDoctor && appointmentDate && (
                                <p className="text-sm text-gray-500 mt-1">
                                    No predefined slots available. Please select a time.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Reason */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Reason for Visit
                    </label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., Regular checkup, Pain consultation"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                        Additional Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional information for the doctor"
                        rows={4}
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
                        {loading ? 'Booking...' : 'Book Appointment'}
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
