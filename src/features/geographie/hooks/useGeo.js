import { useQuery } from '@tanstack/react-query'
import { geoService } from '../services/geo.service'

export const geoKeys = { all: ['geo'], villes: () => ['geo', 'villes'], communes: id => ['geo', 'communes', id] }
const options = { staleTime: 300000, gcTime: 600000, retry: 1 }
export function useVilles() {
    const query = useQuery({ ...options, queryKey: geoKeys.villes(), queryFn: ({ signal }) => geoService.getVilles({ signal }), select: response => {
        const rows = response?.data ?? response
        if (!Array.isArray(rows)) throw new Error('Format de villes inattendu.')
        return rows
    } })
    return { villes: query.data ?? [], isLoading: query.isPending, isError: query.isError, error: query.error, refetch: query.refetch, isFetching: query.isFetching }
}
export function useCommunes(id) {
    const query = useQuery({ ...options, queryKey: geoKeys.communes(id), queryFn: ({ signal }) => geoService.getCommunesByVille(id, { signal }), enabled: id != null && id !== '', select: response => {
        const payload = response?.data ?? response
        if (!Array.isArray(payload?.communes)) throw new Error('Format de communes inattendu.')
        return payload
    } })
    return { villeData: query.data?.ville ?? null, communes: query.data?.communes ?? [], isLoading: query.isLoading, isError: query.isError, error: query.error, refetch: query.refetch, isFetching: query.isFetching }
}
