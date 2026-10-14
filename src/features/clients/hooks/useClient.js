import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService } from '../services/client.service'
import { normalizeUsersResponse } from '../../users/api/normalizeUsers'

export const clientKeys = {
    all: ['clients'],
    lists: () => ['clients', 'list'],
    list: filters => ['clients', 'list', { filters }],
    details: () => ['clients', 'detail'],
    detail: id => ['clients', 'detail', id],
}

export function useClientById(id) {
    return useQuery({
        queryKey: clientKeys.detail(id),
        queryFn: ({ signal }) => clientService.getClientById(id, { signal }),
        enabled: id != null && id !== '',
        staleTime: 5 * 60 * 1000,
        select: response => {
            const client = response.data ?? response
            return normalizeUsersResponse({ data: [client] }, 'clients').items[0]
        },
    })
}

export function useClients(filters = {}) {
    const queryClient = useQueryClient()
    const options = { page: filters.page ?? 1, perPage: filters.perPage ?? 12, all: Boolean(filters.all) }
    const query = useQuery({
        queryKey: clientKeys.list(options),
        queryFn: async ({ signal }) => {
            if (!options.all) return clientService.getClients({ ...options, signal })
            const items = []
            let page = 1
            let totalPages
            do {
                const response = await clientService.getClients({ page, perPage: 100, signal })
                const payload = response?.data ?? response
                const meta = payload?.meta ?? response?.meta ?? payload
                const paginated = meta?.current_page != null || meta?.last_page != null
                if (!paginated) {
                    return { data: normalizeUsersResponse(response, 'clients', { perPage: Number.MAX_SAFE_INTEGER }).items }
                }
                const result = normalizeUsersResponse(response, 'clients', { page, perPage: 100 })
                items.push(...result.items)
                totalPages = result.totalPages
                page += 1
            } while (page <= totalPages)
            return { data: items }
        },
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: response => normalizeUsersResponse(response, 'clients', options.all ? { perPage: Number.MAX_SAFE_INTEGER } : options),
    })
    const invalidate = () => queryClient.invalidateQueries({ queryKey: clientKeys.all })
    const block = useMutation({ mutationFn: ({ id, motif }) => clientService.blockClient(id, motif), onSuccess: invalidate })
    const unblock = useMutation({ mutationFn: clientService.unblockClient, onSuccess: invalidate })
    return {
        clients: query.data?.items ?? [], pagination: query.data,
        isLoading: query.isPending, isFetching: query.isFetching, error: query.error, refetch: query.refetch,
        blockClient: block.mutate, blockClientAsync: block.mutateAsync, isBlocking: block.isPending, blockError: block.error,
        unblockClient: unblock.mutate, unblockClientAsync: unblock.mutateAsync, isUnblocking: unblock.isPending, unblockError: unblock.error,
    }
}
