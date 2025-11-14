<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function index(Request $request): Response
    {
        $albums = Album::with(['coverPhoto'])
            ->withCount('photos')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Album $album) {
                return [
                    'id' => $album->id,
                    'name' => $album->name,
                    'description' => $album->description,
                    'photos_count' => $album->photos_count,
                    'created_at' => $album->created_at?->toIso8601String(),
                    'cover_photo' => $album->coverPhoto ? [
                        'id' => $album->coverPhoto->id,
                        'file_path' => $album->coverPhoto->file_path,
                    ] : null,
                ];
            });

        return Inertia::render('Albums/Index', [
            'albums' => $albums,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'photo_ids' => ['required', 'array', 'min:1'],
            'photo_ids.*' => ['integer'],
        ]);

        $user = $request->user();
        $photoIds = $validated['photo_ids'];

        $photos = Photo::where('user_id', $user->id)
            ->whereIn('id', $photoIds)
            ->get();

        if ($photos->count() !== count($photoIds)) {
            return back()->withErrors([
                'photo_ids' => 'Một hoặc nhiều ảnh không hợp lệ.',
            ]);
        }

        DB::transaction(function () use ($validated, $photos, $user) {
            $album = Album::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'cover_photo_id' => $photos->first()->id,
                'is_auto_generated' => false,
                'auto_type' => 'manual',
            ]);

            $syncData = [];
            foreach ($photos as $index => $photo) {
                $syncData[$photo->id] = ['order_index' => $index];
            }

            $album->photos()->sync($syncData);
        });

        return back()->with('success', 'Album đã được tạo thành công.');
    }

    public function show(Request $request, Album $album): Response
    {
        abort_if($album->user_id !== $request->user()->id, 404);

        $album->load(['coverPhoto', 'photos' => function ($query) {
            $query->orderBy('album_photos.order_index')->orderByDesc('photos.created_at');
        }]);

        $photos = $album->photos->map(function (Photo $photo) {
            return [
                'id' => $photo->id,
                'original_filename' => $photo->original_filename,
                'file_path' => $photo->file_path,
                'file_size' => $photo->file_size,
                'uploaded_at' => optional($photo->uploaded_at ?? $photo->created_at)->toIso8601String(),
                'mime_type' => $photo->mime_type,
            ];
        });

        return Inertia::render('Albums/Show', [
            'album' => [
                'id' => $album->id,
                'name' => $album->name,
                'description' => $album->description,
                'photos_count' => $album->photos()->count(),
                'created_at' => $album->created_at?->toIso8601String(),
                'cover_photo' => $album->coverPhoto ? [
                    'id' => $album->coverPhoto->id,
                    'file_path' => $album->coverPhoto->file_path,
                ] : null,
            ],
            'photos' => $photos,
        ]);
    }
}

