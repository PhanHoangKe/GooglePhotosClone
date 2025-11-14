<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Photo extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'file_path',
        'file_size',
        'mime_type',
        'is_favorite',
        'original_filename',
        'file_type',
        'uploaded_at',
        'thumbnail_path',
        'is_deleted',
    ];

    public function getFilePathAttribute($value)
    {
        if (str_starts_with($value, '/storage/')) {
            return $value;
        }

        if (!str_contains($value, '/')) {
            return '/storage/photos/' . $value;
        }

        if (str_starts_with($value, 'storage/')) {
            return '/' . $value;
        }
        
        return $value;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function albums()
    {
        return $this->belongsToMany(Album::class, 'album_photos')
            ->withPivot('order_index');
    }
}