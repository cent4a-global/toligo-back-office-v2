import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import LocationsContent from '../components/LocationsContent'
import { useClientLocations } from '../hooks/useLocation'

function ClientLocations() {
    const { clientId } = useParams()
    const navigate = useNavigate()
    const query = useClientLocations(clientId)
    return <section className="page-scaffold">
        <PageHeader title="Locations du client" actions={<Button variant="secondary" onClick={() => navigate('/clients')}>Retour aux clients</Button>} />
        <LocationsContent key={clientId} query={query} />
    </section>
}

export default ClientLocations