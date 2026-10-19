import toast from 'react-hot-toast'
import { flushSync } from 'react-dom'

export function notifySuccess(message) {
    // Run after mutation callers have closed/reset their UI, then commit pending renders.
    setTimeout(() => {
        flushSync(() => {})
        toast.success(message)
    }, 0)
}

const reportedErrors = new WeakSet()

export function notifyError(error) {
    if (!error) return
    if (typeof error === 'object') {
        if (reportedErrors.has(error)) return
        reportedErrors.add(error)
    }
    toast.error(typeof error === 'string' ? error : error.message || 'Une erreur est survenue.')
}
