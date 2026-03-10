export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <a href="/patient/dashboard" className="text-xl font-bold text-blue-600">
                                Medilink Patient
                            </a>
                            <div className="hidden md:flex space-x-4">
                                <a href="/patient/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                                    Dashboard
                                </a>
                                <a href="/patient/doctors" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                                    Doctors
                                </a>
                                <a href="/patient/appointments" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                                    Appointments
                                </a>
                                <a href="/patient/prescriptions" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                                    Prescriptions
                                </a>
                                <a href="/patient/reviews" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                                    Reviews
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="/user/profile" className="text-gray-700 hover:text-blue-600">
                                Profile
                            </a>
                            <a href="/login" className="text-red-600 hover:text-red-800">
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
