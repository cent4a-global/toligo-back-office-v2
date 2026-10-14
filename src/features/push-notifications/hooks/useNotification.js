import { useMutation } from '@tanstack/react-query'
import { notificationService } from '../services/notification.service'

export function useSendPushNotification() {
    const mutation = useMutation({ mutationFn: notificationService.sendPushNotification })
    return {
        sendNotification: mutation.mutate,
        sendNotificationAsync: mutation.mutateAsync,
        isSending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
    }
}
