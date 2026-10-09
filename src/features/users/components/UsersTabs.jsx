
const tabs = [
    {
        key: 'internal',
        label: 'Équipe interne',
    },
    {
        key: 'drivers',
        label: 'Livreurs',
    },
    {
        key: 'clients',
        label: 'Clients',
    },
    {
        key: 'companies',
        label: 'Entreprises',
    },
]

function UsersTabs({ activeTab, onChange, counts = {} }) {
    return (
        <div className="users-tabs">
            {tabs.map(tab => {
                const isActive = activeTab === tab.key
                const count = counts[tab.key]

                return (
                    <button
                        key={tab.key}
                        type="button"
                        className={`users-tab${isActive ? ' users-tab-active' : ''}`}
                        aria-pressed={isActive}
                        onClick={() => onChange?.(tab.key)}>
                        <span>{tab.label}</span>

                        {count !== undefined && <span className="users-tab-count">{count}</span>}
                    </button>
                )
            })}
        </div>
    )
}

export default UsersTabs
