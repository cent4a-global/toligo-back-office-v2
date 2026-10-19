import { notifyError, notifySuccess } from '../../lib/notifications'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onError: notifyError,
    }),
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
            retry: 1,
        },

        mutations: {
            retry: 0,
        },
    },
})

queryClient.getMutationCache().subscribe(event => {
    if (event.type !== 'updated' || event.action.type !== 'success') return
    const { mutation } = event
    if (mutation.meta?.silentSuccess) return
    const message = mutation.meta?.successMessage || mutation.state.data?.message || 'Opération effectuée avec succès.'

    notifySuccess(message)
})

function QueryProvider({ children }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider
