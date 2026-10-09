POST
{
"success": true,
"data": {
"id": "01a0f7e2-901b-729e-be43-8013ce32c8b5",
"code": "ST-COC-01",
"nom": "Station Cocody Centre",
"commune": {
"id": "01a0f266-6229-7118-be8c-b13f8d2bf4b7",
"nom": "Yopougon"
},
"entrepot_id": null,
"adresse": "Boulevard Latrille, face à la pharmacie",
"repere": "Immeuble bleu, rez-de-chaussée",
"latitude": 5.36,
"longitude": -3.99,
"statut": "operationnelle",
"horaires": {
"lundi_vendredi": "07:00-19:00",
"samedi": "08:00-16:00"
},
"description": "Station principale du secteur Cocody.",
"created_at": "2026-10-01T14:33:35.000000Z",
"updated_at": "2026-10-01T14:33:35.000000Z",
"archive_le": null
},
"message": "Station ajoutée avec succès."
}

On passe au CRUD des **stations / hubs drone**.

Comme tu ne m’as pas encore donné l’ancien service backend des stations, je vais garder la même architecture que `warehouses` et `zones`, avec des endpoints provisoires à adapter ensuite.

Je pars sur une station avec ces informations :

```text
Nom
Code
Zone
Adresse
Latitude
Longitude
Statut
Capacité drones
Responsable
```

Structure :

```text
src/features/stations/
├── api/
│   └── stations.api.js
├── hooks/
│   └── useStations.js
├── queries/
│   └── stationKeys.js
├── components/
│   ├── StationsTable.jsx
│   ├── StationsTable.css
│   ├── StationFormModal.jsx
│   ├── StationFormModal.css
│   └── DeleteStationDialog.jsx
└── pages/
    ├── StationsPage.jsx
    └── StationsPage.css
```

## 1. `stations.api.js`

```js
import api from '../../../lib/axios/api'

export async function getStations() {
    try {
        const response = await api.get('/api/superadmin/stations')

        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message || 'Erreur lors de la récupération des stations'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function getStationById(id) {
    try {
        const response = await api.get(`/api/superadmin/stations/${id}`)

        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message || 'Erreur lors de la récupération de la station'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function createStation(stationData) {
    try {
        const response = await api.post('/api/superadmin/stations', stationData)

        return response.data
    } catch (error) {
        const message = error.response?.data?.message || 'Erreur lors de la création de la station'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function updateStation(id, stationData) {
    try {
        const response = await api.put(`/api/superadmin/stations/${id}`, stationData)

        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message || 'Erreur lors de la mise à jour de la station'

        throw new Error(message, {
            cause: error,
        })
    }
}

export async function deleteStation(id) {
    try {
        const response = await api.delete(`/api/supersuperadmin/stations/${id}`)

        const data = response.data

        if (data.success === false) {
            throw new Error(data.message || 'Impossible de supprimer cette station')
        }

        return data
    } catch (error) {
        if (error.message && !error.response) {
            throw error
        }

        const message =
            error.response?.data?.message || 'Erreur lors de la suppression de la station'

        throw new Error(message, {
            cause: error,
        })
    }
}
```

---

## 2. `stationKeys.js`

```js
export const stationKeys = {
    all: ['stations'],

    lists: () => [...stationKeys.all, 'list'],

    list: filters => [...stationKeys.lists(), { filters }],

    details: () => [...stationKeys.all, 'detail'],

    detail: id => [...stationKeys.details(), id],
}
```

---

## 3. `useStations.js`

```js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
    createStation,
    deleteStation,
    getStationById,
    getStations,
    updateStation,
} from '../api/stations.api'

import { stationKeys } from '../queries/stationKeys'

export function useStations() {
    return useQuery({
        queryKey: stationKeys.lists(),
        queryFn: getStations,
    })
}

export function useStation(id) {
    return useQuery({
        queryKey: stationKeys.detail(id),

        queryFn: () => getStationById(id),

        enabled: Boolean(id),
    })
}

export function useCreateStation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createStation,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: stationKeys.lists(),
            })
        },
    })
}

export function useUpdateStation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateStation(id, data),

        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({
                queryKey: stationKeys.lists(),
            })

            queryClient.invalidateQueries({
                queryKey: stationKeys.detail(variables.id),
            })
        },
    })
}

export function useDeleteStation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteStation,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: stationKeys.lists(),
            })
        },
    })
}
```

---

# 4. `StationsTable.jsx`

Je propose ces colonnes :

```text
Station
Zone
Adresse
Responsable
Drones
Statut
Actions
```

```jsx
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Dropdown from '../../../components/ui/Dropdown'

import './StationsTable.css'

function StationsTable({ stations = [], loading = false, onEdit, onDelete }) {
    const columns = [
        {
            key: 'name',
            label: 'Station',

            render: station => (
                <div className="station-identity">
                    <strong>{station.name}</strong>

                    {station.code && <span>{station.code}</span>}
                </div>
            ),
        },

        {
            key: 'zone',
            label: 'Zone',

            render: station => station.zone?.name ?? station.zone ?? '—',
        },

        {
            key: 'address',
            label: 'Adresse',

            render: station => <span className="station-address">{station.address || '—'}</span>,
        },

        {
            key: 'manager',
            label: 'Responsable',

            render: station => {
                const manager = station.manager

                if (!manager) {
                    return <span className="station-empty">Non affecté</span>
                }

                return (
                    <div className="station-manager">
                        <strong>{manager.name}</strong>

                        {manager.email && <span>{manager.email}</span>}
                    </div>
                )
            },
        },

        {
            key: 'drones',
            label: 'Drones',

            render: station => (
                <span className="station-drone-count">
                    {station.dronesCount ?? station.drones?.length ?? 0}
                </span>
            ),
        },

        {
            key: 'status',
            label: 'Statut',

            render: station => (
                <Badge variant={station.status === 'active' ? 'success' : 'default'} size="sm">
                    {station.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },

        {
            key: 'actions',
            label: 'Actions',

            render: station => (
                <Dropdown
                    trigger={
                        <button type="button" className="station-actions-trigger">
                            <i className="fi fi-rr-menu-dots"></i>
                        </button>
                    }
                    items={[
                        {
                            label: 'Modifier',

                            onClick: () => onEdit?.(station),
                        },

                        {
                            label: 'Supprimer',
                            danger: true,

                            onClick: () => onDelete?.(station),
                        },
                    ]}
                />
            ),
        },
    ]

    return (
        <div className="stations-table">
            <Table
                columns={columns}
                data={stations}
                loading={loading}
                emptyMessage="Aucune station disponible"
            />
        </div>
    )
}

export default StationsTable
```

---

# 5. `StationsTable.css`

```css
.stations-table {
    width: 100%;
}

.station-identity,
.station-manager {
    display: flex;
    flex-direction: column;

    gap: var(--space-1);
}

.station-identity strong,
.station-manager strong {
    color: var(--color-text-primary);

    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
}

.station-identity span,
.station-manager span {
    color: var(--color-text-secondary);

    font-size: var(--font-size-xs);
}

.station-address {
    display: inline-block;

    max-width: 250px;

    overflow: hidden;

    color: var(--color-text-secondary);

    text-overflow: ellipsis;
    white-space: nowrap;
}

.station-empty {
    color: var(--color-text-muted);

    font-size: var(--font-size-sm);
}

.station-drone-count {
    min-width: 32px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: var(--space-1) var(--space-2);

    border-radius: var(--radius-md);

    background: var(--color-bg-hover);
    color: var(--color-text-primary);

    font-weight: var(--font-weight-semibold);
}

.station-actions-trigger {
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

.station-actions-trigger:hover {
    background: var(--color-bg-hover);
    color: var(--color-text-primary);
}
```

---

# 6. `StationFormModal.jsx`

Ici, la station peut être liée à une zone.

Je laisse `zones` en props pour que le composant ne fasse pas lui-même les appels API.

```jsx
import { useEffect, useState } from 'react'

import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

import './StationFormModal.css'

const initialForm = {
    name: '',
    code: '',
    zoneId: '',
    address: '',
    latitude: '',
    longitude: '',
    droneCapacity: '',
    status: 'active',
}

function StationFormModal({ open, station, zones = [], loading = false, onClose, onSubmit }) {
    const [form, setForm] = useState(initialForm)

    useEffect(() => {
        if (!station) {
            setForm(initialForm)
            return
        }

        setForm({
            name: station.name ?? '',

            code: station.code ?? '',

            zoneId: station.zone?.id ?? station.zoneId ?? '',

            address: station.address ?? '',

            latitude: station.latitude ?? '',

            longitude: station.longitude ?? '',

            droneCapacity: station.droneCapacity ?? '',

            status: station.status ?? 'active',
        })
    }, [station, open])

    const handleChange = event => {
        const { name, value } = event.target

        setForm(previous => ({
            ...previous,
            [name]: value,
        }))
    }

    const handleSubmit = event => {
        event.preventDefault()

        const payload = {
            ...form,

            droneCapacity: form.droneCapacity ? Number(form.droneCapacity) : null,

            latitude: form.latitude ? Number(form.latitude) : null,

            longitude: form.longitude ? Number(form.longitude) : null,
        }

        onSubmit?.(payload)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={station ? 'Modifier la station' : 'Ajouter une station'}
            size="lg">
            <form className="station-form" onSubmit={handleSubmit}>
                <div className="station-form-row">
                    <Input
                        label="Nom de la station"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ex. Hub Cocody"
                        required
                    />

                    <Input
                        label="Code"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="Ex. HUB-COC-01"
                        required
                    />
                </div>

                <Select
                    label="Zone"
                    name="zoneId"
                    value={form.zoneId}
                    onChange={handleChange}
                    options={zones.map(zone => ({
                        value: zone.id,
                        label: zone.name,
                    }))}
                />

                <Input
                    label="Adresse"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Adresse de la station"
                    required
                />

                <div className="station-form-row">
                    <Input
                        label="Latitude"
                        name="latitude"
                        type="number"
                        value={form.latitude}
                        onChange={handleChange}
                        placeholder="5.3599"
                    />

                    <Input
                        label="Longitude"
                        name="longitude"
                        type="number"
                        value={form.longitude}
                        onChange={handleChange}
                        placeholder="-4.0083"
                    />
                </div>

                <Input
                    label="Capacité maximale de drones"
                    name="droneCapacity"
                    type="number"
                    value={form.droneCapacity}
                    onChange={handleChange}
                    placeholder="Ex. 10"
                />

                <Select
                    label="Statut"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'active',
                            label: 'Active',
                        },
                        {
                            value: 'inactive',
                            label: 'Inactive',
                        },
                    ]}
                />

                <div className="station-form-actions">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
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

export default StationFormModal
```

---

# 7. `StationFormModal.css`

```css
.station-form {
    display: flex;
    flex-direction: column;

    gap: var(--space-5);
}

.station-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;

    gap: var(--space-4);
}

.station-form-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    gap: var(--space-3);

    padding-top: var(--space-2);
}

@media (max-width: 650px) {
    .station-form-row {
        grid-template-columns: 1fr;
    }

    .station-form-actions {
        flex-direction: column-reverse;
    }

    .station-form-actions .btn {
        width: 100%;
    }
}
```

---

# 8. `DeleteStationDialog.jsx`

```jsx
import ConfirmDialog from '../../../components/ui/ConfirmDialog'

function DeleteStationDialog({ station, loading = false, onClose, onConfirm }) {
    return (
        <ConfirmDialog
            open={Boolean(station)}
            title="Supprimer la station"
            message={
                station
                    ? `Voulez-vous vraiment supprimer la station « ${station.name} » ? Cette suppression peut être refusée si des drones, missions ou batteries y sont encore associés.`
                    : ''
            }
            confirmLabel="Supprimer"
            cancelLabel="Annuler"
            variant="danger"
            loading={loading}
            onCancel={onClose}
            onConfirm={onConfirm}
        />
    )
}

export default DeleteStationDialog
```

---

# 9. `StationsPage.jsx`

On récupère aussi les zones existantes afin de remplir le formulaire.

```jsx
import { useState } from 'react'

import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import StatCard from '../../../components/ui/StatCard'
import ErrorState from '../../../components/ui/ErrorState'

import {
    useCreateStation,
    useDeleteStation,
    useStations,
    useUpdateStation,
} from '../hooks/useStations'

import { useZones } from '../../zones/hooks/useZones'

import StationsTable from '../components/StationsTable'
import StationFormModal from '../components/StationFormModal'
import DeleteStationDialog from '../components/DeleteStationDialog'

import './StationsPage.css'

function StationsPage() {
    const { data, isLoading, isError, error, refetch } = useStations()

    const { data: zonesData } = useZones()

    const createMutation = useCreateStation()

    const updateMutation = useUpdateStation()

    const deleteMutation = useDeleteStation()

    const [formModal, setFormModal] = useState({
        open: false,
        station: null,
    })

    const [stationToDelete, setStationToDelete] = useState(null)

    const stations = data?.data ?? []

    const zones = zonesData?.data ?? []

    const openCreateModal = () => {
        setFormModal({
            open: true,
            station: null,
        })
    }

    const openEditModal = station => {
        setFormModal({
            open: true,
            station,
        })
    }

    const closeFormModal = () => {
        setFormModal({
            open: false,
            station: null,
        })
    }

    const handleSubmit = async formData => {
        if (formModal.station) {
            await updateMutation.mutateAsync({
                id: formModal.station.id,

                data: formData,
            })
        } else {
            await createMutation.mutateAsync(formData)
        }

        closeFormModal()
    }

    const handleDelete = async () => {
        if (!stationToDelete) {
            return
        }

        await deleteMutation.mutateAsync(stationToDelete.id)

        setStationToDelete(null)
    }

    if (isError) {
        return (
            <ErrorState
                title="Impossible de charger les stations"
                message={error.message}
                onRetry={refetch}
            />
        )
    }

    return (
        <div className="stations-page">
            <PageHeader
                title="Stations et hubs"
                description="Gérez les stations drone et les hubs logistiques de Tôligo."
                action={
                    <Button onClick={openCreateModal}>
                        <i className="fi fi-rr-plus"></i>
                        Ajouter une station
                    </Button>
                }
            />

            <div className="stations-stats">
                <StatCard label="Stations" value={data?.meta?.totalStations ?? stations.length} />

                <StatCard label="Stations actives" value={data?.meta?.activeStations ?? '—'} />

                <StatCard label="Drones" value={data?.meta?.totalDrones ?? '—'} />

                <StatCard label="Drones disponibles" value={data?.meta?.availableDrones ?? '—'} />
            </div>

            <StationsTable
                stations={stations}
                loading={isLoading}
                onEdit={openEditModal}
                onDelete={setStationToDelete}
            />

            <StationFormModal
                open={formModal.open}
                station={formModal.station}
                zones={zones}
                loading={createMutation.isPending || updateMutation.isPending}
                onClose={closeFormModal}
                onSubmit={handleSubmit}
            />

            <DeleteStationDialog
                station={stationToDelete}
                loading={deleteMutation.isPending}
                onClose={() => setStationToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default StationsPage
```

---

# 10. `StationsPage.css`

```css
.stations-page {
    display: flex;
    flex-direction: column;

    gap: var(--space-6);
}

.stations-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    gap: var(--space-4);
}

@media (max-width: 1100px) {
    .stations-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .stations-stats {
        grid-template-columns: 1fr;
    }
}
```

---

# 11. Router

```jsx
import StationsPage from '../../features/stations/pages/StationsPage'
```

Puis :

```jsx
<Route path="/stations" element={<StationsPage />} />
```

Et ta sidebar avait déjà la logique :

```js
{
    label: 'Stations et drones',
    to: '/stations',
    icon: 'fi-rr-drone',
}

```
