import api from '../../../lib/axios/api'

function getErrorMessage(error, fallbackMessage) {
    return error.response?.data?.message || error.message || fallbackMessage
}

export async function login(credentials) {
    try {
        const response = await api.post('/api/admin/login', credentials)

        return response.data
    } catch (error) {
        const message = getErrorMessage(error, 'Erreur lors de la connexion')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function verifyCode({ email, code }) {
    try {
        const response = await api.post('/api/admin/login/verify', {
            email,
            code,
        })

        return response.data
    } catch (error) {
        const message = getErrorMessage(error, 'Code invalide ou expiré')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function resendCode(email) {
    try {
        const response = await api.post('/api/admin/resend-otp', {
            email,
        })

        return response.data
    } catch (error) {
        const message = getErrorMessage(error, 'Erreur lors du renvoi du code')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function forgotPassword(email) {
    try {
        const response = await api.post('/api/admin/forgot-password', {
            email,
        })

        return response.data
    } catch (error) {
        const message = getErrorMessage(error, "Erreur lors de l'envoi du code de réinitialisation")

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function resendResetOtp(email) {
    try {
        const response = await api.post('/api/admin/forgot-password/resend', {
            email,
        })

        return response.data
    } catch (error) {
        const message = getErrorMessage(error, 'Erreur lors du renvoi du code de réinitialisation')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function verifyResetOtp({ email, code }) {
    try {
        const response = await api.post('/api/admin/reset-password/verify', {
            email,
            code,
        })

        return response.data
    } catch (error) {
        const message = getErrorMessage(error, 'Code invalide ou expiré')

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function confirmResetPassword({ email, newPassword, newPasswordConfirmation }) {
    try {
        const response = await api.post('/api/admin/reset-password/confirm', {
            email,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
        })

        return response.data
    } catch (error) {
        const message = getErrorMessage(error, 'Erreur lors de la réinitialisation du mot de passe')

        throw new Error(message, {
            cause: error,
        })
    }
}
