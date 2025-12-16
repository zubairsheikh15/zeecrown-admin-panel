'use client';

import { useEffect } from 'react';

/**
 * Component that signals when a page is ready
 * Place this at the end of your page components
 */
export default function PageReady() {
    useEffect(() => {
        // Signal that page content is ready
        const event = new CustomEvent('page-ready');
        window.dispatchEvent(event);
    }, []);

    return null;
}

