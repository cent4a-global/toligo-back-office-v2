export const zoneKeys = {
    all: ['zones'],

    lists: () => [...zoneKeys.all, 'list'],

    list: filters => [...zoneKeys.lists(), { filters }],

    details: () => [...zoneKeys.all, 'detail'],

    detail: id => [...zoneKeys.details(), id],
}
