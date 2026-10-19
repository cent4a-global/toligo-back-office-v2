import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categorieService } from '../services/categorie.service'

export const categorieKeys = {
    all: ['categories'],
    lists: () => ['categories', 'list'],
    list: filters => ['categories', 'list', { filters }],
    details: () => ['categories', 'detail'],
    detail: id => ['categories', 'detail', id],
}

export function useCategorieById(id) {
    return useQuery({
        queryKey: categorieKeys.detail(id),
        queryFn: ({ signal }) => categorieService.getCategorieById(id, { signal }),
        enabled: id != null && id !== '',
        staleTime: 5 * 60 * 1000,
        select: response => response?.data ?? response,
    })
}

export function useCategories(filters = {}) {
    const queryClient = useQueryClient()
    const categoriesQuery = useQuery({
        queryKey: categorieKeys.list(filters),
        queryFn: ({ signal }) => categorieService.getCategories({ signal }),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: response => {
            const rows = response?.data ?? response
            if (!Array.isArray(rows) || rows.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Le serveur a renvoyé un format de catégories inattendu.')
            return rows
        },
    })
    const invalidate = () => { void queryClient.invalidateQueries({ queryKey: categorieKeys.all }) }
    const createMutation = useMutation({ mutationFn: categorieService.createCategorie, onSuccess: invalidate })
    const updateMutation = useMutation({ mutationFn: ({ id, data }) => categorieService.updateCategorie(id, data), onSuccess: invalidate })
    const deleteMutation = useMutation({
        mutationFn: categorieService.deleteCategorie,
        onSuccess: (_data, id) => {
            queryClient.removeQueries({ queryKey: categorieKeys.detail(id), exact: true })
            invalidate()
        },
    })
    const deleteManyMutation = useMutation({
        mutationFn: async ids => {
            const results = await Promise.allSettled(ids.map(id => categorieService.deleteCategorie(id)))
            const failedIds = ids.filter((_id, index) => results[index].status === 'rejected')
            ids.filter((_id, index) => results[index].status === 'fulfilled').forEach(id => queryClient.removeQueries({ queryKey: categorieKeys.detail(id), exact: true }))
            if (failedIds.length) {
                const error = new Error(`${ids.length - failedIds.length} suppression(s) réussie(s), ${failedIds.length} en échec.`)
                error.failedIds = failedIds
                throw error
            }
            return { message: `${ids.length} catégorie(s) supprimée(s).` }
        },
        onSettled: invalidate,
    })
    return {
        categories: categoriesQuery.data ?? [],
        isLoading: categoriesQuery.isPending,
        isFetching: categoriesQuery.isFetching,
        error: categoriesQuery.error,
        refetch: categoriesQuery.refetch,
        createCategorie: createMutation.mutate,
        createCategorieAsync: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,
        updateCategorie: updateMutation.mutate,
        updateCategorieAsync: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,
        deleteCategorie: deleteMutation.mutate,
        deleteCategorieAsync: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error,
        deleteManyAsync: deleteManyMutation.mutateAsync,
        isDeletingMany: deleteManyMutation.isPending,
    }
}
