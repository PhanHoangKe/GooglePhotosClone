<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('cover_photo_id')->nullable();
            $table->boolean('is_auto_generated')->default(false)->comment('Album tự động tạo từ metadata');
            $table->enum('auto_type', ['date', 'location', 'manual'])->default('manual');
            $table->string('auto_value', 255)->nullable()->comment('Giá trị để group (ngày/địa điểm)');
            
            $table->timestamps(); // created_at và updated_at
            
            $table->index('user_id', 'idx_user_albums');
            $table->index(['user_id', 'is_auto_generated', 'auto_type'], 'idx_auto_type');
            
            // Khóa ngoại cho cover_photo_id sẽ được thêm sau khi bảng 'photos' được tạo
            // Hoặc có thể dùng `foreignId('cover_photo_id')->nullable()->constrained('photos')->onDelete('set null');` nếu bạn sắp xếp lại thứ tự migration. Tạm thời cứ để $table->unsignedBigInteger.
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};