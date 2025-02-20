<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PaymentController;
Route::post('/login', [LoginController::class, 'login']);
Route::apiResource('products', ProductController::class);
Route::middleware('auth:api')->group(function () {
    // Category CRUD routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});
Route::middleware('auth:api')->post('/payment-intent', [PaymentController::class, 'createPaymentIntent']);



