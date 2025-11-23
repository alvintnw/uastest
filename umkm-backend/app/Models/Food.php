<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Food extends Model
{ 
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'foods'; 

    // HAPUS 'protected $table = 'foods';' (tidak perlu untuk MongoDB)

    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image_url', // Ini adalah field asli dari database
        'stock_quantity',
        'ingredients',
        'nutrition_facts',
        'is_active',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
        // 'ingredients' => 'array',
        // 'nutrition_facts' => 'array',
    ];

    /**
     * FUNGSI ACCESSOR YANG BENAR.
     * Ia mengambil nilai mentah $value (path file) dan mengubahnya menjadi URL.
     */
    public function getImageUrlAttribute($value)
    {
        // KITA CEK LANGSUNG VARIABEL '$value' (yang berisi path dari DB)
        if ($value) { 
            // KITA KEMBALIKAN '$value'
            return asset('storage/' . $value); 
        }
        
        return null;
    }

    public function getPriceFormattedAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function setStockQuantityAttribute($value)
    {
        $this->attributes['stock_quantity'] = (int) $value;
    }
}
