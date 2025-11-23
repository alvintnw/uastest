<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Developer extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'developers';

    protected $fillable = [
        'name',
        'role',
        'email',
        'whatsapp',
        'photo_url',
        'skills',
        'description',
        'github_url',
        'linkedin_url',
        'is_active',
        'display_order'
    ];

    protected $casts = [
        'skills' => 'array',
        'is_active' => 'boolean',
        'display_order' => 'integer'
    ];

    /**
     * Scope active developers
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope ordered by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc');
    }

    /**
     * Get formatted WhatsApp number
     */
    public function getFormattedWhatsappAttribute()
    {
        return preg_replace('/[^0-9]/', '', $this->whatsapp);
    }

    /**
     * Get WhatsApp API URL
     */
    public function getWhatsappUrlAttribute()
    {
        $number = $this->formatted_whatsapp;
        return "https://wa.me/{$number}";
    }

    /**
     * Get photo URL or placeholder
     */
    public function getPhotoUrlAttribute($value)
    {
        return $value ?: '/images/developer-placeholder.jpg';
    }
}