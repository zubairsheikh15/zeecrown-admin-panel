'use client';

import { useEffect } from 'react';
import { useNavigation } from './NavigationContext';

/**
 * Wrapper component that signals when page content is ready
 * Wrap your page content with this to ensure loading clears
 */
export default function PageContentWrapper({ children }: { children: React.ReactNode }) {
    const { setIsNavigating } = useNavigation();

    useEffect(() => {
        // Signal that content is mounted and ready
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [setIsNavigating]);

    return <>{children}</>;
}

