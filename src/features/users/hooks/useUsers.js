import { useQuery } from '@tanstack/react-query'

import { getInternalUsers } from '../api/internalUsers.api'

import { getDrivers } from '../api/drivers.api'

import { getClients } from '../api/clients.api'

import { getCompanies } from '../api/companies.api'
import { DRIVERS_ENDPOINT } from '../api/drivers.api'
import { COMPANIES_ENDPOINT } from '../api/companies.api'
import { normalizeUsersResponse } from '../api/normalizeUsers'
import { useAuth } from '../../auth/hooks/useAuth'

function useUsersQuery(key, queryFn, resource, options = {}, configured = true) {
    const { isAuthenticated, role } = useAuth()
    const page = options.page ?? 1
    const perPage = options.perPage ?? 10
    return useQuery({
        queryKey: [key, { page, perPage }],
        queryFn: ({ signal }) => queryFn({ signal, page, perPage }),
        select: response => normalizeUsersResponse(response, resource, { page, perPage }),
        enabled: configured && isAuthenticated && role === 'superadmin' && (options.enabled ?? true),
    })
}

export function useInternalUsers(options) {
    return useUsersQuery('internal-users', getInternalUsers, 'admins', options)
}

export function useDrivers(options) {
    return useUsersQuery('drivers', getDrivers, 'drivers', options, Boolean(DRIVERS_ENDPOINT))
}

export function useClients(options) {
    return useUsersQuery('clients', getClients, 'clients', options)
}

export function useCompanies(options) {
    return useUsersQuery('companies', getCompanies, 'companies', options, Boolean(COMPANIES_ENDPOINT))
}
