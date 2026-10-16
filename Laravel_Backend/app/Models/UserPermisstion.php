<?php

// app/Models/UserPermisstion.php
namespace App\Models;

use MongoDB\Laravel\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class UserPermisstion extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'user_permisstions';

    protected $fillable = [
        'name',
        'path',
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
