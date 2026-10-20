import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Polygon, TileLayer, useMap } from 'react-leaflet'
import Button from '../../../components/ui/Button'
import MapResize from '../../../components/ui/MapResize'
import { communePolygon } from '../utils/communeGeometry'

function FitZones({ bounds, revision }) {
    const map = useMap()
    useEffect(() => {
        const points = JSON.parse(bounds)
        if (points.length) map.fitBounds(points, { padding: [32, 32], maxZoom: 15, animate: false })
    }, [map, bounds, revision])
    return null
}

export default function ZonesMap({ zones, loading = false, selectedZoneId, onSelect }) {
    const [revision, setRevision] = useState(0)
    const mappedZones = useMemo(
        () =>
            [...zones]
                .sort((a, b) => String(a.id).localeCompare(String(b.id)))
                .map((zone, index) => ({
                    zone,
                    positions: communePolygon(zone),
                    color: `hsl(${Math.round(index * 137.508) % 360}, 65%, 40%)`,
                }))
                .filter(item => item.positions.length),
        [zones],
    )
    const bounds = JSON.stringify(mappedZones.flatMap(item => item.positions))
    const missing = zones.length - mappedZones.length

    return (
        <section className="zones-map-card" aria-labelledby="zones-map-title">
            <h2 id="zones-map-title" className="sr-only">Carte des zones</h2>
            <div className="zones-map-frame">
                <Button
                    className="zones-map-recenter"
                    variant="secondary"
                    size="sm"
                    disabled={!mappedZones.length}
                    onClick={() => setRevision(value => value + 1)}>
                    Recentrer
                </Button>
                {loading ? (
                    <p className="zones-map-message" role="status">
                        Chargement des zones…
                    </p>
                ) : (
                    <MapContainer
                        className="zones-overview-map"
                        center={[5.3364, -4.0267]}
                        zoom={11}
                        scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <FitZones bounds={bounds} revision={revision} />
                        <MapResize />
                        {mappedZones.map(({ zone, positions, color }) => {
                            const selected = String(zone.id) === String(selectedZoneId)
                            return (
                                <Polygon
                                    key={zone.id}
                                    positions={positions}
                                    eventHandlers={{ click: () => onSelect?.(zone) }}
                                    pathOptions={{
                                        color,
                                        fillColor: color,
                                        fillOpacity: selected ? 0.38 : zone.est_active ? 0.16 : 0.1,
                                        weight: selected ? 3 : 1.5,
                                        dashArray: zone.est_active ? undefined : '6 5',
                                    }}
                                />
                            )
                        })}
                    </MapContainer>
                )}
                {!loading && !mappedZones.length && (
                    <p className="zones-map-message" role="status">Aucun contour de zone à afficher.</p>
                )}
            </div>
            <ul className="zones-map-legend" aria-label="Légende des zones">
                {mappedZones.map(({ zone, color }) => (
                    <li key={zone.id}>
                        <span
                            className="zones-map-swatch"
                            style={{ backgroundColor: color }}
                            aria-hidden="true"
                        />
                        {zone.nom}
                        {!zone.est_active && <small>Inactive</small>}
                    </li>
                ))}
                <li className="zones-map-legend-hint">Cliquez sur une zone pour afficher ses détails</li>
            </ul>
            {missing > 0 && (
                <p className="zones-map-message">
                    {missing} zone(s) sans contour valide ne peuvent pas être affichées.
                </p>
            )}
        </section>
    )
}
