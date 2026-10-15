import Icon from '../../../components/ui/Icon'
import { notifyError } from '../../../lib/notifications'
import { useState } from 'react'

import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import { useCommunes } from '../../zones/hooks/useCommunes'
import Button from '../../../components/ui/Button'
import WarehouseLocationPicker from './WarehouseLocationPicker'

const initialForm = {
    nom: '',
    adresse: '',
    commune_id: '',
    description: '',
    latitude: '',
    longitude: '',
}

function WarehouseFormModal({ open, warehouse, loading = false, onClose, onSubmit }) {
    const communesQuery = useCommunes()
    const [form, setForm] = useState(() =>
        warehouse
            ? {
                  nom: warehouse.nom ?? warehouse.name ?? '',
                  adresse: warehouse.adresse ?? warehouse.address ?? '',
                  commune_id: warehouse.commune_id ?? warehouse.commune?.id ?? '',
                  description: warehouse.description ?? '',
                  latitude: warehouse.latitude ?? '',
                  longitude: warehouse.longitude ?? '',
              }
            : initialForm,
    )

    const communeOptions = (communesQuery.data ?? []).map(commune => ({
        value: commune.id,
        label: commune.nom,
    }))
    if (form.commune_id && !communeOptions.some(option => String(option.value) === String(form.commune_id))) {
        communeOptions.push({
            value: form.commune_id,
            label: warehouse?.commune?.nom ?? warehouse?.commune?.name ?? 'Commune associée',
        })
    }

    const handleChange = event => {
        const { name, value } = event.target

        setForm(previous => ({
            ...previous,
            [name]: value,
        }))
    }

    const [coordinateMode, setCoordinateMode] = useState('manual')

    const handleSubmit = async event => {
        event.preventDefault()

        if (loading) return

        if (!form.nom.trim() || !form.adresse.trim() || !String(form.commune_id).trim()) {
            notifyError('Veuillez renseigner la commune, le nom et l’adresse de l’entrepôt.')
            return
        }

        const latitude = Number(form.latitude)
        const longitude = Number(form.longitude)
        if (
            String(form.latitude).trim() === '' ||
            String(form.longitude).trim() === '' ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            notifyError('Saisissez une latitude entre -90 et 90 et une longitude entre -180 et 180.')
            return
        }

        try {
            await onSubmit?.({
                commune_id: form.commune_id,
                nom: form.nom.trim(),
                adresse: form.adresse.trim(),
                description: form.description.trim(),
                latitude,
                longitude,
            })
        } catch (failure) {
            notifyError(failure)
        }
    }

    return (
        <Modal subtitle="Renseignez les informations du site et sa localisation."
            open={open}
            closeOnOverlayClick={false}
            onClose={loading ? undefined : onClose}
            title={warehouse ? "Modifier l'entrepôt" : 'Ajouter un entrepôt'}
            size="md">
            <form className="warehouse-form" onSubmit={handleSubmit}>
                <Input
                    label="Nom de l'entrepôt"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Ex. Entrepôt Yopougon"
                    disabled={loading}
                    required
                />
                <Input
                    label="Adresse"
                    name="adresse"
                    value={form.adresse}
                    onChange={handleChange}
                    placeholder="Ex. Boulevard de Yopougon"
                    disabled={loading}
                    required
                />

                <Select
                    label="Commune"
                    name="commune_id"
                    value={form.commune_id}
                    onChange={handleChange}
                    options={communeOptions}
                    placeholder={communesQuery.isPending ? 'Chargement des communes...' : 'Sélectionner une commune'}
                    disabled={loading || communesQuery.isPending}
                    required
                />
                {communesQuery.isError && (
                    <div role="alert">
                        {communesQuery.error.message}{' '}
                        <Button type="button" variant="secondary" onClick={() => communesQuery.refetch()}>
                            Réessayer
                        </Button>
                    </div>
                )}

                <div className="form-field">
                    <label htmlFor="description" className="form-label">
                        Description (optionnel)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-input warehouse-form-description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Informations complémentaires ou consignes d’accès"
                        rows={3}
                        disabled={loading}
                    />
                </div>

                <fieldset className="warehouse-form-coordinates">
                    <legend className="form-label">Coordonnées géographiques</legend>
                    <div
                        className="warehouse-coordinate-modes"
                        role="group"
                        aria-label="Mode de saisie des coordonnées">
                        <button
                            type="button"
                            aria-pressed={coordinateMode === 'manual'}
                            onClick={() => setCoordinateMode('manual')}
                            disabled={loading}>
                            <Icon name="edit" /> Manuel
                        </button>
                        <button
                            type="button"
                            aria-pressed={coordinateMode === 'map'}
                            onClick={() => setCoordinateMode('map')}
                            disabled={loading}>
                            <Icon name="location_on" /> Carte
                        </button>
                    </div>
                    {coordinateMode === 'map' && (
                        <WarehouseLocationPicker
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
                    <div className="warehouse-form-row">
                        <Input
                            label="Latitude"
                            name="latitude"
                            type="number"
                            value={form.latitude}
                            onChange={handleChange}
                            min={-90}
                            max={90}
                            step="any"
                            placeholder="Ex. 5.3364"
                            readOnly={coordinateMode === 'map'}
                            disabled={loading}
                            required
                        />
                        <Input
                            label="Longitude"
                            name="longitude"
                            type="number"
                            value={form.longitude}
                            onChange={handleChange}
                            min={-180}
                            max={180}
                            step="any"
                            placeholder="Ex. -4.0267"
                            readOnly={coordinateMode === 'map'}
                            disabled={loading}
                            required
                        />
                    </div>
                </fieldset>


                <div className="warehouse-form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>

                    <Button type="submit" loading={loading} variant="primary">
                        {warehouse ? 'Enregistrer' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default WarehouseFormModal
