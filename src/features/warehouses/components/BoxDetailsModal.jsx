import Modal from '../../../components/ui/Modal'
import Skeleton from '../../../components/ui/Skeleton'
import ErrorState from '../../../components/ui/ErrorState'
import Button from '../../../components/ui/Button'
import { useBox } from '../hooks/useBoxes'

function DetailsSection({ title, items }) {
    return (
        <section className="box-details-section">
            <h3>{title}</h3>
            <dl className="box-details-grid">
                {items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value ?? 'Non renseigné'}</dd></div>)}
            </dl>
        </section>
    )
}

export default function BoxDetailsModal({ boxId, onClose }) {
    const query = useBox(boxId)
    const box = query.data?.data
    const warehouse = box?.entrepot
    return (
        <Modal open title={box?.numero ? `Caisse ${box.numero}` : 'Informations de la caisse'} subtitle="Caractéristiques et entrepôt associé." size="lg" onClose={onClose} closeOnOverlayClick={false}>
            {query.isLoading ? (
                <div className="box-details" role="status" aria-label="Chargement de la caisse">
                    {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} height={64} />)}
                </div>
            ) : query.isError ? (
                <ErrorState title="Impossible de charger la caisse" description={query.error.message} action={<Button onClick={() => query.refetch()}>Réessayer</Button>} />
            ) : !box ? <ErrorState title="Caisse introuvable" description="Aucune information disponible pour cette caisse." /> : (
                <div className="box-details">
                    {box.image && <img className="box-details-image" src={box.image} alt={`Caisse ${box.numero ?? ''}`} />}
                    <DetailsSection title="Informations générales" items={[
                        ['Numéro', box.numero], ['Statut', box.statut], ['Poids', box.poids],
                        ['Prix par heure', box.prix_par_heure], ['Description', box.description],
                    ]} />
                    <DetailsSection title="Dimensions" items={[
                        ['Longueur', box.dimensions?.longueur], ['Largeur', box.dimensions?.largeur],
                        ['Hauteur', box.dimensions?.hauteur], ['Volume', box.dimensions?.Volume ?? box.dimensions?.volume],
                    ]} />
                    <DetailsSection title="Entrepôt associé" items={[
                        ['Nom', warehouse?.nom], ['Localité', warehouse?.localite], ['Commune', warehouse?.commune],
                        ['Ville', warehouse?.ville], ['Latitude', warehouse?.latitude], ['Longitude', warehouse?.longitude],
                    ]} />
                    {box.smart_lock && <DetailsSection title="Serrure connectée" items={[
                        ['Nom', box.smart_lock.lockname], ['Identifiant serrure', box.smart_lock.lock_id],
                        ['Synchronisée', box.smart_lock.synchronisee == null ? null : box.smart_lock.synchronisee ? 'Oui' : 'Non'],
                    ]} />}
                </div>
            )}
        </Modal>
    )
}
