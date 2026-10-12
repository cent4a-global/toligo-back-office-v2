import Button from '../../../components/ui/Button'

import PageHeader from '../../../components/ui/PageHeader'
import ErrorState from '../../../components/ui/ErrorState'
import PageSkeleton from '../../../components/ui/PageSkeleton'

import { useSaveSettings, useSettings } from '../hooks/useSettings'

import PackageFormatsSection from '../components/PackageFormatsSection'
import BusinessSettingsSection from '../components/BusinessSettingsSection'


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

    const handleSaveSettings = updates => saveMutation.mutateAsync(updates)

    if (isLoading) {
        return (
            <PageSkeleton />
        )
    }


    return (
        <div className="settings-page">
            <PageHeader
                title="Formats et paramètres"
                description="Consultez les formats de colis et ajustez les règles métier de Tôligo."
            />

            <div className="settings-page-sections">
                <PackageFormatsSection />

                {isError ? (
                    <ErrorState
                title="Impossible de charger les paramètres"
                description={error.message}
                action={<Button onClick={() => refetch()}>Réessayer</Button>}
            />
                ) : <BusinessSettingsSection
                    settings={settings}
                    loading={saveMutation.isPending}
                    onSave={handleSaveSettings}
                />}
            </div>
        </div>
    )
}

export default SettingsPage
