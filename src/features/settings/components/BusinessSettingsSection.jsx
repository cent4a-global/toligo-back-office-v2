import toast from 'react-hot-toast'
import { notifyError } from '../../../lib/notifications'
import { useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import { normalizeSettingValue } from '../utils/settingValues'

const settingsOrder = [
    'drone.distance_declenchement_km',
    'drone.portee_max_km',
    'tarification.poids_max_colis_kg',
    'drone.charge_operationnelle_kg',
    'drone.reserve_batterie_pct',
    'tarification.diviseur_volumetrique',
    'tarification.tolerance_ecart_poids_kg',
    'livreur.taux_remuneration_pct',
    'station.nb_suggestions',
    'station.rayon_suggestion_km',
    'dispatch.age_max_position_livreur_secondes',
    'dispatch.delai_proposition_secondes',
    'dispatch.nb_max_propositions',
    'dispatch.rayon_recherche_km',
]

const unitMap = {
    'drone.distance_declenchement_km': 'km',
    'drone.portee_max_km': 'km',
    'tarification.poids_max_colis_kg': 'kg',
    'drone.charge_operationnelle_kg': 'kg',
    'drone.reserve_batterie_pct': '%',
    'tarification.diviseur_volumetrique': 'cm³/kg',
    'tarification.tolerance_ecart_poids_kg': 'kg',
    'livreur.taux_remuneration_pct': '%',
    'station.nb_suggestions': '',
    'station.rayon_suggestion_km': 'km',
    'dispatch.age_max_position_livreur_secondes': 's',
    'dispatch.delai_proposition_secondes': 's',
    'dispatch.nb_max_propositions': '',
    'dispatch.rayon_recherche_km': 'km',
}

function BusinessSettingsSection({
    settings = [],
    loading = false,
    onSave,
}) {
    const orderedSettings = useMemo(() => {
        const map = new Map(settings.map(item => [item.cle, item]))

        const sorted = settingsOrder
            .map(key => map.get(key))
            .filter(Boolean)

        const remaining = settings.filter(
            item => !settingsOrder.includes(item.cle)
        )

        return [...sorted, ...remaining]
    }, [settings])

    const [values, setValues] = useState({})



    const handleChange = (key, value) => {
        setValues(previous => ({
            ...previous,
            [key]: value,
        }))
    }

    const lastUpdate = getLastUpdate(settings)

    const handleSubmit = async event => {
        event.preventDefault()
        if (loading) return

        try {
            const updates = orderedSettings
                .filter(setting => setting.est_modifiable && Object.hasOwn(values, setting.cle))
                .map(setting => ({
                    key: setting.cle,
                    value: normalizeSettingValue(setting.type, values[setting.cle]),
                    original: normalizeSettingValue(setting.type, setting.valeur),
                }))
                .filter(item => JSON.stringify(item.value) !== JSON.stringify(item.original))
                .map(({ key, value }) => ({ key, value }))
            if (!updates.length) {
                toast('Aucune modification à enregistrer.')
                return
            }
            await onSave?.(updates)
            setValues({})

        } catch (failure) {
            if (failure.savedKeys?.length) setValues(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => !failure.savedKeys.includes(key))))
            notifyError(failure)
        }
    }

    return (
        <section className="settings-card">
            <div className="settings-card-header">
                <h2>Paramètres métier</h2>
            </div>

            <form
                className="business-settings-form"
                onSubmit={handleSubmit}
            >
                <div className="business-settings-grid">
                    {orderedSettings.map(setting => (
                        <div
                            key={setting.cle}
                            className="business-setting-field"
                        >
                            <label htmlFor={`setting-${setting.cle}`}>{setting.libelle || setting.cle}</label>

                            <div
                                className={`business-setting-input-wrapper ${
                                    !setting.est_modifiable
                                        ? 'business-setting-input-wrapper-disabled'
                                        : ''
                                }`}
                            >
                                <input
                                    id={`setting-${setting.cle}`}
                                    aria-describedby={`setting-help-${setting.cle}`}
                                    type={
                                        setting.type === 'entier' ||
                                        setting.type === 'decimal'
                                            ? 'number'
                                            : setting.type === 'booleen' ? 'checkbox' : 'text'
                                    }
                                    step={
                                        setting.type === 'decimal'
                                            ? 'any'
                                            : undefined
                                    }
                                    value={values[setting.cle] ?? (typeof setting.valeur === 'object' && setting.valeur !== null ? JSON.stringify(setting.valeur) : setting.valeur) ?? ''}
                                    checked={setting.type === 'booleen' ? [true, 'true', 1, '1'].includes(values[setting.cle] ?? setting.valeur) : undefined}
                                    onChange={event =>
                                        handleChange(
                                            setting.cle,
                                            setting.type === 'booleen' ? event.target.checked : event.target.value
                                        )
                                    }
                                    disabled={loading || !setting.est_modifiable}
                                />

                                {unitMap[setting.cle] ? (
                                    <span className="business-setting-unit">
                                        {unitMap[setting.cle]}
                                    </span>
                                ) : null}
                            </div>

                            <p id={`setting-help-${setting.cle}`}>{setting.description || '—'}</p>
                        </div>
                    ))}
                </div>

                {!orderedSettings.length && <p className="settings-empty">Aucun paramètre disponible.</p>}

                <div className="business-settings-footer">
                    <div className="business-settings-last-update">
                        {lastUpdate ? (
                            <>
                                Dernière modification : {lastUpdate}

                            </>
                        ) : (
                            'Aucune modification récente'
                        )}
                    </div>

                    <Button type="submit" loading={loading} disabled={!orderedSettings.some(setting => setting.est_modifiable)}>
                        Enregistrer les paramètres
                    </Button>
                </div>
            </form>
        </section>
    )
}

function getLastUpdate(settings) {
    if (!settings.length) {
        return null
    }

    const timestamps = settings
        .map(item => item.updated_at)
        .filter(Boolean)
        .map(item => new Date(item))
        .filter(date => !Number.isNaN(date.getTime()))

    if (!timestamps.length) {
        return null
    }

    const latest = timestamps.sort((a, b) => b - a)[0]

    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Africa/Abidjan',
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(latest)
}

export default BusinessSettingsSection
