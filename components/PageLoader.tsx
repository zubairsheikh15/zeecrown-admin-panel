'use client';

import { useEffect } from 'react';
import { useNavigation } from './NavigationContext';

export default function PageLoader() {
    const { setIsNavigating } = useNavigation();

    useEffect(() => {
        // Clear loading when component mounts (page is ready)
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 50);

        return () => clearTimeout(timer);
    }, [setIsNavigating]);

    return null;
}

