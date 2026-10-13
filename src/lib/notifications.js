import toast from 'react-hot-toast'

const reportedErrors = new WeakSet()

export function notifyError(error) {
    if (!error) return
    if (typeof error === 'object') {
        if (reportedErrors.has(error)) return
        reportedErrors.add(error)
    }
    toast.error(typeof error === 'string' ? error : error.message || 'Une erreur est survenue.')
}
