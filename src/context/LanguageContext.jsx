import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // Initialize language from localStorage when available, otherwise default to 'pt'
    const [language, setLanguage] = useState(() => {
        try {
            const stored = localStorage.getItem('language')
            return stored || 'pt'
        } catch (e) {
            return 'pt'
        }
    }); // 'pt' ou 'en'

    const toggleLanguage = (lang) => {
        try {
            localStorage.setItem('language', lang)
        } catch (e) {
            // ignore
        }
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
