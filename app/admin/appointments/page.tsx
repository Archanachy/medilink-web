'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api/admin';

export default function AdminAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllAppointments();
            const appointmentsData = response.data || response;
            setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this appointment?')) {
            return;
        }

        try {
            await adminApi.deleteAppointment(id);
            fetchAppointments();
            alert('Appointment deleted successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete appointment');
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
            <h1 className="text-3xl font-bold mb-8">Appointment Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total</p>
                    <p className="text-2xl font-bold">{appointments.length}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Scheduled</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {appointments.filter(a => a.status === 'scheduled').length}
                    </p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                        {appointments.filter(a => a.status === 'completed').length}
                    </p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Cancelled</p>
                    <p className="text-2xl font-bold text-red-600">
                        {appointments.filter(a => a.status === 'cancelled').length}
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 border-b">
                {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
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
                                        {appointment.consultation_type || appointment.consultationType || 'in-person'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Date:</span>{' '}
                                        {new Date(appointment.appointment_date || appointment.appointmentDate).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Time:</span> {appointment.appointment_time || appointment.appointmentTime}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Patient ID:</span> {appointment.patient_id || appointment.patientId}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Doctor ID:</span> {appointment.doctor_id || appointment.doctorId}
                                    </p>
                                    {(appointment.reason || appointment.notes) && (
                                        <p className="md:col-span-2">
                                            <span className="font-semibold">Reason:</span> {appointment.reason || appointment.notes}
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-semibold">Payment Status:</span>{' '}
                                        <span className={
                                            (appointment.payment_status || appointment.paymentStatus) === 'completed' 
                                                ? 'text-green-600' 
                                                : 'text-orange-600'
                                        }>
                                            {appointment.payment_status || appointment.paymentStatus}
                                        </span>
                                    </p>
                                    {(appointment.payment_amount || appointment.paymentAmount) && (
                                        <p>
                                            <span className="font-semibold">Amount:</span> ${appointment.payment_amount || appointment.paymentAmount}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                                <button
                                    onClick={() => router.push(`/admin/appointments/${appointment._id}`)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleDeleteAppointment(appointment._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAppointments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No {filter !== 'all' ? filter : ''} appointments found</p>
                </div>
            )}
        </div>
    );
}
