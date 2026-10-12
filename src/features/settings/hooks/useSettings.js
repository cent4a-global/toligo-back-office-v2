import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getSettings, saveSettings } from '../api/settings.api'

export const settingKeys = {
    all: ['settings'],
    lists: () => [...settingKeys.all, 'list'],
}

export function useSettings() {
    return useQuery({
        queryKey: settingKeys.lists(),
        queryFn: getSettings,
    })
}

export function useSaveSettings() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: saveSettings,

        onSettled: () => {
            return queryClient.invalidateQueries({
                queryKey: settingKeys.lists(),
            })
        },
    })
}
