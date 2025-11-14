<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Thông tin File (Đã chuẩn hóa)
            $table->string('filename')->comment('Tên file đã được hash/đổi tên trên server');
            $table->string('original_filename')->nullable()->comment('Tên file gốc do người dùng đặt');
            $table->string('path', 500)->comment('Đường dẫn công khai (URL) để truy cập file'); // Dùng 'path'
            $table->string('thumbnail_path', 500)->nullable();
            
            // Thông tin kỹ thuật
            $table->enum('file_type', ['image', 'video', 'gif'])->default('image');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('file_size')->comment('Kích thước file (bytes)');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('duration')->nullable()->comment('Thời lượng video (giây)');
            
            // Metadata từ EXIF
            $table->timestamp('taken_at')->nullable()->comment('Ngày chụp từ EXIF');
            $table->string('camera_make', 100)->nullable();
            $table->string('camera_model', 100)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('location_name', 255)->nullable()->comment('Tên địa điểm');
            
            // Trạng thái (Soft Delete)
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('uploaded_at')->useCurrent(); 
            
            $table->timestamps(); // created_at và updated_at
            
            // Các Index
            $table->index(['user_id', 'is_deleted'], 'idx_user_photos');
            $table->index(['user_id', 'taken_at'], 'idx_taken_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('photos');
    }
};