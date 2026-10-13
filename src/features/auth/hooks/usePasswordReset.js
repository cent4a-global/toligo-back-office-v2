import { useMutation } from '@tanstack/react-query'

import {
    confirmResetPassword,
    forgotPassword,
    resendResetOtp,
    verifyResetOtp,
} from '../api/auth.api'

import { removeResetEmail, saveResetEmail } from '../storage/auth.storage'

export function useForgotPassword() {
    const mutation = useMutation({
        meta: { successMessage: 'Code de réinitialisation envoyé.' },
        mutationFn: forgotPassword,

        onSuccess: (response, email) => {
            if (response.success) {
                saveResetEmail(response.data?.email ?? email)
            }
        },
    })

    return {
        forgotPassword: mutation.mutateAsync,
        isSending: mutation.isPending,
        forgotError: mutation.error,
        forgotData: mutation.data,
    }
}

export function useResendResetOtp() {
    const mutation = useMutation({
        meta: { successMessage: 'Un nouveau code vous a été envoyé.' },
        mutationFn: resendResetOtp,
    })

    return {
        resendResetOtp: mutation.mutateAsync,
        isResending: mutation.isPending,
        resendError: mutation.error,
    }
}

export function useVerifyResetOtp() {
    const mutation = useMutation({
        meta: { successMessage: 'Code vérifié.' },
        mutationFn: verifyResetOtp,
    })

    return {
        verifyResetOtp: mutation.mutateAsync,
        isVerifying: mutation.isPending,
        verifyError: mutation.error,
        verifyData: mutation.data,
    }
}

export function useConfirmResetPassword() {
    const mutation = useMutation({
        meta: { successMessage: 'Mot de passe réinitialisé.' },
        mutationFn: confirmResetPassword,

        onSuccess: response => {
            if (response.success) {
                removeResetEmail()

            }
        },
    })

    return {
        confirmResetPassword: mutation.mutateAsync,
        isResetting: mutation.isPending,
        resetError: mutation.error,
        resetData: mutation.data,
    }
}
