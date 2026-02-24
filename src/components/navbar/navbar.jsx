import { useState } from 'react';
import './navbar.css'
import { NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext';


function navbar() {
    const { language } = useLanguage();
    const location = useLocation()
    const isProjectsRoute = location.pathname.startsWith('/projetos')
    const isRepoRoute = location.pathname.startsWith('/repo')

    function scrollMainToBottom() {
        try {
            const top = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
            window.scrollTo({ top, behavior: 'smooth' })
        } catch (e) {
            // fallback
            window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight)
        }
    }

    return (
        <nav>
            <div className="nav nav-tabs" role="tablist">
                <NavLink to="/" onClick={scrollMainToBottom} className="nav-link" end>{language === 'pt' ? 'Perfil' : 'Profile'}</NavLink>
                <NavLink to="/projetos" onClick={scrollMainToBottom} className={(isProjectsRoute || isRepoRoute) ? 'nav-link active' : 'nav-link' }>{language === 'pt' ? 'Projetos' : 'Projects'}</NavLink>
                {/* highlight with bg only when inside repo explorer */}
                {isRepoRoute && (
                    <style>{`.nav .nav-link.active { background-color: var(--bs-light) !important; border-bottom: 2px solid var(--bs-light) !important; }`}</style>
                )}
                <NavLink to="/post" onClick={scrollMainToBottom} className="nav-link">{language === 'pt' ? 'Postagens' : 'Posts'}</NavLink>
                <NavLink to="/disabled" className="nav-link disabled">Disabled</NavLink>


            </div>
        </nav>
    )
}

export default navbar 
