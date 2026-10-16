import { useEffect, useId, useRef, useState } from 'react'
import { MapPin, Maximize2, Minimize2 } from 'lucide-react'
import Button from './Button'

export default function MapViewer({ label, children }) {
    const [visible, setVisible] = useState(false)
    const [fullscreen, setFullscreen] = useState(false)
    const id = useId()
    const fullscreenButton = useRef(null)

    useEffect(() => {
        if (!fullscreen) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        fullscreenButton.current?.focus()
        const handleKey = event => {
            if (event.key === 'Escape') {
                setFullscreen(false)
                fullscreenButton.current?.focus()
            }
        }
        document.addEventListener('keydown', handleKey)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKey)
        }
    }, [fullscreen])

    return (
        <section className={`map-viewer${fullscreen ? ' map-viewer-fullscreen' : ''}`} aria-label={label}>
            <div className="map-viewer-toolbar">
                <Button variant="secondary" size="md" aria-expanded={visible} aria-controls={id} onClick={() => {
                    setVisible(previous => !previous)
                    setFullscreen(false)
                }}>
                    <MapPin size={18} aria-hidden="true" />
                    {visible ? 'Masquer la carte' : 'Visualiser sur la carte'}
                </Button>
                {visible && <button ref={fullscreenButton} type="button" className="btn btn-secondary btn-md"
                    aria-pressed={fullscreen} onClick={() => setFullscreen(previous => !previous)}>
                    {fullscreen ? <Minimize2 size={18} aria-hidden="true" /> : <Maximize2 size={18} aria-hidden="true" />}
                    {fullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                </button>}
            </div>
            <div id={id} className="map-viewer-content" hidden={!visible}>
                {visible && children}
            </div>
        </section>
    )
}
