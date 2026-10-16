<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use MongoDB\Laravel\Eloquent\DocumentModel;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use DocumentModel;

    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';

    // 💡 បំផ្លែង Primary Key ឱ្យត្រូវជាមួយ MongoDB Object ID
    protected $keyType = 'string';
    protected $casts = [
        'abilities' => 'json',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    protected $fillable = [
        'name',
        'token',
        'abilities',
        'last_used_at',
        'expires_at',
        'tokenable_id',
        'tokenable_type',
    ];

    // protected $casts = [
    //     'abilities' => 'json',
    //     'last_used_at' => 'datetime',
    //     'expires_at' => 'datetime',
    // ];

    // 1. បន្ថែម Method នេះដើម្បីឱ្យ Sanctum ស្វែងរក Hashed Token ក្នុង MongoDB ឃើញ
    public static function findToken($token)
    {
        if (str_contains($token, '|')) {
            [$id, $token] = explode('|', $token, 2);
        }

        return static::where('token', hash('sha256', $token))->first();
    }

    // 2. បន្ថែម Relationship នេះដើម្បីឱ្យ Sanctum ទាញយក User Model តាម MongoDB ObjectId
    public function tokenable()
    {
        return $this->morphTo(null, 'tokenable_type', 'tokenable_id');
    }
}
