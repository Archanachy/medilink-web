'use client';

import { useRouter } from 'next/navigation';

export default function DoctorDashboard() {
    const router = useRouter();

    const features = [
        {
            title: 'My Appointments',
            description: 'View scheduled patient appointments',
            icon: '📅',
            link: '/doctor/appointments',
            color: 'bg-blue-100 hover:bg-blue-200',
        },
        {
            title: 'Prescriptions',
            description: 'Create and manage prescriptions',
            icon: '💊',
            link: '/doctor/prescriptions',
            color: 'bg-green-100 hover:bg-green-200',
        },
        {
            title: 'Create Prescription',
            description: 'Write a new prescription',
            icon: '➕',
            link: '/doctor/prescriptions/create',
            color: 'bg-purple-100 hover:bg-purple-200',
        },
        {
            title: 'Patient Reviews',
            description: 'View your ratings and reviews',
            icon: '⭐',
            link: '/doctor/reviews',
            color: 'bg-yellow-100 hover:bg-yellow-200',
        },
        {
            title: 'My Profile',
            description: 'Manage your profile and availability',
            icon: '👤',
            link: '/user/profile',
            color: 'bg-pink-100 hover:bg-pink-200',
        },
        {
            title: 'Revenue',
            description: 'View earnings and analytics',
            icon: '💰',
            link: '/doctor/revenue',
            color: 'bg-orange-100 hover:bg-orange-200',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Doctor Dashboard</h1>
                <p className="text-gray-600">Manage your practice and patients.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        onClick={() => router.push(feature.link)}
                        className={`${feature.color} rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105 shadow-md`}
                    >
                        <div className="text-5xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-700">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-12 bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Today's Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                        <div className="text-3xl font-bold text-blue-600">-</div>
                        <div className="text-gray-600 mt-1">Today's Appointments</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded">
                        <div className="text-3xl font-bold text-green-600">-</div>
                        <div className="text-gray-600 mt-1">Total Patients</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded">
                        <div className="text-3xl font-bold text-purple-600">-</div>
                        <div className="text-gray-600 mt-1">Average Rating</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded">
                        <div className="text-3xl font-bold text-orange-600">-</div>
                        <div className="text-gray-600 mt-1">This Month Revenue</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
