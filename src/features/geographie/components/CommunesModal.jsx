import Modal from '../../../components/ui/Modal'
import Skeleton from '../../../components/ui/Skeleton'
import ErrorState from '../../../components/ui/ErrorState'
import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import { useCommunes } from '../hooks/useGeo'
import { nameOf, idOf } from '../utils/geographie'

function CommunesModal({ ville, onClose }) {
    const query = useCommunes(idOf(ville))
    return (
        <Modal open title={`Communes de ${nameOf(query.villeData ?? ville)}`} onClose={onClose}>
            {query.isLoading ? (
                <div className="geo-loading">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Skeleton height={40} key={i} />
                    ))}
                </div>
            ) : query.error ? (
                <ErrorState
                    description={query.error.message}
                    action={
                        <Button onClick={() => query.refetch()} loading={query.isFetching}>
                            Réessayer
                        </Button>
                    }
                />
            ) : !query.communes.length ? (
                <EmptyState title="Aucune commune" />
            ) : (
                <>
                    <p className="geo-count">{query.communes.length} commune(s)</p>
                    <ul className="geo-communes">
                        {query.communes.map((commune, index) => (
                            <li key={idOf(commune) ?? index}>{nameOf(commune)}</li>
                        ))}
                    </ul>
                </>
            )}
        </Modal>
    )
}

export default CommunesModal
