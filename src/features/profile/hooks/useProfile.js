import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { changePassword, getProfile, updateProfile } from '../api/profile.api'
import { getToken, saveAdmin } from '../../auth/storage/auth.storage'

export function useUpdateProfile() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: updateProfile,
        meta: { successMessage: 'Profil mis à jour.' },
        onSuccess: response => {
            if (response?.data) {
                const admin = { ...response.data }
                delete admin.token
                saveAdmin(admin)
                client.setQueryData(['adminProfile'], admin)
            }
            return client.invalidateQueries({ queryKey: ['adminProfile'] })
        },
    })
}

export function useChangePassword() {
    return useMutation({ mutationFn: changePassword, meta: { successMessage: 'Mot de passe mis à jour.' } })
}

export function useProfile() {
    return useQuery({
        queryKey: ['adminProfile'],
        queryFn: ({ signal }) => getProfile(signal),
        enabled: Boolean(getToken()),
    })
}
