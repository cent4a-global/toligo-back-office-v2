import api from '../../../lib/axios/api'

export const notificationService = {
    async sendPushNotification({ title, body, target, client_ids }) {
        const payload = { title, body, target }
        if (target === 'specific' && Array.isArray(client_ids)) payload.client_ids = client_ids
        try {
            return (await api.post('/api/superadmin/notifications/push', payload)).data
        } catch (error) {
            throw new Error(
                error.response?.data?.message || 'Erreur lors de l’envoi de la notification',
                { cause: error },
            )
        }
    },
}
