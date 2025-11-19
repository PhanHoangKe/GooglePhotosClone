<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TrashPhotoController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = 12;
        $search = $request->query('search');

        $photosQuery = Photo::where('user_id', $request->user()->id)
            ->where('is_deleted', true)
            ->orderByDesc('deleted_at');

        if ($search) {
            $photosQuery->where('original_filename', 'like', '%' . $search . '%');
        }

        $paginatedPhotos = $photosQuery->paginate($perPage);

        $transformedPhotos = $paginatedPhotos->through(function (Photo $photo) {
            $filePath = route('storage.photo', ['filename' => $photo->filename]);

            return [
                'id' => $photo->id,
                'file_name' => $photo->original_filename ?? $photo->filename,
                'file_path' => $filePath,
                'size' => $photo->file_size,
                'deleted_at' => optional($photo->deleted_at)->toIso8601String(),
                'created_at' => optional($photo->created_at)->toIso8601String(),
            ];
        });

        return Inertia::render('Photos/Trash', [
            'photos' => $transformedPhotos,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function restore(Request $request, string $id): RedirectResponse
    {
        $photo = Photo::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('is_deleted', true)
            ->firstOrFail();

        $photo->update([
            'is_deleted' => false,
            'deleted_at' => null,
        ]);

        return back()->with('success', 'Ảnh đã được khôi phục.');
    }

    public function forceDelete(Request $request, string $id): RedirectResponse
    {
        $photo = Photo::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('is_deleted', true)
            ->firstOrFail();

        $filePath = 'photos/' . $photo->filename;
        Storage::disk('public')->delete($filePath);

        $user = $request->user();
        $fileSize = $photo->file_size ?? 0;

        $photo->delete();

        if ($fileSize > 0) {
            $user->decrement('storage_used', min($fileSize, $user->storage_used ?? 0));
        }

        return back()->with('success', 'Ảnh đã được xóa vĩnh viễn.');
    }
}
