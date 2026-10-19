import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createHub, deleteHub, getHubById, getHubs, updateHub } from '../api/hubs.api'

import { hubKeys } from '../queries/hubKeys'
import { stationKeys } from '../../stations/queries/stationKeys'

export function useHubs() {
    return useQuery({
        queryKey: hubKeys.lists(),
        queryFn: getHubs,
    })
}

export function useHub(id) {
    return useQuery({
        queryKey: hubKeys.detail(id),

        queryFn: () => getHubById(id),

        enabled: Boolean(id),
    })
}

export function useCreateHub() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { successMessage: 'Hub créé.' },
        mutationFn: createHub,

        onSuccess: () => {
            void Promise.all([
            queryClient.invalidateQueries({ queryKey: hubKeys.lists() }),
            queryClient.invalidateQueries({ queryKey: stationKeys.all }),
        ])
        },
    })
}

export function useUpdateHub() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { successMessage: 'Hub modifié.' },
        mutationFn: ({ id, data }) => updateHub(id, data),

        onSuccess: (_response, variables) => {
            void Promise.all([
            queryClient.invalidateQueries({
                queryKey: hubKeys.lists(),
            }),

            queryClient.invalidateQueries({
                queryKey: hubKeys.detail(variables.id),
            }),
            queryClient.invalidateQueries({ queryKey: stationKeys.all }),
        ])
        },
    })
}

export function useDeleteHub() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { successMessage: 'Hub supprimé.' },
        mutationFn: deleteHub,

        onSuccess: () => {
            void Promise.all([
            queryClient.invalidateQueries({ queryKey: hubKeys.all }),
            queryClient.invalidateQueries({ queryKey: stationKeys.all }),
        ])
        },
    })
}
