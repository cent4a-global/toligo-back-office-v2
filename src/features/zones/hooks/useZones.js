import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createZone, deleteZone, getZoneById, getZones, updateZone } from '../api/zones.api'

import { zoneKeys } from '../queries/zoneKeys'

export function useZones() {
    return useQuery({
        queryKey: zoneKeys.lists(),
        queryFn: getZones,
    })
}

export function useZone(id) {
    return useQuery({
        queryKey: zoneKeys.detail(id),
        queryFn: () => getZoneById(id),
        enabled: Boolean(id),
    })
}

export function useCreateZone() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createZone,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: zoneKeys.lists(),
            })
        },
    })
}

export function useUpdateZone() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateZone(id, data),

        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: zoneKeys.lists(),
            })

            queryClient.invalidateQueries({
                queryKey: zoneKeys.detail(variables.id),
            })
        },
    })
}

export function useDeleteZone() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteZone,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: zoneKeys.lists(),
            })
        },
    })
}
