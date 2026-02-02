import { LoginData, RegisterData } from "@/app/(auth)/schema"
import axios from "./axios"
import { API } from "./endpoints"


export const register = async (registerData: RegisterData) => {
    try {
        const transformedData = {
            firstName: registerData.fullName.split(' ')[0],
            lastName: registerData.fullName.split(' ')[1] || '',
            email: registerData.email,
            username: registerData.username,
            password: registerData.password,
            confirmPassword: registerData.confirmPassword,
            role: registerData.userType
        }
        const response = await axios.post(API.AUTH.REGISTER, transformedData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
}

export const login = async (loginData: LoginData) => {
    try {
        const transformedData = {
            email: loginData.emailOrUsername,
            password: loginData.password
        }
        const response = await axios.post(API.AUTH.LOGIN, transformedData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
}