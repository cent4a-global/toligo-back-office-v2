
```text
src/features/settings/
├── api/
│   └── settings.api.js
├── hooks/
│   └── useSettings.js
├── pages/
│   ├── SettingsPage.jsx
│   └── SettingsPage.css
├── components/
│   ├── PackageFormatsSection.jsx
│   ├── PackageFormatsSection.css
│   ├── BusinessSettingsSection.jsx
│   └── BusinessSettingsSection.css
```

---

# 1) `src/features/settings/api/settings.api.js`

```text
import api from '../../../lib/axios/api'

export async function getSettings() {
    try {
        const response = await api.get('/api/superadmin/parametres')
        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'Erreur lors de la récupération des paramètres'

        throw new Error(message, { cause: error })
    }
}

export async function updateSetting(key, value) {
    try {
        const response = await api.put(
            `/api/superadmin/parametres/${encodeURIComponent(key)}`,
            {
                valeur: value,
            }
        )

        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message ||
            'Erreur lors de la modification du paramètre'

        throw new Error(message, { cause: error })
    }
}
```

---

# 2) `src/features/settings/hooks/useSettings.js`

```text
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getSettings, updateSetting } from '../api/settings.api'

export const settingKeys = {
    all: ['settings'],
    lists: () => [...settingKeys.all, 'list'],
}

export function useSettings() {
    return useQuery({
        queryKey: settingKeys.lists(),
        queryFn: getSettings,
    })
}

export function useSaveSettings() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async updates => {
            const requests = updates.map(item =>
                updateSetting(item.key, item.value)
            )

            return Promise.all(requests)
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: settingKeys.lists(),
            })
        },
    })
}
```

---

# 3) `src/features/settings/components/PackageFormatsSection.jsx`

> Ici je te mets des données temporaires pour coller au design.
> Quand ton API formats sera prête, on remplacera juste le tableau.

```text
import Button from '../../../components/ui/Button'
import './PackageFormatsSection.css'

const packageFormats = [
    {
        id: 1,
        image: '📦',
        libelle: 'Petit',
        code: 'PETIT',
        repere: 'Téléphone, documents',
        dimensions: '25 × 20 × 10 cm',
        poids: '2 kg',
        prix: '1 000 F',
        statut: 'Actif',
    },
    {
        id: 2,
        image: '📦',
        libelle: 'Moyen',
        code: 'MOYEN',
        repere: 'Boîte à chaussures',
        dimensions: '40 × 30 × 20 cm',
        poids: '5 kg',
        prix: '1 500 F',
        statut: 'Actif',
    },
    {
        id: 3,
        image: '📦',
        libelle: 'Grand',
        code: 'GRAND',
        repere: 'Carton de déménagement',
        dimensions: '60 × 40 × 40 cm',
        poids: '10 kg',
        prix: '2 500 F',
        statut: 'Actif',
    },
    {
        id: 4,
        image: '—',
        libelle: 'Pli',
        code: 'PLI',
        repere: 'Enveloppe A4',
        dimensions: '32 × 23 × 2 cm',
        poids: '0,5 kg',
        prix: '700 F',
        statut: 'Archivé',
    },
]

function PackageFormatsSection() {
    return (
        <section className="settings-card">
            <div className="settings-card-header settings-card-header-space">
                <div>
                    <h2>Formats de colis</h2>
                    <p>
                        Prix final, identique par route ou par drone. Un changement
                        de prix ne touche pas les commandes déjà passées.
                    </p>
                </div>

                <Button>
                    <i className="fi fi-rr-plus"></i>
                    Nouveau format
                </Button>
            </div>

            <div className="package-formats-table-wrapper">
                <table className="package-formats-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Libellé · code</th>
                            <th>Repère</th>
                            <th>Dimensions max</th>
                            <th>Poids max</th>
                            <th>Prix</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {packageFormats.map(format => (
                            <tr key={format.id}>
                                <td>
                                    <div className="package-format-image">
                                        {format.image}
                                    </div>
                                </td>

                                <td>
                                    <div className="package-format-name">
                                        <strong>{format.libelle}</strong>
                                        <span>{format.code}</span>
                                    </div>
                                </td>

                                <td>{format.repere}</td>
                                <td>{format.dimensions}</td>
                                <td>{format.poids}</td>
                                <td className="package-format-price">{format.prix}</td>

                                <td>
                                    <span
                                        className={`package-format-status ${
                                            format.statut === 'Actif'
                                                ? 'package-format-status-active'
                                                : 'package-format-status-archived'
                                        }`}
                                    >
                                        {format.statut}
                                    </span>
                                </td>

                                <td>
                                    <div className="package-format-actions">
                                        <button type="button">Modifier</button>

                                        <button type="button">
                                            {format.statut === 'Actif'
                                                ? 'Archiver'
                                                : 'Restaurer'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default PackageFormatsSection
```

---

# 4) `src/features/settings/components/PackageFormatsSection.css`

```text
.settings-card {
    border: 1px solid var(--color-border-light);
    border-radius: var(--radius-2xl);
    background: var(--color-bg-surface);
    box-shadow: var(--shadow-sm);
}

.settings-card-header {
    padding: var(--space-6) var(--space-6) var(--space-4);
}

.settings-card-header-space {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
}

.settings-card-header h2 {
    color: var(--color-text-primary);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-2);
}

.settings-card-header p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    line-height: 1.5;
}

.package-formats-table-wrapper {
    padding: 0 var(--space-6) var(--space-6);
    overflow-x: auto;
}

.package-formats-table {
    width: 100%;
    border-collapse: collapse;
}

.package-formats-table th {
    padding: var(--space-4) var(--space-3);
    border-bottom: 1px solid var(--color-border-light);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-align: left;
    white-space: nowrap;
}

.package-formats-table td {
    padding: var(--space-4) var(--space-3);
    border-bottom: 1px solid var(--color-border-light);
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    vertical-align: middle;
}

.package-formats-table tbody tr:last-child td {
    border-bottom: none;
}

.package-format-image {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-lg);
    background: var(--color-bg-hover);
    font-size: 20px;
}

.package-format-name {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.package-format-name strong {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-semibold);
}

.package-format-name span {
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
}

.package-format-price {
    font-weight: var(--font-weight-semibold);
}

.package-format-status {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
}

.package-format-status-active {
    background: var(--color-success-bg);
    color: var(--color-success);
}

.package-format-status-archived {
    background: var(--color-bg-hover);
    color: var(--color-text-secondary);
}

.package-format-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.package-format-actions button {
    border: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
}

.package-format-actions button:hover {
    text-decoration: underline;
}

@media (max-width: 900px) {
    .settings-card-header-space {
        flex-direction: column;
        align-items: stretch;
    }
}
```

---

# 5) `src/features/settings/components/BusinessSettingsSection.jsx`

```text
import { useEffect, useMemo, useState } from 'react'
import Button from '../../../components/ui/Button'
import './BusinessSettingsSection.css'

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

    useEffect(() => {
        const nextValues = {}

        orderedSettings.forEach(item => {
            nextValues[item.cle] =
                item.valeur === null || item.valeur === undefined
                    ? ''
                    : item.valeur
        })

        setValues(nextValues)
    }, [orderedSettings])

    const handleChange = (key, value) => {
        setValues(previous => ({
            ...previous,
            [key]: value,
        }))
    }

    const lastUpdate = getLastUpdate(settings)

    const handleSubmit = event => {
        event.preventDefault()

        const changedSettings = orderedSettings
            .filter(setting => setting.est_modifiable)
            .filter(setting => {
                const oldValue =
                    setting.valeur === null || setting.valeur === undefined
                        ? ''
                        : String(setting.valeur)

                const newValue =
                    values[setting.cle] === null || values[setting.cle] === undefined
                        ? ''
                        : String(values[setting.cle])

                return oldValue !== newValue
            })
            .map(setting => ({
                key: setting.cle,
                value: normalizeValue(setting.type, values[setting.cle]),
            }))

        onSave?.(changedSettings)
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
                            <label>{setting.libelle}</label>

                            <div
                                className={`business-setting-input-wrapper ${
                                    !setting.est_modifiable
                                        ? 'business-setting-input-wrapper-disabled'
                                        : ''
                                }`}
                            >
                                <input
                                    type={
                                        setting.type === 'entier' ||
                                        setting.type === 'decimal'
                                            ? 'number'
                                            : 'text'
                                    }
                                    step={
                                        setting.type === 'decimal'
                                            ? 'any'
                                            : undefined
                                    }
                                    value={values[setting.cle] ?? ''}
                                    onChange={event =>
                                        handleChange(
                                            setting.cle,
                                            event.target.value
                                        )
                                    }
                                    disabled={!setting.est_modifiable}
                                />

                                {unitMap[setting.cle] ? (
                                    <span className="business-setting-unit">
                                        {unitMap[setting.cle]}
                                    </span>
                                ) : null}
                            </div>

                            <p>{setting.description || '—'}</p>
                        </div>
                    ))}
                </div>

                <div className="business-settings-footer">
                    <div className="business-settings-last-update">
                        {lastUpdate ? (
                            <>
                                Dernière modification : {lastUpdate}
                                {' · '}
                                <button type="button">voir l’historique</button>
                            </>
                        ) : (
                            'Aucune modification récente'
                        )}
                    </div>

                    <Button type="submit" disabled={loading}>
                        Enregistrer les paramètres
                    </Button>
                </div>
            </form>
        </section>
    )
}

function normalizeValue(type, value) {
    if (value === '') {
        return null
    }

    if (type === 'entier') {
        return Number.parseInt(value, 10)
    }

    if (type === 'decimal') {
        return Number.parseFloat(value)
    }

    return value
}

function getLastUpdate(settings) {
    if (!settings.length) {
        return null
    }

    const timestamps = settings
        .map(item => item.updated_at)
        .filter(Boolean)
        .map(item => new Date(item))

    if (!timestamps.length) {
        return null
    }

    const latest = timestamps.sort((a, b) => b - a)[0]

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(latest)
}

export default BusinessSettingsSection
```

---

# 6) `src/features/settings/components/BusinessSettingsSection.css`

```text
.business-settings-form {
    padding: 0 var(--space-6) var(--space-6);
}

.business-settings-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-5) var(--space-4);
}

.business-setting-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.business-setting-field label {
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
}

.business-setting-input-wrapper {
    height: 52px;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 0 var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    background: var(--color-bg-surface);
}

.business-setting-input-wrapper:focus-within {
    border-color: var(--color-text-primary);
}

.business-setting-input-wrapper-disabled {
    background: var(--color-bg-hover);
}

.business-setting-input-wrapper input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
}

.business-setting-input-wrapper input:disabled {
    cursor: not-allowed;
    color: var(--color-text-secondary);
}

.business-setting-unit {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    white-space: nowrap;
}

.business-setting-field p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-xs);
    line-height: 1.5;
}

.business-settings-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    margin-top: var(--space-6);
    padding-top: var(--space-5);
    border-top: 1px solid var(--color-border-light);
}

.business-settings-last-update {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
}

.business-settings-last-update button {
    border: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
}

.business-settings-last-update button:hover {
    text-decoration: underline;
}

@media (max-width: 1200px) {
    .business-settings-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 900px) {
    .business-settings-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .business-settings-footer {
        flex-direction: column;
        align-items: flex-start;
    }
}

@media (max-width: 600px) {
    .business-settings-grid {
        grid-template-columns: 1fr;
    }
}
```

---

# 7) `src/features/settings/pages/SettingsPage.jsx`

```text
import toast from 'react-hot-toast'

import PageHeader from '../../../components/ui/PageHeader'
import ErrorState from '../../../components/ui/ErrorState'
import Spinner from '../../../components/ui/Spinner'

import { useSaveSettings, useSettings } from '../hooks/useSettings'

import PackageFormatsSection from '../components/PackageFormatsSection'
import BusinessSettingsSection from '../components/BusinessSettingsSection'

import './SettingsPage.css'

function SettingsPage() {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useSettings()

    const saveMutation = useSaveSettings()

    const settings = data?.data ?? []

    const handleSaveSettings = async changedSettings => {
        if (!changedSettings.length) {
            toast.success('Aucune modification à enregistrer')
            return
        }

        try {
            await saveMutation.mutateAsync(changedSettings)
            toast.success('Paramètres enregistrés avec succès')
        } catch (saveError) {
            toast.error(saveError.message || 'Erreur lors de la sauvegarde')
        }
    }

    if (isLoading) {
        return (
            <div className="settings-page-loading">
                <Spinner />
            </div>
        )
    }

    if (isError) {
        return (
            <ErrorState
                title="Impossible de charger les paramètres"
                message={error.message}
                onRetry={refetch}
            />
        )
    }

    return (
        <div className="settings-page">
            <PageHeader
                title="Formats et paramètres"
                description="Règles métier modifiables sans intervention technique · chaque modification est tracée"
            />

            <div className="settings-page-sections">
                <PackageFormatsSection />

                <BusinessSettingsSection
                    settings={settings}
                    loading={saveMutation.isPending}
                    onSave={handleSaveSettings}
                />
            </div>
        </div>
    )
}

export default SettingsPage
```

---

# 8) `src/features/settings/pages/SettingsPage.css`

```text
.settings-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
}

.settings-page-loading {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.settings-page-sections {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
}