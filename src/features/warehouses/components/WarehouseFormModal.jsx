import { useState } from 'react'

import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'
import WarehouseLocationPicker from './WarehouseLocationPicker'


const initialForm = {
    name: '',
    address: '',
    city: '',
    commune: '',
    description: '',
    latitude: '',
    longitude: '',
}

const cities = ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San Pedro']

function WarehouseFormModal({ open, warehouse, loading = false, onClose, onSubmit }) {
    const [form, setForm] = useState(() =>
        warehouse
            ? {
                  name: warehouse.name ?? '',
                  address: warehouse.address ?? '',
                  city:
                      warehouse.city?.name ??
                      (typeof warehouse.city === 'string' ? warehouse.city : ''),
                  commune:
                      warehouse.commune?.name ??
                      (typeof warehouse.commune === 'string' ? warehouse.commune : ''),
                  description: warehouse.description ?? '',
                  latitude: warehouse.latitude ?? '',
                  longitude: warehouse.longitude ?? '',
              }
            : initialForm,
    )

    const handleChange = event => {
        const { name, value } = event.target

        setForm(previous => ({
            ...previous,
            [name]: value,
        }))
    }

    const [error, setError] = useState('')
    const [coordinateMode, setCoordinateMode] = useState('manual')

    const handleSubmit = async event => {
        event.preventDefault()

        if (loading) return
        setError('')
        if (!form.name.trim() || !form.address.trim() || !form.city.trim()) {
            setError('Veuillez renseigner la ville, le nom et l’adresse de l’entrepôt.')
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
            setError('Saisissez une latitude entre -90 et 90 et une longitude entre -180 et 180.')
            return
        }

        try {
            await onSubmit?.({
                ...form,
                name: form.name.trim(),
                address: form.address.trim(),
                description: form.description.trim(),
                latitude,
                longitude,
            })
        } catch (failure) {
            setError(failure.message)
        }
    }

    return (
        <Modal
            open={open}
            closeOnOverlayClick={false}
            onClose={loading ? undefined : onClose}
            title={warehouse ? "Modifier l'entrepôt" : 'Ajouter un entrepôt'}
            size="md">
            <form className="warehouse-form" onSubmit={handleSubmit}>
                <Select
                    label="Ville"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    options={(form.city && !cities.includes(form.city)
                        ? [...cities, form.city]
                        : cities
                    ).map(city => ({ value: city, label: city }))}
                    placeholder="Sélectionner une ville"
                    disabled={loading}
                    required
                />
                <Input
                    label="Nom de l'entrepôt"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ex. Entrepôt Yopougon"
                    disabled={loading}
                    required
                />

                <Input
                    label="Adresse"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Ex. Boulevard de Yopougon"
                    disabled={loading}
                    required
                />

                <Input
                    label="Commune"
                    name="commune"
                    value={form.commune}
                    onChange={handleChange}
                    placeholder="Cocody"
                    disabled={loading}
                />

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
                            <i className="fi fi-rr-pencil" aria-hidden="true" /> Manuel
                        </button>
                        <button
                            type="button"
                            aria-pressed={coordinateMode === 'map'}
                            onClick={() => setCoordinateMode('map')}
                            disabled={loading}>
                            <i className="fi fi-rr-marker" aria-hidden="true" /> Carte
                        </button>
                    </div>
                    {coordinateMode === 'map' && (
                        <WarehouseLocationPicker
                            city={form.city}
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

                {error && (
                    <p className="warehouse-form-error" role="alert">
                        {error}
                    </p>
                )}
                <div className="warehouse-form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>

                    <Button type="submit" loading={loading} variant="danger">
                        {warehouse ? 'Enregistrer' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default WarehouseFormModal
