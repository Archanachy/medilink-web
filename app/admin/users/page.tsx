"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUsers } from "@/lib/api/user";
import UsersTable from "./_components/UsersTable";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const loadUsers = async (nextPage = page, nextLimit = limit) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getUsers({ page: nextPage, limit: nextLimit });
            if (response.success) {
                const payload = response.data ?? response;
                const resolvedUsers = Array.isArray(payload)
                    ? payload
                    : payload.users || payload.items || payload.data || [];
                const resolvedTotal = payload.total || payload.totalCount || payload.pagination?.total || resolvedUsers.length;
                const resolvedPage = payload.page || payload.pagination?.page || nextPage;
                const resolvedLimit = payload.limit || payload.pagination?.limit || nextLimit;
                const resolvedTotalPages = payload.totalPages || payload.pagination?.totalPages || Math.max(1, Math.ceil(resolvedTotal / resolvedLimit));

                setUsers(resolvedUsers);
                setTotal(resolvedTotal);
                setPage(resolvedPage);
                setLimit(resolvedLimit);
                setTotalPages(resolvedTotalPages);
            }
        } catch (err: Error | any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(page, limit);
    }, [page, limit]);

    const roleCounts = users.reduce(
        (acc, user) => {
            const role = user.role || 'patient';
            acc.roles[role] = (acc.roles[role] || 0) + 1;
            acc.active += user.isActive !== false ? 1 : 0;
            acc.inactive += user.isActive === false ? 1 : 0;
            return acc;
        },
        { roles: {} as Record<string, number>, active: 0, inactive: 0 }
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-600 mt-2">Total users: {total}</p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Create User
                </Link>
            </div>

            {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-6">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Active Users</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">{roleCounts.active}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Inactive Users</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">{roleCounts.inactive}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">Admins / Doctors / Patients</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2">
                        {(roleCounts.roles.admin || 0)} / {(roleCounts.roles.doctor || 0)} / {(roleCounts.roles.patient || 0)}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">Loading users...</div>
            ) : (
                <>
                    <UsersTable users={users} onUserDeleted={() => loadUsers(page, limit)} />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <div className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                disabled={page <= 1}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={page >= totalPages}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                            <select
                                value={limit}
                                onChange={(event) => {
                                    setPage(1);
                                    setLimit(Number(event.target.value));
                                }}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white"
                                aria-label="Rows per page"
                            >
                                {[5, 10, 20, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size} / page
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
