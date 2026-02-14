"use server";
import { forgotPassword, login, register, resetPassword } from "@/lib/api/auth"
import { LoginData, RegisterData } from "@/app/(auth)/schema"
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie"
import { redirect } from "next/navigation";
export const handleRegister = async (data: RegisterData) => {
    try {
        const response = await register(data)
        if (response.success) {
            return {
                success: true,
                message: 'Registration successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Registration action failed' }
    }
}

export const handleLogin = async (data: LoginData) => {
    try {
        const response = await login(data)
        if (response.success) {
            await setAuthToken(response.token)
            
            // Extract user data from response
            // Handle both response.data and response.user structures
            const userData = response.data?.user || response.data || response.user
            
            // Ensure role is included in user data
            const userDataToStore = {
                _id: userData._id || userData.id,
                email: userData.email,
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
                ...userData
            }
            
            await setUserData(userDataToStore)
            return {
                success: true,
                message: 'Login successful',
                data: userDataToStore
            }
        }
        return {
            success: false,
            message: response.message || 'Login failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Login action failed' }
    }
}

export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
}

export const handleForgotPassword = async (email: string) => {
    try {
        const response = await forgotPassword(email)
        if (response.success) {
            return {
                success: true,
                message: response.message || 'Reset email sent'
            }
        }
        return {
            success: false,
            message: response.message || 'Forgot password failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Forgot password action failed' }
    }
}

export const handleResetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword, confirmPassword)
        if (response.success) {
            return {
                success: true,
                message: response.message || 'Password reset successfully'
            }
        }
        return {
            success: false,
            message: response.message || 'Reset password failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Reset password action failed' }
    }
}