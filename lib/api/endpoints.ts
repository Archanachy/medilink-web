
export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password',
        UPDATE_PROFILE: (id: string) => `/api/auth/${id}`,
        ME: '/api/auth/me',
        USER_BY_ID: (id: string) => `/api/auth/users/${id}`,
    },
    ADMIN: {
        USERS: '/api/admin/users',
        USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
        CREATE_USER: '/api/admin/users',
    },
    DOCTORS: {
        LIST: '/api/auth/doctors',
        BY_ID: (id: string) => `/api/auth/doctors/${id}`,
        BY_SPECIALIZATION: '/api/auth/doctors/specialization',
        AVAILABILITY: (id: string) => `/api/auth/doctors/${id}/availability`,
        UPDATE_AVAILABILITY: (id: string) => `/api/auth/doctors/${id}/availability`,
    },
    PATIENTS: {
        CREATE: '/api/auth/patients',
        BY_ID: (id: string) => `/api/auth/patients/${id}`,
        UPDATE: (id: string) => `/api/auth/patients/${id}`,
        DELETE: (id: string) => `/api/auth/patients/${id}`,
    },
    APPOINTMENTS: {
        LIST: '/api/auth/appointments',
        BY_ID: (id: string) => `/api/auth/appointments/${id}`,
        BY_PATIENT: (patientId: string) => `/api/auth/appointments/patient/${patientId}`,
        BY_DOCTOR: (doctorId: string) => `/api/auth/appointments/doctor/${doctorId}`,
        AVAILABLE_SLOTS: '/api/auth/appointments/available-slots',
        CREATE: '/api/auth/appointments',
        UPDATE: (id: string) => `/api/auth/appointments/${id}`,
        CANCEL: (id: string) => `/api/auth/appointments/${id}/cancel`,
        DELETE: (id: string) => `/api/auth/appointments/${id}`,
    },
    PRESCRIPTIONS: {
        DOCTOR: {
            CREATE: '/api/doctor/prescriptions',
            LIST: '/api/doctor/prescriptions',
            BY_ID: (id: string) => `/api/doctor/prescriptions/${id}`,
            UPDATE: (id: string) => `/api/doctor/prescriptions/${id}`,
            UPDATE_ITEMS: (id: string) => `/api/doctor/prescriptions/${id}/items`,
        },
        PATIENT: {
            LIST: '/api/patient/prescriptions',
            BY_ID: (id: string) => `/api/patient/prescriptions/${id}`,
            DOWNLOAD: (id: string) => `/api/patient/prescriptions/${id}/download`,
        },
    },
    PAYMENTS: {
        PATIENT: {
            CREATE_INTENT: '/api/patient/payments/create-intent',
            CONFIRM: '/api/patient/payments/confirm',
            LIST: '/api/patient/payments',
            BY_ID: (id: string) => `/api/patient/payments/${id}`,
        },
        DOCTOR: {
            REVENUE: '/api/doctor/revenue',
            REFUND: (id: string) => `/api/doctor/payments/${id}/refund`,
        },
    },
    REVIEWS: {
        PATIENT: {
            CREATE: '/api/patient/reviews',
            UPDATE: (id: string) => `/api/patient/reviews/${id}`,
            DELETE: (id: string) => `/api/patient/reviews/${id}`,
            LIST: '/api/patient/reviews',
        },
        DOCTOR: {
            LIST: '/api/doctor/reviews',
            STATS: '/api/doctor/reviews/stats',
        },
    },
    MEDICAL_REPORTS: {
        PATIENT: {
            CREATE: '/api/patient/reports',
            LIST: '/api/patient/reports',
            BY_ID: (id: string) => `/api/patient/reports/${id}`,
            DELETE: (id: string) => `/api/patient/reports/${id}`,
        },
        DOCTOR: {
            BY_PATIENT: (patientId: string) => `/api/doctor/reports/${patientId}`,
        },
    },
    DOCTOR_DOCUMENTS: {
        UPLOAD: '/api/doctor/documents',
        LIST: '/api/doctor/documents',
        BY_ID: (id: string) => `/api/doctor/documents/${id}`,
        DELETE: (id: string) => `/api/doctor/documents/${id}`,
    },
    VIDEO_CONSULTATION: {
        PATIENT: {
            START: (appointmentId: string) => `/api/patient/appointments/${appointmentId}/start-video`,
            GET: (id: string) => `/api/patient/video-consultations/${id}`,
            END: (id: string) => `/api/patient/video-consultations/${id}/end`,
        },
        DOCTOR: {
            START: (appointmentId: string) => `/api/doctor/appointments/${appointmentId}/start-video`,
            GET: (id: string) => `/api/doctor/video-consultations/${id}`,
            END: (id: string) => `/api/doctor/video-consultations/${id}/end`,
        },
    },
    SUPPORT: {
        CREATE: '/api/support/tickets',
        LIST: '/api/support/tickets',
        BY_ID: (id: string) => `/api/support/tickets/${id}`,
        ADD_RESPONSE: (id: string) => `/api/support/tickets/${id}/responses`,
        CLOSE: (id: string) => `/api/support/tickets/${id}/close`,
    },
} as const;