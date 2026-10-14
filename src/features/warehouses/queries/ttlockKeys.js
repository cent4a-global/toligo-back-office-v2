export const ttlockKeys = {
    all: ['ttlock'],
    details: () => [...ttlockKeys.all, 'detail'],
    detail: entrepotId => [...ttlockKeys.details(), entrepotId],
}
