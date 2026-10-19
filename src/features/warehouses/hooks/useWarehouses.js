import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    assignWarehouseAdmins,
    createWarehouse,
    deleteWarehouse,
    getWarehouseById,
    getWarehouses,
    updateWarehouse,
} from '../api/warehouses.api'

import { warehouseKeys } from '../queries/warehouseKeys'

export function useAssignWarehouseAdmins() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, adminIds }) => assignWarehouseAdmins(id, adminIds),
        meta: { successMessage: 'Administrateurs enregistrés.' },
        onSuccess: (_response, { id }) => {
            void Promise.all([
            queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(id) }),
            queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() }),
            queryClient.invalidateQueries({ queryKey: ['internal-users'] }),
        ])
        },
    })
}

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
        meta: { successMessage: 'Entrepôt créé.' },
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
        meta: { successMessage: 'Entrepôt modifié.' },
        mutationFn: ({ id, data }) => updateWarehouse(id, data),

        onSuccess: (response, variables) => {
            const updated = response?.data
            const canonicalId = updated?.id ?? variables.id
            if (updated) {
                const updateDetail = previous => ({
                    ...previous,
                    ...response,
                    data: { ...previous?.data, ...updated },
                })
                queryClient.setQueryData(warehouseKeys.detail(variables.id), updateDetail)
                if (canonicalId !== variables.id) {
                    queryClient.setQueryData(warehouseKeys.detail(canonicalId), updateDetail)
                }
                queryClient.setQueriesData({ queryKey: warehouseKeys.lists() }, previous => {
                    if (!Array.isArray(previous?.data)) return previous
                    return {
                        ...previous,
                        data: previous.data.map(warehouse =>
                            [warehouse.id, warehouse.uuid].some(value =>
                                value != null && [variables.id, canonicalId].includes(value),
                            ) ? { ...warehouse, ...updated } : warehouse,
                        ),
                    }
                })
            }
            queryClient.invalidateQueries({
                queryKey: warehouseKeys.lists(),
            })

            queryClient.invalidateQueries({
                queryKey: warehouseKeys.detail(variables.id),
            })
            if (canonicalId !== variables.id) {
                queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(canonicalId) })
            }
        },
    })
}

export function useDeleteWarehouse() {
    const queryClient = useQueryClient()

    return useMutation({
        meta: { successMessage: 'Entrepôt supprimé.' },
        mutationFn: deleteWarehouse,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: warehouseKeys.lists(),
            })
        },
    })
}
