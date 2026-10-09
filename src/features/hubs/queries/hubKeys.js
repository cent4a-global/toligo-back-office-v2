export const hubKeys = {
    all: ['hubs'],

    lists: () => [...hubKeys.all, 'list'],

    list: filters => [...hubKeys.lists(), { filters }],

    details: () => [...hubKeys.all, 'detail'],

    detail: id => [...hubKeys.details(), id],
}
