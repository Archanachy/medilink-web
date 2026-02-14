
export const API = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password',
        UPDATE_PROFILE: '/auth',
        ME: '/api/auth/me',
        USER_BY_ID: (id: string) => `/api/auth/users/${id}`,
    },
    ADMIN: {
        USERS: '/api/admin/users',
        USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
        CREATE_USER: '/api/admin/users',
    }
} as const;