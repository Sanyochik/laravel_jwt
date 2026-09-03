import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import axios from '../../axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const response = await axios.post('/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            router.visit('/tasks');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrors({ general: 'Неверный email или пароль' });
            } else if (error.response && error.response.data) {
                setErrors(error.response.data.errors || { general: 'Ошибка входа' });
            } else {
                setErrors({ general: 'Ошибка соединения' });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Вход</h1>
                {errors.general && <div className="text-red-500 mb-4">{errors.general}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-gray-700"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Войти
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Нет аккаунта? <Link href="/register" className="text-blue-600 hover:underline">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
}