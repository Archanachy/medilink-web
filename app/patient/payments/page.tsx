'use client';

import { useState, useEffect } from 'react';
import { paymentApi, Payment } from '@/lib/api/payment';

export default function PatientPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await paymentApi.patient.getAllPayments();
            setPayments(data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch payments');
        } finally {
            setLoading(false);
        }
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
            <h1 className="text-3xl font-bold mb-8">Payment History</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {payments.map((payment) => (
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
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(payment.payment_status)}`}>
                                        {payment.payment_status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Amount:</span>{' '}
                                        {payment.currency.toUpperCase()} {payment.amount.toFixed(2)}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Method:</span> {payment.payment_method}
                                    </p>
                                    {payment.payment_date && (
                                        <p>
                                            <span className="font-semibold">Date:</span>{' '}
                                            {new Date(payment.payment_date).toLocaleDateString()}
                                        </p>
                                    )}
                                    {payment.transaction_id && (
                                        <p>
                                            <span className="font-semibold">Transaction ID:</span>{' '}
                                            {payment.transaction_id}
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-semibold">Appointment ID:</span>{' '}
                                        {payment.appointment_id.slice(-6)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {payments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">No payment history found</p>
                </div>
            )}
        </div>
    );
}
