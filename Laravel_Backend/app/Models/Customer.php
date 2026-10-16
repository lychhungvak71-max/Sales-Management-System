<?php

namespace App\Models;

// ⚠️ ត្រូវប្រើ Authenticatable របស់ MongoDB (MongoDB\Laravel\Auth\User)
use MongoDB\Laravel\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Customer extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'customers';

    protected $fillable = [
        'name',
        'gender',
        'email',
        'phone',
        'address',
        'photo',
        'category_id',
        'category_name',
        'total_order_completed',
        'total_order_cancel',
        'description',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // 💡 ប្រាប់ Sanctum ឱ្យប្រើ field '_id' របស់ MongoDB ជា Auth Identifier
    public function getAuthIdentifierName()
    {
        return '_id';
    }

    // 💡 បំផ្លែង _id ឱ្យទៅជា String ដើម្បីឱ្យ Sanctum Morph Relation ស្គាល់
    public function getKey()
    {
        return (string) $this->getAttribute('_id');
    }
}
