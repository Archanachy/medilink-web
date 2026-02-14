"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuthToken, getUserData } from "@/lib/cookie";
import { handleLogout } from "@/lib/actions/auth-action";
import { useToast } from "@/app/context/ToastContext";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAuthToken();
      const user = token ? await getUserData() : null;
      setIsAuthenticated(!!token && !!user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogoutClick = async () => {
    addToast('Logged out successfully', 'success');
    await handleLogout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Medilink
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/auth/dashboard"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/user/profile"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/patients"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      For Patients
                    </Link>
                    <Link
                      href="/doctors"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      For Doctors
                    </Link>
                    <Link
                      href="/register"
                      className="px-7 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}