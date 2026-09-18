
import React, { useMemo } from 'react';
import { useStoreConfig } from '../contexts/StoreConfigContext';

const DynamicStyles: React.FC = () => {
    const { config } = useStoreConfig();

    const css = useMemo(() => `
        :root {
            --primary-color: ${config.colors.primary};
            --secondary-color: ${config.colors.secondary};
        }
        body {
            font-family: '${config.font}', sans-serif;
        }
        
        .bg-primary { background-color: var(--primary-color) !important; }
        .text-primary { color: var(--primary-color) !important; }
        .border-primary { border-color: var(--primary-color) !important; }
        
        .bg-secondary { background-color: var(--secondary-color) !important; }
        .text-secondary { color: var(--secondary-color) !important; }

        /* Overriding specific tailwind classes used in the app */
        .bg-blue-600 { background-color: var(--primary-color); }
        .hover\\:bg-blue-700:hover { background-color: var(--primary-color); filter: brightness(0.9); }
        .text-blue-600 { color: var(--primary-color); }
        .dark .text-blue-400 { color: var(--primary-color); filter: brightness(1.2); }
        .border-b-2.border-blue-500 { border-color: var(--primary-color); }
        .focus\\:ring-blue-500:focus { --tw-ring-color: var(--primary-color); }
        .bg-green-500 { background-color: #22c55e; }
        .hover\\:bg-green-600:hover { background-color: #16a34a; }

    `, [config.colors.primary, config.colors.secondary, config.font]);

    const fontLink = useMemo(() => {
        // Roboto is loaded by default in index.html
        if (config.font && config.font !== 'Roboto') {
            const fontQuery = config.font.replace(/\s/g, '+');
            return `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@400;500;700&display=swap`;
        }
        return null;
    }, [config.font]);


    return (
        <>
            {fontLink && <link href={fontLink} rel="stylesheet" />}
            <style>{css}</style>
        </>
    );
};

export default DynamicStyles;
