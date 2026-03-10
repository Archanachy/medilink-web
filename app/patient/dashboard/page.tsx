'use client';

import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
    const router = useRouter();

    const features = [
        {
            title: 'Find Doctors',
            description: 'Browse and search for qualified doctors by specialization',
            icon: '👨‍⚕️',
            link: '/patient/doctors',
            color: 'bg-blue-100 hover:bg-blue-200',
        },
        {
            title: 'My Appointments',
            description: 'View and manage your appointments',
            icon: '📅',
            link: '/patient/appointments',
            color: 'bg-green-100 hover:bg-green-200',
        },
        {
            title: 'Book Appointment',
            description: 'Schedule a new appointment with a doctor',
            icon: '➕',
            link: '/patient/appointments/book',
            color: 'bg-purple-100 hover:bg-purple-200',
        },
        {
            title: 'My Prescriptions',
            description: 'Access your medical prescriptions',
            icon: '💊',
            link: '/patient/prescriptions',
            color: 'bg-pink-100 hover:bg-pink-200',
        },
        {
            title: 'Payment History',
            description: 'View your payment transactions',
            icon: '💳',
            link: '/patient/payments',
            color: 'bg-yellow-100 hover:bg-yellow-200',
        },
        {
            title: 'My Reviews',
            description: 'Manage your doctor reviews',
            icon: '⭐',
            link: '/patient/reviews',
            color: 'bg-orange-100 hover:bg-orange-200',
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Patient Dashboard</h1>
                <p className="text-gray-600">Welcome back! Manage your healthcare journey.</p>
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
                <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded">
                        <div className="text-3xl font-bold text-blue-600">-</div>
                        <div className="text-gray-600 mt-1">Total Appointments</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded">
                        <div className="text-3xl font-bold text-green-600">-</div>
                        <div className="text-gray-600 mt-1">Upcoming</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded">
                        <div className="text-3xl font-bold text-purple-600">-</div>
                        <div className="text-gray-600 mt-1">Prescriptions</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded">
                        <div className="text-3xl font-bold text-orange-600">-</div>
                        <div className="text-gray-600 mt-1">Reviews Written</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
