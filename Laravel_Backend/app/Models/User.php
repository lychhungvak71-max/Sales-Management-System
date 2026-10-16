<?php

namespace App\Models;

// ⚠️ ត្រូវប្រើ Authenticatable របស់ MongoDB (MongoDB\Laravel\Auth\User)
use MongoDB\Laravel\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'photo',
        'role',
        'password',
        'status',
        'permissions',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // 💡 បន្ថែម casts ដើម្បីធានាថា permissions ត្រូវ បានបម្លែងជា Array/Object  অটোម៉ាទិចពេលប្រើប្រាស់
    protected $casts = [
        'permissions' => 'array',
    ];

    // 💡 ប្រាប់ Sanctum ឱ្យប្រើ field '_id' របស់ MongoDB ជា Auth Identifier
    public function getAuthIdentifierName()
    {
        return '_id';
    }

    // 💡 បម្លែង _id ឱ្យទៅជា String ដើម្បីឱ្យ Sanctum Morph Relation ស្គាល់
    public function getKey()
    {
        return (string) $this->getAttribute('_id');
    }
}
