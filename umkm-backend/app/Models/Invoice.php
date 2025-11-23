<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'invoices';

    protected $fillable = [
        'invoice_number',
        'customer_name',
        'customer_phone',
        'customer_email',
        'customer_address',
        'total_amount',
        'tax_amount',
        'discount_amount',
        'final_amount',
        'status',
        'payment_method',
        'notes',
        'order_date',
        'due_date'
    ];

    protected $casts = [
        'total_amount' => 'float',
        'tax_amount' => 'float',
        'discount_amount' => 'float',
        'final_amount' => 'float',
        'order_date' => 'datetime',
        'due_date' => 'datetime'
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['order_date', 'due_date'];

    /**
     * Get the items for the invoice.
     */
    public function items()
    {
        return $this->hasMany(InvoiceItem::class, 'invoice_id', '_id');
    }

    /**
     * Get the user that created the invoice.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Calculate final amount
     */
    public function calculateFinalAmount()
    {
        $this->final_amount = $this->total_amount + $this->tax_amount - $this->discount_amount;
        return $this->final_amount;
    }

    /**
     * Scope pending invoices
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope paid invoices
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('order_date', [$startDate, $endDate]);
    }

    /**
     * Get invoice status badge color
     */
    public function getStatusBadgeAttribute()
    {
        $statusColors = [
            'pending' => 'warning',
            'paid' => 'success',
            'cancelled' => 'danger',
            'refunded' => 'info'
        ];

        return $statusColors[$this->status] ?? 'secondary';
    }
}