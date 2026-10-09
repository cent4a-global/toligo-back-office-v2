import { useEffect, useRef } from 'react'
import { CircleMarker, MapContainer, Polygon, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import Button from '../../../components/ui/Button'
import { communePolygon, communePosition } from '../utils/communeGeometry'

function MapControls({ points, onAdd, disabled }) {
    const map = useMap()
    const initialPoints = useRef(points)
    useEffect(() => {
        if (initialPoints.current.length > 1) {
            map.fitBounds(initialPoints.current, { padding: [24, 24], maxZoom: 16 })
        }
    }, [map])
    useMapEvents({
        click(event) {
            if (disabled) return
            const { lat, lng } = event.latlng.wrap()
            onAdd({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) })
        },
    })
    return null
}

export default function ZonePolygonMap({ points, onAdd, onUndo, onClear, disabled, communes = [], selectedCommunes = [], onToggleCommune }) {
    const locatedCommunes = communes.map(commune => ({ commune, polygon: communePolygon(commune), position: communePosition(commune) }))
        .filter(item => item.polygon.length || item.position)
    const positions = points
        .filter(point => String(point.lat).trim() !== '' && String(point.lng).trim() !== '' &&
            Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lng)) &&
            Math.abs(Number(point.lat)) <= 90 && Math.abs(Number(point.lng)) <= 180)
        .map(point => [Number(point.lat), Number(point.lng)])

    return (
        <div className="zone-polygon-map-panel">
            <p className="zone-polygon-help">Cliquez sur la carte dans l’ordre des sommets. Le contour se ferme automatiquement à partir du troisième point.</p>
            <p className="zone-polygon-help">Cliquez sur une commune affichée pour la cocher ou la décocher. Les communes sélectionnées apparaissent en vert.</p>
            {communes.length > locatedCommunes.length && <p className="zone-polygon-help" role="status">{communes.length - locatedCommunes.length} commune(s) sans données géographiques ne peuvent pas être affichées sur la carte.</p>}
            <MapContainer className="zone-polygon-map" center={positions[0] ?? [5.3364, -4.0267]} zoom={13} scrollWheelZoom={false} doubleClickZoom={false}>
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapControls points={positions} onAdd={onAdd} disabled={disabled} />
                {locatedCommunes.map(({ commune, polygon, position }) => {
                    const selected = selectedCommunes.includes(commune.id)
                    const events = { click: () => { if (!disabled) onToggleCommune?.(commune.id) } }
                    const tooltip = <Tooltip>{commune.nom} — {selected ? 'Sélectionnée' : 'Cliquer pour sélectionner'}</Tooltip>
                    const style = { color: selected ? '#0e7a52' : '#5675a0', fillColor: selected ? '#0e7a52' : '#5675a0', fillOpacity: selected ? 0.25 : 0.08, weight: 2 }
                    return polygon.length ? (
                        <Polygon key={commune.id} positions={polygon} pathOptions={style} eventHandlers={events} bubblingMouseEvents={false}>{tooltip}</Polygon>
                    ) : (
                        <CircleMarker key={commune.id} center={position} radius={10} pathOptions={{ ...style, fillOpacity: 0.8 }} eventHandlers={events} bubblingMouseEvents={false}>{tooltip}</CircleMarker>
                    )
                })}
                {positions.length >= 3 ? <Polygon positions={positions} pathOptions={{ color: '#c94a0a', fillOpacity: 0.15 }} interactive={false} /> :
                    <Polyline positions={positions} pathOptions={{ color: '#c94a0a' }} interactive={false} />}
                {positions.map((position, index) => (
                    <CircleMarker key={index} center={position} radius={6} pathOptions={{ color: '#ffffff', fillColor: '#c94a0a', fillOpacity: 1, weight: 2 }} interactive={false}>
                        <Tooltip permanent direction="top" offset={[0, -6]}>{index + 1}</Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
            <div className="zone-map-actions">
                <span className="zone-polygon-help" role="status">{positions.length} point(s) sélectionné(s)</span>
                <Button size="sm" variant="secondary" onClick={onUndo} disabled={disabled || !points.length}>Retirer le dernier</Button>
                <Button size="sm" variant="ghost" onClick={onClear} disabled={disabled || !points.length}>Recommencer</Button>
            </div>
        </div>
    )
}
