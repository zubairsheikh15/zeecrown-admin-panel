'use client';

import { useEffect, useState } from 'react';

interface RouteTransitionLoaderProps {
    isLoading?: boolean;
}

export default function RouteTransitionLoader({ isLoading = true }: RouteTransitionLoaderProps) {
    const [showLoader, setShowLoader] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isLoading) {
            // Show immediately for better UX
            setShowLoader(true);
        } else {
            // Fade out smoothly
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!mounted || !showLoader) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center transition-opacity duration-200"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-emerald-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
                </div>
                <p className="text-white/90 text-sm font-medium animate-pulse">Loading page...</p>
            </div>
        </div>
    );
}

