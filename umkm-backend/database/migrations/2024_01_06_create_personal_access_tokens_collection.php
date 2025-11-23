<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use MongoDB\Laravel\Schema\Blueprint;

return new class extends Migration
{
    public function up()
    {
        Schema::connection('mongodb')->create('personal_access_tokens', function (Blueprint $collection) {
            $collection->index('tokenable_type');
            $collection->index('tokenable_id');
            $collection->index('name');
            $collection->unique('token');
            $collection->index('created_at');
            $collection->index('updated_at');
        });
    }

    public function down()
    {
        Schema::connection('mongodb')->dropIfExists('personal_access_tokens');
    }
};