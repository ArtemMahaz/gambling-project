<?php

use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\BetController;
use App\Http\Controllers\AdminController;

Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LogoutController::class, 'logout']);
    Route::get('/user', [UserController::class, 'me']);
    Route::get('/wallet', [WalletController::class, 'balance']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/{slug}', [GameController::class, 'show']);
    Route::post('/games/{slug}/play', [BetController::class, 'play']);
    Route::get('/bets', [BetController::class, 'history']);

    Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{id}', [AdminController::class, 'showUser']);
        Route::patch('/users/{id}/ban', [AdminController::class, 'banUser']);
        Route::patch('/games/{id}/toggle', [AdminController::class, 'toggleGame']);
    });
});
