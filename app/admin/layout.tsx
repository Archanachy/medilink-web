"use client";

import Link from "next/link";
import { handleLogout } from "@/lib/actions/auth-action";
import { useToast } from "@/app/context/ToastContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { addToast } = useToast();

    const handleLogoutClick = async () => {
        addToast('Logged out successfully', 'success');
        await handleLogout();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">Medilink Admin</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/admin/dashboard" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                                Dashboard
                            </Link>
                            <Link href="/admin/users" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                                Users
                            </Link>
                            <Link href="/admin/doctors" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                                Doctors
                            </Link>
                            <Link href="/admin/appointments" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                                Appointments
                            </Link>
                            <Link href="/admin/payments" className="text-gray-600 hover:text-red-600 transition-colors font-medium">
                                Payments
                            </Link>
                            <button
                                onClick={handleLogoutClick}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
