import toast from 'react-hot-toast'
import { notifyError } from '../../lib/notifications'
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onError: notifyError,
        onSuccess: (data, _variables, _context, mutation) => {
            toast.success(mutation.meta?.successMessage || data?.message || 'Opération effectuée avec succès.')
        },
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

function QueryProvider({ children }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider
