<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Auth\User as Authenticatable;
use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable 
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    // return hex string id from MongoDB ObjectId
    public function getIdAttribute($value = null)
    {
        $id = $value ?? ($this->_id ?? null);

        if ($id instanceof \MongoDB\BSON\ObjectId) {
            return (string) $id;
        }

        if (is_array($id) && isset($id['$oid'])) {
            return $id['$oid'];
        }

        if (is_object($id) && isset($id->{'$oid'})) {
            return (string) $id->{'$oid'};
        }

        return $id !== null ? (string) $id : null;
    }

}