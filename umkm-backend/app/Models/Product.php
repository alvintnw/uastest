<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\Model as Eloquent;

class Product extends Eloquent
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'products';

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image_url',
        'image_data',
        'image_mime_type',
        'is_active',
        'stock_quantity',
        'ingredients',
        'nutrition_facts'
    ];

    protected $casts = [
        'price' => 'float',
        'is_active' => 'boolean',
        'stock_quantity' => 'integer',
        'nutrition_facts' => 'array'
    ];

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function getIsInStockAttribute()
    {
        return $this->stock_quantity > 0;
    }

    public function getImageAttribute()
    {
        if ($this->image_data && $this->image_mime_type) {
            return 'data:' . $this->image_mime_type . ';base64,' . $this->image_data;
        }
        return $this->image_url ?? '/images/default-food.jpg';
    }

    public function setStockQuantityAttribute($value)
    {
        $this->attributes['stock_quantity'] = (int) $value;
    }
}
