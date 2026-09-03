import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function withAuth(WrappedComponent) {
    return function AuthenticatedComponent(props) {
        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.visit('/login');
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
}