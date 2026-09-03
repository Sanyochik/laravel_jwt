import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from '../../axios';

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const response = await axios.post('/register', form);
            const { token } = response.data;
            localStorage.setItem('token', token);
            router.visit('/tasks');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Ошибка регистрации' });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Регистрация</h1>
                {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Введите ваше имя</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        />
                        {errors.name && <div className="text-red-500 text-sm">{errors.name[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Введите ваш email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        />
                        {errors.email && <div className="text-red-500 text-sm">{errors.email[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Введите номер телефона</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                        />
                        {errors.phone && <div className="text-red-500 text-sm">{errors.phone[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Название компании</label>
                        <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                        />
                        {errors.company && <div className="text-red-500 text-sm">{errors.company[0]}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Придумайте пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        />
                        {errors.password && <div className="text-red-500 text-sm">{errors.password[0]}</div>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Повторите пароль</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Зарегистрироваться
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-700">
                    Уже есть аккаунт? <Link href="/login" className="text-blue-600 hover:underline">Войти</Link>
                </p>
            </div>
        </div>
    );
}