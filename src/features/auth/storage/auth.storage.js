const TOKEN_KEY = 'admin_token'
const ADMIN_KEY = 'admin_data'
const TEMP_EMAIL_KEY = 'temp_admin_email'
const RESET_EMAIL_KEY = 'reset_email'

export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
}

export function saveAdmin(admin) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}

export function getAdmin() {
    try {
        const admin = localStorage.getItem(ADMIN_KEY)

        return admin ? JSON.parse(admin) : null
    } catch {
        return null
    }
}

export function removeAdmin() {
    localStorage.removeItem(ADMIN_KEY)
}

export function saveTempEmail(email) {
    localStorage.setItem(TEMP_EMAIL_KEY, email)
}

export function getTempEmail() {
    return localStorage.getItem(TEMP_EMAIL_KEY)
}

export function removeTempEmail() {
    localStorage.removeItem(TEMP_EMAIL_KEY)
}

export function saveResetEmail(email) {
    localStorage.setItem(RESET_EMAIL_KEY, email)
}

export function getResetEmail() {
    return localStorage.getItem(RESET_EMAIL_KEY)
}

export function removeResetEmail() {
    localStorage.removeItem(RESET_EMAIL_KEY)
}

export function clearAuthStorage() {
    removeToken()
    removeAdmin()
    removeTempEmail()
    removeResetEmail()
}
