import PageHeader from '../components/ui/PageHeader'
import LocationsContent from '../features/locations/components/LocationsContent'
import { useAllLocations } from '../features/locations/hooks/useLocation'

function Locations() {
    const query = useAllLocations()
    return <section className="page-scaffold">
        <PageHeader title="Locations" description="Consultez l’historique des locations et leurs paiements." />
        <LocationsContent query={query} />
    </section>
}

export default Locations
