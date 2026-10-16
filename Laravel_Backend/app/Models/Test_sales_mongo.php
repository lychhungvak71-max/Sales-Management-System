<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model;

class Test_sales_mongo extends Model
{
    protected $connection = 'mongodb';
    protected $table = 'sales_collection';
    protected $collection = 'sales_collection';
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
