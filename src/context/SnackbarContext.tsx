'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarContextType {
    showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<SnackbarType>('info');
    const [isVisible, setIsVisible] = useState(false);

    const showSnackbar = useCallback((msg: string, t: SnackbarType = 'info') => {
        setMessage(msg);
        setType(t);
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 3000);
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {isVisible && <Snackbar message={message} type={type} />}
        </SnackbarContext.Provider>
    );
};

// Internal Snackbar UI Component
const Snackbar = ({ message, type }: { message: string, type: SnackbarType }) => {
    const bgColor = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-primary',
        warning: 'bg-yellow-600'
    }[type];

    const icon = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    }[type];

    return (
        <div className="fixed top-6 inset-x-0 z-[9999] flex justify-center px-4 pointer-events-none">
            <div className={`px-6 py-3 rounded-2xl shadow-2xl text-white font-bold animate-slide-down flex items-center gap-3 ${bgColor} whitespace-nowrap pointer-events-auto`}>
                <i className={`fa-solid ${icon}`}></i>
                {message}
            </div>
        </div>
    );
};
