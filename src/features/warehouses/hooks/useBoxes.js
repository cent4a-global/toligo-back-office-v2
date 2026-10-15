import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBox, deleteBox, getBoxById, getBoxes, updateBox } from '../api/boxes.api'
import { warehouseKeys } from '../queries/warehouseKeys'

export function useBoxes(warehouseId) {
    return useQuery({
        queryKey: ['boxes', 'list'],
        queryFn: ({ signal }) => getBoxes(signal),
        select: boxes => warehouseId ? boxes.filter(box => box.entrepot?.id === warehouseId) : boxes,
    })
}

export function useDeleteBox() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: ({ id }) => deleteBox(id),
        meta: { successMessage: 'Caisse supprimée avec succès.' },
        onSuccess: (_response, { id, warehouseId }) => {
            client.removeQueries({ queryKey: ['boxes', 'detail', id], exact: true })
            return Promise.all([
                client.invalidateQueries({ queryKey: ['boxes', 'list'] }),
                client.invalidateQueries({ queryKey: warehouseKeys.detail(warehouseId) }),
                client.invalidateQueries({ queryKey: warehouseKeys.lists() }),
            ])
        },
    })
}

export function useUpdateBox() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }) => updateBox(id, payload),
        meta: { successMessage: 'Caisse mise à jour.' },
        onSuccess: (_response, { id, payload }) => Promise.all([
            client.invalidateQueries({ queryKey: ['boxes', 'list'] }),
            client.invalidateQueries({ queryKey: ['boxes', 'detail', id] }),
            client.invalidateQueries({ queryKey: warehouseKeys.detail(payload.entrepot_id) }),
            client.invalidateQueries({ queryKey: warehouseKeys.lists() }),
        ]),
    })
}

export function useBox(id) {
    return useQuery({
        queryKey: ['boxes', 'detail', id],
        queryFn: ({ signal }) => getBoxById(id, signal),
        enabled: Boolean(id),
    })
}

export function useCreateBox() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: createBox,
        meta: { successMessage: 'Caisse créée.' },
        onSuccess: (_data, payload) => Promise.all([
            client.invalidateQueries({ queryKey: ['boxes', 'list'] }),
            client.invalidateQueries({ queryKey: warehouseKeys.detail(payload.entrepot_id) }),
            client.invalidateQueries({ queryKey: warehouseKeys.lists() }),
        ]),
    })
}
