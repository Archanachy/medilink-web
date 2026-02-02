
export const API = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        UPDATE_PROFILE: '/auth',
        ME: '/api/auth/me',
    },
    ADMIN: {
        USERS: '/api/admin/users',
        USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
        CREATE_USER: '/api/auth/user', // For admin user creation (uses MULTER)
    }
} as const;