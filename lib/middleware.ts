import { getAuthToken, getUserData } from './cookie';

export const checkAuth = async () => {
    const token = await getAuthToken();
    const userData = await getUserData();
    
    return {
        isAuthenticated: !!token,
        user: userData,
        token,
    };
};

export const checkAdminAuth = async () => {
    const { isAuthenticated, user } = await checkAuth();
    return isAuthenticated && user?.role === 'admin';
};

export const checkUserAuth = async () => {
    const { isAuthenticated } = await checkAuth();
    return isAuthenticated;
};
