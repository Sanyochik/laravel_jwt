<?php
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Защищенные маршруты (требуют валидный JWT)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::delete('/delete', [AuthController::class, 'destroy']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('clients', App\Http\Controllers\Api\ClientController::class);
    Route::apiResource('tasks', App\Http\Controllers\Api\TaskController::class);
});