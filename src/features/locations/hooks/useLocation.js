import { useQuery } from '@tanstack/react-query'
import { locationService } from '../services/location.service'

export const locationKeys = {
    all: ['locations'], lists: () => ['locations', 'list'], global: () => ['locations', 'list', 'global'],
    byEntrepot: id => ['locations', 'list', 'entrepot', id], byClient: id => ['locations', 'list', 'client', id], byCaisse: id => ['locations', 'list', 'caisse', id],
    statistiques: params => ['locations', 'statistiques', params], solde: () => ['locations', 'solde'],
}
function useLocationsQuery(queryKey, fetcher, enabled = true) {
    const query = useQuery({ queryKey, queryFn: ({ signal }) => fetcher({ signal }), enabled, staleTime: 120000, gcTime: 300000, retry: 2,
        select: response => {
            const rows = response?.data ?? response
            if (!Array.isArray(rows) || rows.some(row => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('Format de locations inattendu.')
            return rows
        },
    })
    return { locations: query.data ?? [], isLoading: query.isPending, isFetching: query.isFetching, error: query.error, refetch: query.refetch }
}
export const useAllLocations = () => useLocationsQuery(locationKeys.global(), locationService.getAllLocations)
export const useClientLocations = id => useLocationsQuery(locationKeys.byClient(id), config => locationService.getLocationsByClient(id, config), Boolean(id))
export const useEntrepotLocations = id => useLocationsQuery(locationKeys.byEntrepot(id), config => locationService.getLocationsByEntrepot(id, config), Boolean(id))
export const useCaisseLocations = id => useLocationsQuery(locationKeys.byCaisse(id), config => locationService.getLocationsByCaisse(id, config), Boolean(id))
export function useLocationStatistiques({ date_debut, date_fin }) {
    const params = { date_debut, date_fin }
    const query = useQuery({ queryKey: locationKeys.statistiques(params), queryFn: ({ signal }) => locationService.getLocationStatistiques(params, { signal }), enabled: Boolean(date_debut && date_fin), staleTime: 120000, gcTime: 300000, retry: 1, select: response => response?.data ?? null })
    return { stats: query.data, isLoading: query.isLoading, isFetching: query.isFetching, isError: query.isError, error: query.error, refetch: query.refetch }
}
export function useSoldeGeniusPay() {
    const query = useQuery({ queryKey: locationKeys.solde(), queryFn: ({ signal }) => locationService.getSoldeGeniusPay({ signal }), staleTime: 300000, gcTime: 600000, retry: 2, select: response => response?.data ?? null })
    return { solde: query.data, isLoading: query.isPending, error: query.error, refetch: query.refetch, isFetching: query.isFetching }
}
