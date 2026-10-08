import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, verifyCode, resendCode } from '../api/auth.api'

import {
    clearAuthStorage,
    getAdmin,
    getTempEmail,
    getToken,
    removeTempEmail,
    saveAdmin,
    saveTempEmail,
    saveToken,
} from '../storage/auth.storage'

export function useLogin() {
    const mutation = useMutation({
        mutationFn: login,

        onSuccess: (response, credentials) => {
            if (response.success) {
                saveTempEmail(response.data?.email || credentials.email)
            }
        },
    })

    return {
        login: mutation.mutateAsync,
        isLoggingIn: mutation.isPending,
        loginError: mutation.error,
        loginData: mutation.data,
    }
}

export function useVerifyCode() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async credentials => {
            const response = await verifyCode(credentials)
            if (response.success && !response.data?.token) {
                throw new Error('Le serveur n’a pas fourni de jeton de connexion.')
            }
            return response
        },

        onSuccess: response => {
            if (!response.success || !response.data?.token) {
                return
            }

            const { token, ...admin } = response.data

            if (token) {
                saveToken(token)
            }

            saveAdmin(admin)

            queryClient.setQueryData(['adminProfile'], admin)

            removeTempEmail()
        },
    })

    return {
        verifyCode: mutation.mutateAsync,
        isVerifying: mutation.isPending,
        verifyError: mutation.error,
        verifyData: mutation.data,
    }
}

export function useResendCode() {
    const mutation = useMutation({
        mutationFn: resendCode,
    })

    return {
        resendCode: mutation.mutateAsync,
        isResending: mutation.isPending,
        resendError: mutation.error,
    }
}

export function useLogout() {
    const queryClient = useQueryClient()

    function logout() {
        clearAuthStorage()
        queryClient.clear()
    }

    return {
        logout,
    }
}

export function useAuth() {
    const token = getToken()
    const admin = getAdmin()

    const isAuthenticated = Boolean(token && admin)

    return {
        token,
        admin,
        role: admin?.role ?? null,
        tempEmail: getTempEmail(),
        isAuthenticated,
        hasToken: Boolean(token),
        isLoading: false,
        isInitializing: false,
    }
}
