import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addAdminService } from '../services/addAdmin.service'
import { normalizeUsersResponse } from '../../users/api/normalizeUsers'

export const adminsKeys = {
    all: ['admins'],
    lists: () => ['admins', 'list'],
    list: filters => ['admins', 'list', filters],
    details: () => ['admins', 'detail'],
    detail: id => ['admins', 'detail', id],
}

export function useAdminById(id) {
    return useQuery({
        queryKey: adminsKeys.detail(id),
        queryFn: ({ signal }) => addAdminService.getAdminById(id, { signal }),
        enabled: id != null && id !== '',
        staleTime: 5 * 60 * 1000,
        select: response => response.data ?? response,
    })
}

export function useAddAdmin(filters = {}) {
    const queryClient = useQueryClient()
    const adminsQuery = useQuery({
        queryKey: adminsKeys.list(filters),
        queryFn: async ({ signal }) => {
            if (!filters.all) return addAdminService.getAdmins({ ...filters, signal })
            const items = []
            let page = 1
            let totalPages
            do {
                const response = await addAdminService.getAdmins({ page, perPage: 100, signal })
                const result = normalizeUsersResponse(response, 'admins', { page, perPage: 100 })
                const payload = response?.data ?? response
                const meta = payload?.meta ?? response?.meta ?? payload
                const paginated = meta?.current_page != null || meta?.last_page != null
                if (!paginated) {
                    const rows = [payload, payload?.data, payload?.admins, payload?.users].find(Array.isArray)
                    return { data: rows }
                }
                items.push(...result.items)
                totalPages = result.totalPages
                page += 1
            } while (page <= totalPages)
            return { data: items }
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: response => normalizeUsersResponse(response, 'admins', filters.all ? { page: 1, perPage: Number.MAX_SAFE_INTEGER } : filters),
    })
    const invalidate = () => {
        void Promise.all([
            queryClient.invalidateQueries({ queryKey: adminsKeys.all }),
            queryClient.invalidateQueries({ queryKey: ['internal-users'] }),
        ])
    }
    const createAdminMutation = useMutation({ mutationFn: addAdminService.createAdmin, onSuccess: invalidate })
    const updateRoleMutation = useMutation({ mutationFn: ({ id, roleData }) => addAdminService.updateAdminRole(id, roleData), onSuccess: invalidate })
    const toggleBlockMutation = useMutation({
        mutationFn: ({ id, action }) => {
            if (action === 'block') return addAdminService.blockAdmin(id)
            if (action === 'unblock') return addAdminService.unblockAdmin(id)
            throw new Error('Action de blocage inconnue')
        },
        onSuccess: invalidate,
    })
    const resetPasswordMutation = useMutation({ mutationFn: addAdminService.resetPassword, onSuccess: invalidate })
    const deleteAdminMutation = useMutation({
        mutationFn: addAdminService.deleteAdmin,
        onSuccess: (_data, id) => {
            queryClient.removeQueries({ queryKey: adminsKeys.detail(id), exact: true })
            invalidate()
        },
    })
    const deleteManyMutation = useMutation({
        mutationFn: async ids => {
            const results = await Promise.allSettled(ids.map(id => addAdminService.deleteAdmin(id)))
            const failedIds = ids.filter((_id, index) => results[index].status === 'rejected')
            if (failedIds.length) {
                const error = new Error(`${ids.length - failedIds.length} suppression(s) réussie(s), ${failedIds.length} en échec. Vous pouvez réessayer pour les comptes restants.`)
                error.failedIds = failedIds
                throw error
            }
            return { message: `${ids.length} administrateur(s) supprimé(s).` }
        },
        onSettled: invalidate,
    })
    return {
        admins: adminsQuery.data?.items ?? [],
        pagination: adminsQuery.data,
        isLoading: adminsQuery.isPending,
        isFetching: adminsQuery.isFetching,
        error: adminsQuery.error,
        refetch: adminsQuery.refetch,
        createAdmin: createAdminMutation.mutate,
        createAdminAsync: createAdminMutation.mutateAsync,
        isCreating: createAdminMutation.isPending,
        createError: createAdminMutation.error,
        updateRole: updateRoleMutation.mutate,
        updateRoleAsync: updateRoleMutation.mutateAsync,
        isUpdatingRole: updateRoleMutation.isPending,
        toggleBlock: toggleBlockMutation.mutate,
        toggleBlockAsync: toggleBlockMutation.mutateAsync,
        isTogglingBlock: toggleBlockMutation.isPending,
        resetPassword: resetPasswordMutation.mutate,
        resetPasswordAsync: resetPasswordMutation.mutateAsync,
        isResettingPassword: resetPasswordMutation.isPending,
        deleteAdmin: deleteAdminMutation.mutate,
        deleteAdminAsync: deleteAdminMutation.mutateAsync,
        isDeleting: deleteAdminMutation.isPending,
        deleteError: deleteAdminMutation.error,
        deleteManyAsync: deleteManyMutation.mutateAsync,
        isDeletingMany: deleteManyMutation.isPending,
    }
}
