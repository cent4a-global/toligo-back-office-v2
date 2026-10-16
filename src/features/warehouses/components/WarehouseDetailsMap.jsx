import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'

import MapResize from '../../../components/ui/MapResize'

export default function WarehouseDetailsMap({ warehouse }) {
    const latitude = Number(warehouse.latitude)
    const longitude = Number(warehouse.longitude)
    const hasCoordinates =
        warehouse.latitude != null &&
        warehouse.longitude != null &&
        String(warehouse.latitude).trim() !== '' &&
        String(warehouse.longitude).trim() !== '' &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180

    if (!hasCoordinates) {
        return (
            <div className="warehouse-location-unavailable" role="status">
                Aucune coordonnée géographique valide pour cet entrepôt.
            </div>
        )
    }

    const name = warehouse.nom ?? warehouse.name ?? 'Entrepôt'
    const address = warehouse.adresse ?? warehouse.address

    return (
        <MapContainer
            className="warehouse-detail-map"
            center={[latitude, longitude]}
            zoom={16}
            scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapResize />
            <CircleMarker
                center={[latitude, longitude]}
                radius={10}
                pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#11b85c', fillOpacity: 1 }}>
                <Popup>
                    <div className="warehouse-map-popup">
                        <strong>{name}</strong>
                        {address && <span>{address}</span>}
                    </div>
                </Popup>
            </CircleMarker>
        </MapContainer>
    )
}
