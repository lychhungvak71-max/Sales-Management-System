<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class sale extends Model
{
    protected $connection = 'mongodb';
    protected $table = 'sales_collection';
    protected $collection = 'sales_collection';

    // '_id',
    protected $fillable = [
        'customer_name',
        'product_name',
        'quantity',
        'unit_price',
        'total_price',
        'status',
        'sale_date'
    ];
}
