<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\api\OrderController;
use App\Http\Controllers\Api\ProductCategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SaleController;
use App\Http\Controllers\Api\UserPermisstionController;
use App\Http\Controllers\api\UserPositionController;
use App\Http\Controllers\Api\UserRoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes (នរណាក៏អាចចូលមើល ឬ Login បាន)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (ទាមទារ Sanctum Token សម្រាប់ Action ផ្សេងៗ)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // 💡 Routes សម្រាប់ User Management (UserList.jsx)
    Route::get('/users', [AuthController::class, 'getUsers']);
    Route::put('/users/{id}', [AuthController::class, 'updateUser']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);

    Route::apiResource('user-roles', UserRoleController::class);
    Route::apiResource('user-positions', UserPositionController::class);

    Route::apiResource('user-permissions', UserPermisstionController::class);

    Route::apiResource('product-categorys', ProductCategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('customers', CustomerController::class);

    Route::put('/orders/{id}/refund', [OrderController::class, 'refund']);
    Route::apiResource('orders', OrderController::class);

    // 💡 Read-Only Routes សម្រាប់ Sales (បង្ហាញបញ្ជីការលក់)
    Route::get('/sales', [SaleController::class, 'index']);
    Route::get('/sales/{id}', [SaleController::class, 'show']);

    Route::post('/profile/update', [AuthController::class, 'updateProfile']);
    // Route::post('/profile/update', [AuthController::class, 'updateUser']);
    Route::post('/profile/change-password', [AuthController::class, 'changePassword']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/sales-summary', [SaleController::class, 'summary']);

    // 💡 ប្រើ except(['index', 'show']) ដើម្បីការពារតែ POST, PUT, DELETE
    Route::apiResource('sales', SaleController::class)->except(['index', 'show']);
});
