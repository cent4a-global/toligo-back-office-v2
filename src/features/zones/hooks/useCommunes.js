import { useQuery } from '@tanstack/react-query'
import { getCommunes } from '../api/communes.api'

export function useCommunes() {
    return useQuery({
        queryKey: ['communes', 'list'],
        queryFn: ({ signal }) => getCommunes({ signal }),
        staleTime: 5 * 60 * 1000,
    })
}
