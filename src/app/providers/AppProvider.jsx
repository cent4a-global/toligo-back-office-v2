import AppToaster from '../../components/ui/AppToaster'
import QueryProvider from './QueryProvider'

function AppProvider({ children }) {
    return (
        <QueryProvider>
            {children}
            <AppToaster />
        </QueryProvider>
    )
}

export default AppProvider
