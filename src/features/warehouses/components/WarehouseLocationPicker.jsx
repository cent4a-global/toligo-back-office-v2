import { useEffect, useRef, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { searchLocations } from '../api/geocoding.api'

const cityCenters = {
    Abidjan: [5.3364, -4.0267],
    Yamoussoukro: [6.8276, -5.2893],
    Bouaké: [7.69, -5.03],
    'San Pedro': [4.7485, -6.6363],
}

function LocationEvents({ onSelect, disabled }) {
    useMapEvents({
        click(event) {
            if (!disabled) onSelect(event.latlng)
        },
    })
    return null
}

function SearchMapView({ target }) {
    const map = useMap()
    useEffect(() => {
        if (target) map.setView([target.lat, target.lng], 16)
    }, [map, target])
    return null
}

export default function WarehouseLocationPicker({ city, latitude, longitude, onSelect, disabled, locationLabel = 'l’entrepôt' }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [searching, setSearching] = useState(false)
    const [message, setMessage] = useState('')
    const [target, setTarget] = useState(null)
    const requestRef = useRef(null)

    useEffect(() => () => requestRef.current?.abort(), [])

    const search = async () => {
        if (disabled || requestRef.current) return
        if (query.trim().length < 3) {
            setMessage('Saisissez au moins 3 caractères pour rechercher une zone.')
            return
        }
        const controller = new AbortController()
        requestRef.current = controller
        setSearching(true)
        setResults([])
        setMessage('')
        try {
            const places = await searchLocations(query, controller.signal)
            if (controller.signal.aborted) return
            setResults(places)
            if (!places.length) setMessage('Aucune zone trouvée. Précisez le quartier ou la ville.')
        } catch (error) {
            if (!controller.signal.aborted) setMessage(error.message || 'Impossible de rechercher cette zone.')
        } finally {
            if (requestRef.current === controller) requestRef.current = null
            if (!controller.signal.aborted) setSearching(false)
        }
    }

    const selectPlace = place => {
        const position = { lat: Number(place.lat), lng: Number(place.lon) }
        setTarget(position)
        onSelect(position)
        setResults([])
        setMessage('Position sélectionnée. Cliquez sur la carte pour affiner le point exact.')
    }
    const lat = Number(latitude)
    const lng = Number(longitude)
    const hasPosition = String(latitude).trim() !== '' && String(longitude).trim() !== '' &&
        Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
    const center = hasPosition ? [lat, lng] : cityCenters[city] ?? cityCenters.Abidjan

    return (
        <div className="warehouse-location-picker">
            <div className="warehouse-location-search">
                <Input
                    label="Rechercher une zone"
                    name="warehouse-zone-search"
                    value={query}
                    onChange={event => { setQuery(event.target.value); setResults([]); setMessage('') }}
                    placeholder="Ex. Yopougon, Abidjan"
                    disabled={disabled || searching}
                    onKeyDown={event => {
                        if (event.key === 'Enter') { event.preventDefault(); search() }
                    }}
                />
                <Button onClick={search} loading={searching} disabled={disabled}>Rechercher</Button>
            </div>
            {results.length > 0 && (
                <ul className="warehouse-location-results" aria-label="Zones trouvées">
                    {results.map(place => (
                        <li key={place.place_id}>
                            <button type="button" disabled={disabled} onClick={() => selectPlace(place)}>
                                <i className="fi fi-rr-marker" aria-hidden="true" />
                                <span>{place.display_name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div role="status" aria-live="polite" className="warehouse-location-status">{message}</div>
            <p id="warehouse-map-help">Cliquez sur la carte pour placer le point GPS de {locationLabel}. Vous pouvez zoomer pour affiner la position.</p>
            <MapContainer
                key={city}
                center={center}
                zoom={13}
                className="warehouse-location-map"
                attributionControl
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationEvents onSelect={onSelect} disabled={disabled} />
                <SearchMapView target={target} />
                {hasPosition && <CircleMarker center={[lat, lng]} radius={9} pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#c94a0a', fillOpacity: 1 }} />}
            </MapContainer>
        </div>
    )
}
