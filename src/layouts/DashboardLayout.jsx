import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [animating, setAnimating] = useState(false)
    const animationTimer = useRef(null)
    const menuButtonRef = useRef(null)
    const { pathname } = useLocation()

    const animateToggle = () => {
        clearTimeout(animationTimer.current)
        setAnimating(true)
        animationTimer.current = setTimeout(() => setAnimating(false), 200)
    }

    useEffect(() => {
        const stopAnimation = () => {
            clearTimeout(animationTimer.current)
            setAnimating(false)
        }
        window.addEventListener('resize', stopAnimation)
        return () => {
            window.removeEventListener('resize', stopAnimation)
            clearTimeout(animationTimer.current)
        }
    }, [])

    const closeMenu = () => {
        setMobileOpen(false)
        if (mobileOpen) menuButtonRef.current?.focus()
    }

    useEffect(() => {
        if (!mobileOpen) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const onKeyDown = event => {
            if (event.key === 'Escape') {
                setMobileOpen(false)
                menuButtonRef.current?.focus()
            }
        }
        const media = window.matchMedia('(max-width: 700px)')
        const onResize = () => {
            if (!media.matches) setMobileOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)
        media.addEventListener('change', onResize)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', onKeyDown)
            media.removeEventListener('change', onResize)
        }
    }, [mobileOpen])


    return (
        <div className="dashboard-layout">
            {mobileOpen && (
                <button className="sidebar-backdrop" onClick={closeMenu} aria-label="Fermer le menu" />
            )}
            <Sidebar
                currentPath={pathname}
                collapsed={collapsed}
                animating={animating}
                mobileOpen={mobileOpen}
                onClose={closeMenu}
                onToggleCollapse={() => {
                    animateToggle()
                    setCollapsed(value => !value)
                }}
            />
            <div className="dashboard-content">
                <Header
                    onMenuClick={() => {
                        animateToggle()
                        setMobileOpen(open => !open)
                    }}
                    mobileOpen={mobileOpen}
                    menuButtonRef={menuButtonRef}
                />
                <main className="dashboard-main">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
