<?php

use App\Models\Client;
use App\Models\Task;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/clients', function () {
    return Inertia::render('Clients/Index');
})->name('clients.index');

Route::get('/clients/create', function () {
    return Inertia::render('Clients/Create');
})->name('clients.create');

Route::get('/clients/{client}/edit', function (Client $client) {
    return Inertia::render('Clients/Edit', ['client' => $client]);
})->name('clients.edit');

Route::get('/tasks', function () {
    return Inertia::render('Tasks/Index');
})->name('tasks.index');

Route::get('/tasks/create', function () {
    return Inertia::render('Tasks/Create');
})->name('tasks.create');

Route::get('/tasks/{task}/edit', function (Task $task) {
    return Inertia::render('Tasks/Edit', ['task' => $task]);
})->name('tasks.edit');
