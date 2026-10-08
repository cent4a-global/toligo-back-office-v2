import api from '../../../lib/axios/api'

export async function login(credentials) {
    try {
        const response = await api.post('/auth/login', credentials)

        return response.data
    } catch (error) {
        error.message = error.response?.data?.message ?? error.message
        throw error
    }
}

export async function verifyCode({ email, code }) {
    try {
        const response = await api.post('/auth/verify-code', {
            email,
            code,
        })

        return response.data
    } catch (error) {
        error.message = error.response?.data?.message ?? error.message
        throw error
    }
}

export async function resendCode(email) {
    try {
        const response = await api.post('/auth/resend-code', {
            email,
        })

        return response.data
    } catch (error) {
        error.message = error.response?.data?.message ?? error.message
        throw error
    }
}

export async function forgotPassword(email) {
    try {
        const response = await api.post('/auth/forgot-password', {
            email,
        })

        return response.data
    } catch (error) {
        error.message = error.response?.data?.message ?? error.message
        throw error
    }
}

export async function resendResetOtp(email) {
    try {
        const response = await api.post('/auth/resend-reset-otp', {
            email,
        })

        return response.data
    } catch (error) {
        error.message = error.response?.data?.message ?? error.message
        throw error
    }
}

export async function verifyResetOtp({ email, code }) {
    try {
        const response = await api.post('/auth/verify-reset-otp', {
            email,
            code,
        })

        return response.data
    } catch (error) {
        error.message = error.response?.data?.message ?? error.message
        throw error
    }
}

export async function confirmResetPassword({ email, newPassword, newPasswordConfirmation }) {
    try {
        const response = await api.post('/auth/reset-password', {
            email,
            newPassword,
            newPasswordConfirmation,
        })

        return response.data
    } catch (error) {
        error.message = error.response?.data?.message ?? error.message
        throw error
    }
}
