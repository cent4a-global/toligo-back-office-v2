import { useState } from 'react'

const Tabs = ({ tabs = [], defaultTab, onChange, className = '' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value)

    const handleChange = value => {
        setActiveTab(value)
        onChange?.(value)
    }

    return (
        <div className={`tabs ${className}`}>
            <div className="tabs-list">
                {tabs.map(tab => (
                    <button
                        key={tab.value}
                        type="button"
                        className={`tab ${activeTab === tab.value ? 'tab-active' : ''}`}
                        onClick={() => handleChange(tab.value)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tabs-content">{tabs.find(tab => tab.value === activeTab)?.content}</div>
        </div>
    )
}

export default Tabs
