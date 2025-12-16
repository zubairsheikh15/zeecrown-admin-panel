'use client';

import { useEffect, useState } from 'react';
import { useNavigation } from './NavigationContext';

export default function PageLoader() {
    const { setIsNavigating } = useNavigation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Clear loading when component mounts (page is ready)
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 50);

        return () => clearTimeout(timer);
    }, [setIsNavigating]);

    return null;
}

