'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api/admin';

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getStats();
            setStats(data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Analytics endpoint not available');
            // Set default stats
            setStats({
                totalUsers: 0,
                totalDoctors: 0,
                totalPatients: 0,
                totalAppointments: 0,
                totalRevenue: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Platform Analytics</h1>

            {error && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">All registered users</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-gray-500 text-sm">Doctors</p>
                            <p className="text-3xl font-bold text-green-600">{stats?.totalDoctors || 0}</p>
                        </div>
                        <div className="text-4xl">👨‍⚕️</div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Registered doctors</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-gray-500 text-sm">Patients</p>
                            <p className="text-3xl font-bold text-purple-600">{stats?.totalPatients || 0}</p>
                        </div>
                        <div className="text-4xl">🏥</div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Registered patients</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-gray-500 text-sm">Appointments</p>
                            <p className="text-3xl font-bold text-orange-600">{stats?.totalAppointments || 0}</p>
                        </div>
                        <div className="text-4xl">📅</div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Total bookings</p>
                </div>
            </div>

            {/* Revenue Section */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 shadow rounded-lg p-8 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-100 text-sm mb-2">Total Platform Revenue</p>
                        <p className="text-5xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                        <p className="text-green-100 text-sm mt-2">Lifetime earnings</p>
                    </div>
                    <div className="text-8xl">💰</div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">User Growth</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Users</span>
                            <span className="font-semibold">{stats?.totalUsers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Doctors</span>
                            <span className="font-semibold">{stats?.totalDoctors || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Patients</span>
                            <span className="font-semibold">{stats?.totalPatients || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-gray-600">Patient-to-Doctor Ratio</span>
                            <span className="font-semibold">
                                {stats?.totalDoctors > 0 
                                    ? (stats.totalPatients / stats.totalDoctors).toFixed(1) 
                                    : '0'}:1
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Appointment Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Appointments</span>
                            <span className="font-semibold">{stats?.totalAppointments || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Average per Doctor</span>
                            <span className="font-semibold">
                                {stats?.totalDoctors > 0 
                                    ? Math.round(stats.totalAppointments / stats.totalDoctors) 
                                    : 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Average per Patient</span>
                            <span className="font-semibold">
                                {stats?.totalPatients > 0 
                                    ? (stats.totalAppointments / stats.totalPatients).toFixed(1) 
                                    : '0'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">Platform Size</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {(stats?.totalUsers || 0) + (stats?.totalDoctors || 0)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Total Accounts</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                            {stats?.totalPatients > 0 
                                ? ((stats.totalAppointments / stats.totalPatients) * 100).toFixed(0) 
                                : '0'}%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Appointments per Patient</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded">
                        <p className="text-sm text-gray-600 mb-1">Average Revenue</p>
                        <p className="text-2xl font-bold text-purple-600">
                            ${stats?.totalAppointments > 0 
                                ? (stats.totalRevenue / stats.totalAppointments).toFixed(2) 
                                : '0.00'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Per Appointment</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
