'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
    isNavigating: boolean;
    setIsNavigating: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
    const [isNavigating, setIsNavigating] = useState(false);

    return (
        <NavigationContext.Provider value={{ isNavigating, setIsNavigating }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    // Return a no-op if context is not available (for components outside provider)
    if (!context) {
        return {
            isNavigating: false,
            setIsNavigating: () => {},
        };
    }
    return context;
}

