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
