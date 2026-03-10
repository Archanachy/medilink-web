'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, AdminStats } from '@/lib/api/admin';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getStats();
            setStats(data);
            setError('');
        } catch (err: any) {
            // If analytics endpoint not available, use mock data or skip
            setError(err.response?.data?.message || 'Failed to fetch statistics');
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

    const quickActions = [
        {
            title: 'Manage Users',
            description: 'View, create, and manage user accounts',
            icon: '👥',
            link: '/admin/users',
            color: 'bg-blue-100 hover:bg-blue-200',
        },
        {
            title: 'Manage Doctors',
            description: 'Verify and manage doctor profiles',
            icon: '👨‍⚕️',
            link: '/admin/doctors',
            color: 'bg-green-100 hover:bg-green-200',
        },
        {
            title: 'Appointments',
            description: 'View and manage all appointments',
            icon: '📅',
            link: '/admin/appointments',
            color: 'bg-purple-100 hover:bg-purple-200',
        },
        {
            title: 'Payments',
            description: 'Monitor payment transactions',
            icon: '💳',
            link: '/admin/payments',
            color: 'bg-yellow-100 hover:bg-yellow-200',
        },
        {
            title: 'Analytics',
            description: 'View platform analytics and reports',
            icon: '📊',
            link: '/admin/analytics',
            color: 'bg-pink-100 hover:bg-pink-200',
        },
        {
            title: 'Settings',
            description: 'Configure system settings',
            icon: '⚙️',
            link: '/admin/settings',
            color: 'bg-gray-100 hover:bg-gray-200',
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage and monitor the Medilink platform</p>
            </div>

            {error && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                    {error} (Using default values)
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Doctors</p>
                            <p className="text-3xl font-bold text-green-600">{stats?.totalDoctors || 0}</p>
                        </div>
                        <div className="text-4xl">👨‍⚕️</div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Patients</p>
                            <p className="text-3xl font-bold text-purple-600">{stats?.totalPatients || 0}</p>
                        </div>
                        <div className="text-4xl">🏥</div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Appointments</p>
                            <p className="text-3xl font-bold text-orange-600">{stats?.totalAppointments || 0}</p>
                        </div>
                        <div className="text-4xl">📅</div>
                    </div>
                </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 shadow rounded-lg p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
                        <p className="text-4xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="text-6xl">💰</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickActions.map((action) => (
                        <div
                            key={action.title}
                            onClick={() => router.push(action.link)}
                            className={`${action.color} rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105 shadow-md`}
                        >
                            <div className="text-5xl mb-4">{action.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                            <p className="text-gray-700">{action.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Users</h3>
                    {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentUsers.slice(0, 5).map((user: any) => (
                                <div key={user._id} className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent users</p>
                    )}
                    <button
                        onClick={() => router.push('/admin/users')}
                        className="mt-4 w-full text-blue-600 hover:text-blue-800 text-center"
                    >
                        View All Users →
                    </button>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Appointments</h3>
                    {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentAppointments.slice(0, 5).map((apt: any) => (
                                <div key={apt._id} className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <p className="font-semibold">
                                            {new Date(apt.appointment_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500">{apt.appointment_time}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        apt.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent appointments</p>
                    )}
                    <button
                        onClick={() => router.push('/admin/appointments')}
                        className="mt-4 w-full text-blue-600 hover:text-blue-800 text-center"
                    >
                        View All Appointments →
                    </button>
                </div>
            </div>
        </div>
    );
}
