<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AvatarController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $request->validate([
            'avatar' => ['required', 'image', 'max:5120'], 
        ]);

        $file = $request->file('avatar');

        if ($user->avatar) {
            $oldPath = str_replace('/storage/', '', $user->avatar); 
            Storage::disk('public')->delete($oldPath);
        }

        $storagePath = $file->store('avatars', 'public');

        $publicPath = route('storage.avatar', ['filename' => basename($storagePath)]);

        $user->avatar = $publicPath;
        $user->save();

        return redirect()->route('profile.edit')->with('success', 'Ảnh đại diện đã được cập nhật.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar) {
            $oldPath = str_replace('/storage/', '', $user->avatar); 
            Storage::disk('public')->delete($oldPath);

            $user->avatar = null;
            $user->save();
        }

        return redirect()->route('profile.edit')->with('success', 'Ảnh đại diện đã được xóa.');
    }
}