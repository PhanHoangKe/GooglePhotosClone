<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\AvatarController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\TrashPhotoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Debug route to check images
Route::middleware('auth')->get('/debug/check-image/{filename}', function ($filename) {
    $photos = \App\Models\Photo::where('filename', $filename)->first();
    
    if (!$photos) {
        return response()->json(['error' => 'Photo not found in DB', 'filename' => $filename]);
    }
    
    $exists_photos = Storage::disk('public')->exists('photos/' . $filename);
    $exists_avatars = Storage::disk('public')->exists('avatars/' . $filename);
    
    return response()->json([
        'photo' => $photos,
        'file_exists_photos' => $exists_photos,
        'file_exists_avatars' => $exists_avatars,
        'storage_path_photos' => Storage::disk('public')->path('photos/' . $filename),
        'storage_path_avatars' => Storage::disk('public')->path('avatars/' . $filename),
    ]);
});

// Serve images from storage (Protected by auth)
Route::middleware('auth')->get('/storage/photos/{filename}', function ($filename) {
    $path = 'photos/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'Image not found');
    }
    
    $fullPath = Storage::disk('public')->path($path);
    return response()->file($fullPath);
})->name('storage.photo');

// Serve avatars from storage (Protected by auth)
Route::middleware('auth')->get('/storage/avatars/{filename}', function ($filename) {
    $path = 'avatars/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404, 'Avatar not found');
    }
    
    $fullPath = Storage::disk('public')->path($path);
    return response()->file($fullPath);
})->name('storage.avatar');

Route::get('/dashboard', [PhotoController::class, 'index']) // ĐÃ SỬA
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('photos', PhotoController::class)->only(['store', 'destroy']);

    Route::get('/photos', [PhotoController::class, 'index'])->name('photos.index');
    Route::get('/photos/trash', [TrashPhotoController::class, 'index'])->name('photos.trash');
    Route::patch('/photos/{photo}/restore', [TrashPhotoController::class, 'restore'])->name('photos.restore');
    Route::delete('/photos/{photo}/force', [TrashPhotoController::class, 'forceDelete'])->name('photos.force-delete');

    Route::get('/albums', [AlbumController::class, 'index'])->name('albums.index');
    Route::post('/albums', [AlbumController::class, 'store'])->name('albums.store');
    Route::get('/albums/{album}', [AlbumController::class, 'show'])->name('albums.show');

    // AVATAR ROUTES <--- THÊM PHẦN NÀY
    Route::post('/profile/avatar', [AvatarController::class, 'store'])->name('avatar.store');
    Route::delete('/profile/avatar', [AvatarController::class, 'destroy'])->name('avatar.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
