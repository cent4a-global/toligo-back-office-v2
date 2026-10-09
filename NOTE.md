Oui. Ici on sépare bien **Station** et **Hub** :

```text
Station
└── contient plusieurs Hubs automatisés

Hub
├── code
├── statut
├── description
├── station
├── created_at
├── updated_at
└── archive_le
```

D’après ta réponse API, un hub ressemble à :

```js
{
    id: '01a0f82c-dd2e-719f-895a-58f4e97462d1',
    code: 'H1-004',
    statut: 'libre',
    description: 'Plateforme nord, zone de dégagement courte.',
    station: {
        id: '01a0f7e2-901b-729e-be43-8013ce32c8b5',
        code: 'ST-COC-01',
        nom: 'Station Cocody Centre',
    },
    created_at: '2026-10-01T15:54:44.000000Z',
    updated_at: '2026-10-01T15:58:17.000000Z',
    archive_le: null,
}
```

Je vais donc me baser exactement sur ces champs.

---

# Structure

```text
src/features/hubs/
├── api/
│   └── hubs.api.js
├── hooks/
│   └── useHubs.js
├── queries/
│   └── hubKeys.js
├── components/
│   ├── HubsTable.jsx
│   ├── HubsTable.css
│   ├── HubFormModal.jsx
│   ├── HubFormModal.css
│   └── DeleteHubDialog.jsx
└── pages/
    ├── HubsPage.jsx
    └── HubsPage.css
```

Je pars provisoirement sur :

```text
GET    /api/superadmin/hubs
GET    /api/superadmin/hubs/:id
POST   /api/superadmin/hubs
PUT    /api/superadmin/hubs/:id
DELETE /api/superadmin/hubs/:id
```

Tu remplaceras uniquement les URL si ton backend utilise d’autres routes.

---

# 1. `hubs.api.js`

```js
import api from '../../../lib/axios/api'

export async function getHubs() {
    try {
        const response = await api.get('/api/admin/hubs')

        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Erreur lors de la récupération des hubs'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function getHubById(id) {
    try {
        const response = await api.get(`/api/admin/hubs/${id}`)

        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Erreur lors de la récupération du hub'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function createHub(hubData) {
    try {
        const response = await api.post('/api/superadmin/hubs', hubData)

        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Erreur lors de la création du hub'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function updateHub(id, hubData) {
    try {
        const response = await api.put(`/api/superadmin/hubs/${id}`, hubData)

        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Erreur lors de la mise à jour du hub'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function deleteHub(id) {
    try {
        const response = await api.delete(`/api/superadmin/hubs/${id}`)

        const data = response.data

        if (data.success === false) {
            throw new Error(data.message || 'Impossible de supprimer ce hub')
        }

        return data
    } catch (error) {
        if (error.message && !error.response) {
            throw error
        }

        const message = error.response?.data?.message || 'Erreur lors de la suppression du hub'

        throw new Error(message, {
            cause: error,
        })
    }
}
```

---

# 2. `hubKeys.js`

```js
export const hubKeys = {
    all: ['hubs'],

    lists: () => [...hubKeys.all, 'list'],

    list: filters => [...hubKeys.lists(), { filters }],

    details: () => [...hubKeys.all, 'detail'],

    detail: id => [...hubKeys.details(), id],
}
```

---

# 3. `useHubs.js`

```js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createHub, deleteHub, getHubById, getHubs, updateHub } from '../api/hubs.api'

import { hubKeys } from '../queries/hubKeys'

export function useHubs() {
    return useQuery({
        queryKey: hubKeys.lists(),
        queryFn: getHubs,
    })
}

export function useHub(id) {
    return useQuery({
        queryKey: hubKeys.detail(id),

        queryFn: () => getHubById(id),

        enabled: Boolean(id),
    })
}

export function useCreateHub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createHub,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: hubKeys.lists(),
            })
        },
    })
}

export function useUpdateHub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateHub(id, data),

        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: hubKeys.lists(),
            })

            queryClient.invalidateQueries({
                queryKey: hubKeys.detail(variables.id),
            })
        },
    })
}

export function useDeleteHub() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteHub,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: hubKeys.lists(),
            })
        },
    })
}
```

---

# 4. `HubsTable.jsx`

Pour le tableau :

```text
Hub
Station
Statut
Description
Dernière modification
Actions
```

```jsx
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Dropdown from '../../../components/ui/Dropdown'

import './HubsTable.css'

const statusConfig = {
    libre: {
        label: 'Libre',
        variant: 'success',
    },

    occupe: {
        label: 'Occupé',
        variant: 'warning',
    },

    maintenance: {
        label: 'Maintenance',
        variant: 'danger',
    },

    indisponible: {
        label: 'Indisponible',
        variant: 'default',
    },
}

function HubsTable({ hubs = [], loading = false, onEdit, onDelete }) {
    const columns = [
        {
            key: 'code',
            label: 'Hub',

            render: hub => (
                <div className="hub-identity">
                    <strong>{hub.code}</strong>

                    <span>Hub automatisé</span>
                </div>
            ),
        },

        {
            key: 'station',
            label: 'Station',

            render: hub => (
                <div className="hub-station">
                    <strong>{hub.station?.nom ?? '—'}</strong>

                    {hub.station?.code && <span>{hub.station.code}</span>}
                </div>
            ),
        },

        {
            key: 'statut',
            label: 'Statut',

            render: hub => {
                const status = statusConfig[hub.statut] ?? statusConfig.indisponible

                return (
                    <Badge variant={status.variant} size="sm">
                        {status.label}
                    </Badge>
                )
            },
        },

        {
            key: 'description',
            label: 'Description',

            render: hub => <span className="hub-description">{hub.description || '—'}</span>,
        },

        {
            key: 'updated_at',
            label: 'Dernière modification',

            render: hub => <span className="hub-date">{formatDate(hub.updated_at)}</span>,
        },

        {
            key: 'actions',
            label: 'Actions',

            render: hub => (
                <Dropdown
                    trigger={
                        <button type="button" className="hub-actions-trigger">
                            <i className="fi fi-rr-menu-dots"></i>
                        </button>
                    }
                    items={[
                        {
                            label: 'Modifier',

                            onClick: () => onEdit?.(hub),
                        },

                        {
                            label: 'Supprimer',
                            danger: true,

                            onClick: () => onDelete?.(hub),
                        },
                    ]}
                />
            ),
        },
    ]

    return (
        <div className="hubs-table">
            <Table
                columns={columns}
                data={hubs}
                loading={loading}
                emptyMessage="Aucun hub disponible"
            />
        </div>
    )
}

function formatDate(date) {
    if (!date) {
        return '—'
    }

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date))
}

export default HubsTable
```

---

# 5. `HubsTable.css`

```css
.hubs-table {
    width: 100%;
}

.hub-identity,
.hub-station {
    display: flex;
    flex-direction: column;

    gap: var(--space-1);
}

.hub-identity strong,
.hub-station strong {
    color: var(--color-text-primary);

    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
}

.hub-identity span,
.hub-station span {
    color: var(--color-text-secondary);

    font-size: var(--font-size-xs);
}

.hub-description {
    display: inline-block;

    max-width: 320px;

    overflow: hidden;

    color: var(--color-text-secondary);

    text-overflow: ellipsis;
    white-space: nowrap;
}

.hub-date {
    color: var(--color-text-secondary);

    font-size: var(--font-size-sm);

    white-space: nowrap;
}

.hub-actions-trigger {
    width: 36px;
    height: 36px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: 0;
    border-radius: var(--radius-md);

    background: transparent;
    color: var(--color-text-secondary);

    cursor: pointer;
}

.hub-actions-trigger:hover {
    background: var(--color-bg-hover);
    color: var(--color-text-primary);
}
```

---

# 6. `HubFormModal.jsx`

Ici le Hub dépend obligatoirement d’une Station.

```jsx
import { useEffect, useState } from 'react'

import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

import './HubFormModal.css'

const initialForm = {
    code: '',
    station_id: '',
    statut: 'libre',
    description: '',
}

function HubFormModal({ open, hub, stations = [], loading = false, onClose, onSubmit }) {
    const [form, setForm] = useState(initialForm)

    useEffect(() => {
        if (!hub) {
            setForm(initialForm)
            return
        }

        setForm({
            code: hub.code ?? '',

            station_id: hub.station?.id ?? '',

            statut: hub.statut ?? 'libre',

            description: hub.description ?? '',
        })
    }, [hub, open])

    const handleChange = event => {
        const { name, value } = event.target

        setForm(previous => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleSubmit = event => {
        event.preventDefault()

        onSubmit?.(form)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={hub ? 'Modifier le hub' : 'Ajouter un hub'}
            size="md">
            <form className="hub-form" onSubmit={handleSubmit}>
                <Input
                    label="Code du hub"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Ex. H1-004"
                    required
                />

                <Select
                    label="Station"
                    name="station_id"
                    value={form.station_id}
                    onChange={handleChange}
                    options={stations.map(station => ({
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
                    <label htmlFor="description">Description</label>

                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Ex. Plateforme nord, zone de dégagement courte."
                        rows="4"
                    />
                </div>

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
```

---

# 7. `HubFormModal.css`

```css
.hub-form {
    display: flex;
    flex-direction: column;

    gap: var(--space-5);
}

.hub-form-group {
    display: flex;
    flex-direction: column;

    gap: var(--space-2);
}

.hub-form-group label {
    color: var(--color-text-primary);

    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
}

.hub-form-group textarea {
    width: 100%;
    min-height: 120px;

    padding: var(--space-3) var(--space-4);

    resize: vertical;

    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);

    outline: none;

    background: var(--color-bg-surface);
    color: var(--color-text-primary);

    font-size: var(--font-size-sm);
    font-family: var(--font-family-base);
}

.hub-form-group textarea::placeholder {
    color: var(--color-text-muted);
}

.hub-form-group textarea:focus {
    border-color: var(--color-text-primary);
}

.hub-form-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    gap: var(--space-3);
}

@media (max-width: 600px) {
    .hub-form-actions {
        flex-direction: column-reverse;
    }

    .hub-form-actions .btn {
        width: 100%;
    }
}
```

---

# 8. `DeleteHubDialog.jsx`

```jsx
import ConfirmDialog from '../../../components/ui/ConfirmDialog'

function DeleteHubDialog({ hub, loading = false, onClose, onConfirm }) {
    return (
        <ConfirmDialog
            open={Boolean(hub)}
            title="Supprimer le hub"
            message={hub ? `Voulez-vous vraiment supprimer le hub « ${hub.code} » ?` : ''}
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            variant="danger"
            loading={loading}
            onCancel={onClose}
            onConfirm={onConfirm}
        />
    )
}

export default DeleteHubDialog
```

---

# 9. `HubsPage.jsx`

On récupère les stations pour le formulaire.

```jsx
import { useState } from 'react'

import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import StatCard from '../../../components/ui/StatCard'
import ErrorState from '../../../components/ui/ErrorState'

import { useCreateHub, useDeleteHub, useHubs, useUpdateHub } from '../hooks/useHubs'

import { useStations } from '../../stations/hooks/useStations'

import HubsTable from '../components/HubsTable'
import HubFormModal from '../components/HubFormModal'
import DeleteHubDialog from '../components/DeleteHubDialog'

import './HubsPage.css'

function HubsPage() {
    const { data, isLoading, isError, error, refetch } = useHubs()

    const { data: stationsData } = useStations()

    const createMutation = useCreateHub()

    const updateMutation = useUpdateHub()

    const deleteMutation = useDeleteHub()

    const [formModal, setFormModal] = useState({
        open: false,
        hub: null,
    })

    const [hubToDelete, setHubToDelete] = useState(null)

    const hubs = data?.data ?? []

    const stations = stationsData?.data ?? []

    const openCreateModal = () => {
        setFormModal({
            open: true,
            hub: null,
        })
    }

    const openEditModal = hub => {
        setFormModal({
            open: true,
            hub,
        })
    }

    const closeFormModal = () => {
        setFormModal({
            open: false,
            hub: null,
        })
    }

    const handleSubmit = async formData => {
        if (formModal.hub) {
            await updateMutation.mutateAsync({
                id: formModal.hub.id,

                data: formData,
            })
        } else {
            await createMutation.mutateAsync(formData)
        }

        closeFormModal()
    }

    const handleDelete = async () => {
        if (!hubToDelete) {
            return
        }

        await deleteMutation.mutateAsync(hubToDelete.id)

        setHubToDelete(null)
    }

    if (isError) {
        return (
            <ErrorState
                title="Impossible de charger les hubs"
                message={error.message}
                onRetry={refetch}
            />
        )
    }

    const freeHubs = hubs.filter(hub => hub.statut === 'libre').length

    const maintenanceHubs = hubs.filter(hub => hub.statut === 'maintenance').length

    return (
        <div className="hubs-page">
            <PageHeader
                title="Hubs drone"
                description="Gérez les plateformes automatisées de décollage, d’atterrissage et de recharge des drones."
                action={
                    <Button onClick={openCreateModal}>
                        <i className="fi fi-rr-plus"></i>
                        Ajouter un hub
                    </Button>
                }
            />

            <div className="hubs-stats">
                <StatCard label="Hubs" value={hubs.length} />

                <StatCard label="Hubs libres" value={freeHubs} />

                <StatCard label="En maintenance" value={maintenanceHubs} />

                <StatCard label="Stations" value={stations.length} />
            </div>

            <HubsTable
                hubs={hubs}
                loading={isLoading}
                onEdit={openEditModal}
                onDelete={setHubToDelete}
            />

            <HubFormModal
                open={formModal.open}
                hub={formModal.hub}
                stations={stations}
                loading={createMutation.isPending || updateMutation.isPending}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
            />

            <DeleteHubDialog
                hub={hubToDelete}
                loading={deleteMutation.isPending}
                onClose={() => setHubToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default HubsPage
```

---

# 10. `HubsPage.css`

```css
.hubs-page {
    display: flex;
    flex-direction: column;

    gap: var(--space-6);
}

.hubs-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    gap: var(--space-4);
}

@media (max-width: 1100px) {
    .hubs-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .hubs-stats {
        grid-template-columns: 1fr;
    }
}
```
