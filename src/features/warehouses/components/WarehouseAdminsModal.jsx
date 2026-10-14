import Modal from '../../../components/ui/Modal'
import WarehouseAdminsForm from './WarehouseAdminsForm'

export default function WarehouseAdminsModal(props) {
    return (
        <Modal open title="Affecter des administrateurs" subtitle="Les administrateurs déjà affectés sont cochés. Ajustez la sélection puis validez."
            closeOnOverlayClick={false} onClose={props.loading ? undefined : props.onClose}>
            <WarehouseAdminsForm {...props} />
        </Modal>
    )
}
