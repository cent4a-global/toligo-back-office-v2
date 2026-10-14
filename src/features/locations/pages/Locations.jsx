import PageHeader from '../../../components/ui/PageHeader'
import LocationsContent from '../components/LocationsContent'
import { useAllLocations } from '../hooks/useLocation'

function Locations() {
    const query = useAllLocations()
    return <section className="page-scaffold">
        <PageHeader title="Locations" description="Consultez l’historique des locations et leurs paiements." />
        <LocationsContent query={query} />
    </section>
}

export default Locations
