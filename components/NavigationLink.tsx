'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useNavigation } from './NavigationContext';

interface NavigationLinkProps {
    href: string;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    icon?: ReactNode;
}

export default function NavigationLink({ 
    href, 
    children, 
    onClick, 
    className = '',
    icon 
}: NavigationLinkProps) {
    const pathname = usePathname();
    const navigation = useNavigation();
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));

    const handleClick = () => {
        // Only trigger global loader if navigating to a different route
        if (pathname !== href) {
            navigation.setIsNavigating(true);
        }
        onClick?.();
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            prefetch={true}
            className={`group flex items-center p-3 text-gray-300 rounded-lg hover:bg-white/5 transition-all duration-200 relative ${isActive ? 'bg-white/10 text-white' : ''} ${className}`}
        >
            {icon && (
                <span className={`mr-4 ${isActive ? 'text-green-400' : 'text-green-400'}`}>
                    {icon}
                </span>
            )}
            <span className="font-semibold text-lg">{children}</span>
        </Link>
    );
}

