import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'
import { useCommunes } from '../../zones/hooks/useCommunes'
import { useWarehouses } from '../../warehouses/hooks/useWarehouses'
import WarehouseLocationPicker from '../../warehouses/components/WarehouseLocationPicker'
import { createStationPayload } from '../utils/stationForm'

export default function StationFormModal({ open, station, loading = false, onClose, onSubmit }) {
    const communesQuery = useCommunes()
    const warehousesQuery = useWarehouses()
    const [mode, setMode] = useState('manual')
    const [error, setError] = useState('')
    const [form, setForm] = useState(() => ({
        nom: station?.nom ?? '',
        code: station?.code ?? '',
        commune_id: station?.commune?.id ?? station?.commune_id ?? '',
        entrepot_id: station?.entrepot_id ?? '',
        adresse: station?.adresse ?? '',
        repere: station?.repere ?? '',
        latitude: station?.latitude ?? '',
        longitude: station?.longitude ?? '',
        statut: station?.statut ?? 'operationnelle',
        description: station?.description ?? '',
        horaires: Object.entries(station?.horaires ?? {}).map(([periode, plage]) => ({
            periode,
            plage,
        })),
    }))
    const change = event =>
        setForm(previous => ({ ...previous, [event.target.name]: event.target.value }))
    const communeOptions = [
        ...new Map(
            [...(station?.commune ? [station.commune] : []), ...(communesQuery.data ?? [])].map(
                item => [item.id, item],
            ),
        ).values(),
    ]
    const warehouses = warehousesQuery.data?.data ?? []
    const warehouseOptions = warehouses.map(item => ({
        value: item.id,
        label: item.nom ?? item.name,
    }))
    if (form.entrepot_id && !warehouseOptions.some(item => item.value === form.entrepot_id))
        warehouseOptions.push({ value: form.entrepot_id, label: 'Entrepôt associé' })
    const submit = async event => {
        event.preventDefault()
        if (loading) return
        setError('')
        try {
            await onSubmit(createStationPayload(form))
        } catch (failure) {
            setError(failure.message || 'Impossible d’enregistrer la station.')
        }
    }
    const updateHour = (index, key, value) =>
        setForm(previous => ({
            ...previous,
            horaires: previous.horaires.map((hour, i) =>
                i === index ? { ...hour, [key]: value } : hour,
            ),
        }))
    return (
        <Modal
            open={open}
            onClose={loading ? undefined : onClose}
            closeOnOverlayClick={false}
            title={station ? 'Modifier la station' : 'Ajouter une station'}
            size="lg">
            <form className="station-form" onSubmit={submit}>
                <div className="station-form-row">
                    <Input
                        label="Nom de la station"
                        name="nom"
                        value={form.nom}
                        onChange={change}
                        placeholder="Ex. Station Cocody Centre"
                        disabled={loading}
                        required
                    />
                    <Input
                        label="Code"
                        name="code"
                        value={form.code}
                        onChange={change}
                        placeholder="Ex. ST-COC-01"
                        disabled={loading}
                        required
                    />
                </div>
                <div className="station-form-row">
                    <Select
                        label="Commune"
                        name="commune_id"
                        value={form.commune_id}
                        onChange={change}
                        options={communeOptions.map(item => ({ value: item.id, label: item.nom }))}
                        disabled={loading || communesQuery.isPending}
                        required
                    />
                    <Select
                        label="Entrepôt (optionnel)"
                        name="entrepot_id"
                        value={form.entrepot_id}
                        onChange={change}
                        options={warehouseOptions}
                        placeholder="Aucun entrepôt"
                        disabled={loading || warehousesQuery.isPending}
                    />
                </div>
                {communesQuery.isError && (
                    <div className="station-error" role="alert">
                        {communesQuery.error.message}{' '}
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => communesQuery.refetch()}>
                            Réessayer
                        </Button>
                    </div>
                )}
                {warehousesQuery.isError && (
                    <div className="station-error" role="alert">
                        {warehousesQuery.error.message}{' '}
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => warehousesQuery.refetch()}>
                            Réessayer
                        </Button>
                    </div>
                )}
                <Input
                    label="Adresse"
                    name="adresse"
                    value={form.adresse}
                    onChange={change}
                    disabled={loading}
                    required
                />
                <Input
                    label="Repère (optionnel)"
                    name="repere"
                    value={form.repere}
                    onChange={change}
                    placeholder="Ex. Immeuble bleu, rez-de-chaussée"
                    disabled={loading}
                />
                <fieldset className="station-fieldset">
                    <legend className="form-label">Position géographique</legend>
                    <div
                        className="station-location-modes"
                        role="group"
                        aria-label="Mode de saisie de la position">
                        <button
                            type="button"
                            aria-pressed={mode === 'manual'}
                            disabled={loading}
                            onClick={() => setMode('manual')}>
                            Manuel
                        </button>
                        <button
                            type="button"
                            aria-pressed={mode === 'map'}
                            disabled={loading}
                            onClick={() => setMode('map')}>
                            Carte
                        </button>
                    </div>
                    {mode === 'map' && (
                        <WarehouseLocationPicker
                            locationLabel="la station"
                            latitude={form.latitude}
                            longitude={form.longitude}
                            disabled={loading}
                            onSelect={({ lat, lng }) =>
                                setForm(previous => ({
                                    ...previous,
                                    latitude: lat.toFixed(6),
                                    longitude: lng.toFixed(6),
                                }))
                            }
                        />
                    )}
                    <div className="station-form-row">
                        <Input
                            label="Latitude"
                            name="latitude"
                            type="number"
                            min={-90}
                            max={90}
                            step="any"
                            value={form.latitude}
                            onChange={change}
                            disabled={loading}
                            required
                        />
                        <Input
                            label="Longitude"
                            name="longitude"
                            type="number"
                            min={-180}
                            max={180}
                            step="any"
                            value={form.longitude}
                            onChange={change}
                            disabled={loading}
                            required
                        />
                    </div>
                </fieldset>
                <Select
                    label="Statut"
                    name="statut"
                    value={form.statut}
                    onChange={change}
                    disabled={loading}
                    required
                    options={[
                        { value: 'operationnelle', label: 'Opérationnelle' },
                        { value: 'maintenance', label: 'Maintenance' },
                        { value: 'indisponible', label: 'Indisponible' },
                    ]}
                />
                <fieldset className="station-fieldset">
                    <legend className="form-label">Horaires (optionnel)</legend>
                    {form.horaires.map((hour, index) => (
                        <div className="station-hours-row" key={index}>
                            <Input
                                label="Jour ou période"
                                name={`station-period-${index}`}
                                value={hour.periode}
                                onChange={event => updateHour(index, 'periode', event.target.value)}
                                placeholder="Ex. lundi_vendredi"
                                disabled={loading}
                                required
                            />
                            <Input
                                label="Plage horaire"
                                name={`station-hours-${index}`}
                                value={hour.plage}
                                onChange={event => updateHour(index, 'plage', event.target.value)}
                                placeholder="07:00-19:00"
                                disabled={loading}
                                required
                            />
                            <Button
                                size="sm"
                                variant="ghost"
                                disabled={loading}
                                aria-label={`Retirer l’horaire ${index + 1}`}
                                onClick={() =>
                                    setForm(previous => ({
                                        ...previous,
                                        horaires: previous.horaires.filter((_, i) => i !== index),
                                    }))
                                }>
                                ×
                            </Button>
                        </div>
                    ))}
                    <Button
                        size="sm"
                        variant="secondary"
                        disabled={loading}
                        onClick={() =>
                            setForm(previous => ({
                                ...previous,
                                horaires: [...previous.horaires, { periode: '', plage: '' }],
                            }))
                        }>
                        Ajouter un horaire
                    </Button>
                </fieldset>
                <div className="form-field">
                    <label htmlFor="station-description" className="form-label">
                        Description (optionnel)
                    </label>
                    <textarea
                        id="station-description"
                        className="form-input station-description"
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={change}
                        disabled={loading}
                    />
                </div>
                {error && (
                    <p className="station-error" role="alert">
                        {error}
                    </p>
                )}
                <div className="station-form-actions">
                    <Button variant="secondary" disabled={loading} onClick={onClose}>
                        Annuler
                    </Button>
                    <Button type="submit" loading={loading}>
                        {station ? 'Enregistrer' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
