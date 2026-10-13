import { notifyError } from '../../../lib/notifications'
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

function HubFormModal({
    open,
    hub,
    stations = [],
    defaultStation,
    reassignOnly = false,
    loading = false,
    onClose,
    onSubmit,
}) {
    const [form, setForm] = useState(() =>
        hub
            ? {
                  code: hub.code ?? '',
                  station_id: hub.station?.id ?? hub.station_id ?? '',
                  statut: hub.statut ?? 'libre',
                  description: hub.description ?? '',
              }
            : { ...initialForm, station_id: defaultStation?.id ?? '' },
    )
    const stationOptions = [
        ...new Map(
            [
                ...(hub?.station ? [hub.station] : []),
                ...(defaultStation ? [defaultStation] : []),
                ...stations,
            ].map(station => [station.id, station]),
        ).values(),
    ]

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

        if (!form.code.trim() || !form.station_id) {
            notifyError('Renseignez le code et la station du hub.')
            return
        }
        if (!['libre', 'occupe', 'maintenance', 'indisponible'].includes(form.statut)) {
            notifyError('Sélectionnez un statut valide.')
            return
        }
        try {
            await onSubmit?.({
                ...form,
                code: form.code.trim(),
                description: form.description.trim(),
            })
        } catch (failure) {
            notifyError(failure)
        }
    }

    return (
        <Modal
            subtitle={
                reassignOnly
                    ? `Choisissez la nouvelle station du hub ${hub.code}.`
                    : 'Renseignez le hub et la station à laquelle il est rattaché.'
            }
            open={open}
            onClose={loading ? undefined : onClose}
            closeOnOverlayClick={false}
            title={reassignOnly ? 'Réaffecter le hub' : hub ? 'Modifier le hub' : 'Ajouter un hub'}
            size="md">
            <form className="hub-form" onSubmit={handleSubmit}>
                {!reassignOnly && (
                    <Input
                        label="Code du hub"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ex. H1-004"
                        required
                    />
                )}

                <Select
                    label="Station"
                    name="station_id"
                    value={form.station_id}
                    onChange={handleChange}
                    disabled={true}
                    options={stationOptions.map(station => ({
                        value: station.id,

                        label: `${station.nom} — ${station.code}`,
                    }))}
                    required
                />

                {!reassignOnly && (
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
                        ]}
                    />
                )}

                {!reassignOnly && (
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
                )}

                <div className="hub-form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>

                    <Button
                        type="submit"
                        loading={loading}
                        disabled={
                            reassignOnly &&
                            String(form.station_id) === String(hub.station_id ?? hub.station?.id)
                        }>
                        {reassignOnly ? 'Réaffecter' : hub ? 'Enregistrer' : 'Créer'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default HubFormModal
