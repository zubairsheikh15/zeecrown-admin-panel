'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Bell,
    Menu,
    X,
    ImageIcon,
    Truck,
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import NavigationLink from '@/components/NavigationLink';
import RouteTransitionLoader from '@/components/RouteTransitionLoader';
import { NavigationProvider, useNavigation } from '@/components/NavigationContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
    const { isNavigating, setIsNavigating } = useNavigation();
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);

    useEffect(() => {
        // Show loading when route changes
        if (prevPathname !== pathname) {
            setPrevPathname(pathname);
            setIsNavigating(true);
            
            let cleared = false;
            
            const clearLoading = () => {
                if (!cleared) {
                    cleared = true;
                    setIsNavigating(false);
                }
            };
            
            // Multiple quick checks to detect content
            const checkContent = () => {
                const mainContent = document.querySelector('main > div');
                if (mainContent) {
                    // Very lenient - any sign of content
                    return mainContent.children.length > 0 || 
                           (mainContent.textContent && mainContent.textContent.trim().length > 5) ||
                           mainContent.innerHTML.length > 30;
                }
                return false;
            };
            
            // Quick periodic check
            let checkCount = 0;
            const checkInterval = setInterval(() => {
                checkCount++;
                if (checkContent() || checkCount >= 6) {
                    clearInterval(checkInterval);
                    clearLoading();
                }
            }, 80);
            
            // Immediate checks with RAF
            const doRAFCheck = () => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (checkContent()) {
                            clearInterval(checkInterval);
                            clearLoading();
                        }
                    });
                });
            };
            
            setTimeout(doRAFCheck, 30);
            setTimeout(doRAFCheck, 100);
            setTimeout(doRAFCheck, 200);
            
            // Listen for page ready event
            const handlePageReady = () => {
                clearInterval(checkInterval);
                clearLoading();
            };
            window.addEventListener('page-ready', handlePageReady);
            
            // Absolute fallback - clear after 600ms max
            const fallbackTimer = setTimeout(() => {
                clearInterval(checkInterval);
                window.removeEventListener('page-ready', handlePageReady);
                clearLoading();
            }, 600);
            
            return () => {
                clearInterval(checkInterval);
                clearTimeout(fallbackTimer);
                window.removeEventListener('page-ready', handlePageReady);
            };
        }
    }, [pathname, prevPathname, setIsNavigating]);
    
    // Safety check: Clear stuck loading states
    useEffect(() => {
        if (isNavigating) {
            // After 500ms, force clear if content exists
            const safetyTimer = setTimeout(() => {
                const mainContent = document.querySelector('main > div');
                // If there's any content at all, clear the loading
                if (mainContent && (
                    mainContent.children.length > 0 || 
                    mainContent.textContent ||
                    mainContent.innerHTML.length > 20
                )) {
                    setIsNavigating(false);
                }
            }, 500);
            
            // Absolute fallback - always clear after 800ms
            const forceClearTimer = setTimeout(() => {
                setIsNavigating(false);
            }, 800);
            
            return () => {
                clearTimeout(safetyTimer);
                clearTimeout(forceClearTimer);
            };
        }
    }, [isNavigating, setIsNavigating]);

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            {/* --- Sidebar --- */}
            <aside
                className={`absolute h-full w-80 bg-black text-white border-r border-green-900/50 transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* ... (all your sidebar code remains the same) ... */}
                <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* --- Header --- */}
                    <div className="mb-10 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <Package size={24} className="text-black" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-white">Admin Panel</h1>
                                <p className="text-green-300/80 text-sm font-medium">
                                    Zee Crown
                                </p>
                            </div>
                        </div>

                        {/* --- Close button (visible when sidebar open) --- */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-green-400 transition-transform transform hover:scale-110"
                            title="Close sidebar"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent mb-6"></div>

                    {/* --- Navigation --- */}
                    <nav className="flex-1">
                        <ul className="space-y-3">
                            <li>
                                <NavigationLink
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    icon={<LayoutDashboard size={22} />}
                                >
                                    Dashboard
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/dashboard/products"
                                    onClick={() => setIsOpen(false)}
                                    icon={<Package size={22} />}
                                >
                                    Products
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/dashboard/orders"
                                    onClick={() => setIsOpen(false)}
                                    icon={<ShoppingCart size={22} />}
                                >
                                    Orders
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/dashboard/customers"
                                    onClick={() => setIsOpen(false)}
                                    icon={<Users size={22} />}
                                >
                                    Customers
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/dashboard/notifications"
                                    onClick={() => setIsOpen(false)}
                                    icon={<Bell size={22} />}
                                >
                                    Notifications
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/dashboard/banners"
                                    onClick={() => setIsOpen(false)}
                                    icon={<ImageIcon size={22} />}
                                >
                                    Banners
                                </NavigationLink>
                            </li>
                            <li>
                                <NavigationLink
                                    href="/dashboard/shipping-rules"
                                    onClick={() => setIsOpen(false)}
                                    icon={<Truck size={22} />}
                                >
                                    Shipping Rules
                                </NavigationLink>
                            </li>
                        </ul>
                    </nav>

                    {/* --- Logout button --- */}
                    <div className="mt-auto">
                        <div className="p-4 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-1 overflow-y-auto relative">
                {/* --- Menu Toggle Button (visible when sidebar closed) --- */}
                {!isOpen && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="fixed top-4 left-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-lg shadow-green-500/30 z-50 hover:scale-110 transition-transform duration-200"
                        title="Open sidebar"
                    >
                        <Menu size={28} />
                    </button>
                )}

                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>

            {/* --- Route Transition Loader --- */}
            {isNavigating && <RouteTransitionLoader />}
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NavigationProvider>
            <DashboardContent>{children}</DashboardContent>
        </NavigationProvider>
    );
}