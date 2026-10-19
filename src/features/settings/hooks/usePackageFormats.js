import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPackageFormat, getPackageFormats, updatePackageFormat } from '../api/packageFormats.api'

const formatKeys = ['package-formats']

export function usePackageFormats() {
    return useQuery({ queryKey: formatKeys, queryFn: getPackageFormats })
}

export function useSavePackageFormat() {
    const client = useQueryClient()
    return useMutation({
        meta: { successMessage: 'Format de colis enregistré.' },
        mutationFn: ({ id, payload }) => id ? updatePackageFormat(id, payload) : createPackageFormat(payload),
        onSuccess: () => { void client.invalidateQueries({ queryKey: formatKeys }) },
    })
}
