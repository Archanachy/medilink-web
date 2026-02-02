"use server";

import { getAuthToken, getUserData } from "@/lib/cookie";

export const debugAuthState = async () => {
    const token = await getAuthToken();
    const user = await getUserData();
    
    return {
        hasToken: !!token,
        token: token ? `${token.substring(0, 20)}...` : null,
        user: user,
        userRole: user?.role || 'No role found',
        isAdmin: user?.role === 'admin',
    };
};
