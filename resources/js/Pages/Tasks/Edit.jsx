import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from '../../axios';
import withAuth from '../../hocs/withAuth';

function Edit({ task }) {
    const [form, setForm] = useState({
        client_id: task.client_id || '',
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        deadline: task.deadline || '',
    });
    const [clients, setClients] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get('/clients')
            .then(res => setClients(res.data))
            .catch(err => console.error('Ошибка загрузки клиентов', err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            await axios.put(`/tasks/${task.id}`, form);
            router.visit('/tasks');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Ошибка обновления');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Редактировать задачу</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Клиент</label>
                    <select
                        name="client_id"
                        value={form.client_id}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-gray-700"
                    >
                        <option value="">— Не выбран —</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                    {errors.client_id && <div className="text-red-500 text-sm mt-1">{errors.client_id[0]}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Название заявки *</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-gray-700"
                        required
                    />
                    {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title[0]}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Описание заявки</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-gray-700"
                        rows="3"
                    />
                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description[0]}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Статус заявки</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-gray-700"
                    >
                        <option value="pending">Ожидает</option>
                        <option value="in_progress">В процессе</option>
                        <option value="completed">Выполнено</option>
                    </select>
                    {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status[0]}</div>}
                </div>
                <div className="flex space-x-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
                    >
                        {submitting ? 'Обновление...' : 'Обновить'}
                    </button>
                    <Link href="/tasks" className="text-gray-600 hover:text-gray-800 py-2 px-4">
                        Отмена
                    </Link>
                </div>
            </form>
        </div>
    );
}
export default withAuth(Edit);