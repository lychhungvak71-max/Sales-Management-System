<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Sanctum;
use App\Models\PersonalAccessToken;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {})
    ->booted(function () {
        // ប្រាប់ Sanctum ឱ្យប្រើ MongoDB PersonalAccessToken Model
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    })->create();
