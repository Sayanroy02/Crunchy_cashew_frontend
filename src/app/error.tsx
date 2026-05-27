'use client';

import React, { useEffect } from 'react';
import MaintenanceView from '@/components/common/MaintenanceView';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to console or error report service
        console.error('Unhandled UI exception:', error);
    }, [error]);

    return <MaintenanceView />;
}
