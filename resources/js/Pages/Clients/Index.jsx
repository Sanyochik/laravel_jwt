import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from '../../axios';

export default function Index() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.visit('/login');
            return;
        }
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('/clients');
            setClients(response.data);
        } catch (err) {
            setError('Не удалось загрузить клиентов');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteClient = async (id) => {
        if (!confirm('Удалить клиента?')) return;
        try {
            await axios.delete(`/clients/${id}`);
            setClients(clients.filter(c => c.id !== id));
        } catch (err) {
            alert('Ошибка удаления');
        }
    };
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

    if (loading) return <div className="p-6">Загрузка...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Клиенты</h1>
                <Link
                    href="/clients/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    + Создать клиента
                </Link>
            </div>
            <div className="flex justify-between items-center mb-6">
                <Link
                    href="/tasks"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Перейти к задачам
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Выйти
                </button>
            </div>

            {clients.length === 0 ? (
                <p className="text-gray-500">Нет клиентов. Создайте первого!</p>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Телефон</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Компания</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map(client => (
                                <tr key={client.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.email || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.phone || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{client.company || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <Link
                                            href={`/clients/${client.id}/edit`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Редактировать
                                        </Link>
                                        <button
                                            onClick={() => deleteClient(client.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}