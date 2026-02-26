import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        const contentDiv = document.getElementById('main-content-scroll');
        if (contentDiv) {
            contentDiv.scrollTop = 0;
        }
    }, [pathname]);
    return null;
}

export default ScrollToTop;