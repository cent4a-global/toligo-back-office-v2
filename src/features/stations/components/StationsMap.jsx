import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import Button from '../../../components/ui/Button'

const statuses = {
    operationnelle: { label: 'Opérationnelle', color: '#0e7a52' },
    maintenance: { label: 'Maintenance', color: '#b86b05' },
    indisponible: { label: 'Indisponible', color: '#c43b3b' },
}

function FitStations({ bounds, revision }) {
    const map = useMap()
    useEffect(() => {
        const positions = JSON.parse(bounds)
        if (positions.length)
            map.fitBounds(positions, { padding: [40, 40], maxZoom: 15, animate: false })
    }, [map, bounds, revision])
    return null
}

export default function StationsMap({ stations, loading = false, onEdit }) {
    const [revision, setRevision] = useState(0)
    const located = stations.filter(
        station =>
            station.latitude != null &&
            station.longitude != null &&
            String(station.latitude).trim() !== '' &&
            String(station.longitude).trim() !== '' &&
            Number.isFinite(Number(station.latitude)) &&
            Number.isFinite(Number(station.longitude)) &&
            Math.abs(Number(station.latitude)) <= 90 &&
            Math.abs(Number(station.longitude)) <= 180,
    )
    const bounds = JSON.stringify(
        located.map(station => [Number(station.latitude), Number(station.longitude)]),
    )

    return (
        <section className="stations-map-card" aria-labelledby="stations-map-title">
            <div className="stations-map-header">
                <div>
                    <h2 id="stations-map-title">Carte des stations</h2>
                    <p>Cliquez sur une station pour consulter ses informations.</p>
                </div>
                <Button
                    size="sm"
                    variant="secondary"
                    disabled={!located.length}
                    onClick={() => setRevision(value => value + 1)}>
                    Recentrer
                </Button>
            </div>
            {loading ? (
                <p className="stations-map-message" role="status">
                    Chargement des stations…
                </p>
            ) : (
                <>
                    <MapContainer
                        className="stations-overview-map"
                        center={[5.3364, -4.0267]}
                        zoom={11}
                        scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <FitStations bounds={bounds} revision={revision} />
                        {located.map(station => {
                            const status = statuses[station.statut] ?? {
                                label: station.statut || 'Statut inconnu',
                                color: '#66666d',
                            }
                            return (
                                <CircleMarker
                                    key={station.id}
                                    center={[Number(station.latitude), Number(station.longitude)]}
                                    radius={9}
                                    pathOptions={{
                                        color: '#ffffff',
                                        weight: 2,
                                        fillColor: status.color,
                                        fillOpacity: 1,
                                    }}>
                                    <Tooltip>
                                        {station.nom} — {status.label}
                                    </Tooltip>
                                    <Popup>
                                        <div className="stations-map-popup">
                                            <strong>{station.nom}</strong>
                                            <span>{station.code}</span>
                                            <span>{status.label}</span>
                                            {station.commune?.nom && (
                                                <span>{station.commune.nom}</span>
                                            )}
                                            {station.adresse && <span>{station.adresse}</span>}
                                            {station.repere && <span>{station.repere}</span>}
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => onEdit?.(station)}>
                                                Modifier
                                            </Button>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            )
                        })}
                    </MapContainer>
                    <ul className="stations-map-legend" aria-label="Légende des statuts">
                        {Object.entries(statuses).map(([key, status]) => (
                            <li key={key}>
                                <span
                                    style={{ backgroundColor: status.color }}
                                    aria-hidden="true"
                                />
                                {status.label}
                            </li>
                        ))}
                    </ul>
                    {!stations.length && (
                        <p className="stations-map-message" role="status">
                            Aucune station à afficher.
                        </p>
                    )}
                    {stations.length > located.length && (
                        <p className="stations-map-message" role="status">
                            {stations.length - located.length} station(s) sans coordonnées GPS
                            valides ne peuvent pas être affichées.
                        </p>
                    )}
                </>
            )}
        </section>
    )
}
