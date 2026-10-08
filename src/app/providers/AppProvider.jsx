import QueryProvider from './QueryProvider'

function AppProvider({ children }) {
    return <QueryProvider>{children}</QueryProvider>
}

export default AppProvider
