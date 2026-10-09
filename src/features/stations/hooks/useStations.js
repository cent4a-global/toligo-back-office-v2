import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    createStation,
    deleteStation,
    getStationById,
    getStations,
    updateStation,
} from '../api/stations.api'

import { stationKeys } from '../queries/stationKeys'

export function useStations() {
    return useQuery({
        queryKey: stationKeys.lists(),
        queryFn: getStations,
    })
}

export function useStation(id) {
    return useQuery({
        queryKey: stationKeys.detail(id),

        queryFn: () => getStationById(id),

        enabled: Boolean(id),
    })
}

export function useCreateStation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createStation,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: stationKeys.lists(),
            })
        },
    })
}

export function useUpdateStation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateStation(id, data),

        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: stationKeys.lists(),
            })

            queryClient.invalidateQueries({
                queryKey: stationKeys.detail(variables.id),
            })
        },
    })
}

export function useDeleteStation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteStation,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: stationKeys.lists(),
            })
        },
    })
}
