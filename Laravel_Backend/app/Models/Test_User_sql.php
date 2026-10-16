<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Test_User_sql extends Model
{
    protected $connection = 'mysql';
    protected $table = 'users';
    protected $fillable = [
        'name',
        'email',
        'password',
    ];
}
