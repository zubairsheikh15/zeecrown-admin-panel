'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="3px"
                color="#22c55e" // Green color to match theme
                options={{ 
                    showSpinner: false,
                    easing: 'ease',
                    speed: 500,
                    trickleSpeed: 200,
                    minimum: 0.08,
                }}
                shallowRouting
            />
        </>
    );
};

export default ProgressBarProvider;