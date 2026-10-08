import Icon from '../components/ui/Icon'
import RouteError from '../components/ui/RouteError'

function Unauthorized() {
    return (
        <RouteError
            code="403"
            title="Cet espace est réservé."
            description="Votre rôle ne vous permet pas de consulter cette page. Vous pouvez continuer à utiliser les espaces auxquels vous avez accès."
            icon={<Icon name="shield-exclamation" size={36} />}
        />
    )
}

export default Unauthorized
