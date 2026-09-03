import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { router } from '@inertiajs/react';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/me');
                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem('token');
                router.visit('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            localStorage.removeItem('token');
            router.visit('/login');
        } catch (error) {
            localStorage.removeItem('token');
            router.visit('/login');
        }
    };

    if (loading) return <div className="text-center mt-10">Загрузка...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4 text-gray-700">Добро пожаловать, {user?.name}!</h1>
                <div className="mb-4 text-gray-700">
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Телефон:</strong> {user?.phone || '—'}</p>
                    <p><strong>Компания:</strong> {user?.company || '—'}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Выйти
                </button>
            </div>
        </div>
    );
}