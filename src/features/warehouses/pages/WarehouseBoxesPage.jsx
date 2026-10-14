import { Package } from 'lucide-react'
import WarehouseManagementLayout from '../components/WarehouseManagementLayout'

export default function WarehouseBoxesPage() {
    return (
        <WarehouseManagementLayout title="Gérer les caisses" description="Caisses de cet entrepôt.">
            {() => (
                <div className="warehouse-boxes-placeholder">
                    <Package size={32} strokeWidth={1.5} aria-hidden="true" />
                    <h2>Gestion des caisses à venir</h2>
                    <p>La consultation et la gestion des caisses seront disponibles prochainement.</p>
                </div>
            )}
        </WarehouseManagementLayout>
    )
}
