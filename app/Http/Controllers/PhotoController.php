<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class PhotoController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $perPage = 12; 

        $search = $request->query('search');
        $sortBy = $request->query('sort_by', 'created_at'); 
        $sortDirection = $request->query('sort_direction', 'desc'); 

        $photos = Photo::where('user_id', $request->user()->id)
                        ->where('is_deleted', false);

        if ($search) {
            $photos->where('original_filename', 'like', '%' . $search . '%');
        }

        $dbSortBy = $sortBy === 'file_name' ? 'original_filename' : $sortBy;
 
        if (in_array($dbSortBy, ['original_filename', 'file_size', 'created_at'])) {
            $photos->orderBy($dbSortBy, $sortDirection);
        } else {
             $photos->orderBy('created_at', 'desc');
        }

        $paginatedPhotos = $photos->paginate($perPage);

        $transformedPhotos = $paginatedPhotos->through(function ($photo) {
            $filePath = route('storage.photo', ['filename' => $photo->filename]);
            
            return [
                'id' => $photo->id,
                'user_id' => $photo->user_id,
                'file_name' => $photo->original_filename,
                'file_path' => $filePath,
                'path' => $filePath,
                'size' => $photo->file_size,
                'file_size' => $photo->file_size,
                'file_type' => $photo->file_type,
                'filename' => $photo->filename,
                'original_filename' => $photo->original_filename,
                'created_at' => $photo->created_at->toISOString(),
            ];
        });

        return Inertia::render('Photos/Index', [
            'photos' => $transformedPhotos,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'photos' => ['required', 'array', 'min:1', 'max:20'],
            'photos.*' => ['required', 'image', 'max:20480'],
            'titles' => ['nullable', 'array'],
            'titles.*' => ['nullable', 'string', 'max:255'],
        ]);

        /** @var array<int, \Illuminate\Http\UploadedFile> $files */
        $files = $request->file('photos', []);

        $storageLimit = $user->storage_limit ?? (5 * 1024 * 1024 * 1024);
        $currentUsage = $user->storage_used ?? 0;
        $totalUploadSize = collect($files)->sum(fn ($file) => $file->getSize());

        if ($currentUsage + $totalUploadSize > $storageLimit) {
            throw ValidationException::withMessages([
                'photos' => 'Không đủ dung lượng lưu trữ. Vui lòng nâng cấp tài khoản.',
            ]);
        }

        $titles = $validated['titles'] ?? [];
        $uploadedCount = 0;

        foreach ($files as $index => $file) {
            $storagePath = $file->store('photos', 'public');
            $publicPath = '/storage/' . $storagePath;
            $fileSize = $file->getSize();
            $originalName = $file->getClientOriginalName();

            $displayName = isset($titles[$index]) && filled($titles[$index])
                ? $titles[$index]
                : $originalName;

            Photo::create([
                'user_id' => $user->id,
                'filename' => basename($storagePath),
                'original_filename' => $displayName,
                'file_path' => $publicPath,
                'file_size' => $fileSize,
                'mime_type' => $file->getMimeType(),
                'file_type' => str_contains($file->getMimeType(), 'video') ? 'video' : (str_contains($file->getMimeType(), 'gif') ? 'gif' : 'image'),
                'uploaded_at' => now(),
            ]);

            $uploadedCount++;
        }

        if ($totalUploadSize > 0) {
            $user->increment('storage_used', $totalUploadSize);
        }

        $message = $uploadedCount > 1
            ? sprintf('%d ảnh đã được tải lên thành công.', $uploadedCount)
            : 'Ảnh đã được tải lên thành công.';

        return back()->with('success', $message);
    }

    public function destroy(Request $request, string $id): RedirectResponse
    {
        $photo = Photo::findOrFail($id); 

        if ($photo->user_id !== $request->user()->id) {
            return back()->with('error', 'Bạn không có quyền xóa ảnh này.');
        }

        $fileSize = $photo->file_size;
        $user = $request->user();

        $fileName = basename($photo->file_path); 
        $storagePathToDelete = 'photos/' . $fileName; 
        Storage::disk('public')->delete($storagePathToDelete);

        $photo->delete(); 

        $user->decrement('storage_used', $fileSize);

        return back()->with('success', 'Ảnh đã được xóa.');
    }
}