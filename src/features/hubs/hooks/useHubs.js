import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createHub, deleteHub, getHubById, getHubs, updateHub } from '../api/hubs.api'

import { hubKeys } from '../queries/hubKeys'

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
        mutationFn: createHub,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: hubKeys.lists(),
            })
        },
    })
}

export function useUpdateHub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateHub(id, data),

        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: hubKeys.lists(),
            })

            queryClient.invalidateQueries({
                queryKey: hubKeys.detail(variables.id),
            })
        },
    })
}

export function useDeleteHub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteHub,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: hubKeys.lists(),
            })
        },
    })
}
