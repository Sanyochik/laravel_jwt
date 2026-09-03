import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from '../../axios';

export default function Index() {
    const [tasks, setTasks] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        client_id: '',
        status: '',
        sort_by: 'created_at',
        sort_order: 'desc',
    });

    useEffect(() => {
        axios.get('/clients')
            .then(res => setClients(res.data))
            .catch(() => {});
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.client_id) params.append('client_id', filters.client_id);
            if (filters.status) params.append('status', filters.status);
            params.append('sort_by', filters.sort_by);
            params.append('sort_order', filters.sort_order);

            const response = await axios.get(`/tasks?${params.toString()}`);
            setTasks(response.data);
        } catch (err) {
            setError('Не удалось загрузить задачи');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.visit('/login');
            return;
        }
        fetchTasks();
    }, [filters]);

    const deleteTask = async (id) => {
        if (!confirm('Удалить задачу?')) return;
        try {
            await axios.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (err) {
            alert('Ошибка удаления');
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({
            client_id: '',
            status: '',
            sort_by: 'created_at',
            sort_order: 'desc',
        });
    };

    const statusMap = {
        pending: 'Ожидает',
        in_progress: 'В процессе',
        completed: 'Выполнено',
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
                <h1 className="text-3xl font-bold">Задачи</h1>
                <Link
                    href="/tasks/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    + Создать задачу
                </Link>
            </div>
            <div className="flex justify-between items-center mb-6">
                <Link
                    href="/clients"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Перейти к клиентам
                </Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Выйти
                </button>
            </div>

            {/* Фильтры */}
            <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap items-end gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Клиент</label>
                    <select
                        name="client_id"
                        value={filters.client_id}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2 w-48 text-gray-500"
                    >
                        <option value="">Все клиенты</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Статус</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2 w-48 text-gray-500"
                    >
                        <option value="">Все статусы</option>
                        <option value="pending">Ожидает</option>
                        <option value="in_progress">В процессе</option>
                        <option value="completed">Выполнено</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Сортировка по</label>
                    <select
                        name="sort_by"
                        value={filters.sort_by}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2 w-48 text-gray-500"
                    >
                        <option value="created_at">Дате создания</option>
                        <option value="title">Названию</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Порядок</label>
                    <select
                        name="sort_order"
                        value={filters.sort_order}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2 w-48 text-gray-500"
                    >
                        <option value="desc">По убыванию</option>
                        <option value="asc">По возрастанию</option>
                    </select>
                </div>
                <div>
                    <button
                        onClick={resetFilters}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                        Сбросить
                    </button>
                </div>
            </div>

            {tasks.length === 0 ? (
                <p className="text-gray-500">Нет задач. Создайте первую!</p>
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Описание</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Клиент</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата создания</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tasks.map(task => (
                                <tr key={task.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{task.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{task.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {task.client ? task.client.name : '—'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                            ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                              task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-gray-100 text-gray-800'}`}
                                        >
                                            {statusMap[task.status] || task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{task.created_at ? new Date(task.created_at).toLocaleDateString('ru-RU') : '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <Link
                                            href={`/tasks/${task.id}/edit`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Редактировать
                                        </Link>
                                        <button
                                            onClick={() => deleteTask(task.id)}
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