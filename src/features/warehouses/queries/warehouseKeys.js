export const warehouseKeys = {
    all: ['warehouses'],

    lists: () => [...warehouseKeys.all, 'list'],

    list: filters => [...warehouseKeys.lists(), { filters }],

    details: () => [...warehouseKeys.all, 'detail'],

    detail: id => [...warehouseKeys.details(), id],
}
