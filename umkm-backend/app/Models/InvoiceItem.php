<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'invoice_items';

    protected $fillable = [
        'invoice_id',
        'food_id',
        'food_name',
        'quantity',
        'price',
        'subtotal',
        'notes'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'float',
        'subtotal' => 'float'
    ];

    /**
     * Get the invoice that owns the item.
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Get the food that owns the item.
     */
    public function food()
    {
        return $this->belongsTo(Food::class, 'food_id', '_id');
    }

    /**
     * Calculate subtotal
     */
    public function calculateSubtotal()
    {
        $this->subtotal = $this->quantity * $this->price;
        return $this->subtotal;
    }

    /**
     * Boot method to calculate subtotal before saving
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            $item->calculateSubtotal();
        });
    }
}