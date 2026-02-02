"use client";

import { useToast } from '@/app/context/ToastContext';

const toastColors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`p-4 rounded-lg border flex items-center gap-3 shadow-md animate-in slide-in-from-right ${toastColors[toast.type]}`}
                    role="alert"
                    aria-live="polite"
                >
                    <span className="text-lg font-bold">{iconMap[toast.type]}</span>
                    <span className="flex-1">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-sm font-semibold opacity-70 hover:opacity-100"
                        aria-label="Dismiss notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
