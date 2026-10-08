import PageHeader from '../components/ui/PageHeader'

function PageScaffold({ title, description }) {
    return (
        <section className="page-scaffold">
            <PageHeader title={title} description={description} />
            <p className="page-scaffold-message">Cette page est prête à être complétée.</p>
        </section>
    )
}

export default PageScaffold
