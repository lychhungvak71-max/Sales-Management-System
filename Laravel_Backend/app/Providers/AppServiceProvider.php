<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;
use App\Models\PersonalAccessToken; // 💡 Import Model ដែលបានបង្កើតអម្បាញ់មិញ

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // 💡 ប្រាប់ Sanctum ឱ្យប្រើ MongoDB Token Model
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
