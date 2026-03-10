'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api/admin';

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllPayments();
            const paymentsData = response.data || response;
            setPayments(Array.isArray(paymentsData) ? paymentsData : []);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter((payment) => {
        if (filter === 'all') return true;
        return (payment.payment_status || payment.paymentStatus) === filter;
    });

    const getTotalRevenue = () => {
        return payments
            .filter(p => (p.payment_status || p.paymentStatus) === 'completed')
            .reduce((sum, p) => sum + (p.amount || 0), 0);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading payments...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Payment Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 shadow rounded-lg p-6 text-white">
                    <p className="text-green-100 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">${getTotalRevenue().toFixed(2)}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Payments</p>
                    <p className="text-2xl font-bold">{payments.length}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                        {payments.filter(p => (p.payment_status || p.paymentStatus) === 'completed').length}
                    </p>
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {payments.filter(p => (p.payment_status || p.paymentStatus) === 'pending').length}
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2 border-b">
                {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
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

            {/* Payments List */}
            <div className="space-y-4">
                {filteredPayments.map((payment) => (
                    <div
                        key={payment._id}
                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-semibold">
                                        Payment #{payment._id.slice(-6)}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.payment_status || payment.paymentStatus)}`}>
                                        {payment.payment_status || payment.paymentStatus}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Amount:</span>{' '}
                                        {(payment.currency || 'USD').toUpperCase()} ${payment.amount?.toFixed(2)}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Method:</span> {payment.payment_method || payment.paymentMethod || 'N/A'}
                                    </p>
                                    {(payment.payment_date || payment.paymentDate) && (
                                        <p>
                                            <span className="font-semibold">Date:</span>{' '}
                                            {new Date(payment.payment_date || payment.paymentDate).toLocaleDateString()}
                                        </p>
                                    )}
                                    {(payment.transaction_id || payment.transactionId) && (
                                        <p>
                                            <span className="font-semibold">Transaction ID:</span>{' '}
                                            {payment.transaction_id || payment.transactionId}
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-semibold">Patient ID:</span> {payment.patient_id || payment.patientId}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Doctor ID:</span> {payment.doctor_id || payment.doctorId}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Appointment ID:</span>{' '}
                                        {(payment.appointment_id || payment.appointmentId)?.slice(-6)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPayments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No {filter !== 'all' ? filter : ''} payments found</p>
                </div>
            )}
        </div>
    );
}
