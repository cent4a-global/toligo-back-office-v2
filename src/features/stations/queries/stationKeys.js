export const stationKeys = {
    all: ['stations'],

    lists: () => [...stationKeys.all, 'list'],

    list: filters => [...stationKeys.lists(), { filters }],

    details: () => [...stationKeys.all, 'detail'],

    detail: id => [...stationKeys.details(), id],
}
