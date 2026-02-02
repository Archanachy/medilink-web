"use client";

import { useEffect, useState } from "react";
import { debugAuthState } from "@/lib/actions/debug-action";
import Link from "next/link";

export default function DebugPage() {
    const [authState, setAuthState] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const state = await debugAuthState();
            setAuthState(state);
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                ← Back to Home
            </Link>

            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Debug Auth State</h1>

                <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                        <p className="font-semibold text-gray-900">Auth Token Status:</p>
                        <p className="text-gray-700">{authState?.hasToken ? '✓ Present' : '✗ Missing'}</p>
                        {authState?.token && (
                            <p className="text-sm text-gray-600 mt-1">Token: {authState.token}</p>
                        )}
                    </div>

                    <div className="border-l-4 border-green-500 bg-green-50 p-4">
                        <p className="font-semibold text-gray-900">User Data:</p>
                        {authState?.user ? (
                            <pre className="text-sm text-gray-700 overflow-auto bg-white p-3 rounded mt-2">
                                {JSON.stringify(authState.user, null, 2)}
                            </pre>
                        ) : (
                            <p className="text-gray-700">✗ No user data found</p>
                        )}
                    </div>

                    <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                        <p className="font-semibold text-gray-900">Role Check:</p>
                        <p className="text-gray-700 mt-2">
                            <span className="font-mono">user.role = </span>
                            <span className="font-mono text-blue-600">{authState?.userRole || 'undefined'}</span>
                        </p>
                        <p className="text-gray-700 mt-2">
                            <span className="font-mono">Is Admin? </span>
                            <span className={authState?.isAdmin ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                {authState?.isAdmin ? '✓ YES' : '✗ NO'}
                            </span>
                        </p>
                    </div>

                    <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                        <p className="font-semibold text-gray-900">Middleware Check:</p>
                        <p className="text-gray-700 mt-2">
                            For `/admin/*` routes, middleware requires:
                        </p>
                        <ul className="text-gray-700 mt-2 space-y-1 list-disc list-inside">
                            <li>
                                <span className={authState?.hasToken ? 'text-green-600' : 'text-red-600'}>
                                    {authState?.hasToken ? '✓' : '✗'}
                                </span> auth_token exists
                            </li>
                            <li>
                                <span className={authState?.user ? 'text-green-600' : 'text-red-600'}>
                                    {authState?.user ? '✓' : '✗'}
                                </span> user_data exists
                            </li>
                            <li>
                                <span className={authState?.isAdmin ? 'text-green-600' : 'text-red-600'}>
                                    {authState?.isAdmin ? '✓' : '✗'}
                                </span> user.role === 'admin'
                            </li>
                        </ul>
                        <p className="text-gray-700 mt-3 font-semibold">
                            Can access /admin routes?{' '}
                            <span className={authState?.isAdmin ? 'text-green-600' : 'text-red-600'}>
                                {authState?.isAdmin ? '✓ YES' : '✗ NO'}
                            </span>
                        </p>
                    </div>

                    {!authState?.isAdmin && (
                        <div className="border-l-4 border-red-500 bg-red-50 p-4">
                            <p className="font-semibold text-red-900">⚠️ Reason for Redirect:</p>
                            <p className="text-red-700 mt-2">
                                {!authState?.hasToken && 'No auth token found'}
                                {authState?.hasToken && !authState?.user && 'No user data in cookie'}
                                {authState?.hasToken && authState?.user && authState?.userRole !== 'admin' && 
                                    `User role is "${authState?.userRole}", but "admin" is required`}
                            </p>
                        </div>
                    )}
                </div>

                <Link 
                    href={authState?.isAdmin ? "/admin/users" : "/login"}
                    className={`mt-6 inline-block px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                        authState?.isAdmin 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                >
                    {authState?.isAdmin ? 'Go to Admin Panel' : 'Go to Login'}
                </Link>
            </div>
        </div>
    );
}
