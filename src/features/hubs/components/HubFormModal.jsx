import { useState } from 'react'

import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'


const initialForm = {
    code: '',
    station_id: '',
    statut: 'libre',
    description: '',
}

function HubFormModal({ open, hub, stations = [], loading = false, onClose, onSubmit }) {
    const [form, setForm] = useState(() => hub ? {
        code: hub.code ?? '', station_id: hub.station?.id ?? hub.station_id ?? '',
        statut: hub.statut ?? 'libre', description: hub.description ?? '',
    } : initialForm)
    const [error, setError] = useState('')
    const stationOptions = [...new Map([...(hub?.station ? [hub.station] : []), ...stations].map(station => [station.id, station])).values()]

    const handleChange = event => {
        const { name, value } = event.target

        setForm(previous => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleSubmit = async event => {
        event.preventDefault()
        if (loading) return
        setError('')
        if (!form.code.trim() || !form.station_id) {
            setError('Renseignez le code et la station du hub.')
            return
        }
        if (!['libre', 'occupe', 'maintenance', 'indisponible'].includes(form.statut)) {
            setError('Sélectionnez un statut valide.')
            return
        }
        try {
            await onSubmit?.({ ...form, code: form.code.trim(), description: form.description.trim() })
        } catch (failure) {
            setError(failure.message || 'Impossible d’enregistrer ce hub.')
        }
    }

    return (
        <Modal
            open={open}
            onClose={loading ? undefined : onClose}
            closeOnOverlayClick={false}
            title={hub ? 'Modifier le hub' : 'Ajouter un hub'}
            size="md">
            <form className="hub-form" onSubmit={handleSubmit}>
                <Input
                    label="Code du hub"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Ex. H1-004"
                    required
                />

                <Select
                    label="Station"
                    name="station_id"
                    value={form.station_id}
                    onChange={handleChange}
                    disabled={loading}
                    options={stationOptions.map(station => ({
                        value: station.id,

                        label: `${station.nom} — ${station.code}`,
                    }))}
                    required
                />

                <Select
                    label="Statut"
                    name="statut"
                    value={form.statut}
                    onChange={handleChange}
                    disabled={loading}
                    options={[
                        {
                            value: 'libre',
                            label: 'Libre',
                        },
                        {
                            value: 'occupe',
                            label: 'Occupé',
                        },
                        {
                            value: 'maintenance',
                            label: 'Maintenance',
                        },
                        {
                            value: 'indisponible',
                            label: 'Indisponible',
                        },
                    ]}
                />

                <div className="hub-form-group">
                    <label htmlFor="hub-description">Description</label>

                    <textarea
                        id="hub-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ex. Plateforme nord, zone de dégagement courte."
                        rows="4"
                    />
                </div>

                {error && <p className="hub-error" role="alert">{error}</p>}
                <div className="hub-form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>

                    <Button type="submit" loading={loading}>
                        {hub ? 'Enregistrer' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default HubFormModal
