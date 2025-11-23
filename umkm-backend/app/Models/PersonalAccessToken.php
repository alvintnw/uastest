<?php

namespace App\Models;
 
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

// Agar model ini bisa menggunakan fitur Eloquent MongoDB dan Sanctum
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    // Gunakan trait atau extend DocumentModel/Eloquent dari Jenssegers
    // Catatan: Jika Anda menggunakan Jenssegers\Mongodb\Eloquent\Model, 
    // Anda mungkin perlu mengganti 'use DocumentModel;' 
    // dengan: use Jenssegers\Mongodb\Eloquent\Model as Eloquent; dan extends Eloquent;
    
    // Mari kita gunakan cara yang paling kompatibel untuk Jenssegers
    protected $connection = 'mongodb';
    protected $collection = 'personal_access_tokens';

    // Penting untuk memastikan ID (Primary Key) ditangani sebagai string
    protected $primaryKey = '_id';
    protected $keyType = 'string';
    public $incrementing = false;
}