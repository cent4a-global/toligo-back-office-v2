import Icon from '../components/ui/Icon'
import RouteError from '../components/ui/RouteError'

function NotFound() {
    return (
        <RouteError
            code="404"
            title="Cette page est introuvable."
            description="La page que vous cherchez a peut-être été déplacée ou n’existe plus."
            icon={<Icon name="search" size={36} />}
            standalone
        />
    )
}

export default NotFound
