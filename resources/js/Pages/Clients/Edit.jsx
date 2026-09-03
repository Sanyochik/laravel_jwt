import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from '../../axios';
import withAuth from '../../hocs/withAuth';

function Edit({ client }) {
    const [form, setForm] = useState({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        address: client.address || '',
        notes: client.notes || '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            await axios.put(`/clients/${client.id}`, form);
            router.visit('/clients');
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
            <h1 className="text-3xl font-bold mb-6">Редактировать клиента</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Имя клиента *</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-gray-500"
                        required
                    />
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name[0]}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Email клиента</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-gray-500"
                    />
                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email[0]}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Номер телефона клиента</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-gray-500"
                    />
                    {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone[0]}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">Компания клиента</label>
                    <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 text-gray-500"
                    />
                    {errors.company && <div className="text-red-500 text-sm mt-1">{errors.company[0]}</div>}
                </div>
                <div className="flex space-x-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
                    >
                        {submitting ? 'Обновление...' : 'Обновить'}
                    </button>
                    <Link href="/clients" className="text-gray-600 hover:text-gray-800 py-2 px-4">
                        Отмена
                    </Link>
                </div>
            </form>
        </div>
    );
}
export default withAuth(Edit);