import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Polygon, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import Button from '../../../components/ui/Button'
import { communePolygon } from '../utils/communeGeometry'

function FitZones({ bounds, revision }) {
    const map = useMap()
    useEffect(() => {
        const points = JSON.parse(bounds)
        if (points.length) map.fitBounds(points, { padding: [32, 32], maxZoom: 15, animate: false })
    }, [map, bounds, revision])
    return null
}

export default function ZonesMap({ zones, loading = false, onEdit }) {
    const [revision, setRevision] = useState(0)
    const mappedZones = useMemo(() => [...zones]
        .sort((a, b) => String(a.id).localeCompare(String(b.id)))
        .map((zone, index) => ({
            zone,
            positions: communePolygon(zone),
            color: `hsl(${Math.round(index * 137.508) % 360}, 65%, 40%)`,
        }))
        .filter(item => item.positions.length), [zones])
    const bounds = JSON.stringify(mappedZones.flatMap(item => item.positions))
    const missing = zones.length - mappedZones.length

    return (
        <section className="zones-map-card" aria-labelledby="zones-map-title">
            <div className="zones-map-header">
                <div>
                    <h2 id="zones-map-title">Carte des zones</h2>
                    <p>Cliquez sur un contour pour consulter la zone.</p>
                </div>
                <Button variant="secondary" size="sm" disabled={!mappedZones.length} onClick={() => setRevision(value => value + 1)}>Recentrer</Button>
            </div>
            {loading ? <p className="zones-map-message" role="status">Chargement des zones…</p> : <>
                <MapContainer className="zones-overview-map" center={[5.3364, -4.0267]} zoom={11} scrollWheelZoom={false}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <FitZones bounds={bounds} revision={revision} />
                    {mappedZones.map(({ zone, positions, color }) => (
                        <Polygon key={zone.id} positions={positions} pathOptions={{ color, fillColor: color, fillOpacity: 0.22, weight: 3, dashArray: zone.est_active ? undefined : '6 5' }}>
                            <Tooltip sticky>{zone.nom}</Tooltip>
                            <Popup>
                                <div className="zones-map-popup">
                                    <strong>{zone.nom}</strong>
                                    <span>{zone.code}</span>
                                    <span>{zone.est_active ? 'Active' : 'Inactive'}</span>
                                    {zone.communes?.length > 0 && <span>{zone.communes.map(commune => commune.nom).join(', ')}</span>}
                                    <Button size="sm" variant="secondary" onClick={() => onEdit?.(zone)}>Modifier</Button>
                                </div>
                            </Popup>
                        </Polygon>
                    ))}
                </MapContainer>
                {!mappedZones.length && <p className="zones-map-message" role="status">Aucun contour de zone à afficher.</p>}
                {mappedZones.length > 0 && <ul className="zones-map-legend" aria-label="Légende des zones">
                    {mappedZones.map(({ zone, color }) => (
                        <li key={zone.id}><span className="zones-map-swatch" style={{ backgroundColor: color }} aria-hidden="true" />{zone.nom}{!zone.est_active && <small>Inactive</small>}</li>
                    ))}
                </ul>}
                {missing > 0 && <p className="zones-map-message">{missing} zone(s) sans contour valide ne peuvent pas être affichées.</p>}
            </>}
        </section>
    )
}
