import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    createWarehouse,
    deleteWarehouse,
    getWarehouseById,
    getWarehouses,
    updateWarehouse,
} from '../api/warehouses.api'

import { warehouseKeys } from '../queries/warehouseKeys'

export function useWarehouses() {
    return useQuery({
        queryKey: warehouseKeys.lists(),
        queryFn: getWarehouses,
    })
}

export function useWarehouse(id) {
    return useQuery({
        queryKey: warehouseKeys.detail(id),
        queryFn: () => getWarehouseById(id),
        enabled: Boolean(id),
    })
}

export function useCreateWarehouse() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createWarehouse,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: warehouseKeys.lists(),
            })
        },
    })
}

export function useUpdateWarehouse() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateWarehouse(id, data),

        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: warehouseKeys.lists(),
            })

            queryClient.invalidateQueries({
                queryKey: warehouseKeys.detail(variables.id),
            })
        },
    })
}

export function useDeleteWarehouse() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteWarehouse,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: warehouseKeys.lists(),
            })
        },
    })
}
