import { useState } from 'react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { useCommunes } from '../hooks/useCommunes'

export default function ZoneCommunesSelect({ value, onChange, existing = [], disabled = false }) {
    const { data = [], isPending, isError, error, refetch } = useCommunes()
    const [search, setSearch] = useState('')
    // Keep currently associated communes available even if absent from the latest list.
    const options = [
        ...new Map([...existing, ...data].map(commune => [commune.id, commune])).values(),
    ]
    const term = search.trim().toLocaleLowerCase('fr')
    const filtered = options.filter(commune =>
        `${commune.nom} ${commune.code ?? ''}`.toLocaleLowerCase('fr').includes(term),
    )

    return (
        <fieldset className="zone-communes" disabled={disabled}>
            <legend className="form-label">Communes associées</legend>
            <Input
                label="Filtrer les communes"
                name="zone-commune-search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Ex. Marcory"
                disabled={disabled}
            />
            {isPending && (
                <p className="zone-polygon-help" role="status">
                    Chargement des communes…
                </p>
            )}
            {isError && (
                <div className="zone-error" role="alert">
                    <p>{error.message}</p>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={disabled}>
                        Réessayer
                    </Button>
                </div>
            )}
            <div className="zone-communes-options">
                {filtered.map(commune => (
                    <label className="zone-commune-option" key={commune.id}>
                        <input
                            type="checkbox"
                            checked={value.includes(commune.id)}
                            disabled={disabled}
                            onChange={event =>
                                onChange(
                                    event.target.checked
                                        ? [...value, commune.id]
                                        : value.filter(id => id !== commune.id),
                                )
                            }
                        />
                        <span>
                            {commune.nom}
                            {commune.code && <small>{commune.code}</small>}
                        </span>
                    </label>
                ))}
                {!isPending && !isError && !filtered.length && (
                    <p className="zone-polygon-help">
                        {options.length
                            ? 'Aucune commune ne correspond à la recherche.'
                            : 'Aucune commune disponible.'}
                    </p>
                )}
            </div>
            <p className="zone-polygon-help" aria-live="polite">
                {value.length} commune(s) sélectionnée(s)
            </p>
        </fieldset>
    )
}
