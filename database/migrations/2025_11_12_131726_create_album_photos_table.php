<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('album_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->constrained()->onDelete('cascade');
            $table->foreignId('photo_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('order_index')->default(0);
            $table->timestamp('created_at')->useCurrent();
            
            $table->unique(['album_id', 'photo_id'], 'unique_album_photo');
            $table->index(['album_id', 'order_index'], 'idx_album_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('album_photos');
    }
};