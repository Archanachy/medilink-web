'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentApi, Appointment } from '@/lib/api/appointment';

export default function PatientAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            // This would need the patient ID from auth context
            const data = await appointmentApi.getAllAppointments();
            setAppointments(data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            await appointmentApi.cancelAppointment(id);
            fetchAppointments();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    const filteredAppointments = appointments.filter((apt) => {
        if (filter === 'all') return true;
        return apt.status === filter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'no-show':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading appointments...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Appointments</h1>
                <button
                    onClick={() => router.push('/patient/appointments/book')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Book New Appointment
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 border-b">
                {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 capitalize ${
                            filter === status
                                ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                                : 'text-gray-600'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                    <div
                        key={appointment._id}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold">
                                        Appointment #{appointment._id.slice(-6)}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                                        {appointment.consultation_type}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Date:</span>{' '}
                                        {new Date(appointment.appointment_date).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Time:</span> {appointment.appointment_time}
                                    </p>
                                    {appointment.reason && (
                                        <p className="md:col-span-2">
                                            <span className="font-semibold">Reason:</span> {appointment.reason}
                                        </p>
                                    )}
                                    {appointment.notes && (
                                        <p className="md:col-span-2">
                                            <span className="font-semibold">Notes:</span> {appointment.notes}
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-semibold">Payment:</span>{' '}
                                        <span className={appointment.payment_status === 'completed' ? 'text-green-600' : 'text-orange-600'}>
                                            {appointment.payment_status}
                                        </span>
                                    </p>
                                    {appointment.payment_amount && (
                                        <p>
                                            <span className="font-semibold">Amount:</span> ${appointment.payment_amount}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                                {appointment.status === 'scheduled' && (
                                    <>
                                        <button
                                            onClick={() => router.push(`/patient/appointments/${appointment._id}`)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleCancelAppointment(appointment._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {appointment.status === 'completed' && (
                                    <button
                                        onClick={() => router.push(`/patient/appointments/${appointment._id}`)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        View Details
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAppointments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl mb-4">No {filter !== 'all' ? filter : ''} appointments found</p>
                    <button
                        onClick={() => router.push('/patient/appointments/book')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Book your first appointment →
                    </button>
                </div>
            )}
        </div>
    );
}
