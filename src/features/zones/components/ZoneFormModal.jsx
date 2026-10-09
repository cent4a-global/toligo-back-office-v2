import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'
import { createZonePayload } from '../utils/zoneForm'
import ZonePolygonMap from './ZonePolygonMap'
import { useCommunes } from '../hooks/useCommunes'
import { communePolygon, containsPoint } from '../utils/communeGeometry'

function ZoneFormModal({ open, zone, loading = false, onClose, onSubmit }) {
    const { data: communes = [] } = useCommunes()
    const mapCommunes = [...new Map([...(zone?.communes ?? []), ...communes].map(commune => [commune.id, commune])).values()]
    const [form, setForm] = useState(() => ({
        nom: zone?.nom ?? '',
        code: zone?.code ?? '',
        est_active: String(zone?.est_active ?? true),
        communes: zone?.communes?.map(commune => commune.id) ?? [],
        polygone: zone?.polygone?.length
            ? zone.polygone.map(point => ({ ...point }))
            : [],
    }))
    const [error, setError] = useState('')
    const [polygonMode, setPolygonMode] = useState('map')

    const changePolygonMode = mode => {
        setPolygonMode(mode)
        setForm(previous => ({
            ...previous,
            polygone: mode === 'map'
                ? previous.polygone.filter(point => String(point.lat).trim() !== '' || String(point.lng).trim() !== '')
                : previous.polygone.length ? previous.polygone : Array.from({ length: 3 }, () => ({ lat: '', lng: '' })),
        }))
    }

    const handleChange = event => {
        const { name, value } = event.target
        setForm(previous => ({ ...previous, [name]: value }))
    }

    const updatePoint = (index, key, value) =>
        setForm(previous => ({
            ...previous,
            polygone: previous.polygone.map((point, i) =>
                i === index ? { ...point, [key]: value } : point,
            ),
        }))
        
    const handleSubmit = async event => {
        event.preventDefault()
        if (loading) return
        setError('')
        try {
            await onSubmit?.(createZonePayload(form))
        } catch (failure) {
            setError(failure.message || 'Impossible d’enregistrer cette zone.')
        }
    }

    return (
        <Modal
            open={open}
            onClose={loading ? undefined : onClose}
            closeOnOverlayClick={false}
            title={zone ? 'Modifier la zone' : 'Ajouter une zone'}>
            <form className="zone-form" onSubmit={handleSubmit}>
                <div className="zone-form-row">
                    <Input
                        label="Nom de la zone"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        placeholder="Ex. Zone Abidjan Nord"
                        required
                        disabled={loading}
                    />
                    <Input
                        label="Code"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="Ex. ZN-ABJ-NORD"
                        required
                        disabled={loading}
                    />
                </div>
                <Select
                    label="Statut"
                    name="est_active"
                    value={form.est_active}
                    onChange={handleChange}
                    disabled={loading}
                    options={[
                        { value: 'true', label: 'Active' },
                        { value: 'false', label: 'Inactive' },
                    ]}
                />
                <fieldset className="zone-polygon">
                    <legend className="form-label">Contour géographique</legend>
                    <div className="zone-polygon-modes" role="group" aria-label="Mode de saisie du contour">
                        <button type="button" aria-pressed={polygonMode === 'map'} disabled={loading} onClick={() => changePolygonMode('map')}>Carte</button>
                        <button type="button" aria-pressed={polygonMode === 'manual'} disabled={loading} onClick={() => changePolygonMode('manual')}>Manuel</button>
                    </div>
                    {polygonMode === 'map' ? (
                        <ZonePolygonMap points={form.polygone} disabled={loading}
                            communes={mapCommunes} selectedCommunes={form.communes}
                            onToggleCommune={id => setForm(previous => ({ ...previous, communes: previous.communes.includes(id)
                                ? previous.communes.filter(value => value !== id) : [...previous.communes, id] }))}
                            onAdd={point => setForm(previous => ({
                                ...previous,
                                polygone: [...previous.polygone, point],
                                communes: [...new Set([...previous.communes, ...mapCommunes
                                    .filter(commune => containsPoint(communePolygon(commune), point)).map(commune => commune.id)])],
                            }))}
                            onUndo={() => setForm(previous => ({ ...previous, polygone: previous.polygone.slice(0, -1) }))}
                            onClear={() => setForm(previous => ({ ...previous, polygone: [] }))} />
                    ) : <>
                    <p className="zone-polygon-help">
                        Ajoutez au moins trois points dans l’ordre du contour de la zone.
                    </p>
                    {form.polygone.map((point, index) => (
                        <div className="zone-polygon-point" key={index}>
                            <span className="zone-point-number">{index + 1}</span>
                            <Input
                                label="Latitude"
                                name={`zone-lat-${index}`}
                                type="number"
                                step="any"
                                min={-90}
                                max={90}
                                value={point.lat}
                                onChange={event => updatePoint(index, 'lat', event.target.value)}
                                required
                                disabled={loading}
                            />
                            <Input
                                label="Longitude"
                                name={`zone-lng-${index}`}
                                type="number"
                                step="any"
                                min={-180}
                                max={180}
                                value={point.lng}
                                onChange={event => updatePoint(index, 'lng', event.target.value)}
                                required
                                disabled={loading}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={loading || form.polygone.length <= 3}
                                aria-label={`Retirer le point ${index + 1}`}
                                onClick={() =>
                                    setForm(previous => ({
                                        ...previous,
                                        polygone: previous.polygone.filter((_, i) => i !== index),
                                    }))
                                }>
                                ×
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                        onClick={() =>
                            setForm(previous => ({
                                ...previous,
                                polygone: [...previous.polygone, { lat: '', lng: '' }],
                            }))
                        }>
                        Ajouter un point
                    </Button>
                    </>}
                </fieldset>
                {error && (
                    <p className="zone-error" role="alert">
                        {error}
                    </p>
                )}
                <div className="zone-form-actions">
                    <Button variant="secondary" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button type="submit" loading={loading}>
                        {zone ? 'Enregistrer' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default ZoneFormModal
